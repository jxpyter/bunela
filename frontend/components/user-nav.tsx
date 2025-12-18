'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { useQueryClient } from '@tanstack/react-query';
import { progressAPI } from '@/lib/api';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { User, Settings, LogOut, RotateCcw } from 'lucide-react';

interface UserNavProps {
  user: {
    name: string;
    email: string;
    role: string;
  };
}

export function UserNav({ user }: UserNavProps) {
  const { logout } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleReset = async () => {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
        try {
            await progressAPI.reset();
            queryClient.invalidateQueries({ queryKey: ['stats'] });
            window.location.reload(); // Reload to refresh all states
        } catch (error) {
            console.error('Failed to reset progress:', error);
            alert('Failed to reset progress');
        }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full overflow-hidden hover:opacity-80 transition-opacity">
          <Avatar className="h-10 w-10">
            <AvatarImage 
              src="https://rickandmortyapi.com/api/character/avatar/2.jpeg" 
              alt="Morty Smith" 
            />
            <AvatarFallback className="bg-transparent text-primary font-bold text-lg">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {user.role === 'admin' && (
             <DropdownMenuItem onClick={() => router.push('/admin')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Admin Panel</span>
             </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={handleReset} className="text-destructive focus:text-destructive">
            <RotateCcw className="mr-2 h-4 w-4" />
            <span>Reset Progress</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
