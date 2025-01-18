import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { API_URL } from './apiConstants';

function PaginaCourseDetalles() {
  const { id } = useParams(); // Obtenemos el ID de la URL
  const [course, setCourse] = useState(null);
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
        setCourse(data); // Suponiendo que la respuesta tiene los detalles del curso
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
    <div className="course-detail">
      <h2>{course.name}</h2>
      <img
        src={course.pictureCoverKey || 'default-image-url'} // Imagen por defecto si no está disponible
        alt={course.name}
        className="course-image"
      />
      <p>{course.description}</p>
      <p>
        <strong>Duración:</strong> {course.duration} minutos
      </p>
      <p>
        <strong>Precio:</strong> ${course.price}
      </p>

      {/* Mostrar profesores solo si existen */}
      <p>
        <strong>Profesores:</strong> {course.professors ? course.professors.join(', ') : 'No hay profesores asignados'}
      </p>

      {/* Mostrar contenido solo si existe */}
      <p>
        <strong>Contenido:</strong> {course.content || 'No disponible'}
      </p>

      {/* Mostrar requisitos solo si existen */}
      <p>
        <strong>Requisitos:</strong> {course.requirements ? course.requirements.join(', ') : 'No hay requisitos'}
      </p>
    </div>
  );
}

export default PaginaCourseDetalles;
