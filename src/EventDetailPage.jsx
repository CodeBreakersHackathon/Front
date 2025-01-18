import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from './apiConstants';
import './EventDetailPage.css';

function EventDetailPage() {
  const { id } = useParams();  // Obtener el ID del evento desde la URL
  const [event, setEvent] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener userId del token
        const userDataFromLocalStorage = localStorage.getItem('userData');
        if (userDataFromLocalStorage) {
          const parsedData = JSON.parse(userDataFromLocalStorage);
          const decodedToken = decodeJWT(parsedData.access_token);
          if (decodedToken?.sub) setUserId(decodedToken.sub);
        }

        const response = await fetch(`${API_URL}/activity/${id}`);
        const data = await response.json();
        setEvent(data);
      } catch (error) {
        console.error('Error fetching event:', error);
        setMessage('Error al cargar los detalles del evento.');
      }
    };

    fetchData();
  }, [id]);

  const decodeJWT = (token) => {
    if (!token) return null;
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return decoded;
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  };

  const handleSubscribe = async () => {
    setIsLoading(true);
    setMessage('');
    const userDataString = localStorage.getItem('userData');

    if (!userDataString) {
      setMessage('Necesitas iniciar sesión para suscribirte.');
      navigate('/login');
      return;
    }

    const userData = JSON.parse(userDataString);
    const token = userData.access_token;

    try {
      const response = await axios.post(
        `${API_URL}/tickets/${id}/subscribe`,  // Se ha cambiado el path aquí
        { userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if ([200, 201].includes(response.status)) {
        setMessage('¡Te has suscrito exitosamente!');

        // Redirigir según el tipo de suscripción (evento o curso)
        const redirectPath = event.eventType === 'curso' ? `/class/${id}/view` : `/event/${id}`;
        setTimeout(() => navigate(redirectPath), 2000);
      }
    } catch (error) {
      console.error('Error en la suscripción:', error);
      if (error.response?.status === 400) setMessage('Ya estás suscrito a este evento.');
      else if (error.response?.status === 401) {
        setMessage('Necesitas iniciar sesión nuevamente.');
        navigate('/login');
      } else if (error.response?.status === 404) setMessage('Evento no encontrado.');
      else setMessage('Error al procesar la suscripción.');
    } finally {
      setIsLoading(false);
    }
  };

  // Si el evento no se ha cargado aún
  if (!event) {
    return <div>Cargando...</div>;
  }

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
          <button 
            onClick={handleSubscribe} 
            className="btn-suscribirse"
            disabled={isLoading}
          >
            {isLoading ? <span className="spinner"></span> : 'Suscribirse'}
          </button>
          {message && <p className={`message ${isLoading ? 'loading' : ''}`}>{message}</p>}
        </div>
      </div>
      <div className="event-footer">
        {/* Puedes agregar más información aquí si lo deseas */}
      </div>
    </div>
  );
}

export default EventDetailPage;
