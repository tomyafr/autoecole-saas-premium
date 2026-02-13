'use client';

import { motion } from 'framer-motion';
import {
    Users,
    Calendar,
    TrendingUp,
    Award,
    Clock,
    CheckCircle2,
    ChevronRight,
    MessageSquare,
    Zap,
    Play
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function MoniteurDashboard() {
    const router = useRouter();

    const stats = [
        { label: 'Sessions du jour', value: '6 Élèves', sub: '4 missions restantes', icon: <Users size={18} />, color: 'text-[#00F5FF]' },
        { label: 'Volume horaire', value: '28h', sub: 'Objectif: 32h/sem', icon: <Clock size={18} />, color: 'text-blue-400' },
        { label: 'Taux Succès', value: '94%', sub: 'Moyenne de confiance', icon: <TrendingUp size={18} />, color: 'text-emerald-400' },
        { label: 'Niveau Expertise', value: 'Expert', sub: 'Top 5 Moniteurs', icon: <Award size={18} />, color: 'text-amber-400' },
    ];

    const todaySessions = [
        { id: 1, name: 'Lucas Bernard', time: '09:00', type: 'Conduite Ville', status: 'done', note: '18/20' },
        { id: 2, name: 'Emma Petit', time: '10:30', type: 'Autoroute A86', status: 'done', note: '17/20' },
        { id: 3, name: 'Hugo Roux', time: '14:00', type: 'Manoeuvres', status: 'upcoming' },
        { id: 4, name: 'Chloé Moreau', time: '15:30', type: 'Examen Blanc', status: 'upcoming' },
    ];

    return (
        <div className="space-y-10 group/moniteur">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                <div>
                    <h1 className="page-title">Console Instructeur</h1>
                    <p className="text-sm text-[#8A94A6] mt-1 font-medium">Gestion tactique de vos sessions d'apprentissage.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.push('/dashboard/moniteur/planning')}
                        className="btn-secondary"
                    >
                        <Calendar size={18} />
                        Planning Complet
                    </button>
                    <button
                        onClick={() => router.push('/dashboard/moniteur/planning')}
                        className="btn-primary"
                    >
                        <Zap size={18} />
                        Lancer Session
                    </button>
                </div>
            </div>

            {/* Tactical Grid Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div
                        key={i}
                        className="premium-card p-6 flex flex-col justify-between space-y-4 min-h-[160px]"
                    >
                        <div className="flex justify-between items-start">
                            <div className={`p-2.5 rounded-xl bg-white/[0.03] border border-white/5 ${stat.color}`}>
                                {stat.icon}
                            </div>
                            <span className="card-title">{stat.label}</span>
                        </div>
                        <div>
                            <div className="primary-value">{stat.value}</div>
                            <p className="secondary-info mt-1 font-medium">{stat.sub}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Section: Schedule */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="premium-card overflow-hidden">
                        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
                            <h3 className="section-title">Engagements du jour</h3>
                            <div className="flex gap-3">
                                <span className="status-badge status-badge-cyan">2 Terminés</span>
                                <span className="status-badge status-badge-gray">2 En attente</span>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="premium-table">
                                <thead>
                                    <tr>
                                        <th>HORAIRE</th>
                                        <th>ÉLÈVE / MISSION</th>
                                        <th>ÉVALUATION</th>
                                        <th>ACTION STADIA</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {todaySessions.map((session) => (
                                        <tr key={session.id} className="group">
                                            <td>
                                                <div className="flex flex-col">
                                                    <span className="text-white font-semibold">{session.time}</span>
                                                    <span className="text-[10px] text-[#5F6B7A] font-bold uppercase tracking-widest mt-0.5">Slot ACTIF</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs font-black text-[#5F6B7A] group-hover:text-[#00F5FF] transition-colors">
                                                        {session.name.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="text-sm font-semibold text-white truncate">{session.name}</span>
                                                        <span className="text-[10px] text-[#5F6B7A] font-bold uppercase tracking-widest mt-0.5">{session.type}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                {session.status === 'done' ? (
                                                    <div className="flex items-center gap-2">
                                                        <CheckCircle2 size={14} className="text-emerald-400" />
                                                        <span className="text-emerald-400 font-mono font-bold">{session.note}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-[10px] text-[#5F6B7A] font-black uppercase tracking-widest italic opacity-40">Prévu</span>
                                                )}
                                            </td>
                                            <td>
                                                <button
                                                    onClick={() => router.push('/dashboard/moniteur/planning')}
                                                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${session.status === 'done' ? 'text-emerald-400 bg-emerald-400/5' : 'text-[#8A94A6] bg-white/5 hover:bg-[#00F5FF]/10 hover:text-[#00F5FF]'}`}
                                                >
                                                    {session.status === 'done' ? <CheckCircle2 size={18} /> : <ChevronRight size={18} />}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="premium-card p-8 bg-[radial-gradient(circle_at_0%_0%,rgba(0,245,255,0.02)_0%,transparent_50%)]">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-blue-500/5 rounded-2xl border border-blue-500/10 text-blue-400">
                                <MessageSquare size={22} />
                            </div>
                            <div>
                                <h3 className="section-title">Journal Pédagogique</h3>
                                <p className="secondary-info">Dernières annotations stratégiques</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div
                                onClick={() => router.push('/dashboard/moniteur/evaluations')}
                                className="p-6 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-[#00F5FF]/20 transition-all group cursor-pointer"
                            >
                                <p className="text-sm text-gray-300 leading-relaxed font-medium group-hover:text-white transition-colors">
                                    "Excellente maîtrise de l'embrayage pour Lucas. Nous allons passer à l'autoroute la semaine prochaine. Focus sur les angles morts."
                                </p>
                                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black text-[#5F6B7A] uppercase tracking-widest">Élève ID: LB_2026</span>
                                        <div className="w-1 h-1 rounded-full bg-white/10" />
                                        <span className="text-[10px] font-black text-[#5F6B7A] uppercase tracking-widest">Lucas Bernard</span>
                                    </div>
                                    <span className="text-[10px] font-black text-[#00F5FF] uppercase tracking-[0.2em]">Archivé</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Column: Week Planning */}
                <div className="space-y-6">
                    <div className="premium-card p-6 border-l-4 border-l-[#00F5FF] shadow-[0_0_40px_rgba(0,245,255,0.02)]">
                        <div className="flex items-center gap-2.5 mb-8">
                            <Play size={14} className="text-[#00F5FF] fill-[#00F5FF]" />
                            <h3 className="text-[10px] font-bold text-[#00F5FF] uppercase tracking-[0.2em]">Engagement Hebdo</h3>
                        </div>
                        <div className="space-y-3">
                            {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'].map((day, i) => (
                                <div key={day} className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300
                                    ${i === 2 ? 'bg-[#00F5FF]/5 border-[#00F5FF]/20 shadow-[0_0_20px_rgba(0,245,255,0.05)]' : 'bg-white/[0.01] border-white/5 hover:border-white/10'}`}>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-xs font-bold ${i === 2 ? 'text-[#00F5FF]' : 'text-white/40'}`}>{day.slice(0, 3).toUpperCase()}</span>
                                        <div className="w-1 h-3 rounded-full bg-white/5" />
                                        <span className="text-sm font-semibold text-white">{8 - i} Missions</span>
                                    </div>
                                    <span className="text-[9px] font-black text-[#5F6B7A] uppercase tracking-widest">08h-19h</span>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => router.push('/dashboard/moniteur/planning')}
                            className="w-full btn-primary mt-8 py-4"
                        >
                            Optimizer Planning
                            <ChevronRight size={16} />
                        </button>
                    </div>

                    <div className="premium-card p-6">
                        <h3 className="card-title mb-6">Expertise & Certifications</h3>
                        <div className="space-y-3">
                            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-between">
                                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Instructeur Elite</span>
                                <Award size={16} className="text-emerald-400" />
                            </div>
                            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                                <span className="text-xs font-bold text-[#5F6B7A] uppercase tracking-widest">Conduite de nuit</span>
                                <CheckCircle2 size={16} className="text-white/10" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
