import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from './apiConstants';

function ClassesPage() {
  const [classes, setClasses] = useState([]);

  // Usamos useEffect para obtener las clases desde la API del backend cuando el componente se monta
  useEffect(() => {
    // Cambia esta URL por la de tu API
    fetch(`${API_URL}/courses/`)
      .then(response => response.json())
      .then(data => {
        setClasses(data); // Guardamos las clases en el estado
      })
      .catch(error => console.error('Error fetching classes:', error));
  }, []); // Este efecto se ejecuta solo una vez al cargar el componente

  return (
    <div className="classes-page">
      <h2>Clases Disponibles</h2>
      <ul>
        {classes.map((classItem) => (
          <li key={classItem.id}>
            <h3>{classItem.name}</h3>
            <p>{classItem.description}</p>
            <Link to={`/courses/${classItem.id}`} className="btn-detalles">
              Ver detalles
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ClassesPage;
