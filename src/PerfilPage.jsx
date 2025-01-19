import React, { useState, useEffect } from "react";
import "./PerfilPage.css";
import { API_URL } from "./apiConstants";
import { UserCircle, Eye, EyeOff } from "lucide-react";

export function PerfilPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("perfil");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordError, setPasswordError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchUser = async () => {
    try {
      const res = await fetch(`${API_URL}/users/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      
      if (!res.ok) {
        throw new Error('Error al cargar los datos del usuario');
      }

      const data = await res.json();
      setUser(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setSuccessMessage("");

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Las contraseñas nuevas no coinciden");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/users/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al cambiar la contraseña');
      }

      setSuccessMessage("Contraseña actualizada exitosamente");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      setShowPasswordForm(false);
    } catch (err) {
      setPasswordError(err.message);
    }
  };

  const menuItems = [
    { id: "perfil", label: "Perfil" },
    { id: "archivos", label: "Archivos" },
    { id: "configuracion", label: "Configuración" },
    { id: "portafolio", label: "Portafolio electrónico" },
  ];

  if (loading) {
    return (
      <div className="perfil-container">
        <aside className="perfil-sidebar">
          <ul>
            {menuItems.map((item) => (
              <li 
                key={item.id}
                className={activeSection === item.id ? "active" : ""}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </aside>
        <main className="perfil-main">
          <div className="loading-state">Cargando...</div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="perfil-container">
        <aside className="perfil-sidebar">
          <ul>
            {menuItems.map((item) => (
              <li 
                key={item.id}
                className={activeSection === item.id ? "active" : ""}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </aside>
        <main className="perfil-main">
          <div className="error-message">Error: {error}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="perfil-container">
      <aside className="perfil-sidebar">
        <ul>
          {menuItems.map((item) => (
            <li 
              key={item.id}
              className={activeSection === item.id ? "active" : ""}
              onClick={() => setActiveSection(item.id)}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </aside>

      <main className="perfil-main">
        <div className="perfil-header">
          <div className="perfil-picture-container">
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt="Foto de perfil"
                className="perfil-picture"
              />
            ) : (
              <div className="perfil-avatar">
                <UserCircle size={80} />
              </div>
            )}
          </div>
          <div className="perfil-user-info">
            <h1>{user.lastName}, {user.firstName}</h1>
            <span className="user-role">{user.role}</span>
          </div>
        </div>

        <section className="perfil-details">
          <div className="contact-section">
            <h2>Información de Contacto</h2>
            <div className="contact-info">
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Teléfono:</strong> {user.phone}</p>
              <p><strong>País:</strong> {user.country}</p>
              <p><strong>Ciudad:</strong> {user.city}</p>
              <p><strong>Dirección:</strong> {user.address}</p>
            </div>
          </div>

          <div className="biography-section">
            <h2>Biografía</h2>
            <p>{user.biography || "No se ha agregado una biografía"}</p>
          </div>

          <div className="password-section">
            <h2>Cambiar Contraseña</h2>
            {!showPasswordForm ? (
              <button 
                className="btn-secondary"
                onClick={() => setShowPasswordForm(true)}
              >
                Cambiar contraseña
              </button>
            ) : (
              <form onSubmit={handlePasswordChange} className="password-form">
                {passwordError && (
                  <div className="error-message">{passwordError}</div>
                )}
                {successMessage && (
                  <div className="success-message">{successMessage}</div>
                )}
                <div className="form-group">
                  <label htmlFor="currentPassword">Contraseña actual</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPassword.current ? "text" : "password"}
                      id="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({
                        ...passwordForm,
                        currentPassword: e.target.value
                      })}
                      required
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowPassword({
                        ...showPassword,
                        current: !showPassword.current
                      })}
                    >
                      {showPassword.current ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="newPassword">Nueva contraseña</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPassword.new ? "text" : "password"}
                      id="newPassword"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({
                        ...passwordForm,
                        newPassword: e.target.value
                      })}
                      required
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowPassword({
                        ...showPassword,
                        new: !showPassword.new
                      })}
                    >
                      {showPassword.new ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirmar nueva contraseña</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPassword.confirm ? "text" : "password"}
                      id="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({
                        ...passwordForm,
                        confirmPassword: e.target.value
                      })}
                      required
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowPassword({
                        ...showPassword,
                        confirm: !showPassword.confirm
                      })}
                    >
                      {showPassword.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-primary">
                    Guardar cambios
                  </button>
                  <button 
                    type="button" 
                    className="btn-secondary"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setPasswordError("");
                      setPasswordForm({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: ""
                      });
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>

        <button className="perfil-edit-btn">
          Editar el perfil
        </button>
      </main>
    </div>
  );
}

export default PerfilPage;