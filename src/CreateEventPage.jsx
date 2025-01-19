import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { API_URL } from './apiConstants';

const CreateEventPage = () => {
  const navigate = useNavigate();
  const [eventData, setEventData] = useState({
    name: '',
    description: '',
    price: 0,
    type: 'event',
    eventType: 'conference',
    location: '',
    eventDate: '',
    record_key: '',
    duration: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get('access_token'); // Obtiene el token de las cookies

    if (!token) {
      setAlert({
        show: true,
        message: 'No se ha encontrado un token de acceso',
        type: 'error',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/activity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Se envía el token en el header
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear el evento');
      }

      setAlert({
        show: true,
        message: '¡Evento creado exitosamente!',
        type: 'success',
      });

      setTimeout(() => {
        navigate('/'); // Redirige al inicio o a otra página después de crear el evento
      }, 1500);
    } catch (error) {
      console.error('Error al crear evento:', error);
      setAlert({
        show: true,
        message: error.message,
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-event-page">
      {alert.show && (
        <div className={`alert ${alert.type}`}>
          {alert.message}
        </div>
      )}

      <h2>Crear Evento</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Nombre de la actividad</label>
          <input
            type="text"
            id="name"
            name="name"
            value={eventData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Descripción</label>
          <textarea
            id="description"
            name="description"
            value={eventData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="price">Precio</label>
          <input
            type="number"
            id="price"
            name="price"
            value={eventData.price}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="location">Ubicación</label>
          <input
            type="text"
            id="location"
            name="location"
            value={eventData.location}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="eventDate">Fecha del evento</label>
          <input
            type="datetime-local"
            id="eventDate"
            name="eventDate"
            value={eventData.eventDate}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="duration">Duración (minutos)</label>
          <input
            type="number"
            id="duration"
            name="duration"
            value={eventData.duration}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creando evento...' : 'Crear Evento'}
        </button>
      </form>
    </div>
  );
};

export default CreateEventPage;
