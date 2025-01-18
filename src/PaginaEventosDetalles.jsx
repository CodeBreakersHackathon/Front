import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { API_URL } from './apiConstants';

function PaginaEventosDetalles() {
  const { id } = useParams(); // Obtenemos el ID de la URL
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/activity/${id}`)
      .then((response) => {
        // Verificar si la respuesta es exitosa
        if (!response.ok) {
          throw new Error('Error en la respuesta del servidor');
        }
        return response.json();
      })
      .then((data) => {
        setEvent(data); // Suponiendo que la respuesta tiene los detalles del evento
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message); // Guardamos el mensaje de error
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="event-detail">
      <h2>{event.name}</h2>
      <img
        src={event.pictureCoverKey || 'default-image-url'} // Imagen por defecto si no está disponible
        alt={event.name}
        className="event-image"
      />
      <p>{event.description}</p>
      <p>
        <strong>Fecha del evento:</strong> {new Date(event.created_at).toLocaleDateString()}
      </p>
      <p>
        <strong>Categorías:</strong> {event.categories ? event.categories.join(', ') : 'No hay categorías disponibles'}
      </p>
      <p>
        <strong>Profesores:</strong> {event.professors ? event.professors.join(', ') : 'No hay profesores asignados'}
      </p>
      <p>
        <strong>Duración:</strong> {event.duration} minutos
      </p>
      <p>
        <strong>Precio:</strong> ${event.price}
      </p>
    </div>
  );
}

export default PaginaEventosDetalles;
