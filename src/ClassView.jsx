import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from './apiConstants';

const ClassView = () => {
  const { id } = useParams(); // Obtener el ID del curso desde la URL
  const [classDetails, setClassDetails] = useState([]); // Estado para manejar las clases
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Llamar a la API para obtener las clases del curso
    axios
      .get(`${API_URL}/classes/course/${id}`)
      .then((response) => {
        setClassDetails(response.data); // Guardar las clases en el estado
      })
      .catch((error) => {
        console.error('Error fetching classes:', error);
        setMessage('No se pudieron cargar las clases de este curso.');
      });
  }, [id]);

  if (classDetails.length === 0) {
    return <p>Cargando información de las clases...</p>;
  }

  return (
    <div className="class-view">
      <h2>Clases del Curso</h2>
      {classDetails.map((classItem) => (
        <div key={classItem.id} className="class-item">
          <h3>{classItem.title}</h3>
          <p>{classItem.description}</p>
          <p>Duración: {classItem.duration}</p>
          <div className="video-container">
            {classItem.videoUrl ? (
              <video width="100%" controls>
                <source
                  src={`${API_URL}${classItem.videoUrl}`}
                  type="video/mp4"
                />
                Tu navegador no soporta el formato de video.
              </video>
            ) : (
              <p>No hay video disponible para esta clase.</p>
            )}
          </div>
        </div>
      ))}

      {message && <p>{message}</p>}
    </div>
  );
};

export default ClassView;
