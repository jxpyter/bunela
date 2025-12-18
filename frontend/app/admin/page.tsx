'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wordsAPI } from '@/lib/api';
import type { Word } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select,SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Plus, Search, Trash2, Edit, Sparkles, Database, RotateCw, ChevronLeft, ChevronRight } from 'lucide-react';


export default function AdminPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingWord, setEditingWord] = useState<Word | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token) {
      router.push('/login');
    } else if (userData) {
      const parsed = JSON.parse(userData);
      if (parsed.role !== 'admin') {
        router.push('/dashboard');
      }
      setUser(parsed);
    }
  }, [router]);

  // Reset page when search or level changes
  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedLevel]);

  const { data: wordsData, isLoading } = useQuery({
    queryKey: ['all-words', searchTerm, selectedLevel, page],
    queryFn: async () => {
      const res = await wordsAPI.getAll({
        search: searchTerm || undefined,
        level: selectedLevel === 'all' ? undefined : selectedLevel,
        page,
        limit: 20
      });
      return res.data;
    },
    enabled: !!user,
  });

  const deleteWordMutation = useMutation({
    mutationFn: (id: string) => wordsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-words'] });
    },
  });

  const handleDelete = async (id: string, word: string) => {
    if (confirm(`Are you sure you want to delete "${word}"?`)) {
      await deleteWordMutation.mutateAsync(id);
    }
  };

  const handleEdit = (word: Word) => {
    setEditingWord(word);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingWord(null);
    setShowModal(true);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6" />
              <span className="text-2xl font-bold">Bunela Admin</span>
            </Link>
            <Button variant="ghost" onClick={() => router.push('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Word Management</CardTitle>
            <CardDescription>Manage vocabulary database</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">



            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search words..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="All Levels" />
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

              <Button onClick={handleAddNew}>
                <Plus className="h-4 w-4 mr-2" />
                Add Word
              </Button>
            </div>

            {/* Words Table */}
            {isLoading ? (
              <div className="text-center text-muted-foreground py-8">Loading...</div>
            ) : wordsData?.data ? (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Word</TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead>Definition</TableHead>
                        <TableHead>Meaning (TR)</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {wordsData.data.map((word: Word) => (
                        <TableRow key={word._id}>
                          <TableCell className="font-medium">{word.word}</TableCell>
                          <TableCell>
                            <Badge variant={getLevelVariant(word.level)}>
                              {word.level}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {word.definition}
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {word.meaning}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(word)}
                              >
                                <Edit className="h-4 w-4 text-blue-500" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(word._id, word.word)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="text-sm text-muted-foreground">
                  Showing {wordsData.data.length} of {wordsData.total} words
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center justify-end space-x-2 py-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <div className="text-sm font-medium">
                    Page {page} of {wordsData.pages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.min(wordsData.pages, p + 1))}
                    disabled={page === wordsData.pages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : null}
          </CardContent>
        </Card>
      </main>

      {/* Word Modal (Add/Edit) */}
      {showModal && (
        <WordModal 
          onClose={() => setShowModal(false)} 
          initialData={editingWord}
        />
      )}
    </div>
  );
}

// Maintenance Button Helper Component


function getLevelVariant(level: string): "default" | "secondary" | "destructive" | "outline" {
  const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    A1: 'secondary',
    A2: 'secondary',
    B1: 'default',
    B2: 'default',
    C1: 'outline',
    C2: 'outline',
  };
  return variants[level] || 'default';
}

function WordModal({ onClose, initialData }: { onClose: () => void; initialData: Word | null }) {
  const queryClient = useQueryClient();
  const isEditing = !!initialData;
  
  const [formData, setFormData] = useState({
    word: initialData?.word || '',
    definition: initialData?.definition || '',
    meaning: initialData?.meaning || '',
    example_sentences: initialData?.example_sentences?.join('\n') || '', // Newlines for textarea
    level: initialData?.level || 'A1',
  });

  const mutation = useMutation({
    mutationFn: (data: any) => {
      if (isEditing && initialData) {
        return wordsAPI.update(initialData._id, data);
      }
      return wordsAPI.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-words'] });
      onClose();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      // Ensure we clean up the list
      example_sentences: formData.example_sentences.split('\n').map(s => s.trim()).filter(Boolean),
    };
    await mutation.mutateAsync(data);
  };

  const { word, definition, meaning, example_sentences, level } = formData;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Word' : 'Add New Word'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Modify word details.' : 'Add a new word to the vocabulary database.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="word">Word</Label>
            <Input
              id="word"
              value={word}
              onChange={(e) => setFormData({ ...formData, word: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="level">Level</Label>
              <Select
                value={level}
                onValueChange={(value) => setFormData({ ...formData, level: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
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

          <div className="space-y-2">
            <Label htmlFor="definition">Definition (EN)</Label>
            <Input
              id="definition"
              value={definition}
              onChange={(e) => setFormData({ ...formData, definition: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="meaning">Meaning (TR)</Label>
            <Input
              id="meaning"
              value={meaning}
              onChange={(e) => setFormData({ ...formData, meaning: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
             <Label htmlFor="examples_mult">Example Sentences (3 examples, one per line)</Label>
             <textarea 
               id="examples_mult"
               className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
               value={example_sentences}
               onChange={(e) => setFormData({ ...formData, example_sentences: e.target.value })}
               placeholder="Example 1&#10;Example 2&#10;Example 3"
             />
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving...' : (isEditing ? 'Save Changes' : 'Add Word')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
