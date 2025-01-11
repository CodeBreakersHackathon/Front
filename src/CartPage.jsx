import "./CartPage.css";
import React from "react";
import { Trash2, Info } from "lucide-react";

const CartPage = () => {
  const courses = [
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
  ];

  const totalPrice = courses.reduce((total, course) => {
    return total + parseFloat(course.price.replace("S/.", ""));
  }, 0);

  return (
    <div className="cart-page">
      <div className="left">
        <h1>Carrito</h1>
        <div className="cart-items">
          {courses.map((course) => (
            <div key={course.id} className="cart-item">
              <h3>{course.name}</h3>
              <strong>{course.price}</strong>
              <p>{course.description}</p>
              <div className="cart-item-controls">
                <Info className="cart-control" />
                <Trash2 className="cart-control" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="right">
        <h1>Resumen</h1>
        <div className="price-summary">
          <div className="price-list">
            {courses.map((course) => (
              <div key={course.id} className="price-item">
                <span>{course.name}</span>

                <span>{course.price}</span>
              </div>
            ))}
          </div>
          <div className="checkout">
            <h2>Monto Total: S/.{totalPrice.toFixed(2)}</h2>
            <button className="checkout-button">Confirmar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
