import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const LiveStreamEmitter = () => {
  const [stream, setStream] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const videoRef = useRef(null);
  const socketRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    // Conectar al servidor WebSocket
    socketRef.current = io('http://localhost:3000', {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    console.log('Conectado al servidor WebSocket');

    // Limpiar cuando el componente se desmonte
    return () => {
      console.log('Limpiando WebSocket y RTCPeerConnection');
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current.off('answer');
        socketRef.current.off('icecandidate');
      }
      if (peerConnection) {
        peerConnection.close();
      }
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [peerConnection, stream]);

  const startStreaming = () => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((localStream) => {
        setStream(localStream);
  
        if (videoRef.current) {
          videoRef.current.srcObject = localStream;

          // Voltear el video horizontalmente
          videoRef.current.style.transform = 'scaleX(-1)';
        }
  
        const pc = new RTCPeerConnection();
        setPeerConnection(pc);
  
        localStream.getTracks().forEach(track => pc.addTrack(track, localStream));
  
        pc.onicecandidate = ({ candidate }) => {
          if (candidate) {
            console.log('Enviando candidato ICE:', candidate);
            socketRef.current.emit('icecandidate', candidate);
          }
        };
  
        pc.createOffer()
          .then((offer) => {
            pc.setLocalDescription(offer);
            socketRef.current.emit('offer', offer);
            console.log('Oferta enviada:', offer);
          })
          .catch((error) => console.error('Error al crear la oferta:', error));
  
        socketRef.current.on('answer', (answer) => {
          pc.setRemoteDescription(new RTCSessionDescription(answer));
          console.log('Respuesta remota establecida:', answer);
        });
  
        socketRef.current.on('icecandidate', (candidate) => {
          pc.addIceCandidate(new RTCIceCandidate(candidate));
          console.log('Candidato ICE remoto agregado:', candidate);
        });
      })
      .catch((error) => {
        console.error('Error al acceder a la cámara y el micrófono', error);
      });
  
    setIsStreaming(true);
  };
  
  const stopStreaming = () => {
    console.log('Deteniendo transmisión...');
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    if (peerConnection) {
      peerConnection.close();
      setPeerConnection(null);
    }
    setIsStreaming(false);
  };

  return (
    <div>
      <h2>Emisión en Vivo</h2>
      <video ref={videoRef} autoPlay muted style={{ width: '100%', maxHeight: '500px' }} />
      <div>
        {!isStreaming ? (
          <button onClick={startStreaming}>Iniciar Transmisión</button>
        ) : (
          <button onClick={stopStreaming}>Detener Transmisión</button>
        )}
      </div>
    </div>
  );
};

export default LiveStreamEmitter;
