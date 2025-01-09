import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const Broadcaster = ({ roomId }) => {
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
  
  
  const peerConnections = useRef<Map<string, RTCPeerConnection>>(new Map());
  const streamRef = useRef<MediaStream>();

  useEffect(() => {
    const init = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        socketRef.current.emit('startBroadcast', roomId);

        socketRef.current.on('viewerJoined', async ({ viewerId }) => {
          const peerConnection = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
          });

          peerConnections.current.set(viewerId, peerConnection);

          stream.getTracks().forEach(track => {
            peerConnection.addTrack(track, stream);
          });

          peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
              socketRef.current.emit('iceCandidate', {
                candidate: event.candidate,
                roomId,
                targetId: viewerId
              });
            }
          };

          const offer = await peerConnection.createOffer();
          await peerConnection.setLocalDescription(offer);

          socketRef.current.emit('offer', {
            offer,
            roomId,
            viewerId
          });
        });

        socketRef.current.on('answer', async ({ answer, viewerId }) => {
          const peerConnection = peerConnections.current.get(viewerId);
          if (peerConnection) {
            await peerConnection.setRemoteDescription(answer);
          }
        });

        socketRef.current.on('iceCandidate', async ({ candidate, senderId }) => {
          const peerConnection = peerConnections.current.get(senderId);
          if (peerConnection) {
            await peerConnection.addIceCandidate(candidate);
          }
        });
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };

    init();

    return () => {
      streamRef.current?.getTracks().forEach(track => track.stop());
      socketRef.current.disconnect();
      peerConnections.current.forEach(connection => connection.close());
    };
  }, [roomId]);

  return (
    <div>
      <h2>Transmisión en Vivo</h2>
      <video ref={videoRef} autoPlay muted playsInline />
    </div>
  );
};

export default Broadcaster;
