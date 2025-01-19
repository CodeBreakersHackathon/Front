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
import ClassView from "./ClassView";
import MisCursos from "./MisCursos"; // Página para mostrar los cursos
import CartPage from "./CartPage.jsx";

import VideoChat from "./VideoChat"; // Importar VideoChat
import EventosPage from "./EventosPage"; // Importar página de eventos

import RoomLiveStream from "./RoomLiveStream"; // Importar página de eventos
import PerfilPage from "./PerfilPage.jsx";

import CreateEventPage from "./CreateEventPage.jsx";

import ActivitiesPage from "./ActivitiesPage.jsx";

import EventDetailPage from './EventDetailPage.jsx';

import PaginaEventosDetalles from './PaginaEventosDetalles.jsx';
import PaginaCourseDetalles from './PaginaCourseDetalles.jsx';
import EventView from './EventView.jsx';


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
        <Navbar isAuthenticated={isAuthenticated} />{" "}
        {/* Pasamos el estado al Navbar */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/culqi" element={<OnlyCharge />} />
          <Route path="/nosotros" element={<AboutPage />} />
          <Route path="/servicios" element={<ServicesPage />} />
          <Route path="/contacto" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/course" element={<ClassesPage />} />{" "}
          {/* Ruta de clases */}
          <Route path="/classdetails/:id" element={<ClassDetails />} />
          {/* Ruta para los detalles de la clase */}


          
          <Route path="/tickets/user/:userId/activities" element={<MisCursos />} />
          {/* <Route path="/mis-clases" element={<MyClassesPage />} /> */}
          <Route path="/class/:id/view" element={<ClassView />} />
          <Route path="/event/:id/view" element={<EventView />} /> {/* Ruta para el evento */}


          <Route path="/eventos" element={<EventosPage />} />{" "}
          <Route path="/videochat" element={<VideoChat />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/profile" element={<PerfilPage />} />

          <Route path="/RoomLiveStream" element={<RoomLiveStream/>}/>
          <Route path="/RoomLiveStream/:roomId" element={<RoomLiveStream />} />



          <Route path="/createEvent" element={<CreateEventPage />} />
          <Route path="/AllActivities" element={<ActivitiesPage />} />

          <Route path="/activity/:id" element={<EventDetailPage />} />
          <Route path="/cart" element={<CartPage />} />




          {/* De Todas las actividades a eventos y cursos por separado */}
          <Route path="/event/:id" element={<PaginaEventosDetalles />} />
        `<Route path="/classdetails/:id" element={<PaginaCourseDetalles />} />

        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
