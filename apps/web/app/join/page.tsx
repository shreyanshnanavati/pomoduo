"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function JoinPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const roomId = searchParams.get('room');

  useEffect(() => {
    // If no room ID is provided, redirect to home
    if (!roomId) {
      router.push('/');
      return;
    }

    // If user is authenticated, redirect to the room
    if (status === 'authenticated') {
      router.push(`/timer/collab?room=${roomId}`);
    }
  }, [roomId, status, router]);

  // If loading, show loading state
  if (status === 'loading' || !roomId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#0A0A0A] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
        <div className="w-full max-w-md">
          <Card className="p-6 bg-zinc-900/40 shadow-xl backdrop-blur-2xl border border-zinc-800/50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-violet-500 mx-auto"></div>
              <p className="mt-4 text-zinc-400">Loading...</p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // If not authenticated, show sign in prompt
  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#0A0A0A] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
        <div className="w-full max-w-md">
          <Card className="p-6 bg-zinc-900/40 shadow-xl backdrop-blur-2xl border border-zinc-800/50">
            <h1 className="text-2xl font-bold text-zinc-100 mb-4">Join Focus Room</h1>
            <p className="text-zinc-400 mb-6">
              You've been invited to join a focus room. Please sign in to continue.
            </p>
            <Button 
              className="w-full bg-violet-600 hover:bg-violet-700 text-white"
              onClick={() => router.push(`/auth/login?callbackUrl=${encodeURIComponent(`/join?room=${roomId}`)}`)}
            >
              Sign in to join
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return null;
} 