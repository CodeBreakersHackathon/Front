import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from './apiConstants';

function PaginaEventosDetalles() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [userId, setUserId] = useState(null);


    const fetchCurrentUser = async () => {
        try {
          const response = await fetch(`${API_URL}/users/me`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          });
          const userData = await response.json();
          setUserId(userData.id);
        } catch (error) {
          console.error('Error obteniendo usuario:', error);
        }
      };
  
      useEffect(() => {
        // Obtener datos del usuario
        fetchCurrentUser();
    
        // Obtener datos del evento
        fetch(`${API_URL}/activity/${id}`)
          .then((response) => {
            if (!response.ok) throw new Error('Error en la respuesta del servidor');
            return response.json();
          })
          .then((data) => {
            setEvent(data);
            setIsLoading(false);
          })
          .catch((error) => {
            console.error(error);
            setIsLoading(false);
          });
      }, [id]);

//   const decodeJWT = (token) => {
//     if (!token) return null;
//     try {
//       const payload = token.split('.')[1];
//       const decoded = JSON.parse(atob(payload));
//       return decoded;
//     } catch (error) {
//       console.error('Error decodificando JWT:', error);
//       return null;
//     }
//   };

const handleSubscribe = async () => {
    setIsLoading(true);
    setMessage('');
    const token = localStorage.getItem("access_token");

    if (!token) {
      setMessage('Necesitas iniciar sesión para suscribirte.');
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/tickets/${id}/subscribe`,
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

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!event) {
    return <div>Evento no encontrado</div>;
  }

  return (
    <div className="event-detail-page">
      <div className="event-header">
        <img
          src={event.pictureCoverKey || 'default-image-url'}
          alt={event.name}
          className="event-image"
        />
        <div className="event-info">
          <h1>{event.name}</h1>
          <p className="event-description">{event.description}</p>
          <p><strong>Duración:</strong> {event.duration} minutos</p>
          <p><strong>Precio:</strong> ${event.price}</p>
          <p><strong>Fecha del evento:</strong> {new Date(event.created_at).toLocaleDateString()}</p>
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
    </div>
  );
}

export default PaginaEventosDetalles;