'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
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
        <div className="relative group animate-pulse">
          <div className="absolute inset-0 bg-[#00F5FF]/20 blur-3xl rounded-full opacity-60 shadow-[0_0_40px_rgba(0,245,255,0.4)]" />
          <Image
            src="/logo.svg"
            alt="Logo AutoDrive"
            width={88}
            height={88}
            priority
            className="relative z-10 object-contain drop-shadow-[0_0_25px_rgba(0,245,255,0.5)]"
          />
        </div>
        <div className="spinner-elegant" />
      </div>
    </div>
  );
}
