import React, { useState, useEffect } from 'react';
import { Culqi } from './culqi/component/Culqi'; 

function CartPageeee() {
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [chargeMessage, setChargeMessage] = useState("");

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];  
    setCart(storedCart);

    const total = storedCart.reduce((total, item) => {
      const priceStr = typeof item.price === 'string' ? item.price : String(item.price);
      return total + parseFloat(priceStr.replace("S/.", ""));
    }, 0);
    setTotalPrice(total);
  }, []);

  const handlePayment = async (paymentData) => {
    setChargeMessage('Procesando pago...');
    
    // Obtener el userId del localStorage
    const userDataString = localStorage.getItem('userData');
    if (!userDataString) {
      setChargeMessage('Necesitas iniciar sesión para realizar el pago.');
      return;
    }
  
    const userData = JSON.parse(userDataString);
    const token = userData.access_token;
    const userId = userData.userId; // Asegúrate de tener el userId en el objeto del usuario
    
    try {
      // Iterar sobre las actividades (courseId) para suscribir al usuario a cada una
      for (const courseId of activities) {
        const url = `http://localhost:3000/tickets/${courseId}/subscribe`;
        
        // Realizar la solicitud para cada curso
        const response = await axios.post(
          url,
          { userId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
  
        if (response.status !== 200 && response.status !== 201) {
          throw new Error(`Error al suscribir al curso ${courseId}`);
        }
      }
  
      setChargeMessage('¡Pago realizado y tickets guardados exitosamente!');
      // Redirigir o mostrar algún mensaje de éxito
      setTimeout(() => {
        // Opcional: Redirigir a una página de éxito o de detalles del pago
        navigate('/payment-success');
      }, 2000);
    } catch (error) {
      console.error('Error al guardar el ticket:', error.response || error);
      setChargeMessage('Hubo un error al procesar el pago o guardar el ticket.');
    }
  };
  
  
  const handleRemoveItem = (itemIndex) => {
    const updatedCart = cart.filter((_, index) => index !== itemIndex);
    setCart(updatedCart);
  
    const total = updatedCart.reduce((total, item) => {
      const priceStr = typeof item.price === 'string' ? item.price : String(item.price);
      return total + parseFloat(priceStr.replace("S/.", ""));
    }, 0);
    setTotalPrice(total);
    localStorage.setItem('cart', JSON.stringify(updatedCart));  // Actualiza el carrito en localStorage
  
    console.log(updatedCart); // Verifica el carrito actualizado
  };
  


  const activities = cart.map(item => item.id); 

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
                <button onClick={() => handleRemoveItem(index)}>Eliminar</button>
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
            <Culqi
  activities={activities}
  chargeMessage={chargeMessage}
  setChargeMessage={setChargeMessage}
  buttonTitle="Pagar Ahora"
  payText="Confirmar Suscripción"
  onPaymentSuccess={handlePayment} // Pasamos la función para manejar el pago
/>

            {chargeMessage && <p>{chargeMessage}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPageeee;
