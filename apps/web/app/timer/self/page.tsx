'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Volume2, Pause, Play, RefreshCcw, Coffee, Brain, Music, Moon } from 'lucide-react';

const timerPresets = [
  { name: 'Focus', duration: 25, icon: Brain },
  { name: 'Short Break', duration: 5, icon: Coffee },
  { name: 'Long Break', duration: 15, icon: Coffee },
];

export default function IndividualHome() {
  const [time, setTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [volume, setVolume] = useState(50);
  const [activePreset, setActivePreset] = useState('Focus');
  const [sessionStats, setSessionStats] = useState({
    totalFocusTime: '2h 45m',
    sessionsCompleted: 5,
    currentStreak: 3,
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, time]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const setTimerPreset = (preset: typeof timerPresets[0]) => {
    setTime(preset.duration * 60);
    setActivePreset(preset.name);
    setIsRunning(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0A0A0A] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <div className="w-full max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Timer Card */}
          <Card className="lg:col-span-2 bg-zinc-900/40 shadow-xl backdrop-blur-2xl border border-zinc-800/50 rounded-xl">
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
                      onClick={() => setIsRunning(!isRunning)}
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
                      onClick={() => setTime(activePreset === 'Focus' ? 25 * 60 : activePreset === 'Short Break' ? 5 * 60 : 15 * 60)}
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
                    onValueChange={(value) => setVolume(value[0])}
                    max={100}
                    step={1}
                    className="w-64"
                  />
                  <Volume2 className="h-4 w-4 text-zinc-400" />
                </div>
              </div>
            </div>
          </Card>

          {/* Stats Card */}
          <Card className="bg-zinc-900/40 shadow-xl backdrop-blur-2xl border border-zinc-800/50 rounded-xl p-6">
            <h2 className="text-xl font-medium text-zinc-100 mb-6">Today's Progress</h2>
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="bg-zinc-800/30 p-4 rounded-lg border border-zinc-800/50">
                  <p className="text-sm text-zinc-400">Total Focus Time</p>
                  <p className="text-2xl font-bold text-zinc-100">{sessionStats.totalFocusTime}</p>
                </div>
                <div className="bg-zinc-800/30 p-4 rounded-lg border border-zinc-800/50">
                  <p className="text-sm text-zinc-400">Sessions Completed</p>
                  <p className="text-2xl font-bold text-zinc-100">{sessionStats.sessionsCompleted}</p>
                </div>
                <div className="bg-zinc-800/30 p-4 rounded-lg border border-zinc-800/50">
                  <p className="text-sm text-zinc-400">Current Streak</p>
                  <p className="text-2xl font-bold text-zinc-100">{sessionStats.currentStreak} days</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}