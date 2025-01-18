import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './ClassesPage.css';
import { API_URL } from './apiConstants';

function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el texto del buscador

  useEffect(() => {
    fetch(`${API_URL}/course/`)
      .then((response) => response.json())
      .then((data) => {
        setClasses(data);
      })
      .catch((error) => console.error('Error fetching classes:', error));
  }, []);

  // Filtramos las clases en función del término de búsqueda
  const filteredClasses = classes.filter((classItem) =>
    classItem.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              src={classItem.image_url}
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
