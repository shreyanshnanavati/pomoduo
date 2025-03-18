import { useEffect, useState } from "react";

export const useSocket = () => {
  const [socket, setSocket] = useState<WebSocket>()

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8092");
    socket.onopen = () => {
      setSocket(socket);
    };
  }, []);

  return [socket, setSocket];
};
