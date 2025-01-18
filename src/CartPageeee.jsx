import React, { useState, useEffect } from 'react';
import { Culqi } from './culqi/component/Culqi';  // Asegúrate de tener este componente de pago

function CartPageeee() {
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  // Obtener el carrito desde localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];  
    setCart(storedCart);
  
    // Calcular el precio total
    const total = storedCart.reduce((total, item) => {
      // Asegurarse de que item.price es una cadena
      const priceStr = typeof item.price === 'string' ? item.price : String(item.price);
      return total + parseFloat(priceStr.replace("S/.", ""));
    }, 0);
    setTotalPrice(total);
  }, []);
  

  // Función para manejar el checkout
  const handleCheckout = () => {
    // Lógica para procesar el pago con Culqi
    Culqi.open({
      amount: totalPrice * 100, // El monto debe ser en centavos
      currency: 'PEN',
      email: 'cliente@ejemplo.com', // Aquí podrías obtener el email del usuario
      onPayment: (paymentData) => {
        if (paymentData.status === 'success') {
          alert(`Pago exitoso. Total: S/.${totalPrice.toFixed(2)}`);
          
          // Eliminar los productos del carrito después de la compra
          localStorage.removeItem('cart');
          setCart([]);
        } else {
          alert('Hubo un error en el pago. Intenta nuevamente.');
        }
      },
      onError: (error) => {
        console.error('Error en el pago', error);
        alert('Hubo un error en el pago. Intenta nuevamente.');
      }
    });
  };

  return (
    <div className="cart-page">
      <div className="left">
        <h1>Carrito</h1>
        <div className="cart-items">
          {cart.length === 0 ? (
            <p>No tienes productos en tu carrito.</p>
          ) : (
            cart.map((item, index) => (
              <div key={index} className="cart-item">
                <h3>{item.name}</h3>
                <strong>{item.price}</strong>
                <p>{item.description}</p>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="right">
        <h1>Resumen</h1>
        <div className="price-summary">
          <div className="price-list">
            {cart.map((item, index) => (
              <div key={index} className="price-item">
                <span>{item.name}</span>
                <span>{item.price}</span>
              </div>
            ))}
          </div>
          <div className="checkout">
            <h2>Monto Total: S/.{totalPrice.toFixed(2)}</h2>
            <button className="checkout-button" onClick={handleCheckout}>
              Confirmar Suscripción
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPageeee;
