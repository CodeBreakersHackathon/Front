import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PaginaEventosDetalles.css';

const API_URL = 'http://localhost:3000'; // URL base de la API

function PaginaEventosDetalles() {
    const { id } = useParams(); // `id` corresponde al ActivityId
    const navigate = useNavigate();
    const [eventDetails, setEventDetails] = useState(null);
    const [activityDetails, setActivityDetails] = useState(null); // Datos de la actividad
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [eventId, setEventId] = useState(null); // ID del evento

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                // Obtener el ID del evento desde el ActivityId
                const activityResponse = await axios.get(`${API_URL}/event/activity/${id}`);
                const eventData = activityResponse.data;
                setEventDetails(eventData);
                setEventId(eventData.id); // Establecer el ID del evento

                // Obtener los detalles adicionales de la actividad
                const activityDetailsResponse = await axios.get(`${API_URL}/activity/${id}`);
                setActivityDetails(activityDetailsResponse.data);
            } catch (error) {
                console.error('Error al obtener detalles:', error);
                setMessage('Error al obtener detalles del evento o actividad.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDetails();
    }, [id]);

    const handleSubscribe = async () => {
        setIsLoading(true);
        setMessage('');
        const token = localStorage.getItem('access_token');

        if (!token) {
            setMessage('Necesitas iniciar sesión para suscribirte.');
            navigate('/login');
            return;
        }

        try {
            const response = await axios.post(
                `${API_URL}/tickets/${eventId}/subscribe`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if ([200, 201].includes(response.status)) {
                setMessage('¡Te has suscrito exitosamente!');
                // Redirigir a la página correcta usando el ID del evento
                setTimeout(() => navigate(`/event/${eventId}/view`), 2000);
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

    if (!eventDetails || !activityDetails) {
        return <div>Evento o actividad no encontrados</div>;
    }

    return (
        <div className="eventos-detalles-container">
            <div >
                <h1 className="detalles-header">{activityDetails.name}</h1>
                <div className="activity-details">
                <p><strong>Descripción:</strong> {activityDetails.description}</p>
                <p><strong>Duración:</strong> {activityDetails.duration} minutos</p>
                <p><strong>Precio:</strong> S/.{activityDetails.price}</p>
                <p><strong>Ubicación:</strong> {eventDetails.location}</p>
                <p><strong>Fecha del evento:</strong> {new Date(eventDetails.eventDate).toLocaleDateString()}</p>
                </div>
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
    );
}

export default PaginaEventosDetalles;
