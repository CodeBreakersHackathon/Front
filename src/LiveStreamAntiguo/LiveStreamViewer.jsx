import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const LiveStreamViewer = () => {
  const [peerConnection, setPeerConnection] = useState(null);
  const videoRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    // Conexión con el servidor WebSocket
    socketRef.current = io('http://localhost:3000', {
        reconnectionAttempts: 10,  // Aumenta el número de intentos
        reconnectionDelay: 2000,   // Retraso mayor entre intentos
    });      

    console.log('Conectando al servidor WebSocket...');

    socketRef.current.on('connect', () => {
      console.log('Conexión WebSocket establecida');
    });

    socketRef.current.on('disconnect', () => {
      console.log('WebSocket desconectado. Intentando reconectar...');
    });

    // Crear conexión WebRTC
    const pc = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          {
            urls: 'turn:your-turn-server-url',
            username: 'user',
            credential: 'pass',
          },
        ],
      });
      

    setPeerConnection(pc);

    // Manejar ofertas recibidas
    socketRef.current.on('offer', async (offer) => {
        console.log('Oferta recibida:', offer);
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(offer));
          console.log('Descripción remota establecida');
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          console.log('Respuesta enviada:', answer);
          socketRef.current.emit('answer', answer);
        } catch (error) {
          console.error('Error al manejar la oferta:', error);
        }
      });
      

    // Manejar candidatos ICE
    socketRef.current.on('icecandidate', async (candidate) => {
      try {
        if (candidate) {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
          console.log('Candidato ICE agregado:', candidate);
        }
      } catch (error) {
        console.error('Error al agregar candidato ICE:', error);
      }
    });

    pc.oniceconnectionstatechange = () => {
  console.log('Estado de la conexión ICE:', pc.iceConnectionState);
};


    // Recibir pista de video
    pc.ontrack = (event) => {
        console.log('Pista de video recibida:', event.streams[0]);
        if (event.streams[0] && event.streams[0].getVideoTracks().length > 0) {
          console.log('Video track found');
          if (videoRef.current) {
            console.log('Asignando flujo al videoRef');
            videoRef.current.srcObject = event.streams[0];
          } else {
            console.error('videoRef.current es null');
          }
        } else {
          console.error('No video track in the stream');
        }
      };
      
      
      
    // Manejar nuevos candidatos ICE locales y enviarlos al servidor
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('Candidato ICE local generado:', event.candidate);
        socketRef.current.emit('icecandidate', event.candidate);
      }
    };

    return () => {
      console.log('Limpiando recursos de WebSocket y RTCPeerConnection');
      socketRef.current.disconnect();
      pc.close();
    };
  }, []);

  return (
    <div>
      <h2>Visualización de la transmisión en vivo</h2>
      <video ref={videoRef} autoPlay muted style={{ width: '100%', maxHeight: '500px' }} />
    </div>
  );
};

export default LiveStreamViewer;
