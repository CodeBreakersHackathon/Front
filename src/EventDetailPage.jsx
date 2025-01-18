import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { API_URL } from './apiConstants';
import './EventDetailPage.css';

function EventDetailPage() {
  const { id } = useParams();  // Obtener el ID del evento desde la URL
  const [event, setEvent] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/activity/${id}`)
      .then((response) => response.json())
      .then((data) => setEvent(data))
      .catch((error) => console.error('Error fetching event:', error));
  }, [id]);

  // Si el evento no se ha cargado aún
  if (!event) {
    return <div>Cargando...</div>;
  }

  // Función para agregar el evento al carrito y guardar en localStorage
  const addToCart = () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];  // Obtener carrito desde localStorage o inicializar vacío
    cart.push(event);  // Agregar el evento al carrito
    localStorage.setItem('cart', JSON.stringify(cart));  // Guardar el carrito en localStorage
    alert(`${event.name} ha sido agregado a tu carrito.`);
  };

  return (
    <div className="event-detail-page">
      <div className="event-header">
        <img
          src={event.image_url}
          alt={event.name}
          className="event-image"
        />
        <div className="event-info">
          <h1>{event.name}</h1>
          <p className="event-description">{event.description}</p>
          <p><strong>Duración:</strong> {event.duration} minutos</p>
          <p><strong>Precio:</strong> ${event.price}</p>
          <p><strong>Fecha del evento:</strong> {new Date(event.eventDate).toLocaleDateString()}</p>
          <p><strong>Tipo de evento:</strong> {event.eventType}</p>
          <p>
            <strong>Categorías:</strong> {event.categories && event.categories.length > 0 ? event.categories.join(', ') : 'No hay categorías disponibles'}
          </p>
          <p>
            <strong>Profesores:</strong> {event.professors && event.professors.length > 0 ? event.professors.join(', ') : 'No hay profesores asignados'}
          </p>
        </div>
      </div>
      <div className="event-footer">
        <button className="btn-registrarse" onClick={addToCart}>
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}

export default EventDetailPage;
