import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Para acceder al id del evento
import axios from "axios";
import { API_URL } from "./apiConstants"; // Asegúrate de que esta constante esté bien definida
import "./EventView.css";

const EventView = () => {
  const { id } = useParams(); // Obtener el id del evento desde la URL
  const [eventDetails, setEventDetails] = useState(null); // Para almacenar la información del evento
  const [activityDetails, setActivityDetails] = useState(null); // Para almacenar la información de la actividad
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Función para obtener los detalles del evento y de la actividad
    const fetchEventDetails = async () => {
      try {
        // Primero obtenemos los detalles del evento
        const eventResponse = await axios.get(`${API_URL}/event/${id}`);
        setEventDetails(eventResponse.data);

        // Luego obtenemos el activityId del evento
        const activityId = eventResponse.data.activityId;

        // Usamos el activityId para obtener los detalles de la actividad
        const activityResponse = await axios.get(`${API_URL}/activity/${activityId}`);
        setActivityDetails(activityResponse.data);

        setLoading(false);
      } catch (err) {
        console.error("Error al obtener los detalles del evento:", err);
        setError("Hubo un error al obtener los detalles del evento.");
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]); // Dependemos del id del evento para hacer la llamada

  if (loading) {
    return <div>Cargando información del evento...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Si no se encuentran los detalles del evento o de la actividad
  if (!eventDetails || !activityDetails) {
    return <div>No se encontró información completa del evento.</div>;
  }

  // Función para redirigir al enlace
const handleRedirect = () => {
  // Usar el ID del evento como nombre de sala
  window.location.href = `http://localhost:5173/RoomLiveStream/${id}`;
};

  return (
    <div className="event-view">
      <h2 className="event-view__title">Detalles del Evento</h2>
      <h3 className="event-view__type">{eventDetails.eventType}</h3>
      <div className="event-view__details">
        <p className="event-view__item"><strong>Fecha del Evento:</strong> {new Date(eventDetails.eventDate).toLocaleDateString()}</p>
        <p className="event-view__item"><strong>Ubicación:</strong> {eventDetails.location}</p>
        <p className="event-view__item"><strong>Clave de Registro:</strong> {eventDetails.record_key}</p>
      </div>
  
      <h3 className="event-view__subtitle">Detalles de la Actividad</h3>
      <div className="event-view__activity">
        <p className="event-view__item"><strong>Nombre de la Actividad:</strong> {activityDetails.name}</p>
        <p className="event-view__item"><strong>Descripción:</strong> {activityDetails.description}</p>
        <p className="event-view__item"><strong>Duración:</strong> {activityDetails.duration} minutos</p>
        <p className="event-view__item"><strong>Precio:</strong> ${activityDetails.price}</p>
      </div>

      {/* Botón para redirigir */}
      <button onClick={handleRedirect} className="event-view__button">
        Ir a RoomLiveStream
      </button>
    </div>
  );
};

export default EventView;

