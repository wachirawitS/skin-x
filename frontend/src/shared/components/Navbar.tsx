'use client';

import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { LogOut, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove('access_token');
    router.push('/login');
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-slate-900 text-white shadow-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-400" />
            <span className="text-lg font-bold tracking-tight">SkinX</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-white hover:bg-slate-700 hover:text-white gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>
      <Separator />
    </>
  );
}
