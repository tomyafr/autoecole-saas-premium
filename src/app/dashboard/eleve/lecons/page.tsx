'use client';

import {
    Calendar,
    User,
    Car,
    CheckCircle2,
    Clock,
    Search,
    Filter,
    ArrowUpRight,
    Star,
    Target,
    Zap,
    Download
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, type User as UserType } from '@/lib/auth';

const LESSONS = [
    { id: 'CITY-101', date: '10 Fév 2026', time: '09:00', moniteur: 'Marc Dupont', vehicule: 'Renault Clio 5', score: '18/20', status: 'Effectué' },
    { id: 'PARK-102', date: '08 Fév 2026', time: '14:30', moniteur: 'Sophie Martin', vehicule: 'Peugeot 208', score: '15/20', status: 'Effectué' },
    { id: 'HWY-103', date: '12 Fév 2026', time: '11:00', moniteur: 'Sophie Martin', vehicule: 'Peugeot 208', score: null, status: 'Prévu' },
    { id: 'NIGHT-104', date: '15 Fév 2026', time: '18:00', moniteur: 'Marc Dupont', vehicule: 'Renault Clio 5', score: null, status: 'Prévu' },
];

export default function LeconsPage() {
    const router = useRouter();
    const [user, setUser] = useState<UserType | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const u = getUser();
        if (u) {
            setUser(u);
            setLoading(false);
        } else {
            router.replace('/login');
        }
    }, [router]);

    if (loading || !user) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-[#00F5FF] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }
    return (
        <div className="space-y-10 group/lecons">
            {/* Page Header with Controls */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-2">
                <div>
                    <h1 className="page-title">Historique leçons</h1>
                    <p className="text-sm text-[#8A94A6] mt-1 font-medium">Analyse historique de vos performances en mission.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative w-full sm:w-80 group">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5F6B7A] transition-colors group-focus-within:text-[#00F5FF]" />
                        <input
                            type="text"
                            placeholder="RECHERCHER UNE SESSION..."
                            className="w-full pl-12 pr-6 py-3.5 bg-white/[0.02] border border-white/5 rounded-xl text-xs font-bold uppercase tracking-widest text-white focus:outline-none focus:border-[#00F5FF]/40 transition-all placeholder:text-[#5F6B7A]"
                        />
                    </div>
                    <button className="btn-secondary h-[46px] w-[46px] p-0 flex items-center justify-center">
                        <Filter size={18} />
                    </button>
                    <button className="btn-primary h-[46px]">
                        <Download size={18} />
                        Exporter
                    </button>
                </div>
            </div>

            {/* Performance Stats Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="premium-card p-6 flex flex-col justify-between space-y-4">
                    <div className="flex justify-between items-start">
                        <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-[#00F5FF]">
                            <Star size={18} fill="currentColor" className="text-[#00F5FF]/40" />
                        </div>
                        <span className="card-title">Score de Maîtrise</span>
                    </div>
                    <div>
                        <div className="primary-value">7.8/10</div>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-400 w-[78%]" />
                            </div>
                            <span className="text-[10px] font-bold text-emerald-400 font-mono tracking-tighter">+12%</span>
                        </div>
                    </div>
                </div>

                <div className="premium-card p-6 flex flex-col justify-between space-y-4">
                    <div className="flex justify-between items-start">
                        <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-[#8A94A6]">
                            <Target size={18} />
                        </div>
                        <span className="card-title">Zones Explorées</span>
                    </div>
                    <div>
                        <div className="primary-value">12 Zones</div>
                        <p className="secondary-info mt-1 font-medium">78% du secteur parisien</p>
                    </div>
                </div>

                <div className="premium-card p-6 flex flex-col justify-between space-y-4">
                    <div className="flex justify-between items-start">
                        <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-[#8A94A6]">
                            <CheckCircle2 size={18} />
                        </div>
                        <span className="card-title">Missions Validées</span>
                    </div>
                    <div>
                        <div className="primary-value">24 Sessions</div>
                        <p className="secondary-info mt-1 font-medium">Sur 35 prévues au total</p>
                    </div>
                </div>
            </div>

            {/* Main History Table Block */}
            <div className="premium-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="premium-table">
                        <thead>
                            <tr>
                                <th>IDENTIFIANT / DATE</th>
                                <th>FORMATEUR</th>
                                <th>CONFIGURATION</th>
                                <th>MAÎTRISE</th>
                                <th>STATUT GLOBAL</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {LESSONS.map((lesson, idx) => (
                                <motion.tr
                                    key={lesson.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="group"
                                >
                                    <td>
                                        <div className="flex flex-col">
                                            <span className="text-white font-semibold">
                                                {lesson.date}
                                            </span>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[9px] font-bold text-[#5F6B7A] uppercase tracking-[0.2em] group-hover:text-[#00F5FF] transition-colors">{lesson.id}</span>
                                                <div className="w-1 h-1 rounded-full bg-white/10" />
                                                <span className="text-[9px] font-bold text-[#5F6B7A] uppercase tracking-widest">{lesson.time}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-[10px] font-black text-[#5F6B7A] group-hover:bg-[#00F5FF]/10 group-hover:text-[#00F5FF] transition-all">
                                                {lesson.moniteur.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <span className="text-sm font-medium text-gray-300">{lesson.moniteur}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="p-1.5 rounded-lg bg-white/[0.02] border border-white/5 text-[#5F6B7A]">
                                                <Car size={14} />
                                            </div>
                                            <span className="text-xs font-semibold text-gray-400 group-hover:text-white transition-colors">{lesson.vehicule}</span>
                                        </div>
                                    </td>
                                    <td>
                                        {lesson.score ? (
                                            <div className="flex flex-col gap-1.5 min-w-[120px]">
                                                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                                                    <span className="text-[#5F6B7A]">Maîtrise Vol</span>
                                                    <span className="text-emerald-400 font-mono">{lesson.score}</span>
                                                </div>
                                                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                                    <div className="h-full bg-emerald-400 opacity-60 rounded-full" style={{ width: `${(parseInt(lesson.score) / 20) * 100}%` }} />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-[#5F6B7A]">
                                                <div className="w-1 h-1 rounded-full bg-white/20" />
                                                <span className="text-[10px] font-semibold uppercase tracking-widest">Données en attente</span>
                                            </div>
                                        )}
                                    </td>
                                    <td>
                                        <span className={`status-badge ${lesson.status === 'Effectué' ? 'status-badge-cyan' : 'status-badge-gray'}`}>
                                            {lesson.status}
                                        </span>
                                    </td>
                                    <td className="text-right">
                                        <button className="p-2 text-[#5F6B7A] hover:text-white transition-colors">
                                            <ArrowUpRight size={18} />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Strategic Analytics Insight Module */}
            <div className="premium-card p-10 bg-[radial-gradient(circle_at_0%_0%,rgba(0,245,255,0.03)_0%,transparent_50%)] border-[#00F5FF]/10 shadow-[0_0_30px_rgba(0,245,255,0.02)] flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-8 text-center md:text-left">
                    <div className="w-20 h-20 rounded-[2rem] bg-[#00F5FF]/5 border border-[#00F5FF]/10 flex items-center justify-center text-[#00F5FF] shadow-[0_0_20px_rgba(0,245,255,0.2)]">
                        <Zap size={36} fill="currentColor" className="animate-pulse" />
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 justify-center md:justify-start">
                            <h3 className="section-title">Analyse AutoDrive AI™</h3>
                            <div className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[8px] font-black text-white/40 uppercase tracking-widest">PRO</div>
                        </div>
                        <p className="secondary-info max-w-lg leading-relaxed">
                            Sur la base de vos 2 dernières sessions, nous recommandons de focaliser votre prochain entrainement sur les <span className="text-[#00F5FF] font-semibold italic">contrôles d'angle mort lors des insertions rapides</span>. Votre note de confiance a augmenté de 15%.
                        </p>
                    </div>
                </div>
                <button className="btn-secondary py-4 px-8 border-[#00F5FF]/20 text-[#00F5FF] hover:bg-[#00F5FF]/5 uppercase text-[10px] font-black tracking-[0.2em]">
                    Voir Rapport IA Complet
                </button>
            </div>
        </div>
    );
}
