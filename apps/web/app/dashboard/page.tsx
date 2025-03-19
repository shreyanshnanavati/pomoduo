import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Clock, Users, Calendar, BarChart3, ArrowUpRight, Timer, Coffee, Brain, LogOut } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

const stats = [
  { name: 'Focus Time', value: '12h 30m', icon: Clock, change: '+22%' },
  { name: 'Sessions', value: '24', icon: Timer, change: '+12%' },
  { name: 'Team Members', value: '8', icon: Users, change: '+2' },
  { name: 'Completion Rate', value: '94%', icon: BarChart3, change: '+5%' },
];

const recentSessions = [
  { id: 1, type: 'Focus', duration: '25:00', time: '2h ago', icon: Brain },
  { id: 2, type: 'Break', duration: '05:00', time: '2.5h ago', icon: Coffee },
  { id: 3, type: 'Focus', duration: '25:00', time: '3h ago', icon: Brain },
  { id: 4, type: 'Break', duration: '15:00', time: '3.5h ago', icon: Coffee },
];

const teamActivity = [
  { id: 1, name: 'Alex', image: 'https://i.pravatar.cc/150?u=1', action: 'Completed focus session', time: '5m ago' },
  { id: 2, name: 'Sarah', image: 'https://i.pravatar.cc/150?u=2', action: 'Started break', time: '10m ago' },
  { id: 3, name: 'Mike', image: 'https://i.pravatar.cc/150?u=3', action: 'Joined the room', time: '15m ago' },
  { id: 4, name: 'Emma', image: 'https://i.pravatar.cc/150?u=4', action: 'Completed focus session', time: '20m ago' },
];

export default async function Dashboard() {
  const session = await getServerSession();
  console.log(session);
  
  if (!session) {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen p-8 bg-[#0A0A0A] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-zinc-100">Dashboard</h1>
          <div className="flex gap-4">
            <Link href="/create-session">
              <Button className="bg-violet-600 hover:bg-violet-700 text-white">
                Start Session
              </Button>
            </Link>
            <form action="/auth/signout" method="post">
              <Button className="bg-zinc-100 hover:bg-zinc-200 text-zinc-900">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </form>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.name} className="bg-zinc-900/40 border-zinc-800/50 backdrop-blur-2xl p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-zinc-400">{stat.name}</p>
                    <p className="text-2xl font-bold text-zinc-100 mt-2">{stat.value}</p>
                  </div>
                  <div className="p-2 bg-zinc-800/50 rounded-lg">
                    <Icon className="w-5 h-5 text-violet-400" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <ArrowUpRight className="w-4 h-4 text-emerald-500 mr-1" />
                  <span className="text-emerald-500">{stat.change}</span>
                  <span className="text-zinc-400 ml-2">vs last week</span>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Sessions */}
          <Card className="bg-zinc-900/40 border-zinc-800/50 backdrop-blur-2xl p-6">
            <h2 className="text-xl font-semibold text-zinc-100 mb-6">Recent Sessions</h2>
            <div className="space-y-4">
              {recentSessions.map((session) => {
                const Icon = session.icon;
                return (
                  <div key={session.id} className="flex items-center justify-between p-4 rounded-lg bg-zinc-800/30 border border-zinc-800/50">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-zinc-800 rounded-lg">
                        <Icon className="w-4 h-4 text-violet-400" />
                      </div>
                      <div>
                        <p className="font-medium text-zinc-100">{session.type} Session</p>
                        <p className="text-sm text-zinc-400">{session.time}</p>
                      </div>
                    </div>
                    <p className="text-zinc-100 font-mono">{session.duration}</p>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Team Activity */}
          <Card className="bg-zinc-900/40 border-zinc-800/50 backdrop-blur-2xl p-6">
            <h2 className="text-xl font-semibold text-zinc-100 mb-6">Team Activity</h2>
            <div className="space-y-4">
              {teamActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-4 rounded-lg bg-zinc-800/30 border border-zinc-800/50">
                  <Avatar className="w-10 h-10 ring-2 ring-zinc-800">
                    <AvatarImage src={activity.image} alt={activity.name} />
                    <AvatarFallback className="bg-zinc-800 text-zinc-100">
                      {activity.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-zinc-100">{activity.name}</p>
                      <p className="text-sm text-zinc-400">{activity.time}</p>
                    </div>
                    <p className="text-sm text-zinc-400">{activity.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}