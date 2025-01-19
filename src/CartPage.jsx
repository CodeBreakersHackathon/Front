import "./CartPage.css";
import React, { useEffect, useState } from "react";
import { Trash2, Info, X } from "lucide-react";
import { useStorageState, useStorageStateList } from "./util/useLocalStorage";
import { Culqi } from "./culqi/component/Culqi";
import { motion, AnimatePresence } from "framer-motion";

const defaultCourses = [
  {
    id: 1,
    name: "Course 1",
    price: "S/.100",
    description: "Description for Course 1",
  },
  {
    id: 2,
    name: "Course 2",
    price: "S/.200",
    description: "Description for Course 2",
  },
  {
    id: 3,
    name: "Course 3",
    price: "S/.300",
    description: "Description for Course 3",
  },
  {
    id: 4,
    name: "Course 4",
    price: "S/.400",
    description: "Description for Course 4",
  },
  {
    id: 5,
    name: "Course 5",
    price: "S/.500",
    description: "Description for Course 5",
  },
  {
    id: 6,
    name: "Course 6",
    price: "S/.600",
    description: "Description for Course 6",
  },
]

const CartPage = () => {
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [[b, courses], setCourses] = useStorageStateList("courses");
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);

  if (!courses) {
    setCourses(defaultCourses);
  }

  console.log(courses)
  useEffect(
    () => {
      setTotalPrice(
        courses.reduce((total, course) => {
          return total + parseFloat(course.price.replace("S/.", ""));
        }, 0)
      )

      setLoading(false);
    },
    [courses]
  )

  const handleDelete = (id) => {
    setCourses(courses.filter((course) => course.id !== id));
  }

  const handleCharge = (data) => {
    console.log(data);
    if (data.object === "charge") {
      setAlert(
        {
          show: true,
          message: data.outcome.user_message,
          type: "success"
        }
      );
      setTimeout(() => {
        setAlert({ show: false, message: "", type: "" });
      }, 3000);
      setCourses([]);
    }
  }

  return (
    <div className="cart-page">
      <AnimatePresence>
        {alert.show && (
          <motion.div
            className={`custom-alert ${alert.type}`}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <div className="alert-message">{alert.message}</div>
            <button
              onClick={() => setAlert({ show: false, message: "", type: "" })}
              className="alert-close-btn"
            >
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="left">
        <h1>Carrito</h1>
        <div className="cart-items">
          {!loading && courses.map((course) => (
            <div key={course.id} className="cart-item">
              <h3>{course.name}</h3>
              <strong>{course.price}</strong>
              <p>{course.description}</p>
              <div className="cart-item-controls">
                <Info className="cart-control"
                />
                <Trash2 className="cart-control"
                  onClick={() => handleDelete(course.id)} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="right">
        <h1>Resumen</h1>
        <div className="price-summary">
          <div className="price-list">
            {!loading && courses.map((course) => (
              <div key={course.id} className="price-item">
                <span>{course.name}</span>

                <span>{course.price}</span>
              </div>
            ))}
          </div>
          <div className="checkout">
            <h2>Monto Total: S/.{totalPrice.toFixed(2)}</h2>
            {!loading &&
              <Culqi
                className="checkout-button"
                buttonTitle="Confirmar"
                activities={courses.map((course) => course.id)}
                onChargeResponse={handleCharge}
              />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
