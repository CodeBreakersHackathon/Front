import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import Peer from 'peerjs';

const VideoChat = ({ roomId }) => {
  const videoGrid = useRef(null);
  const [peers, setPeers] = useState({});
  const socket = useRef(null);
  const myPeer = useRef(null);
  const myVideo = useRef(null);

  useEffect(() => {
    // Conectar al servidor Socket.IO
    socket.current = io('/');

    // Crear un nuevo objeto Peer
    myPeer.current = new Peer();

    myVideo.current = document.createElement('video');
    myVideo.current.muted = true;

    // Obtener el stream de medios del usuario
    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    }).then(stream => {
      addVideoStream(myVideo.current, stream);

      // Manejar llamadas entrantes
      myPeer.current.on('call', call => {
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream', userVideoStream => {
          addVideoStream(video, userVideoStream);
        });
      });

      // Manejar usuarios conectados
      socket.current.on('user-connected', userId => {
        connectToNewUser(userId, stream);
      });
    });

    // Unirse a la sala
    myPeer.current.on('open', id => {
      socket.current.emit('join-room', roomId, id); // Emitir el evento 'join-room' con el roomId
    });

    // Manejar desconexiones de usuarios
    socket.current.on('user-disconnected', userId => {
      if (peers[userId]) peers[userId].close();
    });

    return () => {
      socket.current.disconnect();
      myPeer.current.destroy();
    };
  }, [roomId, peers]);

  // Función para conectar un nuevo usuario a la llamada
  function connectToNewUser(userId, stream) {
    const call = myPeer.current.call(userId, stream);
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream);
    });
    call.on('close', () => {
      video.remove();
    });

    setPeers(prevPeers => ({
      ...prevPeers,
      [userId]: call,
    }));
  }

  // Función para agregar el stream de video al DOM
  function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
      video.play();
    });
    videoGrid.current.appendChild(video);
  }

  return (
    <div>
      <div id="video-grid" ref={videoGrid}></div>
    </div>
  );
};

export default VideoChat;
