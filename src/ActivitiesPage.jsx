import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './ClassesPage.css';
import { API_URL } from './apiConstants';

function ActivitiesPage() {
  const [activities, setActivities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // Filtro por tipo (event, course, o all)

  useEffect(() => {
    fetch(`${API_URL}/activity/`)
      .then((response) => response.json())
      .then((data) => {
        setActivities(data.data); // Accede a "data" para obtener las actividades
      })
      .catch((error) => console.error('Error fetching activities:', error));
  }, []);

  // Filtro de actividades por tipo y por nombre
  const filteredActivities = activities.filter((activity) => {
    const matchesSearch = activity.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || activity.type === filterType;
    return matchesSearch && matchesType;
  });

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
        {filteredActivities.map((activity) => (
          <li className="classes-li-page" key={activity.id}>
            <img
              src={activity.pictureCoverKey}
              alt={activity.name}
              style={{ width: '100%', borderRadius: '8px', marginBottom: '10px' }}
            />
            <h3>{activity.name}</h3>
            <p>{activity.description}</p>
            <p>
              <strong>Duración:</strong> {activity.duration} minutos
            </p>
            <p>
              <strong>Precio:</strong> ${activity.price}
            </p>
            
            {/* Solo mostrar los detalles completos para los eventos */}
            {activity.type === 'event' && (
              <>
                <p>
                  <strong>Fecha del evento:</strong> {new Date(activity.created_at).toLocaleDateString()}
                </p>
                <p>
                  <strong>Categorías:</strong> {activity.categories && activity.categories.length > 0 ? activity.categories.join(', ') : 'No hay categorías disponibles'}
                </p>
                <p>
                  <strong>Profesores:</strong> {activity.professors && activity.professors.length > 0 ? activity.professors.join(', ') : 'No hay profesores asignados'}
                </p>
                <p>
                  <strong>Tipo de evento:</strong> {activity.type}
                </p>
              </>
            )}
            
            <Link to={`/activity/${activity.id}`} className="btn-detalles">
              Ver detalles
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ActivitiesPage;
