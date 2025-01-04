import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Cookies from "js-cookie"; // Para acceder al token

import Navbar from "./Navbar.jsx";
import Home from "./Home.jsx";
import AboutPage from "./AboutPage.jsx";
import ServicesPage from "./ServicesPage.jsx";
import ContactPage from "./ContactPage.jsx";
import LoginPage from "./LoginPage.jsx";
import RegisterPage from "./RegisterPage.jsx";
import { AuthProvider } from "./AuthContext";
import ClassesPage from "./ClassesPage"; // Importa la página de clases
import ClassDetails from "./ClassDetails"; // Importar la página de detalles de clase
import OnlyCharge from "./culqi/pages/CulqiComponents.tsx";
// import MyClassesPage from "./MyClassesPage"; // Importar la página de clases suscritas
import ClassView from "./ClassView";



function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);


  useEffect(() => {
    const token = Cookies.get("access_token");
    if (token) {
      setIsAuthenticated(true); // Si existe un token, el usuario está logueado
    }
  }, []);



  return (
    <Router>
      <AuthProvider>
        <Navbar isAuthenticated={isAuthenticated} /> {/* Pasamos el estado al Navbar */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/culqi" element={<OnlyCharge />} />
          <Route path="/nosotros" element={<AboutPage />} />
          <Route path="/servicios" element={<ServicesPage />} />
          <Route path="/contacto" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/course" element={<ClassesPage />} /> {/* Ruta de clases */}
          <Route path="/course/:id" element={<ClassDetails />} />{/* Ruta para los detalles de la clase */}
          {/* <Route path="/mis-clases" element={<MyClassesPage />} /> */}
          <Route path="/class/:id/view" element={<ClassView />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

