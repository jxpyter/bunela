'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { progressAPI } from '@/lib/api';
import type { StatsResponse } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Flame, BookMarked, Sprout, BookOpenCheck, RotateCw, Star, Target, Settings, Quote } from 'lucide-react';
import { UserNav } from '@/components/user-nav';

const MOTIVATIONAL_QUOTES = [
  { text: "The limit of my language means the limits of my world.", author: "Ludwig Wittgenstein" },
  { text: "One language sets you in a corridor for life. Two languages open every door along the way.", author: "Frank Smith" },
  { text: "To have another language is to possess a second soul.", author: "Charlemagne" },
  { text: "Language is the road map of a culture. It tells you where its people come from and where they are going.", author: "Rita Mae Brown" },
  { text: "Learning another language is not only learning different words for the same things, but learning another way to think about things.", author: "Flora Lewis" },
];

function GreetingSection({ name }: { name: string }) {
  const [greeting, setGreeting] = useState('');
  const [quote, setQuote] = useState(MOTIVATIONAL_QUOTES[0]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    // Random quote
    setQuote(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);
  }, []);

  return (
    <div className="mb-8 space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">
        {greeting}, <span className="text-primary">{name}</span>
      </h1>
      <Card className="bg-muted/50 border-none">
        <CardContent className="p-4 flex gap-4 items-start">
          <Quote className="h-6 w-6 text-muted-foreground shrink-0 opacity-50" />
          <div>
            <p className="text-lg italic text-muted-foreground font-serif">"{quote.text}"</p>
            <p className="text-sm font-semibold mt-2 text-primary">— {quote.author}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: stats, isLoading } = useQuery<StatsResponse>({
    queryKey: ['stats'],
    queryFn: async () => {
      const res = await progressAPI.getStats();
      return res.data;
    },
    enabled: !!user,
  });



  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6" />
              <span className="text-2xl font-bold">Bunela</span>
            </Link>
            <div className="flex items-center gap-4">
              <UserNav user={user} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="text-center text-muted-foreground">Loading...</div>
        ) : stats ? (
          <div className="space-y-8">
            <GreetingSection name={user.name} />

            {/* Top Section - Streak & Due Today */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Streak Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardDescription>Current Streak</CardDescription>
                      <CardTitle className="text-4xl mt-2">
                        {stats.data.user_stats?.current_streak || 0}
                      </CardTitle>
                    </div>
                    <Flame className="h-12 w-12 text-orange-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Longest: {stats.data.user_stats?.longest_streak || 0} days
                  </p>
                </CardContent>
              </Card>

              {/* Due Today */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardDescription>Due Today</CardDescription>
                      <CardTitle className="text-4xl mt-2">{stats.data.due_today}</CardTitle>
                    </div>
                    <BookMarked className="h-12 w-12 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Words to review</p>
                </CardContent>
              </Card>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatsCard
                title="New"
                value={stats.data.new}
                icon={<Sprout className="h-6 w-6" />}
              />
              <StatsCard
                title="Learning"
                value={stats.data.learning}
                icon={<BookOpenCheck className="h-6 w-6" />}
              />
              <StatsCard
                title="Review"
                value={stats.data.review}
                icon={<RotateCw className="h-6 w-6" />}
              />
              <StatsCard
                title="Mastered"
                value={stats.data.mastered}
                icon={<Star className="h-6 w-6" />}
              />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => router.push('/learn')}>
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Target className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <CardTitle>Start Learning</CardTitle>
                      <CardDescription className="mt-1">
                        Review due words and learn new ones
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {user.role === 'admin' && (
                <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => router.push('/admin')}>
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <Settings className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <CardTitle>Admin Panel</CardTitle>
                        <CardDescription className="mt-1">
                          Manage words and users
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              )}
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}

function StatsCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardDescription className="text-xs">{title}</CardDescription>
          <div className="text-muted-foreground">{icon}</div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}


