import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const useSocket = (patientId?: string) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!patientId) return;

    const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:3001');
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to socket', socket.id);
      socket.emit('subscribeToPatient', patientId);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return () => {
      if (socket) {
        socket.emit('unsubscribeFromPatient', patientId);
        socket.disconnect();
      }
    };
  }, [patientId]);

  return socketRef;
};

export default useSocket;
