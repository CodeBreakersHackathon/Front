import React, { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const Viewer = ({ roomId }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const socketRef = useRef(io('http://localhost:3000/streaming', {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
    autoConnect: true,
    withCredentials: true,
  }));
  
  
  const peerConnectionRef = useRef<RTCPeerConnection>();

  useEffect(() => {
    const init = async () => {
      peerConnectionRef.current = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });

      peerConnectionRef.current.ontrack = (event) => {
        if (videoRef.current) {
          videoRef.current.srcObject = event.streams[0];
        }
      };

      peerConnectionRef.current.onicecandidate = (event) => {
        if (event.candidate) {
          socketRef.current.emit('iceCandidate', {
            candidate: event.candidate,
            roomId,
            targetId: socketRef.current.id
          });
        }
      };

      socketRef.current.emit('joinStream', roomId);

      socketRef.current.on('offer', async ({ offer, broadcasterId }) => {
        if (peerConnectionRef.current) {
          await peerConnectionRef.current.setRemoteDescription(offer);
          const answer = await peerConnectionRef.current.createAnswer();
          await peerConnectionRef.current.setLocalDescription(answer);

          socketRef.current.emit('answer', {
            answer,
            roomId,
            broadcasterId
          });
        }
      });

      socketRef.current.on('iceCandidate', async ({ candidate, senderId }) => {
        if (peerConnectionRef.current) {
          await peerConnectionRef.current.addIceCandidate(candidate);
        }
      });
    };

    init();

    return () => {
      peerConnectionRef.current?.close();
      socketRef.current.disconnect();
    };
  }, [roomId]);

  return (
    <div>
      <h2>Viendo Transmisión</h2>
      <video ref={videoRef} autoPlay playsInline />
    </div>
  );
};

export default Viewer;
