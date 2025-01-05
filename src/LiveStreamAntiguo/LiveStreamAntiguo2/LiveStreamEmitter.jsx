import React, { useState, useEffect, useRef } from "react";
import socket from "../../socket"; // Asegúrate de tener el cliente socket configurado correctamente

const LiveStreamEmitter = () => {
  const [isEmitterReady, setIsEmitterReady] = useState(false);
  const localVideoRef = useRef(null); // Para el video local
  const peerConnection = useRef(null); // Referencia para RTCPeerConnection
  const [localStream, setLocalStream] = useState(null);

  useEffect(() => {
    peerConnection.current = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    });
  
    peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          console.log("Emisor: Enviando ICE candidate", event.candidate);
          socket.emit("ice-candidate", event.candidate);
        }
      };
      
  
    socket.on("answer", async (answer) => {
      console.log("Emisor: Respuesta recibida");
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
    });
  
    socket.on("ice-candidate", async (candidate) => {
      console.log("Emisor: Recibiendo ICE candidate");
      try {
        await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        console.error("Error añadiendo ICE candidate:", error);
      }
    });
  
    return () => {
      socket.off("answer");
      socket.off("ice-candidate");
      if (peerConnection.current) {
        peerConnection.current.close();
      }
    };
  }, []);
  
  useEffect(() => {
    // Obtener acceso al dispositivo de video
    const getUserMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true, 
          audio: true,
        });
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        // Agregar la pista de video al peerConnection
        stream.getTracks().forEach(track => {
          peerConnection.current.addTrack(track, stream); // Asegúrate de que esto se hace
        });
      } catch (err) {
        console.error("Error obteniendo el stream local:", err);
      }
    };
  
    getUserMedia();
  }, []);
  
  
  const startStreaming = async () => {
    try {
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);
      socket.emit("offer", offer); // Enviar la oferta al espectador
    } catch (error) {
      console.error("Error creando la oferta:", error);
    }
  };

  return (
    <div>
      <h2>Emisor: Enviando la transmisión en vivo</h2>
      <video ref={localVideoRef} autoPlay playsInline />
      <button onClick={startStreaming}>Iniciar Transmisión</button>
    </div>
  );
};

export default LiveStreamEmitter;

