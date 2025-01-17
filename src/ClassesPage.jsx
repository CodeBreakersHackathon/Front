import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './ClassesPage.css';
import { API_URL } from './apiConstants';

function ClassesPage() {
  const [classes, setClasses] = useState([]);

  // Usamos useEffect para obtener las clases desde la API del backend cuando el componente se monta
  useEffect(() => {
    // Cambia esta URL por la de tu API
    fetch(`${API_URL}/course/`)
      .then(response => response.json())
      .then(data => {
        setClasses(data); // Guardamos las clases en el estado
      })
      .catch(error => console.error('Error fetching classes:', error));
  }, []); // Este efecto se ejecuta solo una vez al cargar el componente

  return (
    <div className="classes-page">
      <h2>Clases Disponibles</h2>
      <ul className='clases-css'>
  {classes.map((classItem) => (
    <li className="classes-li-page" key={classItem.id}>
      <img 
        src={classItem.image_url} 
        alt={classItem.name} 
        style={{ width: '100%', borderRadius: '8px', marginBottom: '10px' }}
      />
      <h3>{classItem.name}</h3>
      <p>{classItem.description}</p>
      <p><strong>Duración:</strong> {classItem.duration} minutos</p>
      <p><strong>Precio:</strong> ${classItem.price}</p>
      <Link to={`/course/${classItem.id}`} className="btn-detalles">
        Ver detalles
      </Link>
    </li>
  ))}
</ul>

    </div>
  );
}

export default ClassesPage;
