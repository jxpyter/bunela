'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Repeat, TrendingUp, Users, Zap, BookOpen } from 'lucide-react';

import { useAuth } from '@/context/auth-context';
import { UserNav } from '@/components/user-nav';

export default function LandingPage() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6" />
              <span className="text-2xl font-bold">Bunela</span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="#features" className="text-sm font-medium hover:underline">
                Features
              </Link>
              <Link href="#how-it-works" className="text-sm font-medium hover:underline">
                How it Works
              </Link>
              <Link href="#pricing" className="text-sm font-medium hover:underline">
                Pricing
              </Link>
            </nav>
            <div className="flex items-center space-x-2">
              {user ? (
                 <div className="flex items-center gap-4">
                  <Button variant="ghost" asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                  <UserNav user={user} />
                </div>
              ) : (
                <>
                  <Button variant="outline" asChild>
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/register">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <Badge className="mb-4" variant="secondary">
            Powered by SM-2 Algorithm
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Master English Vocabulary with{' '}
            <span className="text-primary">Spaced Repetition</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Learn smarter, not harder. Bunela uses proven spaced repetition techniques to help you
            remember words forever. Track your progress from A1 to C2 levels.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/register">Start Learning Free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            No credit card required • 5000+ words to start
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-16 bg-muted/50">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose Bunela?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Built with modern learning science and designed for efficiency
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <FeatureCard
            icon={<Brain className="h-10 w-10" />}
            title="Smart Algorithm"
            description="SM-2 spaced repetition algorithm optimizes your review schedule for maximum retention"
          />
          <FeatureCard
            icon={<Repeat className="h-10 w-10" />}
            title="Spaced Repetition"
            description="Review words at scientifically proven intervals to move them into long-term memory"
          />
          <FeatureCard
            icon={<TrendingUp className="h-10 w-10" />}
            title="Track Progress"
            description="Monitor your learning journey with detailed statistics and streak counters"
          />
          <FeatureCard
            icon={<BookOpen className="h-10 w-10" />}
            title="CEFR Levels"
            description="Words organized from A1 (beginner) to C2 (proficiency) following European standards"
          />
          <FeatureCard
            icon={<Zap className="h-10 w-10" />}
            title="Fast & Beautiful"
            description="Modern, responsive interface built with Next.js and TailwindCSS for optimal performance"
          />
          <FeatureCard
            icon={<Users className="h-10 w-10" />}
            title="Admin Panel"
            description="Complete CMS for managing vocabulary database with bulk import/export capabilities"
          />
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Simple, effective learning in three steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <StepCard
            number="1"
            title="Create Account"
            description="Sign up for free and set your learning goals. Choose target CEFR levels and daily word count."
          />
          <StepCard
            number="2"
            title="Learn New Words"
            description="Study words with definitions, meanings, and example sentences. Rate how well you know each word."
          />
          <StepCard
            number="3"
            title="Review & Master"
            description="The algorithm schedules reviews at optimal intervals. Watch your vocabulary grow with each session."
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16 bg-muted/50">
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
          <div>
            <p className="text-4xl font-bold mb-2">5000+</p>
            <p className="text-muted-foreground">Vocabulary Words</p>
          </div>
          <div>
            <p className="text-4xl font-bold mb-2">6</p>
            <p className="text-muted-foreground">CEFR Levels (A1-C2)</p>
          </div>
          <div>
            <p className="text-4xl font-bold mb-2">SM-2</p>
            <p className="text-muted-foreground">Algorithm Powered</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Master English Vocabulary?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join Bunela today and start your journey to fluency
          </p>
          <Button size="lg" asChild>
            <Link href="/register">Get Started for Free</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2024 Bunela. Built with Next.js, Express, and MongoDB.</p>
            <p className="mt-2">
              Demo: admin@bunela.com / admin123
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="mb-4 text-primary">{icon}</div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardContent>
    </Card>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mb-4 mx-auto">
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
