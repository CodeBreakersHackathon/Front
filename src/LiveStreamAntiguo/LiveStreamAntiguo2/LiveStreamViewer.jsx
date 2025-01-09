import React, { useState, useEffect, useRef } from "react";
import socket from "../../socket"; // Asegúrate de tener el cliente socket configurado correctamente

const LiveStreamViewer = () => {
    const peerConnection = useRef(null); // Referencia para RTCPeerConnection
    const [remoteStream, setRemoteStream] = useState(null);
    const remoteVideoRef = useRef(null);

    useEffect(() => {
        if (remoteStream && remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream; // Asigna el stream al video
        }
    }, [remoteStream]);

    useEffect(() => {
        // Configura la conexión y manejo de señales como antes
        peerConnection.current = new RTCPeerConnection({
            iceServers: [
                { urls: "stun:stun.l.google.com:19302" },
            ],
        });

        peerConnection.current.onicecandidate = (event) => {
            if (event.candidate) {
                console.log("Espectador: Enviando ICE candidate", event.candidate);
                socket.emit("ice-candidate", event.candidate);
            }
        };

        peerConnection.current.ontrack = (event) => {
            console.log("Espectador: Recibiendo stream", event);
            setRemoteStream(event.streams[0]); // Configura el stream recibido
        };

        // Manejo de la oferta para la conexión
        socket.on("offer", async (offer) => {
            console.log("Espectador: Oferta recibida");
            try {
                await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
                const answer = await peerConnection.current.createAnswer();
                await peerConnection.current.setLocalDescription(answer);
                socket.emit("answer", answer); // Responder con la respuesta
            } catch (error) {
                console.error("Error configurando oferta de conexión: ", error);
            }
        });

        // Manejo de ICE candidates
        socket.on("ice-candidate", async (candidate) => {
            console.log("Espectador: Recibiendo ICE candidate", candidate);
            try {
                await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (error) {
                console.error("Error añadiendo ICE candidate:", error);
            }
        });

        // Cleanup en caso de que el componente se desmonte
        return () => {
            socket.off("offer");
            socket.off("ice-candidate");
            if (peerConnection.current) {
                peerConnection.current.close();
            }
        };
    }, [remoteStream]); // Dependencia de remoteStream para actualizar el video

    return (
        <div>
            <h2>Espectador: Viendo la transmisión</h2>
            <video ref={remoteVideoRef} autoPlay playsInline style={{ width: "100%", maxHeight: "400px" }} />
        </div>
    );
};

export default LiveStreamViewer;
