'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Brain, Coffee, Users, Link as LinkIcon, Timer } from 'lucide-react';
import { useRouter } from 'next/navigation';

const timerPresets = [
  { id: 'focus-25', name: 'Focus 25', duration: 25, icon: Brain },
  { id: 'focus-50', name: 'Focus 50', duration: 50, icon: Brain },
  { id: 'break-5', name: 'Short Break', duration: 5, icon: Coffee },
  { id: 'break-15', name: 'Long Break', duration: 15, icon: Coffee },
];

interface User {
  name?: string;
  email?: string;
  image?: string;
  id?: string;
}

interface CreateSessionFormProps {
  user: User;
}

export default function CreateSessionForm({ user }: CreateSessionFormProps) {
  const router = useRouter();
  const [sessionType, setSessionType] = useState('individual');
  const [selectedPreset, setSelectedPreset] = useState('focus-25');
  const [roomName, setRoomName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateSession = async () => {
    setIsLoading(true);
    
    try {
      // Get the selected preset duration
      const preset = timerPresets.find(p => p.id === selectedPreset);
      const duration = preset ? preset.duration : 25;
      
      if (sessionType === 'individual') {
        // For individual sessions, redirect to the timer page with preset
        router.push(`/timer?preset=${selectedPreset}&duration=${duration}`);
      } else {
        // For room sessions, create a room and then redirect
        // This would typically involve an API call to create the room
        console.log('Creating room session:', { roomName, selectedPreset, duration, userId: user.id });
        
        // Example API call (uncomment and implement when ready)
        const response = await fetch('/api/rooms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            slug: roomName, 
            adminId: user.id 
          }),
        });
        const data = await response.json();
        router.push(`/timer/collab?slug=${data.slug}`);
      }
    } catch (error) {
      console.error('Error creating session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-[#0A0A0A] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-zinc-100 mb-8">Create Session</h1>
        
        {user && (
          <p className="text-zinc-400 mb-6">
            Creating session as {user.name || user.email}
          </p>
        )}

        <div className="space-y-6">
          {/* Session Type Selection */}
          <Card className="bg-zinc-900/40 border-zinc-800/50 backdrop-blur-2xl p-6">
            <h2 className="text-xl font-semibold text-zinc-100 mb-4">Session Type</h2>
            <RadioGroup
              defaultValue="individual"
              value={sessionType}
              onValueChange={setSessionType}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <Label
                htmlFor="individual"
                className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all ${
                  sessionType === 'individual'
                    ? 'bg-violet-600/20 border-violet-500'
                    : 'bg-zinc-800/30 border-zinc-800/50 hover:bg-zinc-800/50'
                }`}
              >
                <RadioGroupItem value="individual" id="individual" className="sr-only" />
                <Timer className="w-5 h-5 text-violet-400" />
                <div>
                  <p className="font-medium text-zinc-100">Individual Session</p>
                  <p className="text-sm text-zinc-400">Focus on your own schedule</p>
                </div>
              </Label>

              <Label
                htmlFor="room"
                className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all ${
                  sessionType === 'room'
                    ? 'bg-violet-600/20 border-violet-500'
                    : 'bg-zinc-800/30 border-zinc-800/50 hover:bg-zinc-800/50'
                }`}
              >
                <RadioGroupItem value="room" id="room" className="sr-only" />
                <Users className="w-5 h-5 text-violet-400" />
                <div>
                  <p className="font-medium text-zinc-100">Create Room</p>
                  <p className="text-sm text-zinc-400">Study together with others</p>
                </div>
              </Label>
            </RadioGroup>
          </Card>

          {/* Timer Presets */}
          <Card className="bg-zinc-900/40 border-zinc-800/50 backdrop-blur-2xl p-6">
            <h2 className="text-xl font-semibold text-zinc-100 mb-4">Timer Preset</h2>
            <RadioGroup
              value={selectedPreset}
              onValueChange={setSelectedPreset}
              className="grid grid-cols-2 gap-4"
            >
              {timerPresets.map((preset) => {
                const Icon = preset.icon;
                return (
                  <Label
                    key={preset.id}
                    htmlFor={preset.id}
                    className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedPreset === preset.id
                        ? 'bg-violet-600/20 border-violet-500'
                        : 'bg-zinc-800/30 border-zinc-800/50 hover:bg-zinc-800/50'
                    }`}
                  >
                    <RadioGroupItem value={preset.id} id={preset.id} className="sr-only" />
                    <Icon className="w-5 h-5 text-violet-400" />
                    <div>
                      <p className="font-medium text-zinc-100">{preset.name}</p>
                      <p className="text-sm text-zinc-400">{preset.duration} minutes</p>
                    </div>
                  </Label>
                );
              })}
            </RadioGroup>
          </Card>

          {/* Room Settings (conditional) */}
          {sessionType === 'room' && (
            <Card className="bg-zinc-900/40 border-zinc-800/50 backdrop-blur-2xl p-6">
              <h2 className="text-xl font-semibold text-zinc-100 mb-4">Room Settings</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="room-name" className="text-sm text-zinc-400">
                    Room Name
                  </Label>
                  <Input
                    id="room-name"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="Enter room name"
                    className="bg-zinc-800/30 border-zinc-800/50 text-zinc-100 placeholder:text-zinc-500"
                  />
                </div>
              </div>
            </Card>
          )}

          {/* Create Button */}
          <Button
            onClick={handleCreateSession}
            disabled={isLoading || (sessionType === 'room' && !roomName.trim())}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white h-12 text-lg"
          >
            {isLoading ? (
              'Creating...'
            ) : sessionType === 'individual' ? (
              <>
                Start Session
                <Timer className="ml-2 w-5 h-5" />
              </>
            ) : (
              <>
                Create Room
                <LinkIcon className="ml-2 w-5 h-5" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
} 