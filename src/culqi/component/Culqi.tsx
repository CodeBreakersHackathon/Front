import React, { useState, useEffect, useRef } from "react";
import culqiCustomCheckout from "../utils/culqiCustomCheckout";
import { culqiConfig } from "../config/culqiConfig";
import { createCharge, createOrder } from "../services/culqi-services";
import Culqi3DSService from "../utils/culqi3DS";
import { getMessage } from "../utils/util";
import { checkoutConfig } from "../config";
import "../culqi.css";
import { CustomerInfo, ItemInfo } from "../config/Customer";
import { ShoppingCartDto, ShoppingChargeDto } from "../dto/cart.dto";
import { API_URL } from "../../apiConstants";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { button } from "framer-motion/client";

const axiosInstance = axios.create({
    headers: {
      "Content-Type": "application/json",
    },
    baseURL: import.meta.env.VITE_API_URL
});

const publicKey = import.meta.env.VITE_APP_CULQI_PUBLICKEY;

async function orderCart(cart: ShoppingCartDto) {
    const token = localStorage.getItem("access_token");
    if (!token) {
        throw new Error("No access token found");
    }

    return await axiosInstance.post(`${API_URL}/culqi/order-cart`, cart,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }
    );
}

async function chargeCart(cart: ShoppingChargeDto) {
    const token = localStorage.getItem("access_token");
    if (!token) {
        throw new Error("No access token found");
    }

    return await axiosInstance.post(`${API_URL}/culqi/charge-cart`, cart,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }
    );;
}

interface CulqiButtonProps {
    className?: string;
    buttonTitle?: string;
    payText?: string;

    activities: number[];
    onChargeResponse: (value: any) => void;
}

export function Culqi(props: CulqiButtonProps) {
    const [CulqiCheckout, setCulqiCheckout] = useState<any>(null);
    const [amount, setAmount] = useState<number>(0);
    const [expiration, setExpiration] = useState<number>(-1);

    const Culqi3DS = useRef<any>(null);
    const [removeMessageListener, setRemoveMessageListener] = useState(() => {});
  
    const isFirstRunOrderService = useRef(true); // Variable de referencia para rastrear la primera ejecución

    const decive3DS = useRef(null);
    const orderId = useRef(null);
    const tokenId = useRef(null);
    const tokenEmail = useRef(null);
  
    // Function to handle 3DS parameters
    const handleSuccess3DSParameters = async (parameters3DS) => {
      const { data, status } = await orderCart({
        items: props.activities,
        currency: "PEN",
        description: "Actividades: " + props.activities.join(", "),
        device_id: decive3DS.current,
        authentication_3DS: parameters3DS
      })
      console.log("data", data)
      console.log("status", status)
  
      if (status === 201 && data.data.object === "charge") {
        //props.onChargeResponse()

        // props.setChargeMessage("OPERACIÓN REALIZADA EXITOSAMENTE CON 3DS. El ID: "+ data.data.id);
      }
      Culqi3DS.current.reset();
    };
  
    const handleResponse = (token, email, statusCode, objResponse) => {
      //let message = "";
      switch (statusCode) {
        case 200:
          if (objResponse.action_code === "REVIEW") {
            Culqi3DS.current.validationInit3DS({
              token,
              statusCode,
              email,
              amount,
              url: checkoutConfig.URL_BASE
            });
            props.onChargeResponse(objResponse)
            return;
          }
          //message = "ERROR AL REALIZAR LA OPERACIÓN";
          break;
        case 201:
          props.onChargeResponse(objResponse)
          //message = "OPERACIÓN EXITOSA - SIN 3DS. El ID: " + objResponse.id;
          Culqi3DS.current.reset();
          break;
        default:
          //message = "OPERACIÓN FALLIDA - SIN 3DS";

          Culqi3DS.current.reset();
          break;
      }
      // props.setChargeMessage(message);
    };
  
    // Function to handle Culqi token
    const handleCulqiToken = async () => {
      const token = CulqiCheckout.getToken();
      console.log(token)
      const error = CulqiCheckout.getError();
      if (error) {
        console.log("ERROR - ERROR: ", error);
        alert(error.user_message);
        return;
      }
      if (!token) {
        return;
      }
      tokenId.current = token.id;
      tokenEmail.current = token.email;
  
      CulqiCheckout.close();
      const { data, status } = await chargeCart({
        items: props.activities,
        currency: "PEN",
        token: token.id,
        device_id: decive3DS.current,
      });
      handleResponse(token.id, token.email, status, data.data);
    };
  
    useEffect(() => {
      const handleCulqi3DS = () => {
        Culqi3DS.current = new Culqi3DSService(publicKey);
  
        if (Culqi3DS) {
          Culqi3DS.current
            .open()
            .then(async () => {
              const device = await Culqi3DS.current.getDevice();
              decive3DS.current = device;
            })
            .catch((err) => {});
        }
      };
      handleCulqi3DS();
    }, [Culqi3DS !== null]);
  
    useEffect(() => {
      const removeMessageListener = getMessage(
        handleSuccess3DSParameters,
        (err) => {
          console.log("ERROR 3DS CARGO:: ", err);
        }
      );
  
      setRemoveMessageListener(() => removeMessageListener);
  
      return () => {
        if (removeMessageListener) {
          removeMessageListener();
        }
      };
    }, []);
  
    useEffect(() => {
      const generateOrder = async () => {
        console.log("generateOrder", isFirstRunOrderService.current);
        isFirstRunOrderService.current = false; // Marca que ya no es la primera ejecución
        const { data, status } = await orderCart({
            items: props.activities,
            currency: "PEN",
            description: "Actividades: " + props.activities,
            device_id: decive3DS.current,
        });
        console.log(data)

        setExpiration(data.data.expiration_date);
        if (status === 201) {
          orderId.current = data.data.id;
        } else {
          isFirstRunOrderService.current = true;
        }
      };
  
      const handleCulqiCheckout = async () => {
        if (isFirstRunOrderService.current) {
            await generateOrder();
        }
        
        if (orderId.current) {
          const config = await culqiConfig({
            installments: true,
            orderId: orderId.current,
            buttonTex: props.payText ? props.payText : "Pagar",
            amount
          });
          
          setCulqiCheckout(new culqiCustomCheckout(publicKey, config));
          console.log("checkout", CulqiCheckout)
        }
      };
  
      handleCulqiCheckout();
    }, [orderId.current, props.activities, amount]); // Add orderId.current to the dependency array
  
    const openCheckout = async () => {
      CulqiCheckout.open()
        .then(async () => {
          CulqiCheckout.culqiFunction = handleCulqiToken;
          CulqiCheckout.closeCheckoutFunction = () => {
            console.log("cerrando...");
          };
        })
        .catch((err) => {
          console.log("falló al abrir checkout");
        });
    };

  return (
    <div>
    <motion.button
      onClick={openCheckout}
      className={props.className}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      disabled={props.activities.length === 0}
    >
        {props.buttonTitle ? props.buttonTitle : "Pagar"}
    </motion.button>
    </div>
  );
}