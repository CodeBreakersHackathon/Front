import React, { useState, useEffect, useRef } from "react";
import culqiCustomCheckout from "../utils/culqiCustomCheckout";
import { culqiConfig } from "../config/culqiConfig";
import { createCharge, createOrder } from "../services/culqi-services";
import Culqi3DSService from "../utils/culqi3DS";
import { getMessage } from "../utils/util";
import { checkoutConfig } from "../config";
import "../culqi.css";

const publicKey = import.meta.env.VITE_APP_CULQI_PUBLICKEY;

interface CulqiButtonProps {
    buttonId?: string;
    chargeMessage: string;
    setChargeMessage: (value: string) => void;
}

export function CulqiButton(props: CulqiButtonProps) {
    const [CulqiCheckout, setCulqiCheckout] = useState<any>(null);
    const Culqi3DS = useRef<any>(null);
  
    const [removeMessageListener, setRemoveMessageListener] = useState(() => {});
  
    const isFirstRunOrderService = useRef(true); // Variable de referencia para rastrear la primera ejecución
  
    const decive3DS = useRef(null);
    const orderId = useRef(null);
    const tokenId = useRef(null);
    const tokenEmail = useRef(null);
  
    const [amount, setAmount] = useState(900);
  
    // Function to handle 3DS parameters
    const handleSuccess3DSParameters = async (parameters3DS) => {
      const { data, status } = await createCharge({
        deviceId: decive3DS.current,
        email: tokenEmail.current,
        tokenId: tokenId.current,
        parameters3DS
      });
  
      if (status === 201 && data.object === "charge") {
        props.setChargeMessage("OPERACIÓN REALIZADA EXITOSAMENTE CON 3DS. El ID: "+ data.id);
      }
      Culqi3DS.current.reset();
    };
  
    const handleResponse = (token, email, statusCode, objResponse) => {
      let message = "";
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
            return;
          }
          message = "ERROR AL REALIZAR LA OPERACIÓN";
          break;
        case 201:
          message = "OPERACIÓN EXITOSA - SIN 3DS. El ID: " + objResponse.id;
          Culqi3DS.current.reset();
          break;
        default:
          message = "OPERACIÓN FALLIDA - SIN 3DS";
          Culqi3DS.current.reset();
          break;
      }
      props.setChargeMessage(message);
    };
  
    // Function to handle Culqi token
    const handleCulqiToken = async () => {
      const token = CulqiCheckout.getToken();
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
      const { data, status } = await createCharge({
        deviceId: decive3DS.current,
        email: token.email,
        tokenId: token.id
      });
      handleResponse(token.id, token.email, status, data);
    };
  
    useEffect(() => {
      const handleCulqi3DS = () => {
        Culqi3DS.current = new Culqi3DSService(publicKey);
  
        if (Culqi3DS) {
          Culqi3DS.current
            .open()
            .then(async () => {
              console.log("3DS GENERADO");
              const device = await Culqi3DS.current.getDevice();
              decive3DS.current = device;
            })
            .catch((err) => {
              console.log("error 3DS:: ", err);
            });
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
        isFirstRunOrderService.current = false; // Marca que ya no es la primera ejecución
        const { data, status } = await createOrder();
        if (status === 201) {
          orderId.current = data.id;
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
            buttonTex: "",
            amount
          });
          setCulqiCheckout(new culqiCustomCheckout(publicKey, config));
        }
      };
  
      handleCulqiCheckout();
    }, [orderId.current]);
  
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
    <button onClick={openCheckout} id={props.buttonId ? props.buttonId : "crearCharge"}>
        Crear Cargo
    </button>
  );
}