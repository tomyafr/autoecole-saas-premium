'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, getDashboardPath } from '@/lib/auth';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const user = getUser();
    if (user) {
      router.replace(getDashboardPath(user.role));
    } else {
      router.replace('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center animate-pulse">
          <span className="text-black font-black text-2xl italic">A</span>
        </div>
        <div className="spinner-elegant" />
      </div>
    </div>
  );
}
