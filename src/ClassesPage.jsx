import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './ClassesPage.css';
import { API_URL } from './apiConstants';

function ActivitiesPage() {
  const [activities, setActivities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // Filtro por tipo (event, course, o all)

  const fetchActivities = () => {
    const endpoint = filterType === 'course' ? `${API_URL}/course/` : `${API_URL}/activity/`;
    fetch(endpoint)
      .then((response) => response.json())
      .then((data) => {
        // Manejo de datos según la estructura del endpoint
        setActivities(filterType === 'course' ? data : data.data);
      })
      .catch((error) => console.error('Error fetching activities:', error));
  };

  useEffect(() => {
    fetchActivities();
  }, [filterType]); // Vuelve a cargar los datos si cambia el filtro

  // Filtro de actividades por nombre
  const filteredActivities = activities.filter((activity) =>
    activity.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="classes-page">
      <h2>Actividades Disponibles</h2>

      {/* Input para buscar por nombre */}
      <input
        type="text"
        placeholder="Buscar por nombre..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      {/* Filtro por tipo de actividad */}
      <div className="filter-type">
        <label>Filtrar por tipo:</label>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">Todas</option>
          <option value="event">Eventos</option>
          <option value="course">Cursos</option>
        </select>
      </div>

      <ul className="clases-css">
        {filteredActivities.map((classItem) => (
          <li className="classes-li-page" key={classItem.id}>
            <img
              src={classItem.pictureCoverKey || classItem.image_url} // Manejo de imágenes según el endpoint
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

            {/* Solo mostrar los detalles adicionales para los eventos */}
            {classItem.type === 'event' && (
              <>
                <p>
                  <strong>Fecha del evento:</strong> {new Date(classItem.created_at).toLocaleDateString()}
                </p>
                <p>
                  <strong>Categorías:</strong> {classItem.categories && classItem.categories.length > 0 ? classItem.categories.join(', ') : 'No hay categorías disponibles'}
                </p>
                <p>
                  <strong>Profesores:</strong> {classItem.professors && classItem.professors.length > 0 ? classItem.professors.join(', ') : 'No hay profesores asignados'}
                </p>
              </>
            )}

<Link 
  to={filterType === 'course' 
    ? `/course/${classItem.courseId}` // Ruta para cursos
    : `/event/${classItem.id}`        // Ruta para eventos
  } 
  className="btn-detalles"
>
  Ver detalles
</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ActivitiesPage;
