'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Calendar,
    BookOpen,
    CreditCard,
    Settings,
    LogOut,
    Bell,
    UserCircle,
    Hexagon
} from 'lucide-react';
import Image from 'next/image';
import { getUser, logout, type User, type UserRole } from '@/lib/auth';

interface NavItem {
    label: string;
    href: string;
    icon: React.ReactNode;
}

const NAV_CONFIG: Record<UserRole, NavItem[]> = {
    eleve: [
        { label: 'Tableau de bord', href: '/dashboard/eleve', icon: <LayoutDashboard size={18} /> },
        { label: 'Sessions de conduite', href: '/dashboard/eleve/reservation', icon: <Calendar size={18} /> },
        { label: 'Historique leçons', href: '/dashboard/eleve/lecons', icon: <BookOpen size={18} /> },
        { label: 'Facturation', href: '/dashboard/eleve/paiements', icon: <CreditCard size={18} /> },
    ],
    moniteur: [
        { label: 'Tableau de bord', href: '/dashboard/moniteur', icon: <LayoutDashboard size={18} /> },
        { label: 'Gestion élèves', href: '/dashboard/moniteur/eleves', icon: <UserCircle size={18} /> },
    ],
    admin: [
        { label: 'Tableau de bord', href: '/dashboard/admin', icon: <LayoutDashboard size={18} /> },
    ],
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const u = getUser();
        if (!u) {
            router.replace('/login');
        } else {
            setUser(u);
            setLoading(false);
        }
    }, [router]);

    const handleLogout = () => {
        logout();
        router.replace('/');
    };

    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0B0F14]">
                <div className="w-6 h-6 border-2 border-[#00F5FF] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const navItems = NAV_CONFIG[user.role] || [];

    return (
        <div className="min-h-screen">
            <aside className="sidebar-layout">
                <div className="p-8 pb-10 flex items-center gap-3">
                    <Image
                        src="/logo Autodrive fictif.png"
                        alt="Logo AutoDrive"
                        width={32}
                        height={32}
                        priority
                        className="rounded-lg shadow-[0_0_15px_rgba(0,245,255,0.2)] object-contain"
                    />
                    <h1 className="text-lg font-bold text-white tracking-tight uppercase">
                        AutoDrive
                    </h1>
                </div>

                <nav className="flex-1 px-4 space-y-1.5">
                    <p className="text-[10px] font-semibold text-[#5F6B7A] uppercase tracking-[0.2em] px-4 mb-4">Principal</p>
                    {navItems.map((item) => (
                        <button
                            key={item.href}
                            onClick={() => router.push(item.href)}
                            className={`nav-item w-full ${pathname === item.href ? 'active' : ''}`}
                        >
                            {item.icon}
                            <span className="text-sm font-medium">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-4 mt-auto border-t border-white/5 space-y-1.5">
                    <button
                        onClick={() => router.push('/dashboard/settings')}
                        className={`nav-item w-full ${pathname === '/dashboard/settings' ? 'active' : ''}`}
                    >
                        <Settings size={18} />
                        <span className="text-sm font-medium">Paramètres</span>
                    </button>
                    <button
                        onClick={handleLogout}
                        className="nav-item w-full text-red-500 hover:bg-red-500/5 hover:text-red-400"
                    >
                        <LogOut size={18} />
                        <span className="text-sm font-medium">Déconnexion</span>
                    </button>

                    <div className="mt-4 p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#00F5FF]/10 flex items-center justify-center text-[#00F5FF] text-[10px] font-bold border border-[#00F5FF]/20">
                            {user.avatar}
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-xs font-semibold text-white truncate">{user.name}</span>
                            <span className="text-[10px] text-[#5F6B7A] uppercase font-bold tracking-wider">{user.role}</span>
                        </div>
                    </div>
                </div>
            </aside>

            <main className="main-content">
                <header className="h-16 border-b border-white/5 flex items-center justify-between px-10 sticky top-0 bg-[#0B0F14]/60 backdrop-blur-md z-40">
                    <div className="flex items-center gap-4 text-sm font-medium">
                        <span className="text-[#5F6B7A]">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span>
                        <span className="text-white/20">/</span>
                        <span className="text-white">
                            {navItems.find(n => n.href === pathname)?.label || 'Paramètres'}
                        </span>
                    </div>
                    <div className="flex items-center gap-5">
                        <button className="relative w-8 h-8 flex items-center justify-center text-[#8A94A6] hover:text-white transition-colors">
                            <Bell size={20} />
                            <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#00F5FF] rounded-full shadow-[0_0_8px_rgba(0,245,255,0.6)]"></div>
                        </button>
                        <div className="h-4 w-px bg-white/10"></div>
                        <div className="w-8 h-8 rounded-full border border-white/10 overflow-hidden bg-white/5 flex items-center justify-center text-[10px] font-black text-gray-400">
                            {user.avatar}
                        </div>
                    </div>
                </header>

                <div className="main-container">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={pathname}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
