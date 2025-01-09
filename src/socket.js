import { io } from "socket.io-client";

const socket = io('ws://localhost:3000'); // Cambia localhost si estás en producción

socket.on('connect', () => {
  console.log('Conectado al servidor');
});

socket.on('connect_error', (error) => {
  console.error('Error de conexión:', error);
});
