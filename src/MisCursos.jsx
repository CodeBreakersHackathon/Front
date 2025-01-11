import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Ya no necesitamos useParams
import axios from "axios";
import "./MisCursos.css";
import { API_URL } from "./apiConstants";

const MisCursos = () => {
  const navigate = useNavigate();
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener userId del localStorage
  const getUserId = () => {
    const userDataString = localStorage.getItem("userData");
    if (!userDataString) {
      return null;
    }
    try {
      const userData = JSON.parse(userDataString);
      return userData.userId;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchCursos = async () => {
      const userId = getUserId();
      
      if (!userId) {
        setError("No se encontró información del usuario. Por favor, inicia sesión nuevamente.");
        setLoading(false);
        return;
      }

      try {
        // Obtener el token de acceso
        const token = localStorage.getItem("token");
        
        // Realizar la solicitud HTTP a la API con el token
        const response = await axios.get(
          `${API_URL}/tickets/user/${userId}/courses`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        console.log("Usuario ID:", userId);
        console.log("Respuesta completa:", response.data);

        if (Array.isArray(response.data)) {
          setCursos(response.data);
        } else {
          setError("La respuesta no es una lista de cursos válida.");
        }

        setLoading(false);
      } catch (err) {
        console.error("Error al obtener los cursos:", err);
        setError("Hubo un error al obtener los cursos.");
        setLoading(false);
        
        // Si el error es de autenticación, redirigir al login
        if (err.response && err.response.status === 401) {
          navigate("/login");
        }
      }
    };

    fetchCursos();
  }, []); // Ya no dependemos de userId como prop

  const handleVerClases = (cursoId) => {
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
              <button 
                onClick={() => handleVerClases(curso.id)} 
                className="btn-ver-clases"
              >
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