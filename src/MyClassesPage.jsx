import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';

function MyClassesPage() {
  const [subscribedClasses, setSubscribedClasses] = useState([]);

  useEffect(() => {
    const fetchSubscribedClasses = async () => {
      try {
        const token = Cookies.get("access_token");
        const response = await fetch("http://localhost:3000/user/subscriptions", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        
        if (response.status === 200) {
          const data = await response.json();
          setSubscribedClasses(data);
        } else {
          alert("No se pudieron obtener las clases suscritas.");
        }
      } catch (error) {
        console.error("Error al obtener las clases suscritas:", error);
        alert("Hubo un error al cargar tus clases.");
      }
    };

    fetchSubscribedClasses();
  }, []);

  return (
    <div className="my-classes-page">
      <h2>Mis Clases Suscritas</h2>
      {subscribedClasses.length > 0 ? (
        <ul>
          {subscribedClasses.map((classItem) => (
            <li key={classItem.id}>
              <h3>{classItem.name}</h3>
              <p>{classItem.description}</p>
              <p><strong>Horario:</strong> {classItem.schedule}</p>
              <Link to={`/clases/${classItem.id}`} className="btn-ver-detalles">
                Ver detalles
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No estás suscrito a ninguna clase aún.</p>
      )}
    </div>
  );
}

export default MyClassesPage;
