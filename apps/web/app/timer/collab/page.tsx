'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Volume2, Pause, Play, RefreshCcw, Coffee, Brain, Book, Music, Moon } from 'lucide-react';
import { useSocket } from '@/hooks/useSocket';

const timerPresets = [
  { name: 'Focus', duration: 25, icon: Brain },
  { name: 'Short Break', duration: 5, icon: Coffee },
  { name: 'Long Break', duration: 15, icon: Book },
];

const mockMembers = [
  { id: 1, name: 'Alex', image: 'https://i.pravatar.cc/150?u=1', status: 'Focusing' },
  { id: 2, name: 'Sarah', image: 'https://i.pravatar.cc/150?u=2', status: 'Break' },
  { id: 3, name: 'Mike', image: 'https://i.pravatar.cc/150?u=3', status: 'Focusing' },
  { id: 4, name: 'Emma', image: 'https://i.pravatar.cc/150?u=4', status: 'Break' },
  { id: 5, name: 'Jay', image: 'https://i.pravatar.cc/150?u=5', status: 'Focusing' },
  { id: 6, name: 'Luna', image: 'https://i.pravatar.cc/150?u=6', status: 'Break' },
];

export default function Home() {
  const [time, setTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [volume, setVolume] = useState(50);
  const [activePreset, setActivePreset] = useState('Focus');
  const [socket, setSocket] = useSocket();

  // Remove the timer logic and update handler
  useEffect(() => {
    if(socket && socket instanceof WebSocket){
      socket.send(JSON.stringify({type:"join",roomId:"default_room"}))
      
      // Set up message handler for server updates
      socket.onmessage = (event: MessageEvent) => {
        const data = JSON.parse(event.data);
        
        if(data.type === "updateTimer" || data.type === "joinedRoom"){
          setTime(data.timer);
          setIsRunning(data.isRunning);
          setActivePreset(data.preset);
        }
      };
    }
  }, [socket]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const setTimerPreset = (preset: typeof timerPresets[0]) => {
    if(socket && socket instanceof WebSocket) {
      socket.send(JSON.stringify({
        type: "setPreset",
        roomId: "default_room",
        preset: preset.name
      }));
    }
  };

  const handleStartPause = () => {
    if(socket && socket instanceof WebSocket) {
      if (isRunning) {
        socket.send(JSON.stringify({
          type: "pauseTimer",
          roomId: "default_room"
        }));
      } else {
        socket.send(JSON.stringify({
          type: "startTimer",
          roomId: "default_room"
        }));
      }
    }
  };

  const handleReset = () => {
    if(socket && socket instanceof WebSocket) {
      socket.send(JSON.stringify({
        type: "resetTimer",
        roomId: "default_room"
      }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0A0A0A] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <div className="w-full max-w-6xl flex gap-6 flex-col md:flex-row">
        {/* Left Side - Timer */}
        <Card className="flex-1 bg-zinc-900/40 shadow-xl backdrop-blur-2xl border border-zinc-800/50 rounded-xl">
          <div className="p-8 space-y-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-medium text-zinc-100">Focus Timer</h2>
                <Moon className="w-5 h-5 text-zinc-400" />
              </div>
              
              {/* Timer Presets */}
              <div className="flex justify-center gap-3">
                {timerPresets.map((preset) => {
                  const Icon = preset.icon;
                  return (
                    <Button
                      key={preset.name}
                      onClick={() => setTimerPreset(preset)}
                      variant={activePreset === preset.name ? "default" : "outline"}
                      className={`w-32 transition-all duration-300 ${
                        activePreset === preset.name 
                          ? "bg-violet-600 hover:bg-violet-700 text-white border-0" 
                          : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                      }`}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {preset.name}
                    </Button>
                  );
                })}
              </div>

              {/* Timer Display */}
              <div className="text-center py-12">
                <h1 className="text-8xl font-bold text-zinc-100 mb-8 font-mono tracking-tight">
                  {formatTime(time)}
                </h1>
                <div className="flex justify-center gap-4">
                  <Button
                    size="lg"
                    onClick={handleStartPause}
                    className={`w-32 transition-all duration-300 ${
                      isRunning
                        ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-100"
                        : "bg-violet-600 hover:bg-violet-700 text-white"
                    }`}
                  >
                    {isRunning ? <Pause className="mr-2" /> : <Play className="mr-2" />}
                    {isRunning ? 'Pause' : 'Start'}
                  </Button>
                  <Button
                    size="lg"
                    onClick={handleReset}
                    variant="outline"
                    className="w-32 border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                  >
                    <RefreshCcw className="mr-2" />
                    Reset
                  </Button>
                </div>
              </div>

              {/* Audio Controls */}
              <div className="flex items-center gap-4 justify-center bg-zinc-900/50 p-4 rounded-lg border border-zinc-800/50">
                <Music className="h-4 w-4 text-zinc-400" />
                <Slider
                  value={[volume]}
                  onValueChange={(value) => {
                    if (typeof value[0] === 'number') {
                      setVolume(value[0]);
                    }
                  }}
                  max={100}
                  step={1}
                  className="w-64"
                />
                <Volume2 className="h-4 w-4 text-zinc-400" />
              </div>
            </div>
          </div>
        </Card>

        {/* Right Side - Members */}
        <Card className="w-full md:w-80 bg-zinc-900/40 shadow-xl backdrop-blur-2xl border border-zinc-800/50 rounded-xl">
          <div className="p-6">
            <h2 className="text-xl font-medium text-zinc-100 mb-6">Room Members</h2>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
              {mockMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/50 hover:bg-zinc-800/50 transition-colors duration-200"
                >
                  <div className="relative">
                    <Avatar className="w-10 h-10 ring-2 ring-zinc-800">
                      <AvatarImage src={member.image} alt={member.name} />
                      <AvatarFallback className="bg-zinc-800 text-zinc-100">{member.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className={`absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full ring-2 ring-zinc-900 ${
                      member.status === 'Focusing' ? 'bg-violet-500' : 'bg-zinc-500'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-zinc-100">{member.name}</div>
                    <div className={`text-xs ${
                      member.status === 'Focusing' ? 'text-violet-400' : 'text-zinc-400'
                    }`}>
                      {member.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}