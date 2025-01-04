import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./Navbar.css";
import logo from "./assets/logo/logo2.png";

// Función para decodificar el JWT
const decodeJWT = (token) => {
  if (!token) return null;
  const payload = token.split(".")[1];
  const decoded = JSON.parse(atob(payload)); // Decodifica y parsea el payload
  return decoded; // Retorna el payload decodificado
};

function Navbar() {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null); // Estado para almacenar el userId

  // Efecto para obtener el userId desde el localStorage
  useEffect(() => {
    const userDataFromLocalStorage = localStorage.getItem("userData");

    if (userDataFromLocalStorage && userDataFromLocalStorage !== "undefined") {
      try {
        const parsedData = JSON.parse(userDataFromLocalStorage);
        const decodedToken = decodeJWT(parsedData.access_token); // Decodifica el token
        if (decodedToken && decodedToken.sub) {
          setUserId(decodedToken.sub); // Establece el userId
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
    logout(); // Llamamos al método de logout
    navigate("/"); // Redirigimos a la página principal (home)
  };

  const goToMisCursos = () => {
    if (userId) {
      navigate(`/tickets/user/${userId}/courses`); // Si el userId está disponible, redirige a "Mis Cursos"
    } else {
      alert("Debes iniciar sesión para acceder a tus cursos."); // Muestra un mensaje si no hay userId
    }
  };

  const goToMisClases = () => {
    navigate(`/course`); //redirige a "Mis Clases"
  };

  const goToPerfil = () => {
    navigate(`/profile`); // redirige a "Mi Perfil"
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
