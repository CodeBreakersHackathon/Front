import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Añadir useNavigate
import axios from "axios"; // Usamos axios para obtener los cursos
import "./MisCursos.css";

const MisCursos = () => {
  const { userId } = useParams(); // Extraemos el userId de la URL
  const navigate = useNavigate(); // Inicializamos useNavigate
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        // Realiza la solicitud HTTP a la API
        const response = await axios.get(`http://localhost:3000/tickets/user/${userId}/courses`);
        
        // Verifica la respuesta completa
        console.log(response.data);

        // Asegúrate de que la respuesta es un arreglo
        if (Array.isArray(response.data)) {
          setCursos(response.data);
        } else {
          setError("La respuesta no es una lista de cursos válida.");
        }

        setLoading(false);
      } catch (err) {
        setError("Hubo un error al obtener los cursos.");
        setLoading(false);
      }
    };

    fetchCursos();
  }, [userId]);

  const handleVerClases = (cursoId) => {
    // Redirige al usuario a la página de clases del curso
    navigate(`/class/${cursoId}/view`);
  };

  if (loading) {
    return <div>Cargando tus cursos...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="mis-cursos">
      <h2>Mis Cursos</h2>
      <ul>
        {cursos.length === 0 ? (
          <li>No tienes cursos disponibles.</li>
        ) : (
          cursos.map((curso) => (
            <li key={curso.id}>
              <h3>{curso.name}</h3>
              <p>{curso.description}</p>
              <button onClick={() => handleVerClases(curso.id)} className="btn-ver-clases">
                Ver Clases
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default MisCursos;
