import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Añadir useNavigate
import axios from 'axios';

// Función para decodificar el JWT
const decodeJWT = (token) => {
  if (!token) return null;
  const payload = token.split('.')[1];
  const decoded = JSON.parse(atob(payload));  // Decodifica y parsea el payload
  return decoded;  // Retorna el payload decodificado
};

const ClassDetails = () => {
  const { id } = useParams(); // Obtenemos el ID de la clase desde la URL
  const navigate = useNavigate(); // Inicializamos useNavigate
  const [classDetails, setClassDetails] = useState(null);
  const [userId, setUserId] = useState(null); // Almacenamos el userId obtenido desde el token
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Obtener el userId del localStorage
    const userDataFromLocalStorage = localStorage.getItem('userData');
    
    if (userDataFromLocalStorage && userDataFromLocalStorage !== 'undefined') {
      try {
        const parsedData = JSON.parse(userDataFromLocalStorage);
        
        // Extraer el userId del token JWT
        const decodedToken = decodeJWT(parsedData.access_token); // Decodifica el token
        if (decodedToken && decodedToken.sub) {  // Verifica que el 'sub' (userId) esté presente
          setUserId(decodedToken.sub); // Establecer el userId en el estado
        }
      } catch (error) {
        console.error('Error al analizar los datos del usuario desde localStorage:', error);
      }
    } else {
      console.log('No se encontraron datos en localStorage');
    }

    // Llamar a la API para obtener los detalles de la clase
    axios
      .get(`http://localhost:3000/course/${id}`)
      .then((response) => {
        setClassDetails(response.data);
      })
      .catch((error) => {
        console.error('Error fetching class details:', error);
      });
  }, [id]); // Solo se ejecuta cuando el ID de la clase cambia

  // En tu función de manejo del subscribe (por ejemplo, handleSubscribe)
const handleSubscribe = async () => {
  try {
    // Tu lógica de suscripción
    await axios.post('http://localhost:3000/tickets/1/subscribe', { /* datos */ });
  } catch (error) {
    if (error.response && error.response.status === 400) {
      // Si el error es un 400, puedes manejarlo aquí
      alert('Ya estás suscrito a este curso');
    } else {
      // Manejo general de otros errores
      alert('Hubo un problema al intentar suscribirte');
    }
  }
};

  
  

  if (!classDetails) {
    return <p>Cargando detalles de la clase...</p>;
  }

  return (
    <div className="class-details">
      <h2>{classDetails.name}</h2>
      <p>{classDetails.description}</p>
      <p>Duración: {classDetails.duration}</p>
      <p>Instructor: {classDetails.instructor}</p>
      <button onClick={handleSubscribe} className="btn-suscribirse">
        Suscribirse
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ClassDetails;
