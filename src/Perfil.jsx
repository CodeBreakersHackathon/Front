import React from "react";
import "./Perfil.css";
import { API_URL } from "./apiConstants";

export function PerfilPage() {
  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState(null);

  const fetchUser = async () => {
    const res = await fetch(`${API_URL}/users/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    const data = await res.json();
    console.log(data)
    setUser(data);
    setLoading(false);
  }

  React.useEffect(() => {
    if (loading)
    fetchUser();
  }, [loading]);

  return (
    <div className="perfil-container">
      <aside className="perfil-sidebar">
        <ul>
          <li>Notificaciones</li>
          <li className="active">Perfil</li>
          <li>Archivos</li>
          <li>Configuraciones</li>
          <li>Portafolios electrónicos</li>
          <li>My Badges</li>
          <li>Código QR</li>
          <li>Anuncios globales</li>
        </ul>
      </aside>

{!loading ? (
      <main className="perfil-main">
        <div className="perfil-header">
          <img
            src="/path/to/profile-picture.jpg"
            alt="Profile"
            className="perfil-picture"
          />
          <h1>{user.lastName}, {user.firstName}</h1>
        </div>
        <section className="perfil-details">
          <h2>Contacto</h2>
          <p>No hay servicios registrados, puede agregar algunos en la página de configuraciones.</p>

          <h2>Biografía</h2>
          <p>No se ha agregado una biografía</p>

          <h2>Enlaces</h2>
          <p>No se han agregado enlaces</p>
        </section>
        <button className="perfil-edit-btn">Editar el perfil</button>
      </main>
    ) : "Cargando..."};
    </div>
  );
}

export default PerfilPage;
