'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { getUser, type User } from '@/lib/auth';
import { getInstructorDashboard } from '@/app/actions/dashboard';
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Clock,
    User as UserIcon,
    MapPin,
    AlertCircle,
    CheckCircle2,
    CalendarDays,
    Plus,
    Filter,
    ArrowRight,
    X
} from 'lucide-react';

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

export default function MoniteurPlanningPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [dbData, setDbData] = useState<any>(null);
    const [actionFeedback, setActionFeedback] = useState<string | null>(null);

    const triggerFeedback = (msg: string) => {
        setActionFeedback(msg);
        setTimeout(() => setActionFeedback(null), 3000);
    };

    const [selectedDate, setSelectedDate] = useState(() => {
        const d = new Date();
        d.setHours(12, 0, 0, 0);
        return d;
    });

    useEffect(() => {
        const u = getUser();
        if (u) {
            setUser(u);
            fetchDashboardData(u.id);
        } else {
            router.replace('/login');
        }
    }, [router]);

    const fetchDashboardData = async (userId: string) => {
        try {
            const rawData = await getInstructorDashboard(userId);
            const parsed = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
            if (parsed && parsed.success) {
                setDbData(parsed.data);
            }
        } catch (error) {
            console.error('Failed to fetch planning data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#00F5FF] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const currentMonthDays = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay();
    const paddingDays = (firstDayOfMonth + 6) % 7; // Convert Sunday(0) to 6, Monday(1) to 0...

    // Filter DB appointments by selectedDate
    const dateStr = selectedDate.toISOString().split('T')[0];
    const SESSIONS = dbData?.appointmentsAsInstructor?.filter((app: any) => app.date && new Date(app.date).toISOString().split('T')[0] === dateStr).map((app: any) => ({
        id: app.id,
        time: app.time,
        duration: app.type && app.type.includes('2H') ? '2h' : '1h',
        student: app.student?.name || 'Inconnu',
        type: 'Leçon de conduite',
        status: app.status === 'completed' ? 'confirmé' : app.status === 'pending' ? 'en attente' : 'annulé',
        location: 'Centre AutoDrive' // Mock location
    })) || [];

    const totalHours = SESSIONS.reduce((sum: number, s: any) => sum + (s.duration === '2h' ? 2 : 1), 0);

    return (
        <div className="space-y-10 group/planning">
            {/* Header section with Tactical Controls */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                <div>
                    <h1 className="page-title">Planning</h1>
                    <p className="text-sm text-[#8A94A6] mt-1 font-medium">Gestion de vos disponibilités et élèves.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => triggerFeedback("Filtres avancés en cours d'intégration")} className="btn-secondary">
                        <Filter size={16} />
                        Filtrer
                    </button>
                    <button onClick={() => triggerFeedback("L'ouverture de créneaux automatiques arrive bientôt")} className="btn-primary">
                        <Plus size={16} />
                        Ouvrir Créneau
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                {/* Tactical Calendar Rail */}
                <div className="space-y-6">
                    <div className="premium-card p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="section-title capitalize">{selectedDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</h3>
                            <div className="flex gap-1">
                                <button onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1, 12))} className="p-1.5 rounded-lg hover:bg-white/5 text-[#5F6B7A] transition-colors"><ChevronLeft size={16} /></button>
                                <button onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1, 12))} className="p-1.5 rounded-lg hover:bg-white/5 text-[#5F6B7A] transition-colors"><ChevronRight size={16} /></button>
                            </div>
                        </div>
                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {DAYS.map(d => (
                                <div key={d} className="text-center text-[9px] font-black text-[#5F6B7A] uppercase tracking-tighter">{d}</div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                            {Array.from({ length: paddingDays }).map((_, i) => (
                                <div key={`pad-${i}`} />
                            ))}
                            {Array.from({ length: currentMonthDays }).map((_, i) => {
                                const dayNum = i + 1;
                                const isSelected = dayNum === selectedDate.getDate();
                                return (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), dayNum, 12, 0, 0))}
                                        className={`aspect-square rounded-lg flex items-center justify-center text-[10px] font-bold transition-all ${isSelected
                                            ? 'bg-[#00F5FF] text-black shadow-[0_0_15px_rgba(0,245,255,0.3)]'
                                            : 'text-[#8A94A6] hover:bg-white/5 hover:text-white'
                                            }`}
                                    >
                                        {dayNum}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="premium-card p-6 space-y-4">
                        <h3 className="card-title text-[#00F5FF]/60 italic font-black">Résumé du Jour</h3>
                        <div className="space-y-4">
                            {[
                                { label: 'Charge Totale', value: `${totalHours}h`, color: 'text-white' },
                                { label: 'Sessions Actives', value: `${SESSIONS.filter((s: any) => s.status !== 'annulé').length}`, color: 'text-[#00F5FF]' },
                                { label: 'Flux Moyen', value: SESSIONS.length > 0 ? '88%' : '0%', color: 'text-emerald-400' },
                            ].map((stat, i) => (
                                <div key={i} className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0 last:pb-0">
                                    <span className="text-[10px] font-bold text-[#5F6B7A] uppercase tracking-wider">{stat.label}</span>
                                    <span className={`text-sm font-black ${stat.color}`}>{stat.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Daily Timeline Panel */}
                <div className="xl:col-span-3 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-2 rounded-xl bg-[#00F5FF]/10 border border-[#00F5FF]/20 text-[#00F5FF]">
                                <CalendarDays size={20} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-white uppercase italic tracking-tight">
                                    {selectedDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                </h2>
                                <p className="text-[10px] text-[#5F6B7A] font-bold uppercase tracking-widest mt-0.5">
                                    {SESSIONS.length === 0 ? "Journée de repos" : SESSIONS.length >= 5 ? "Planning dense : Journée chargée" : "Rythme classique d'encadrement"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {SESSIONS.length > 0 ? SESSIONS.map((session: any, i: number) => (
                            <motion.div
                                key={session.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="premium-card group transition-all duration-300 hover:border-[#00F5FF]/20"
                            >
                                <div className="p-6 flex flex-col md:flex-row md:items-center gap-6">
                                    {/* Time Block */}
                                    <div className="flex flex-col items-center justify-center min-w-[100px] border-r border-white/5 pr-6">
                                        <span className="text-2xl font-black text-white">{session.time}</span>
                                        <div className="flex items-center gap-1.5 mt-1 text-[#5F6B7A]">
                                            <Clock size={12} />
                                            <span className="text-[10px] font-bold uppercase tracking-widest">{session.duration}</span>
                                        </div>
                                    </div>

                                    {/* Info Block */}
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center gap-3">
                                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-[0.2em] border ${session.status === 'confirmé' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                session.status === 'en attente' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                    'bg-red-500/10 text-red-500 border-red-500/20'
                                                }`}>
                                                {session.status}
                                            </span>
                                            <span className="text-[10px] font-black text-[#5F6B7A] uppercase tracking-widest">• {session.type}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black text-[#8A94A6]">
                                                {session.student.split(' ').map((n: string) => n[0]).join('')}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-base font-bold text-white leading-none">{session.student}</span>
                                                <div className="flex items-center gap-1.5 mt-1.5">
                                                    <MapPin size={10} className="text-[#5F6B7A]" />
                                                    <span className="text-[10px] font-bold text-[#8A94A6] uppercase tracking-tight">{session.location}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button onClick={() => triggerFeedback(`Édition de la session de ${session.student}`)} className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black text-[#8A94A6] hover:text-white transition-all uppercase tracking-widest">Modifier</button>
                                        <button onClick={() => router.push('/dashboard/moniteur/evaluations')} className="w-10 h-10 rounded-xl bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 text-[var(--color-accent)] flex items-center justify-center transition-all hover:bg-[var(--color-accent)] hover:text-black">
                                            <ArrowRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )) : (
                            <div className="p-8 text-center rounded-2xl border border-dashed border-white/10">
                                <p className="text-sm font-medium text-[#5F6B7A]">Aucune leçon planifiée pour ce jour.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ACTION FEEDBACK TOAST */}
            <AnimatePresence>
                {actionFeedback && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl bg-[#0B0F14] border border-[var(--color-border-subtle)] shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
                    >
                        <div className="w-8 h-8 rounded-full bg-[var(--color-accent)]/10 flex items-center justify-center text-[var(--color-accent)]">
                            <CheckCircle2 size={16} />
                        </div>
                        <p className="text-sm font-medium text-[var(--color-text-primary)]">{actionFeedback}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
