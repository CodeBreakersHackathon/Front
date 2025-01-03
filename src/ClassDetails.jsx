import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ClassDetails.css';

function ClassDetails() {
  const { id } = useParams();
  const [classDetails, setClassDetails] = useState(null);
  const [userId, setUserId] = useState(1); 
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios
      .get(`http://localhost:3000/course/${id}`)
      .then((response) => {
        setClassDetails(response.data);
      })
      .catch((error) => {
        console.error('Error fetching class details:', error);
      });
  }, [id]);

  const handleSubscribe = () => {
    axios
      .post(`http://localhost:3000/tickets/${id}/subscribe`, { userId })
      .then((response) => {
        setMessage('Te has suscrito a la clase exitosamente.');
      })
      .catch((error) => {
        console.error('Error subscribing to the class:', error);
        setMessage('Ocurrió un error al intentar suscribirte a la clase.');
      });
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
}

export default ClassDetails;
