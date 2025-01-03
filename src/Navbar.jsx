import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./Navbar.css";
import logo from "./assets/logo/logo2.png";

function Navbar() {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate(); // Redirección programática

  const handleLogout = () => {
    logout(); // Llamamos al método de logout que elimina el token
    navigate("/"); // Redirigimos a la página principal (home)
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
            <Link to="/course" className="btn-ver-clases">
              Ver Clases
            </Link>
            <Link to="/profile" className="btn-ver-perfil">
              Ver Perfil
            </Link>
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
