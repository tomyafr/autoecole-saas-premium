'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
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
import { getUser, type User as UserType } from '@/lib/auth';
import { createAppointment } from '@/app/actions/appointment';

const SLOTS = [
    { id: 1, time: '08:00', type: 'Conduite urbaine', moniteur: 'Marc Dupont', exp: 'Senior', rating: 4.9 },
    { id: 2, time: '09:30', type: 'Code accéléré', moniteur: 'Sophie Martin', exp: 'Expert', rating: 5.0 },
    { id: 3, time: '11:00', type: 'Conduite urbaine', moniteur: 'Marc Dupont', exp: 'Senior', rating: 4.9 },
    { id: 4, time: '14:00', type: 'Insertion autoroute', moniteur: 'Sophie Martin', exp: 'Expert', rating: 5.0 },
    { id: 5, time: '15:30', type: 'Manoeuvres parking', moniteur: 'Jean Roche', exp: 'Junior', rating: 4.7 },
    { id: 6, time: '17:00', type: 'Conduite de nuit', moniteur: 'Marc Dupont', exp: 'Senior', rating: 4.9 },
];

export default function ReservationPage() {
    const router = useRouter();
    const [user, setUser] = useState<UserType | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [availableDates, setAvailableDates] = useState<{ label: string, date: Date }[]>([]);
    const [isConfirmed, setIsConfirmed] = useState(false);

    useEffect(() => {
        const u = getUser();
        if (u) {
            setUser(u);
            setLoading(false);

            // Generate next 4 working days dynamically
            const dates = [];
            const today = new Date();
            let daysAdded = 0;
            let current = new Date(today);
            current.setDate(current.getDate() + 1); // Start tomorrow

            while (dates.length < 4) {
                // Skip Sundays
                if (current.getDay() !== 0) {
                    const label = current.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' }).replace('.', '');
                    dates.push({
                        label: label.charAt(0).toUpperCase() + label.slice(1),
                        date: new Date(current)
                    });
                }
                current.setDate(current.getDate() + 1);
            }
            setAvailableDates(dates);
            setSelectedDate(dates[0].date);

        } else {
            router.replace('/login');
        }
    }, [router]);

    const handleConfirm = async () => {
        if (!selectedSlot || !user || !selectedDate) return;

        const slot = SLOTS.find(s => s.id === selectedSlot);
        if (!slot) return;

        setLoading(true);
        const result = await createAppointment(
            user.id,
            slot.moniteur,
            selectedDate,
            slot.time,
            slot.type
        );

        if (result.success) {
            setIsConfirmed(true);
            setTimeout(() => {
                setIsConfirmed(false);
                setSelectedSlot(null);
                setLoading(false);
            }, 3000);
        } else {
            alert('Erreur lors de la réservation');
            setLoading(false);
        }
    };

    if (loading || !user) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-10 group/reservation">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                <div>
                    <h1 className="page-title">Sessions de conduite</h1>
                    <p className="text-sm text-[var(--color-text-secondary)] mt-1 font-medium">Planifiez vos prochaines missions de formation stratégique.</p>
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
                            <span className="text-xs font-bold text-[var(--color-text-primary)]/40 uppercase tracking-[0.2em]">Sélectionner un module</span>
                            <div className="h-px w-12 bg-[var(--color-sidebar)]" />
                        </div>
                        <div className="flex gap-2 text-nowrap overflow-x-auto pb-2">
                            {availableDates.map((dayItem, idx) => {
                                const isSelected = selectedDate.getDate() === dayItem.date.getDate();
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedDate(dayItem.date)}
                                        className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest border transition-all ${isSelected ? 'bg-[var(--color-sidebar)] border-[var(--color-border-subtle)] text-[var(--color-text-primary)]' : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'}`}
                                    >
                                        {dayItem.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {SLOTS.map((slot) => (
                            <button
                                key={slot.id}
                                onClick={() => setSelectedSlot(slot.id)}
                                className={`premium-card p-6 flex flex-col justify-between space-y-6 text-left group transition-all duration-300 min-h-[220px] ${selectedSlot === slot.id ? 'border-[var(--color-accent)]/40 bg-[var(--color-accent)]/[0.02] shadow-[0_0_30px_rgba(0,245,255,0.05)]' : 'hover:border-white/20'}`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-2xl font-semibold text-[var(--color-text-primary)] tracking-tight">{slot.time}</span>
                                            {selectedSlot === slot.id && (
                                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-[var(--color-accent)]">
                                                    <CheckCircle2 size={18} fill="currentColor" className="text-[#0B0F14]" />
                                                </motion.div>
                                            )}
                                        </div>
                                        <span className="text-[10px] uppercase font-bold text-[var(--color-text-muted)] tracking-wider">{slot.type}</span>
                                    </div>
                                    <div className={`p-2 rounded-lg bg-[var(--color-sidebar)] border border-[var(--color-border-subtle)] transition-colors ${selectedSlot === slot.id ? 'text-[var(--color-accent)] border-[var(--color-accent)]/20' : 'text-[var(--color-text-secondary)]'}`}>
                                        <Clock size={16} />
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-[var(--color-border-subtle)]">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-[var(--color-sidebar)] flex items-center justify-center text-[10px] font-bold text-[var(--color-text-secondary)]">
                                                {slot.moniteur.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors">{slot.moniteur}</span>
                                                <span className="text-[9px] text-[var(--color-text-muted)] uppercase font-bold tracking-widest">{slot.exp}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[var(--color-card)] border border-[var(--color-border-subtle)]">
                                            <Star size={10} className="text-amber-500 fill-amber-500" />
                                            <span className="text-[10px] font-bold text-[var(--color-text-primary)]">{slot.rating}</span>
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
                        {isConfirmed ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="premium-card p-12 flex flex-col items-center justify-center text-center space-y-6 min-h-[400px] border-[var(--color-accent)]/20"
                            >
                                <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                                    <CheckCircle2 size={40} />
                                </div>
                                <div>
                                    <h3 className="section-title mb-2">Session Confirmée</h3>
                                    <p className="secondary-info max-w-[200px] mx-auto">Votre mission a été enregistrée avec succès dans votre planning.</p>
                                </div>
                            </motion.div>
                        ) : selectedSlot ? (
                            <motion.div
                                key="selection"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="premium-card p-6 flex flex-col justify-between space-y-6 min-h-[400px] border-l-4 border-l-[var(--color-accent)] shadow-[0_0_40px_rgba(0,245,255,0.03)]"
                            >
                                <div className="space-y-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1 h-4 bg-[var(--color-accent)] rounded-full" />
                                        <h3 className="section-title">Validation session</h3>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-[var(--color-accent)]/10 flex items-center justify-center text-[var(--color-accent)]">
                                                <CalendarIcon size={24} />
                                            </div>
                                            <div>
                                                <p className="secondary-info font-medium uppercase tracking-widest text-[10px]">Date & Heure</p>
                                                <p className="text-lg font-semibold text-[var(--color-text-primary)]">
                                                    {selectedDate?.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'short' }).replace(/^\w/, (c) => c.toUpperCase())} • {SLOTS.find(s => s.id === selectedSlot)?.time}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-[var(--color-sidebar)] flex items-center justify-center text-[var(--color-text-secondary)]">
                                                <Car size={24} />
                                            </div>
                                            <div>
                                                <p className="secondary-info font-medium uppercase tracking-widest text-[10px]">Type de mission</p>
                                                <p className="text-lg font-semibold text-[var(--color-text-primary)]">{SLOTS.find(s => s.id === selectedSlot)?.type}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-xl bg-[var(--color-card)] border border-[var(--color-border-subtle)] space-y-3">
                                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
                                            <span>Prix session</span>
                                            <span className="text-[var(--color-text-primary)]">Inclus dans pack</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
                                            <span>Temps estimé</span>
                                            <span className="text-[var(--color-text-primary)]">90 min</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <button
                                        onClick={handleConfirm}
                                        className="w-full btn-primary py-4"
                                    >
                                        Confirmer la session
                                        <ArrowRight size={18} />
                                    </button>
                                    <button
                                        onClick={() => setSelectedSlot(null)}
                                        className="w-full btn-secondary py-4 text-xs font-bold uppercase tracking-widest bg-transparent border-none text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                                    >
                                        Annuler la sélection
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="premium-card p-12 flex flex-col items-center justify-center text-center space-y-6 min-h-[400px]">
                                <div className="w-20 h-20 rounded-3xl bg-[var(--color-card)] border border-[var(--color-border-subtle)] flex items-center justify-center text-[var(--color-text-muted)]">
                                    <div className="relative">
                                        <CalendarIcon size={40} className="opacity-20" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <ChevronRight size={24} className="opacity-40 animate-pulse text-[var(--color-accent)]" />
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
                            <ShieldCheck size={18} className="text-[var(--color-text-secondary)]" />
                            <span className="card-title">Sécurité garantie</span>
                        </div>
                        <p className="text-[10px] text-[var(--color-text-muted)] leading-relaxed font-medium">
                            Toutes nos sessions sont assurées. Rappel : vous pouvez annuler sans frais jusqu'à 24h avant le début de la mission.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
