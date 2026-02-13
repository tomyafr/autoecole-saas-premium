'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Clock,
    User,
    MapPin,
    AlertCircle,
    CheckCircle2,
    CalendarDays,
    Plus,
    Filter,
    ArrowRight
} from 'lucide-react';

/* ======= DATA ======= */
const SESSIONS = [
    { id: 1, time: '08:00', duration: '2h', student: 'Lucas Bernard', type: 'Conduite', status: 'confirmé', location: 'Point Ralliement A' },
    { id: 2, time: '10:30', duration: '1.5h', student: 'Emma Petit', type: 'Circuit', status: 'en attente', location: 'Centre Technique' },
    { id: 3, time: '14:00', duration: '2h', student: 'Hugo Roux', type: 'Examen Blanc', status: 'confirmé', location: 'Parcours Officiel' },
    { id: 4, time: '16:30', duration: '1h', student: 'Chloé Moreau', type: 'Evaluation', status: 'annulé', location: 'Point Ralliement B' },
];

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

export default function MoniteurPlanningPage() {
    const [selectedDate, setSelectedDate] = useState(new Date());

    return (
        <div className="space-y-10 group/planning">
            {/* Header section with Tactical Controls */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                <div>
                    <h1 className="page-title">Planning Opérationnel</h1>
                    <p className="text-sm text-[#8A94A6] mt-1 font-medium">Gestion temps-réel de votre déploiement sur le terrain.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="btn-secondary">
                        <Filter size={16} />
                        Filtrer
                    </button>
                    <button className="btn-primary">
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
                            <h3 className="section-title">Calendrier</h3>
                            <div className="flex gap-1">
                                <button className="p-1.5 rounded-lg hover:bg-white/5 text-[#5F6B7A] transition-colors"><ChevronLeft size={16} /></button>
                                <button className="p-1.5 rounded-lg hover:bg-white/5 text-[#5F6B7A] transition-colors"><ChevronRight size={16} /></button>
                            </div>
                        </div>
                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {DAYS.map(d => (
                                <div key={d} className="text-center text-[9px] font-black text-[#5F6B7A] uppercase tracking-tighter">{d}</div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                            {Array.from({ length: 31 }).map((_, i) => (
                                <button
                                    key={i}
                                    className={`aspect-square rounded-lg flex items-center justify-center text-[10px] font-bold transition-all ${i + 1 === 13
                                            ? 'bg-[#00F5FF] text-black shadow-[0_0_15px_rgba(0,245,255,0.3)]'
                                            : 'text-[#8A94A6] hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="premium-card p-6 space-y-4">
                        <h3 className="card-title text-[#00F5FF]/60 italic font-black">Résumé du Jour</h3>
                        <div className="space-y-4">
                            {[
                                { label: 'Charge Totale', value: '6.5h', color: 'text-white' },
                                { label: 'Sessions Actives', value: '3', color: 'text-[#00F5FF]' },
                                { label: 'Flux Moyen', value: '88%', color: 'text-emerald-400' },
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
                                <h2 className="text-xl font-black text-white uppercase italic tracking-tight">Jeudi, 13 Février 2026</h2>
                                <p className="text-[10px] text-[#5F6B7A] font-bold uppercase tracking-widest mt-0.5">Lutte contre les imprévus opérationnels</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {SESSIONS.map((session, i) => (
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
                                                {session.student.split(' ').map(n => n[0]).join('')}
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

                                    {/* Action Block */}
                                    <div className="flex items-center gap-3">
                                        <button className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black text-[#8A94A6] hover:text-white transition-all uppercase tracking-widest">Modifier</button>
                                        <button className="w-10 h-10 rounded-xl bg-[#00F5FF]/10 border border-[#00F5FF]/20 text-[#00F5FF] flex items-center justify-center transition-all hover:bg-[#00F5FF] hover:text-black">
                                            <ArrowRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
