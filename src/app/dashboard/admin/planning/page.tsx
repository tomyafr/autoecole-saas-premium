'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { getPlanningData } from '@/app/actions/admin';

export default function AdminPlanningPage() {
    const [slots, setSlots] = useState<any[]>([]);
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        getPlanningData(currentDate).then(data => {
            if (mounted && data) {
                setSlots(data);
                setLoading(false);
            }
        });
        return () => { mounted = false; };
    }, [currentDate]);

    const changeDate = (days: number) => {
        setCurrentDate(prev => {
            const next = new Date(prev);
            next.setDate(next.getDate() + days);
            return next;
        });
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    const formattedDate = new Intl.DateTimeFormat('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(currentDate);

    // Titre de la date capitalisé
    const displayDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

    return (
        <div className="space-y-10 group/planning">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-white/5">
                <div>
                    <h1 className="page-title">Agenda Général</h1>
                    <p className="text-sm text-[#8A94A6] mt-1 font-medium">Vue macroscopique du planning de tous les centres et moniteurs.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={goToToday} className="btn-secondary">
                        Aujourd'hui
                    </button>
                    <div className="flex border border-white/10 rounded-xl overflow-hidden bg-white/[0.02]">
                        <button onClick={() => changeDate(-1)} className="p-2 hover:bg-white/5 text-[#8A94A6] hover:text-white transition-colors border-r border-white/10">
                            <ChevronLeft size={16} />
                        </button>
                        <button onClick={() => changeDate(1)} className="p-2 hover:bg-white/5 text-[#8A94A6] hover:text-white transition-colors">
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="premium-card p-6">
                <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                    <div className="flex items-center gap-4">
                        <Calendar size={20} className="text-[#00F5FF]" />
                        <h3 className="section-title">En temps réel : {displayDate}</h3>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest hidden sm:flex">
                        <div className="flex items-center gap-1.5 text-emerald-400">
                            <div className="w-2 h-2 rounded-full bg-emerald-400" /> Confirmé
                        </div>
                        <div className="flex items-center gap-1.5 text-amber-400">
                            <div className="w-2 h-2 rounded-full bg-amber-400" /> En attente
                        </div>
                        <div className="flex items-center gap-1.5 text-[#5F6B7A]">
                            <div className="w-2 h-2 rounded-full bg-white/10" /> Disponible
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {loading ? (
                        <div className="h-40 flex items-center justify-center">
                            <div className="w-8 h-8 border-2 border-[#00F5FF] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : slots.length === 0 ? (
                        <div className="text-center py-20 text-[#5F6B7A]">
                            <Calendar size={40} className="mx-auto mb-4 opacity-10" />
                            <p className="text-sm font-medium">Aucun rendez-vous planifié pour cette période.</p>
                        </div>
                    ) : (
                        slots.map((slot: any, i: number) => (
                            <div key={i} className="flex flex-col md:flex-row items-center gap-6 p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors cursor-pointer group">
                                <div className="flex items-center gap-3 w-40 shrink-0">
                                    <Clock size={14} className="text-[#5F6B7A]" />
                                    <span className="text-sm font-black text-white">{slot.time}</span>
                                </div>
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-[#5F6B7A] uppercase font-bold tracking-widest mb-1">Formateur</span>
                                        <span className="text-sm font-medium text-white group-hover:text-[#00F5FF] transition-colors">{slot.inst}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-[#5F6B7A] uppercase font-bold tracking-widest mb-1">Élève Assigné</span>
                                        <span className={`text-sm font-medium ${slot.student === '-' || !slot.student ? 'text-[#5F6B7A]' : 'text-white'}`}>{slot.student}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin size={14} className="text-[#8A94A6]" />
                                        <span className="text-xs text-[#8A94A6]">{slot.center}</span>
                                    </div>
                                </div>
                                <div className="shrink-0 w-full md:w-24 md:text-right mt-2 md:mt-0">
                                    <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${slot.status === 'Confirmé' ? 'bg-emerald-500/10 text-emerald-400' :
                                        slot.status === 'En attente' ? 'bg-amber-500/10 text-amber-500' : 'bg-white/5 text-[#5F6B7A]'
                                        }`}>
                                        {slot.status}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
