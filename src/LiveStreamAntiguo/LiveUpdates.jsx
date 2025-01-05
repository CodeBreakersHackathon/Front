import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import './LiveUpdates.css'; // Importar el CSS

const LiveUpdates = ({ className }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Conectar al servidor WebSocket en NestJS
    const socket = io('http://localhost:3000'); // Asegúrate de que el backend esté en el puerto correcto

    // Escuchar el evento 'message' del servidor
    socket.on('message', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // Limpiar la conexión cuando el componente se desmonte
    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    // Enviar el mensaje al servidor
    const socket = io('http://localhost:3000'); // Asegúrate de que el backend esté en el puerto correcto
    socket.emit('message', message); // Emitir mensaje al servidor
    setMessage(''); // Limpiar el input
  };

  return (
    <div className="live-updates-container">
      <div className="class-chat-container">
        {/* Mostrar el nombre de la clase a la derecha */}
        <div className="class-container">
          <h2 className="title">Clase en Vivo: {className}</h2>
        </div>

        <div className="chat-container">
          {/* Mostrar los mensajes del chat a la izquierda */}
          <div className="messages-container">
            {messages.map((msg, index) => (
              <p key={index} className="message">{msg}</p>
            ))}
          </div>

          <div className="input-container">
            <input
              type="text"
              className="message-input"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escribe un mensaje..."
            />
            <button className="send-button" onClick={sendMessage}>Enviar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveUpdates;
