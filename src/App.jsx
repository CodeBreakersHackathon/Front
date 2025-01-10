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
import MisCursos from "./MisCursos"; // Página para mostrar los cursos
// import LiveUpdates from "./LiveStreamAntiguo/LiveUpdates.jsx"; // Asegúrate de que la ruta sea correcta
// import LiveStream from './LiveStream';
// import LiveStreamEmitter from './LiveStreamAntiguo/LiveStreamEmitter.jsx'; // Transmisor
// import LiveStreamViewer from './LiveStreamAntiguo/LiveStreamViewer.jsx'; // Espectador

// import LiveStream from "./LiveStreamAntiguo/LiveStreamAntiguo2/LiveStream.jsx"; // Importamos el componente de transmisión en vivo
// import LiveStreamEmitter from "./LiveStreamAntiguo/LiveStreamAntiguo2/LiveStreamEmitter.jsx"; // Transmisor
// import LiveStreamViewer from "./LiveStreamAntiguo/LiveStreamAntiguo2/LiveStreamViewer.jsx"; // Espectador

// import Broadcaster from "./components/Broadcaster";
// import Viewer from "./components/Viewer";

import VideoChat from './VideoChat'; // Importar VideoChat
import EventosPage from "./EventosPage"; // Importar página de eventos

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
          <Route path="/tickets/user/:userId/courses" element={<MisCursos />} />
          {/* <Route path="/mis-clases" element={<MyClassesPage />} /> */}
          <Route path="/class/:id/view" element={<ClassView />} />
          <Route path="/eventos" element={<EventosPage />} /> {/* Nueva ruta para eventos */}

          {/* <Route path="/live-stream" element={<LiveStream />} /> */}
          {/* <Route path="/live-updates" element={<LiveUpdates />} /> */}
          {/* Ruta para el transmisor */}
          {/* <Route path="/transmisor" element={<LiveStreamEmitter />} /> */}

          {/* Ruta para el espectador */}
          {/* <Route path="/espectador" element={<LiveStreamViewer />} /> */}

          {/* <Route path="/live" element={<LiveStream />} /> */}
          {/* <Route path="/live/emitter" element={<LiveStreamEmitter />} /> 
          <Route path="/live/viewer" element={<LiveStreamViewer />} />  */}

          {/* Nuevas rutas para el streaming */}
          {/* <Route path="/streaming/stream/:roomId" element={<Broadcaster />} />
          <Route path="/streaming/watch/:roomId" element={<Viewer />} />
          */}

          <Route path="/videochat" element={<VideoChat />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;