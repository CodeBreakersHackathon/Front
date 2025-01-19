import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from './apiConstants';
import './ClassDetails.css';

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

const ClassDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [classDetails, setClassDetails] = useState(null);
  const [relatedClasses, setRelatedClasses] = useState([]);
  const [userId, setUserId] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

        // Llamadas a las APIs en paralelo
        const [classResponse, relatedClassesResponse] = await Promise.all([
          axios.get(`${API_URL}/activity/${id}`),
          axios.get(`${API_URL}/classes/course/${id}`),
        ]);

        setClassDetails(classResponse.data);
        setRelatedClasses(relatedClassesResponse.data);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        setMessage('Error al cargar los detalles del curso.');
      }
    };

    fetchData();
  }, [id]);

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
        setMessage('¡Te has suscrito exitosamente al curso!');
        // Redirigir a la página de las clases del curso
        setTimeout(() => navigate(`/class/${id}/view`), 2000);
      }
    } catch (error) {
      console.error('Error en la suscripción:', error);
      if (error.response?.status === 400) setMessage('Ya estás suscrito a este curso.');
      else if (error.response?.status === 401) {
        setMessage('Necesitas iniciar sesión nuevamente.');
        navigate('/login');
      } else if (error.response?.status === 404) setMessage('Curso no encontrado.');
      else setMessage('Error al procesar la suscripción.');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!classDetails) {
    return <p>Cargando detalles de la clase...</p>;
  }

  return (
    <div className="class-details-container">
      <div className="class-details">
        <h2>{classDetails.name}</h2>
        <img 
          src={classDetails.image_url} 
          alt={classDetails.name} 
          className="class-image" 
        />
        <p>{classDetails.description}</p>
        <p><strong>Duración:</strong> {classDetails.duration} minutos</p>
        <p><strong>Precio:</strong> ${classDetails.price}</p>
        <button 
          onClick={handleSubscribe} 
          className="btn-suscribirse"
          disabled={isLoading}
        >
          {isLoading ? <span className="spinner"></span> : 'Suscribirse'}
        </button>
        {message && <p className={`message ${isLoading ? 'loading' : ''}`}>{message}</p>}
      </div>

      <div className="related-classes">
        <h3>Clases del curso</h3>
        <ul>
          {relatedClasses.map((relatedClass) => (
            <li key={relatedClass.id}>
              <strong>{relatedClass.title}</strong> - {relatedClass.duration} minutos
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ClassDetails;
