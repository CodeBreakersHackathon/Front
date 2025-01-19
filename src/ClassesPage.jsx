import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ClassesPage.css';
import { API_URL } from './apiConstants';

function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el texto del buscador
  const navigate = useNavigate(); // Para redirigir

  useEffect(() => {
    fetch('http://localhost:3000/activity')
      .then((response) => response.json())
      .then((data) => {
        // Filtramos los cursos con type === 'course'
        const filteredCourses = data.data.filter((activity) => activity.type === 'course');
        setClasses(filteredCourses); // Almacenamos solo los cursos
      })
      .catch((error) => console.error('Error fetching classes:', error));
  }, []);

  // Filtramos las clases en función del término de búsqueda
  const filteredClasses = classes.filter((classItem) =>
    classItem.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Redirigir a la página de detalles del curso
  const handleGoToDetails = (id) => {
    navigate(`/classdetails/${id}`);
  };

  return (
    <div className="classes-page">
      <h2>Clases Disponibles</h2>

      {/* Campo de búsqueda */}
      <input
        type="text"
        placeholder="Buscar por nombre..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      <ul className="clases-css">
        {filteredClasses.map((classItem) => (
          <li className="classes-li-page" key={classItem.id}>
            <img
              src={classItem.pictureCoverKey || 'default-image.jpg'} // Asegúrate de tener una imagen por defecto
              alt={classItem.name}
              style={{ width: '100%', borderRadius: '8px', marginBottom: '10px' }}
            />
            <h3>{classItem.name}</h3>
            <p>{classItem.description}</p>
            <p>
              <strong>Duración:</strong> {classItem.duration} minutos
            </p>
            <p>
              <strong>Precio:</strong> ${classItem.price}
            </p>
            <button
              onClick={() => handleGoToDetails(classItem.id)} // Llama a la función para redirigir
              className="btn-detalles"
            >
              Ver detalles
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ClassesPage;
