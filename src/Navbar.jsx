import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./Navbar.css";
import logo from "./assets/logo/logo2.png";

// Función para decodificar el JWT
const decodeJWT = (token) => {
  if (!token) return null;
  const payload = token.split('.')[1];
  const decoded = JSON.parse(atob(payload));
  return decoded;
};

function Navbar() {
  const { isLoggedIn, logout, userRole } = useAuth(); // Añadimos userRole del contexto
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token && token !== undefined) {
      try {
        const decodedToken = decodeJWT(token);
        if (decodedToken && decodedToken.sub) {
          setUserId(decodedToken.sub);
        }
      } catch (error) {
        console.error(
          "Error al analizar los datos del usuario desde localStorage:",
          error
        );
      }
    }
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const goToMisCursos = () => {
    if (userId) {
      navigate(`/tickets/user/${userId}/courses`);
    } else {
      alert("Debes iniciar sesión para acceder a tus cursos.");
    }
  };

  const goToMisClases = () => {
    navigate(`/course`);
  };


  const createEvent = () => {
    navigate(`/createEvent`);
  };
  
  const goToPerfil = () => {
    navigate(`/profile`);
  };

  const goToCalificar = () => {
    navigate('/calificar'); // Nueva función para el botón de calificar
  };

  return (
    <nav className="barra-navegacion">
      <div className="logo-navegacion">
        <Link to="/">
          <img src={logo} alt="Logo Handin" className="logo-imagen" />
        </Link>
      </div>

      <ul className="lista-navegacion">
        <li>
          <Link to="/" className="enlace-navegacion">
            Inicio
          </Link>
        </li>
        <li>
          <Link to="/nosotros" className="enlace-navegacion">
            Nosotros
          </Link>
        </li>
        <li>
          <Link to="/servicios" className="enlace-navegacion">
            Servicios
          </Link>
        </li>
        <li>
          <Link to="/contacto" className="enlace-navegacion">
            Contacto
          </Link>
        </li>
      </ul>

      <div className="botones-navegacion">
        {isLoggedIn ? (
          <>
            <button onClick={goToMisClases} className="btn-ver-clases">
              Ver Clases
            </button>
            <button onClick={goToMisCursos} className="btn-mis-cursos">
              Mis Cursos
            </button>
            <button onClick={goToPerfil} className="btn-ver-perfil">
              Ver Perfil
            </button>
            {/* Botón que solo aparece para profesores */}
            {userRole === 'professor' && (
              <button onClick={createEvent} className="btn-crearEvento">
                Crear Evento
              </button>
            )}
            <button onClick={handleLogout} className="btn-cerrar-sesion">
              Cerrar Sesión
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-iniciar-sesion">
              Iniciar Sesión
            </Link>
            <Link to="/register" className="btn-registrarse">
              Registrarse
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;