'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar as CalendarIcon,
    Clock,
    User,
    ChevronRight,
    Star,
    CheckCircle2,
    ShieldCheck,
    ArrowRight,
    Car
} from 'lucide-react';

const SLOTS = [
    { id: 1, time: '08:00', type: 'Conduite urbaine', moniteur: 'Marc Dupont', exp: 'Senior', rating: 4.9 },
    { id: 2, time: '09:30', type: 'Code accéléré', moniteur: 'Sophie Martin', exp: 'Expert', rating: 5.0 },
    { id: 3, time: '11:00', type: 'Conduite urbaine', moniteur: 'Marc Dupont', exp: 'Senior', rating: 4.9 },
    { id: 4, time: '14:00', type: 'Insertion autoroute', moniteur: 'Sophie Martin', exp: 'Expert', rating: 5.0 },
    { id: 5, time: '15:30', type: 'Manoeuvres parking', moniteur: 'Jean Roche', exp: 'Junior', rating: 4.7 },
    { id: 6, time: '17:00', type: 'Conduite de nuit', moniteur: 'Marc Dupont', exp: 'Senior', rating: 4.9 },
];

export default function ReservationPage() {
    const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

    return (
        <div className="space-y-10 group/reservation">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                <div>
                    <h1 className="page-title">Sessions de conduite</h1>
                    <p className="text-sm text-[#8A94A6] mt-1 font-medium">Planifiez vos prochaines missions de formation stratégique.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Disponibilité temps réel
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Tactical Selection Grid */}
                <div className="lg:col-span-3">
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <span className="text-xs font-bold text-white/40 uppercase tracking-[0.2em]">Sélectionner un module</span>
                            <div className="h-px w-12 bg-white/5" />
                        </div>
                        <div className="flex gap-2">
                            {['Lun 12', 'Mar 13', 'Mer 14', 'Jeu 15'].map((day, idx) => (
                                <button key={idx} className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest border transition-all ${idx === 0 ? 'bg-white/5 border-white/10 text-white' : 'border-transparent text-[#5F6B7A] hover:text-white'}`}>
                                    {day}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {SLOTS.map((slot) => (
                            <button
                                key={slot.id}
                                onClick={() => setSelectedSlot(slot.id)}
                                className={`premium-card p-6 flex flex-col justify-between space-y-6 text-left group transition-all duration-300 min-h-[220px] ${selectedSlot === slot.id ? 'border-[#00F5FF]/40 bg-[#00F5FF]/[0.02] shadow-[0_0_30px_rgba(0,245,255,0.05)]' : 'hover:border-white/20'}`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-2xl font-semibold text-white tracking-tight">{slot.time}</span>
                                            {selectedSlot === slot.id && (
                                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-[#00F5FF]">
                                                    <CheckCircle2 size={18} fill="currentColor" className="text-[#0B0F14]" />
                                                </motion.div>
                                            )}
                                        </div>
                                        <span className="text-[10px] uppercase font-bold text-[#5F6B7A] tracking-wider">{slot.type}</span>
                                    </div>
                                    <div className={`p-2 rounded-lg bg-white/5 border border-white/5 transition-colors ${selectedSlot === slot.id ? 'text-[#00F5FF] border-[#00F5FF]/20' : 'text-[#8A94A6]'}`}>
                                        <Clock size={16} />
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-white/5">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-bold text-[#8A94A6]">
                                                {slot.moniteur.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-semibold text-white group-hover:text-[#00F5FF] transition-colors">{slot.moniteur}</span>
                                                <span className="text-[9px] text-[#5F6B7A] uppercase font-bold tracking-widest">{slot.exp}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/[0.02] border border-white/5">
                                            <Star size={10} className="text-amber-500 fill-amber-500" />
                                            <span className="text-[10px] font-bold text-white">{slot.rating}</span>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Context & Confirmation */}
                <div className="space-y-6">
                    <AnimatePresence mode="wait">
                        {selectedSlot ? (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="premium-card p-6 flex flex-col justify-between space-y-6 min-h-[400px] border-l-4 border-l-[#00F5FF] shadow-[0_0_40px_rgba(0,245,255,0.03)]"
                            >
                                <div className="space-y-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1 h-4 bg-[#00F5FF] rounded-full" />
                                        <h3 className="section-title">Validation session</h3>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-[#00F5FF]/10 flex items-center justify-center text-[#00F5FF]">
                                                <CalendarIcon size={24} />
                                            </div>
                                            <div>
                                                <p className="secondary-info font-medium uppercase tracking-widest text-[10px]">Date & Heure</p>
                                                <p className="text-lg font-semibold text-white">Jeudi 12 Fév • 09:30</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[#8A94A6]">
                                                <Car size={24} />
                                            </div>
                                            <div>
                                                <p className="secondary-info font-medium uppercase tracking-widest text-[10px]">Type de mission</p>
                                                <p className="text-lg font-semibold text-white">{SLOTS.find(s => s.id === selectedSlot)?.type}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
                                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-[#5F6B7A]">
                                            <span>Prix session</span>
                                            <span className="text-white">Inclus dans pack</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-[#5F6B7A]">
                                            <span>Temps estimé</span>
                                            <span className="text-white">90 min</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <button className="w-full btn-primary py-4">
                                        Confirmer la session
                                        <ArrowRight size={18} />
                                    </button>
                                    <button
                                        onClick={() => setSelectedSlot(null)}
                                        className="w-full btn-secondary py-4 text-xs font-bold uppercase tracking-widest bg-transparent border-none text-[#5F6B7A] hover:text-white"
                                    >
                                        Annuler la sélection
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="premium-card p-12 flex flex-col items-center justify-center text-center space-y-6 min-h-[400px]">
                                <div className="w-20 h-20 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-[#5F6B7A]">
                                    <div className="relative">
                                        <CalendarIcon size={40} className="opacity-20" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <ChevronRight size={24} className="opacity-40 animate-pulse text-[#00F5FF]" />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="section-title mb-2">En attente de sélection</h3>
                                    <p className="secondary-info max-w-[200px] mx-auto">Veuillez sélectionner un créneau dans la grille tactique.</p>
                                </div>
                            </div>
                        )}
                    </AnimatePresence>

                    <div className="premium-card p-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <ShieldCheck size={18} className="text-[#8A94A6]" />
                            <span className="card-title">Sécurité garantie</span>
                        </div>
                        <p className="text-[10px] text-[#5F6B7A] leading-relaxed font-medium">
                            Toutes nos sessions sont assurées. Rappel : vous pouvez annuler sans frais jusqu'à 24h avant le début de la mission.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
