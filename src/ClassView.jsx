import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ClassView = () => {
  const { id } = useParams(); // Obtener el ID de la clase desde la URL
  const [classDetails, setClassDetails] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Llamar a la API para obtener los detalles de la clase grabada
    axios
      .get(`http://localhost:3000/course/${id}/view`) // Ruta para obtener los detalles de la clase grabada
      .then((response) => {
        setClassDetails(response.data); // Guardar los detalles de la clase en el estado
      })
      .catch((error) => {
        console.error('Error fetching class view:', error);
        setMessage('No se pudo cargar la clase grabada.');
      });
  }, [id]);

  if (!classDetails) {
    return <p>Cargando información de la clase grabada...</p>;
  }

  return (
    <div className="class-view">
      <h2>{classDetails.name}</h2>
      <p>{classDetails.description}</p>
      <p>Duración: {classDetails.duration}</p>
      <p>Instructor: {classDetails.instructor}</p>

      {/* Suponiendo que la clase grabada es un video */}
      <div className="video-container">
        {classDetails.videoUrl ? (
          <video width="100%" controls>
            <source src={classDetails.videoUrl} type="video/mp4" />
            Tu navegador no soporta el formato de video.
          </video>
        ) : (
          <p>No hay video disponible para esta clase.</p>
        )}
      </div>

      {message && <p>{message}</p>}
    </div>
  );
};

export default ClassView;
