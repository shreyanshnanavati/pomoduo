import WebSocket from "ws";

// Start a websocket server
const wsServer = new WebSocket.Server({ port: 8092 });

// Define room type to manage timer state
interface Room {
  id: string; 
  timer: number;
  isRunning: boolean;
  timerInterval?: NodeJS.Timeout;
  preset: 'Focus' | 'Short Break' | 'Long Break';
}

// Store clients and rooms
const clients: { socket: WebSocket; userId: string; roomId: string; isAdmin: boolean }[] = [];
const rooms: Map<string, Room> = new Map();

// Initialize default room
rooms.set("default_room", {
  id: "default_room",
  timer: 25 * 60, // 25 minutes in seconds
  isRunning: false,
  preset: 'Focus'
});

// Broadcast timer updates to all clients in a room
function broadcastTimerUpdate(roomId: string) {
  const room = rooms.get(roomId);
  if (!room) return;
  
  clients.forEach((client) => {
    if (client.roomId === roomId) {
      client.socket.send(JSON.stringify({
        type: "updateTimer",
        timer: room.timer,
        isRunning: room.isRunning,
        preset: room.preset
      }));
    }
  });
}

// Start or stop a room timer
function toggleRoomTimer(roomId: string, shouldRun: boolean) {
  const room = rooms.get(roomId);
  if (!room) return;

  // Clear any existing interval
  if (room.timerInterval) {
    clearInterval(room.timerInterval);
    room.timerInterval = undefined;
  }

  room.isRunning = shouldRun;

  // Start a new interval if timer should be running
  if (shouldRun && room.timer > 0) {
    room.timerInterval = setInterval(() => {
      room.timer -= 1;
      
      // When timer reaches 0, stop it
      if (room.timer <= 0) {
        clearInterval(room.timerInterval);
        room.isRunning = false;
        room.timerInterval = undefined;
      }
      
      broadcastTimerUpdate(roomId);
    }, 1000);
  }
  
  broadcastTimerUpdate(roomId);
}

// Set timer preset
function setTimerPreset(roomId: string, preset: 'Focus' | 'Short Break' | 'Long Break') {
  const room = rooms.get(roomId);
  if (!room) return;
  
  // Stop any running timer
  if (room.timerInterval) {
    clearInterval(room.timerInterval);
    room.timerInterval = undefined;
  }
  
  room.isRunning = false;
  room.preset = preset;
  
  // Set the appropriate time based on preset
  switch (preset) {
    case 'Focus':
      room.timer = 25 * 60;
      break;
    case 'Short Break':
      room.timer = 5 * 60;
      break;
    case 'Long Break':
      room.timer = 15 * 60;
      break;
  }
  
  broadcastTimerUpdate(roomId);
}

// Handle WebSocket connections
wsServer.on("connection", (ws) => {
  console.log("Client connected");
  clients.push({ socket: ws, userId: "", roomId: "", isAdmin: false });

  ws.on("message", (message) => {
    const data = JSON.parse(message.toString());
    console.log(data);

    switch (data.type) {
      case "join":
        const clientToJoin = clients.find((client) => client.socket === ws);
        if (clientToJoin) {
          clientToJoin.roomId = data.roomId;
          
          // Create room if it doesn't exist
          if (!rooms.has(data.roomId)) {
            rooms.set(data.roomId, {
              id: data.roomId,
              timer: 25 * 60,
              isRunning: false,
              preset: 'Focus'
            });
          }
          
          // Send current room state to the joining client
          const room = rooms.get(data.roomId);
          ws.send(JSON.stringify({
            type: "joinedRoom",
            roomId: data.roomId,
            timer: room?.timer,
            isRunning: room?.isRunning,
            preset: room?.preset
          }));
        }
        break;
        
      case "leave":
        const clientToLeave = clients.find((client) => client.socket === ws);
        if (clientToLeave) {
          clientToLeave.roomId = "";
        }
        ws.send(JSON.stringify({ type: "leave", roomId: data.roomId }));
        break;
        
      case "startTimer":
        toggleRoomTimer(data.roomId, true);
        break;
        
      case "pauseTimer":
        toggleRoomTimer(data.roomId, false);
        break;
        
      case "resetTimer":
        const roomToReset = rooms.get(data.roomId);
        if (roomToReset) {
          // Stop any running timer
          if (roomToReset.timerInterval) {
            clearInterval(roomToReset.timerInterval);
            roomToReset.timerInterval = undefined;
          }
          
          // Reset time based on current preset
          switch (roomToReset.preset) {
            case 'Focus':
              roomToReset.timer = 25 * 60;
              break;
            case 'Short Break':
              roomToReset.timer = 5 * 60;
              break;
            case 'Long Break':
              roomToReset.timer = 15 * 60;
              break;
          }
          
          roomToReset.isRunning = false;
          broadcastTimerUpdate(data.roomId);
        }
        break;
        
      case "setPreset":
        setTimerPreset(data.roomId, data.preset);
        break;
    }
  });

  // Handle disconnection
  ws.on("close", () => {
    const index = clients.findIndex((client) => client.socket === ws);
    if (index !== -1) {
      clients.splice(index, 1);
    }
    console.log("Client disconnected");
  });
});

console.log("WebSocket server is running on port 8092");

