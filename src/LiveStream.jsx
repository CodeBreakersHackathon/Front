import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const LiveStream = () => {
  const [stream, setStream] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const videoRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    // Conectar al servidor de señalización WebSocket
    socketRef.current = io('http://localhost:3000');

    // Solicitar acceso a la cámara y micrófono
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((localStream) => {
        setStream(localStream);
        if (videoRef.current) {
          videoRef.current.srcObject = localStream;
        }

        // Crear una nueva conexión de WebRTC
        const pc = new RTCPeerConnection();
        setPeerConnection(pc);

        // Agregar el stream local a la conexión
        localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

        // Manejar la señalización: escuchar mensajes del servidor
        socketRef.current.on('offer', (offer) => {
          pc.setRemoteDescription(new RTCSessionDescription(offer));
          pc.createAnswer().then((answer) => {
            pc.setLocalDescription(answer);
            socketRef.current.emit('answer', answer);
          });
        });

        socketRef.current.on('answer', (answer) => {
          pc.setRemoteDescription(new RTCSessionDescription(answer));
        });

        socketRef.current.on('icecandidate', (candidate) => {
          if (candidate) {
            pc.addIceCandidate(new RTCIceCandidate(candidate));
          }
        });

        // Enviar candidatos ICE a otros usuarios
        pc.onicecandidate = ({ candidate }) => {
          if (candidate) {
            socketRef.current.emit('icecandidate', candidate);
          }
        };
      })
      .catch((error) => {
        console.error('Error al acceder a la cámara y el micrófono', error);
      });

    // Limpiar cuando el componente se desmonte
    return () => {
      socketRef.current.disconnect();
      if (peerConnection) {
        peerConnection.close();
      }
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div>
      <h2>Clase en Vivo</h2>
      <video ref={videoRef} autoPlay muted />
    </div>
  );
};

export default LiveStream;
