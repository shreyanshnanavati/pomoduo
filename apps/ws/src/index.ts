import WebSocket from "ws";
import { parse } from 'url'
import { verify } from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

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
const clients: { socket: WebSocket; userId: string; roomId: string; isAdmin: boolean, name: string, status: string, image: string }[] = [];
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

// Add this interface for token payload
interface TokenPayload {
  userId: string;
  name?: string;
  email?: string;
  // Add other fields that are in your NextAuth JWT
}

// Add this new broadcast function after the other broadcast function
function broadcastMemberUpdate(roomId: string) {
  const roomMembers = clients
    .filter((client) => client.roomId === roomId)
    .map(client => ({
      id: client.userId,
      name: client.name,
      image: client.image,
      status: client.status
    }));

  clients.forEach((client) => {
    if (client.roomId === roomId) {
      client.socket.send(JSON.stringify({
        type: "memberUpdate",
        members: roomMembers
      }));
    }
  });
}

// Handle WebSocket connections - now using token from query parameter
wsServer.on("connection", (ws: WebSocket, request) => {
  console.log("New client connected, authenticating from URL");
  
  // Get token from query parameter
  const { query } = parse(request.url || '', true);
  const token = query.token as string;
  
  if (!token) {
    console.error("No token provided");
    ws.close(1008, "Authentication required");
    return;
  }
  
  try {
    // Verify the token using the same secret used by NextAuth
    const JWT_SECRET = process.env.NEXTAUTH_SECRET;
    
    if (!JWT_SECRET) {
      console.error("Missing NEXTAUTH_SECRET environment variable");
      ws.close(1011, "Server configuration error");
      return;
    }
    
    // Verify and decode the token
    const decoded = verify(token, JWT_SECRET) as TokenPayload;
    
    // Authentication successful - add client to the clients array
    const client = {
      socket: ws,
      userId: decoded.userId || decoded.name || "anonymous", // Ensure userId is always a string
      roomId: "",
      isAdmin: false, 
      name: decoded.name || "Anonymous",
      status: "Focusing",
      image: `https://i.pravatar.cc/150?u=${decoded.userId || decoded.name || "anonymous"}`
    };
    
    clients.push(client);
    
    console.log(`Client authenticated: ${client.name} (${client.userId})`);
    
    // Send success message to client
    ws.send(JSON.stringify({ 
      type: "authenticated", 
      success: true,
      user: {
        name: client.name,
        userId: client.userId
      }
    }));
  } catch (error) {
    console.error("Authentication error:", error);
    ws.close(1008, "Authentication failed");
    return;
  }

  ws.on("message", (message: any) => {
    const data = JSON.parse(message.toString());
    console.log(data);

    // Find client by websocket connection
    const client = clients.find(c => c.socket === ws);
    if (!client) {
      ws.close(1008, "Client not found");
      return;
    }

    // Handle message types
    switch (data.type) {
      case "join":
        const clientToJoin = clients.find((client) => client.socket === ws);
        if (clientToJoin) {
          clientToJoin.roomId = data.roomId;
          clientToJoin.isAdmin = data.isAdmin || false; // Set admin status
          
          // Create room if it doesn't exist
          if (!rooms.has(data.roomId)) {
            rooms.set(data.roomId, {
              id: data.roomId,
              timer: 25 * 60,
              isRunning: false,
              preset: 'Focus'
            });
          }
          
          const room = rooms.get(data.roomId);
          // Send current state to the joining client
          ws.send(JSON.stringify({
            type: "joinedRoom",
            roomId: data.roomId,
            timer: room?.timer,
            isRunning: room?.isRunning,
            preset: room?.preset,
            isAdmin: clientToJoin.isAdmin,
            members: clients
              .filter((client) => client.roomId === data.roomId)
              .map(client => ({
                id: client.userId,
                name: client.name,
                image: client.image,
                status: client.status,
                isAdmin: client.isAdmin
              }))
          }));

          // Broadcast member update to all clients in the room
          broadcastMemberUpdate(data.roomId);
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
      const roomId = clients[index]!.roomId;
      clients.splice(index, 1);
      if (roomId) {
        broadcastMemberUpdate(roomId);
      }
    }
    console.log("Client disconnected");
  });
});

console.log("WebSocket server is running on port 8092");

