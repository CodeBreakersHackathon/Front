import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import './RoomLiveStream.css';

const RoomLiveStream = () => {
  const [peers, setPeers] = useState({});
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [roomName, setRoomName] = useState('');
  const [currentRoom, setCurrentRoom] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const localVideoRef = useRef(null);
  const socket = useRef(null);
  const localStream = useRef(null);
  const peerConnections = useRef({});
  const iceCandidatesQueue = useRef({});

  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const screenVideoRef = useRef(null);
  const screenStream = useRef(null);

  const [isMuted, setIsMuted] = useState(false);

  // Almacena mensajes del chat
  const [chatMessages, setChatMessages] = useState([]); 
  const [newMessage, setNewMessage] = useState(''); 

  //Para grabar
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorder = useRef(null);
  const recordedChunks = useRef([]);


  const toggleMute = () => {
    if (localStream.current) {
      const audioTrack = localStream.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const sendMessage = () => {
    if (newMessage.trim() && socket.current) {
      const messageData = {
        room: currentRoom,
        message: newMessage.trim(),
        sender: socket.current.id,  // Usar el ID del cliente en lugar de 'Yo'
      };
  
      // Enviar el mensaje al servidor
      socket.current.emit('chatMessage', messageData);
  
      // Limpiar el input del mensaje después de enviarlo
      setNewMessage('');
    }
  };
  
  

  const toggleCamera = async () => {
    if (localStream.current) {
      const videoTrack = localStream.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraOn(videoTrack.enabled);
      }
    }
  };
  

  const initializeMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      localStream.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = isCameraOn;
      }

      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      return null;
    }
  };


  //Grabaciones
  const startRecording = () => {
    if (screenStream.current) {
      recordedChunks.current = [];
      mediaRecorder.current = new MediaRecorder(screenStream.current, {
        mimeType: 'video/webm; codecs=vp8', // Ajusta el tipo MIME según lo que necesites
      });
  
      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.current.push(event.data);
        }
      };
  
      mediaRecorder.current.onstop = () => {
        const blob = new Blob(recordedChunks.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
  
        // Descarga el archivo automáticamente
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'recording.webm';
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
      };
  
      mediaRecorder.current.start();
      setIsRecording(true);
    } else {
      console.error('No hay flujo de pantalla disponible para grabar');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };
  



  const joinRoom = async () => {
    if (roomName.trim() && socket.current) {
      if (currentRoom) {
        // Si estamos en una sala, salimos primero
        await leaveRoom();
      }
      
      // Inicializar el stream si no existe
      if (!localStream.current) {
        await initializeMedia();
      }

      // Unirse a la nueva sala
      socket.current.emit('joinRoom', roomName.trim());
      setCurrentRoom(roomName.trim());
      setIsConnected(true);
    }
  };

  const leaveRoom = async () => {
    if (currentRoom && socket.current) {
      socket.current.emit('leaveRoom', currentRoom);
      
      // Limpiar las conexiones peer
      Object.values(peerConnections.current).forEach(pc => {
        pc.close();
      });
      
      // Limpiar el estado de los mensajes del chat
      setChatMessages([]);  // Limpia los mensajes del chat al salir
  
      setPeers({});
      peerConnections.current = {};
      iceCandidatesQueue.current = {};
      
      setCurrentRoom('');
      setIsConnected(false);
      setRoomName('');
    }
  };
  

  const cleanupConnections = () => {
    if (localStream.current) {
      localStream.current.getTracks().forEach(track => track.stop());
      localStream.current = null;
    }
    
    Object.values(peerConnections.current).forEach(pc => {
      pc.close();
    });
    
    setPeers({});
    peerConnections.current = {};
    iceCandidatesQueue.current = {};
  };

  const processIceCandidatesQueue = async (userId) => {
    const pc = peerConnections.current[userId];
    const queue = iceCandidatesQueue.current[userId] || [];
    
    while (queue.length > 0 && pc.remoteDescription) {
      const candidate = queue.shift();
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        console.error('Error adding queued ICE candidate:', error);
      }
    }
  };

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      // Detener compartir pantalla
      screenStream.current.getTracks().forEach((track) => track.stop());
  
      // Restaurar cámara si estaba activa
      if (localStream.current) {
        const videoTrack = localStream.current.getVideoTracks()[0];
        Object.values(peerConnections.current).forEach((pc) => {
          const sender = pc.getSenders().find((s) => s.track?.kind === 'video');
          if (sender) {
            sender.replaceTrack(videoTrack);
          }
        });
      }
  
      setIsScreenSharing(false);
      if (screenVideoRef.current) {
        screenVideoRef.current.srcObject = null;
      }
    } else {
      try {
        // Iniciar compartir pantalla
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        screenStream.current = stream;
  
        const videoTrack = stream.getVideoTracks()[0];
        Object.values(peerConnections.current).forEach((pc) => {
          const sender = pc.getSenders().find((s) => s.track?.kind === 'video');
          if (sender) {
            sender.replaceTrack(videoTrack);
          }
        });
  
        setIsScreenSharing(true);
        if (screenVideoRef.current) {
          screenVideoRef.current.srcObject = stream;
        }
  
        videoTrack.onended = () => toggleScreenShare();
      } catch (error) {
        console.error('Error sharing screen:', error);
      }
    }
  };
  
  useEffect(() => {
    socket.current = io('http://localhost:3000', {
      reconnection: true,
      reconnectionDelay: 1000,
    });
  
    // Configurar solo una vez el evento 'chatMessage'
    if (socket.current) {
      socket.current.on('chatMessage', ({ sender, message }) => {
        setChatMessages((prev) => [...prev, { sender, message }]);
      });
    }
  
    const setupSocketListeners = () => {
      socket.current.on('userJoined', (userId) => {
        console.log(`New user joined: ${userId}`);
        createOffer(userId);
      });
  
      socket.current.on('userLeft', (userId) => {
        console.log(`User left: ${userId}`);
        if (peerConnections.current[userId]) {
          peerConnections.current[userId].close();
          delete peerConnections.current[userId];
          delete iceCandidatesQueue.current[userId];
        }
        setPeers(prev => {
          const newPeers = { ...prev };
          delete newPeers[userId];
          return newPeers;
        });
      });
  
      socket.current.on('offer', async ({ sender, offer }) => {
        console.log(`Offer received from ${sender}`);
        await createAnswer(sender, offer);
      });
  
      socket.current.on('answer', async ({ sender, answer }) => {
        console.log(`Answer received from ${sender}`);
        const pc = peerConnections.current[sender];
        if (pc) {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
          await processIceCandidatesQueue(sender);
        }
      });
  
      socket.current.on('candidate', ({ sender, candidate }) => {
        console.log(`ICE candidate received from ${sender}`);
        const pc = peerConnections.current[sender];
        
        if (!pc || !pc.remoteDescription) {
          if (!iceCandidatesQueue.current[sender]) {
            iceCandidatesQueue.current[sender] = [];
          }
          iceCandidatesQueue.current[sender].push(candidate);
        } else {
          pc.addIceCandidate(new RTCIceCandidate(candidate))
            .catch(error => console.error('Error adding ICE candidate:', error));
        }
      });
  
      socket.current.on('disconnect', () => {
        console.log('Disconnected from server');
        setIsConnected(false);
        setCurrentRoom('');
      });
    };
  
    initializeMedia();
    setupSocketListeners();
  
    return () => {
      cleanupConnections();
      if (socket.current) {
        socket.current.off('userJoined');
        socket.current.off('userLeft');
        socket.current.off('offer');
        socket.current.off('answer');
        socket.current.off('candidate');
        socket.current.off('disconnect');
        socket.current.off('chatMessage');  // Limpiar el evento 'chatMessage'
        socket.current.disconnect();
      }
    };
  }, []); // Esta dependencia vacía asegura que se registre solo una vez
  

  const createPeerConnection = (userId) => {
    const peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ]
    });

    peerConnections.current[userId] = peerConnection;

    if (localStream.current) {
      localStream.current.getTracks().forEach(track => 
        peerConnection.addTrack(track, localStream.current)
      );
    }

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.current.emit('candidate', { 
          to: userId, 
          candidate: event.candidate 
        });
      }
    };

    peerConnection.onconnectionstatechange = (event) => {
      console.log(`Connection state with ${userId}:`, peerConnection.connectionState);
      if (peerConnection.connectionState === 'failed') {
        peerConnection.close();
        delete peerConnections.current[userId];
        delete iceCandidatesQueue.current[userId];
        setPeers(prev => {
          const newPeers = { ...prev };
          delete newPeers[userId];
          return newPeers;
        });
      }
    };

    peerConnection.ontrack = (event) => {
      setPeers(prev => ({
        ...prev,
        [userId]: event.streams[0],
      }));
    };

    return peerConnection;
  };

  const createOffer = async (userId) => {
    try {
      const peerConnection = createPeerConnection(userId);
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      socket.current.emit('offer', { to: userId, offer });
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  };

  const createAnswer = async (userId, offer) => {
    try {
      const peerConnection = createPeerConnection(userId);
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      socket.current.emit('answer', { to: userId, answer });
      await processIceCandidatesQueue(userId);
    } catch (error) {
      console.error('Error creating answer:', error);
    }
  };

  return (
    <div className="all-css p-4">
      <div className="allvideos-container-css">
      <div className="mb-4 flex gap-4 items-center">
        <input
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="Ingresa el nombre de la sala"
          className="px-4 py-2 border rounded"
          disabled={isConnected}
        />
        {!isConnected ? (
          <button
            onClick={joinRoom}
            disabled={!roomName.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            Unirse a Sala
          </button>
        ) : (
          <button
            onClick={leaveRoom}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Salir de Sala
          </button>
          
        )}
        <button

        onClick={toggleScreenShare}
        className={`px-4 py-2 ${
          isScreenSharing
            ? 'bg-green-500 hover:bg-green-600'
            : 'bg-yellow-500 hover:bg-yellow-600'
        } text-white rounded transition-colors`}
        >

        {isScreenSharing ? 'Detener Pantalla' : 'Compartir Pantalla'}

        </button>
        <div className="flex gap-2">
        <button
          onClick={startRecording}
          disabled={isRecording || !isScreenSharing}
          className="btn btn-primary"
        >
          Iniciar Grabación
        </button>
        <button
          onClick={stopRecording}
          disabled={!isRecording}
          className="btn btn-secondary"
        >
          Detener Grabación
        </button>
        </div>
        <button
          onClick={toggleCamera}
          className={`px-4 py-2 rounded ${
            isCameraOn 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-green-500 hover:bg-green-600'
          } text-white transition-colors`}
        >
          {isCameraOn ? 'Apagar Cámara' : 'Encender Cámara'}
        </button>
      </div>
      <button
        onClick={toggleMute}
        className={`px-4 py-2 rounded ${
          isMuted 
            ? 'bg-green-500 hover:bg-green-600' 
            : 'bg-red-500 hover:bg-red-600'
        } text-white transition-colors`}
        >
        {isMuted ? 'Activar Micrófono' : 'Silenciar Micrófono'}
        </button>
      {currentRoom && (
        <div className="mb-4">
          <p className="text-lg">
            Sala actual: <span className="font-semibold">{currentRoom}</span>
          </p>
        </div>
      )}

      {/* VIDEO CAMARA */}
      <div className="videos-container grid grid-cols-2 gap-4">
        <div>
          <h3 className="mb-2">Local Video</h3>
          <video 
            ref={localVideoRef} 
            autoPlay 
            muted 
            className="local-video-css w-full border border-gray-300 rounded-lg"
          />

        </div>
        {Object.entries(peers).map(([userId, stream]) => (
          <div key={userId}>
            <h3 className="mb-2">Remote Video ({userId})</h3>
            <video
              autoPlay
              ref={(video) => {
                if (video) video.srcObject = stream;
              }}
              className="remote-video-css w-full border border-gray-300 rounded-lg"
            />
          </div>
        ))}
      </div>

      <video
        ref={screenVideoRef}
        autoPlay
        muted
        playsInline
        style={{ display: isScreenSharing ? 'block' : 'none' }}
        className="share-screen-css"
      />
      </div>


      
      <div className="chat-container border mt-4 p-4 rounded">
        <h3 className="font-bold mb-2">Chat</h3>
        <div className="chat-messages overflow-y-auto h-64 bg-gray-100 p-2 rounded mb-2">
          {chatMessages.map((msg, index) => (
            <div key={index} className="mb-2">
              <strong>{msg.sender}:</strong> {msg.message}
            </div>
          ))}
        </div>
        <div className="chat-input flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-grow px-4 py-2 border rounded-l"
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600"
          >
            Enviar
          </button>
        </div>
      </div>

    </div>
  );
};

export default RoomLiveStream;



