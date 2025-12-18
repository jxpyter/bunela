'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { progressAPI } from '@/lib/api';
import type { Word, UserProgress } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { UserNav } from '@/components/user-nav';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function LearnPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showQuality, setShowQuality] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [mode, setMode] = useState<'learn' | 'practice'>('learn');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);



  // Fetch due words first, then new words if no due words
  const { data: dueWords, isLoading: isLoadingDue, isFetching: isFetchingDue } = useQuery<{ data: UserProgress[] }>({
    queryKey: ['dueWords'],
    queryFn: async () => {
      const res = await progressAPI.getDue();
      return res.data;
    },
    enabled: mode === 'learn',
  });

  const { data: newWords, isLoading: isLoadingNew, isFetching: isFetchingNew } = useQuery<{ data: Word[] }>({
    queryKey: ['newWords', selectedLevel],
    queryFn: async () => {
      const res = await progressAPI.getNew({ level: selectedLevel });
      return res.data;
    },
    enabled: mode === 'learn' && !dueWords?.data.length,
  });
  
  const { data: practiceWords, isLoading: isLoadingPractice, isFetching: isFetchingPractice } = useQuery<{ data: UserProgress[] }>({
    queryKey: ['practiceWords', selectedLevel],
    queryFn: async () => {
      const res = await progressAPI.getPractice({ level: selectedLevel });
      return res.data;
    },
    enabled: mode === 'practice',
  });

  const submitReviewMutation = useMutation({
    mutationFn: (data: { word_id: string; quality: number }) =>
      progressAPI.submitReview(data),
    onSuccess: () => {
      // Don't invalidate immediately to avoid shifting the list while iterating
      // We will invalidate when the batch is finished
    },
  });

  const words = mode === 'practice' 
    ? (practiceWords?.data || []) 
    : (dueWords?.data.length ? dueWords.data : newWords?.data || []);
    
  const currentWord = words[currentIndex];
  
  const isFetching = isFetchingDue || isFetchingNew || isFetchingPractice;
  const isLoading = isLoadingDue || isLoadingNew || isLoadingPractice;

  // Reset transitioning state when fetching completes
  useEffect(() => {
    if (!isFetching && isTransitioning) {
        setIsTransitioning(false);
    }
  }, [isFetching, isTransitioning]);

  const handleSkip = () => {
    // Just move to next word without API call
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Batch finished - fetch next batch
      setIsTransitioning(true); // START TRANSITION
      setCurrentIndex(0);
      if (mode === 'learn') {
        queryClient.invalidateQueries({ queryKey: ['dueWords'] });
        queryClient.invalidateQueries({ queryKey: ['newWords'] });
      } else {
        queryClient.invalidateQueries({ queryKey: ['practiceWords'] });
      }
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleQuality = async (quality: number) => {
    if (!currentWord) return;

    const wordId = 'word_id' in currentWord ? 
      (typeof currentWord.word_id === 'string' ? currentWord.word_id : (currentWord.word_id as Word)._id) 
      : currentWord._id;

    await submitReviewMutation.mutateAsync({ word_id: wordId, quality });

    // Move to next word
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Batch finished - fetch next batch
      setIsTransitioning(true); // START TRANSITION
      setCurrentIndex(0);
      if (mode === 'learn') {
        queryClient.invalidateQueries({ queryKey: ['dueWords'] });
        queryClient.invalidateQueries({ queryKey: ['newWords'] });
      } else {
        queryClient.invalidateQueries({ queryKey: ['practiceWords'] });
      }
    }
  };

  const handleLevelChange = (value: string) => {
    setSelectedLevel(value);
    setCurrentIndex(0); // Reset index
    setMode('learn'); // Reset to learn mode on level change
    queryClient.invalidateQueries({ queryKey: ['newWords'] });
  };
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
          handleSkip();
          break;
        case 'ArrowLeft':
         handlePrevious();
         break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, words.length]); 

  if ((isLoading && !words.length) || isTransitioning) {
     return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background space-y-4">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
        {isTransitioning && <p className="text-muted-foreground animate-pulse">Loading next set...</p>}
      </div>
    );
  }

  if (!currentWord && !submitReviewMutation.isPending) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/dashboard" className="flex items-center space-x-2">
                <BookOpen className="h-6 w-6" />
                <span className="text-2xl font-bold">Bunela</span>
              </Link>
             
               <div className="flex items-center gap-4">
                 <Select value={selectedLevel} onValueChange={handleLevelChange}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="A1">A1</SelectItem>
                    <SelectItem value="A2">A2</SelectItem>
                    <SelectItem value="B1">B1</SelectItem>
                    <SelectItem value="B2">B2</SelectItem>
                    <SelectItem value="C1">C1</SelectItem>
                    <SelectItem value="C2">C2</SelectItem>
                  </SelectContent>
                </Select>
               </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-primary/10">
                  <span className="text-4xl">🎉</span>
                </div>
              </div>
              <CardTitle className="text-3xl">All Done!</CardTitle>
              <CardDescription className="text-base mt-2">
                {mode === 'learn' 
                  ? "No more new words to learn right now." 
                  : "You've reviewed all practice words for now."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mode === 'learn' && (
                <Button 
                  onClick={() => setMode('practice')} 
                  variant="outline" 
                  className="w-full font-semibold border-2"
                >
                  Practice Learned Words
                </Button>
              )}
              
              <Button onClick={() => router.push('/dashboard')} className="w-full">
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const word = 'word_id' in currentWord && typeof currentWord.word_id === 'object' 
    ? currentWord.word_id as Word 
    : currentWord as Word;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6" />
              <span className="text-2xl font-bold">Bunela</span>
            </Link>
            
            <div className="flex items-center gap-4">
               <Select value={selectedLevel} onValueChange={handleLevelChange}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="A1">A1</SelectItem>
                  <SelectItem value="A2">A2</SelectItem>
                  <SelectItem value="B1">B1</SelectItem>
                  <SelectItem value="B2">B2</SelectItem>
                  <SelectItem value="C1">C1</SelectItem>
                  <SelectItem value="C2">C2</SelectItem>
                </SelectContent>
              </Select>
              {user && <UserNav user={user} />}
            </div>
          </div>
        </div>
      </header>

      {/* Main Container - Centered Vertically & Horizontally */}
      <main className="container mx-auto px-4 min-h-[calc(100vh-73px)] flex items-center justify-center py-8">
        
        <div className="flex items-center gap-4 md:gap-8 w-full justify-center">
          
          {/* Previous Button - Out of Card */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex h-12 w-12 rounded-full shrink-0"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            <ArrowLeft className="h-8 w-8 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Prev</span>
          </Button>

          {/* Compact Card */}
          <div className="w-full max-w-3xl bg-card border rounded-xl shadow-sm p-8 md:p-12 space-y-8 flex-1">
            
            {/* Word Header */}
            <div className="space-y-4 text-center border-b pb-8">
              <Badge variant="secondary" className="mb-4 text-base px-3 py-1">
                {word.level}
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-primary">
                {word.word}
              </h1>
            </div>

            {/* Content Area */}
            <div className="space-y-8">
              
              {/* Definition & Meaning Grid */}
              <div className="grid md:grid-cols-2 gap-8 text-center md:text-left">
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    Definition
                  </h3>
                  <p className="text-xl font-medium text-foreground leading-snug">
                    {word.definition}
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    Turkish Meaning
                  </h3>
                  <p className="text-xl font-semibold text-primary/90">
                    {word.meaning}
                  </p>
                </div>
              </div>

              {/* Example Sentences */}
              <div className="space-y-3">
                 <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest text-center md:text-left">
                  Examples
                </h3>
                <div className="space-y-3">
                  {(word.example_sentences || []).map((example, i) => (
                    <div key={i} className="py-1 px-4 bg-muted/30 rounded-lg text-center md:text-left">
                      <p className="text-lg text-muted-foreground italic font-serif">
                        "{example}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Action Footer */}
            <div className="pt-4">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => handleQuality(1)}
                  variant="outline"
                  size="lg"
                  className="h-14 text-lg font-semibold shadow-sm hover:bg-accent hover:text-accent-foreground transition-all"
                >
                  I don't know
                </Button>
                
                <Button
                  onClick={() => handleQuality(5)}
                  variant="default"
                  size="lg"
                  className="h-14 text-lg font-semibold shadow-md hover:opacity-90 transition-all"
                >
                  I know
                </Button>
              </div>
            </div>

          </div>

          {/* Next Button (Skip) - Out of Card */}
          <div className="hidden md:flex flex-col items-center gap-2"> 
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-full shrink-0"
              onClick={handleSkip}
            >
              <span className="text-xs text-muted-foreground">Skip</span> 
              <ArrowRight className="h-8 w-8 text-muted-foreground" />
            </Button>
          </div>

        </div>
      </main>
    </div>
  );
}

