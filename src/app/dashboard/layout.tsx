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
    Users,
    Activity,
    MapPin,
    ClipboardCheck,
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
        { label: 'Console Instructeur', href: '/dashboard/moniteur', icon: <LayoutDashboard size={18} /> },
        { label: 'Planning de Vol', href: '/dashboard/moniteur/planning', icon: <Calendar size={18} /> },
        { label: 'Pilotage Élèves', href: '/dashboard/moniteur/eleves', icon: <UserCircle size={18} /> },
        { label: 'Journal d\'Audit', href: '/dashboard/moniteur/evaluations', icon: <ClipboardCheck size={18} /> },
    ],
    admin: [
        { label: 'Quartier Général', href: '/dashboard/admin', icon: <LayoutDashboard size={18} /> },
        { label: 'Management Nodes', href: '/dashboard/admin/centres', icon: <MapPin size={18} /> },
        { label: 'Flux Utilisateurs', href: '/dashboard/admin/utilisateurs', icon: <Users size={18} /> },
        { label: 'Analyse Tactique', href: '/dashboard/admin/stats', icon: <Activity size={18} /> },
    ],
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    useEffect(() => {
        const u = getUser();
        if (!u) {
            router.replace('/login');
        } else {
            // Apply Route Guards
            if (pathname.startsWith('/dashboard/admin') && u.role !== 'admin') {
                router.replace('/dashboard/eleve');
                return;
            }
            if (pathname.startsWith('/dashboard/moniteur') && u.role !== 'moniteur') {
                router.replace('/dashboard/eleve');
                return;
            }
            setUser(u);
            setLoading(false);
        }
    }, [pathname, router]);

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
                <div className="p-8 pb-10 flex items-center gap-x-3">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-[#00F5FF]/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <Image
                            src="https://i.imgur.com/ZvGdbPc.png"
                            alt="Logo AutoDrive"
                            width={48}
                            height={48}
                            priority
                            className="relative z-10 object-contain transition-transform duration-300 group-hover:scale-110"
                        />
                    </div>
                    <h1 className="text-xl font-black text-white tracking-tighter uppercase italic leading-none">
                        AUTODRIVE
                    </h1>
                </div>

                <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
                    <p className="text-[10px] font-semibold text-[#5F6B7A] uppercase tracking-[0.2em] px-4 mb-4">Principal</p>
                    {navItems.map((item) => (
                        <button
                            key={item.href}
                            type="button"
                            onClick={() => {
                                console.log('Navigating to:', item.href);
                                router.push(item.href);
                            }}
                            className={`nav-item w-full cursor-pointer relative z-20 ${pathname === item.href ? 'active' : ''}`}
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
                    <div className="flex items-center gap-5 relative">
                        {/* Notifications Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => { setNotificationsOpen(!notificationsOpen); setUserMenuOpen(false); }}
                                className="relative w-8 h-8 flex items-center justify-center text-[#8A94A6] hover:text-white hover:bg-white/5 rounded-full transition-colors"
                            >
                                <Bell size={20} />
                                <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#00F5FF] rounded-full shadow-[0_0_8px_rgba(0,245,255,0.8)] border border-[#0B0F14]"></div>
                            </button>

                            <AnimatePresence>
                                {notificationsOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 top-12 w-80 premium-card z-50 p-4 shadow-2xl border-[#00F5FF]/10 overflow-hidden"
                                    >
                                        <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
                                            <h4 className="text-xs font-bold text-white uppercase tracking-widest">Centre de contrôle</h4>
                                            <span className="text-[10px] text-[#00F5FF] font-black uppercase">2 Nouvelles</span>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="p-3 rounded-lg bg-[#00F5FF]/5 border border-[#00F5FF]/10 hover:bg-[#00F5FF]/10 transition-colors cursor-pointer">
                                                <p className="text-xs font-bold text-white">Mise à jour Systémique</p>
                                                <p className="text-[10px] text-[#8A94A6] mt-1 leading-relaxed">Les serveurs AutoDrive v2.1 sont déployés avec succès. Navigation fluide garantie.</p>
                                                <span className="text-[8px] text-[#5F6B7A] uppercase font-black tracking-widest mt-2 block">Il y a 10 min</span>
                                            </div>
                                            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
                                                <p className="text-xs font-bold text-white">Rapport Pédagogique généré</p>
                                                <p className="text-[10px] text-[#8A94A6] mt-1 leading-relaxed">L'IA a terminé l'analyse de votre dernière session de conduite.</p>
                                                <span className="text-[8px] text-[#5F6B7A] uppercase font-black tracking-widest mt-2 block">Il y a 2 heures</span>
                                            </div>
                                        </div>
                                        <button className="w-full mt-4 py-2 text-[10px] font-black text-[#5F6B7A] uppercase tracking-[0.2em] hover:text-white transition-colors border-t border-white/5">
                                            Tout marquer comme lu
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="h-4 w-px bg-white/10"></div>

                        {/* User Menu Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => { setUserMenuOpen(!userMenuOpen); setNotificationsOpen(false); }}
                                className="w-9 h-9 rounded-full border border-white/10 overflow-hidden bg-white/5 flex items-center justify-center text-[10px] font-black text-gray-400 hover:border-[#00F5FF]/30 hover:text-[#00F5FF] transition-all"
                            >
                                {user.avatar}
                            </button>

                            <AnimatePresence>
                                {userMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 top-12 w-56 premium-card z-50 p-2 shadow-2xl border-[#00F5FF]/10"
                                    >
                                        <div className="px-3 py-3 border-b border-white/5 flex items-center gap-3 mb-1">
                                            <div className="w-10 h-10 rounded-lg bg-[#00F5FF]/10 text-[#00F5FF] flex items-center justify-center font-black">
                                                {user.avatar}
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-sm font-semibold text-white truncate">{user.name}</span>
                                                <span className="text-[10px] text-[#5F6B7A] font-bold uppercase tracking-widest">{user.role}</span>
                                            </div>
                                        </div>
                                        <button onClick={() => router.push('/dashboard/settings')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-[#8A94A6] hover:text-white hover:bg-white/5 transition-all group">
                                            <Settings size={14} className="group-hover:text-[#00F5FF] transition-colors" />
                                            <span>Paramètres</span>
                                        </button>
                                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-red-500 hover:bg-red-500/10 transition-all mt-1">
                                            <LogOut size={14} />
                                            <span>Déconnexion Rapide</span>
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </header>

                <div className="main-container">
                    {children}
                </div>
            </main>
        </div>
    );
}
