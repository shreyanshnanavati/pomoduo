import { useEffect, useState } from "react";

export const useSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const connectSocket = async () => {
      // Only proceed if we have a session
        try {
          // Get JWT token from our API endpoint
          const response = await fetch('/api/auth/socket-token');
          if (!response.ok) {
            throw new Error('Failed to get socket token');
          }
          
          const { token } = await response.json();
          
          // Create WebSocket connection with token as query parameter
          const socket = new WebSocket(`ws://localhost:8092?token=${token}`);
          
          socket.onopen = () => {
            console.log('WebSocket connection established');
            setSocket(socket);
          };
          
          socket.onerror = (error) => {
            console.error('WebSocket error:', error);
          };
          
          // Cleanup on unmount
          return () => {
            socket.close();
          };
        } catch (error) {
          console.error('Error connecting to WebSocket:', error);
        }
      }

    connectSocket();
    
    // Cleanup function
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);

  return [socket, setSocket];
};
