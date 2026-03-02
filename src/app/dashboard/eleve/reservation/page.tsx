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

const INSTRUCTORS = [
    { id: '1', name: 'Marc Dupont', exp: 'Senior - 15 ans exp.', rating: 4.9, avatar: 'MD', color: 'emerald' },
    { id: '2', name: 'Sophie Martin', exp: 'Expert - Examen', rating: 5.0, avatar: 'SM', color: 'blue' },
    { id: '3', name: 'Jean Roche', exp: 'Instructeur Ville', rating: 4.7, avatar: 'JR', color: 'amber' },
];

const BASE_SLOTS = [
    { time: '08:00', type: 'Conduite urbaine' },
    { time: '09:30', type: 'Code accéléré' },
    { time: '11:00', type: 'Conduite urbaine' },
    { time: '14:00', type: 'Insertion autoroute' },
    { time: '15:30', type: 'Manoeuvres parking' },
    { time: '17:00', type: 'Conduite de nuit' },
];

export default function ReservationPage() {
    const router = useRouter();
    const [user, setUser] = useState<UserType | null>(null);
    const [loading, setLoading] = useState(true);

    // Multi-step state
    const [selectedInstructorId, setSelectedInstructorId] = useState<string>(INSTRUCTORS[0].id);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [availableDates, setAvailableDates] = useState<{ label: string, date: Date }[]>([]);

    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [isConfirmed, setIsConfirmed] = useState(false);

    useEffect(() => {
        const u = getUser();
        if (u) {
            setUser(u);
            setLoading(false);

            const dates = [];
            const today = new Date();
            let current = new Date(today);
            current.setDate(current.getDate() + 1);

            while (dates.length < 5) {
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

    // Dynamic slot generation based on instructor and date to feel real
    const getSlotsForSelection = () => {
        const hash = selectedInstructorId.charCodeAt(0) + selectedDate.getDate();
        return BASE_SLOTS.filter((_, idx) => (hash + idx) % 2 === 0);
    };

    const currentSlots = getSlotsForSelection();
    const selectedInstructor = INSTRUCTORS.find(i => i.id === selectedInstructorId);
    const selectedSlotData = currentSlots.find(s => s.time === selectedTime);

    const handleConfirm = async () => {
        if (!selectedTime || !user || !selectedDate || !selectedInstructor || !selectedSlotData) return;

        setLoading(true);
        const result = await createAppointment(
            user.id,
            selectedInstructor.name,
            selectedDate,
            selectedTime,
            selectedSlotData.type
        );

        if (result.success) {
            setIsConfirmed(true);
            setTimeout(() => {
                setIsConfirmed(false);
                setSelectedTime(null);
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
                    <h1 className="page-title">Réserver une mission</h1>
                    <p className="text-sm text-[var(--color-text-secondary)] mt-1 font-medium">Configurez votre prochaine session d'apprentissage sur-mesure.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Tactical Selection Column */}
                <div className="lg:col-span-3 space-y-8">

                    {/* STEP 1: Instructor */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <span className="text-xs font-bold text-[var(--color-accent)] uppercase tracking-[0.2em]">Étape 1</span>
                            <span className="text-sm font-bold text-[var(--color-text-primary)]">Choisir un Formateur</span>
                            <div className="h-px flex-1 bg-[var(--color-sidebar)]" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {INSTRUCTORS.map(inst => (
                                <button
                                    key={inst.id}
                                    onClick={() => { setSelectedInstructorId(inst.id); setSelectedTime(null); }}
                                    className={`premium-card p-4 flex items-center gap-4 transition-all ${selectedInstructorId === inst.id ? 'border-[var(--color-accent)]/50 bg-[var(--color-accent)]/[0.03] shadow-[0_0_20px_rgba(0,245,255,0.05)]' : 'hover:border-white/20'}`}
                                >
                                    <div className="w-12 h-12 rounded-xl bg-[var(--color-sidebar)] flex items-center justify-center text-xs font-bold text-[var(--color-text-secondary)]">
                                        {inst.avatar}
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-semibold text-[var(--color-text-primary)]">{inst.name}</p>
                                        <div className="flex items-center gap-1 mt-0.5">
                                            <Star size={10} className="text-amber-500 fill-amber-500" />
                                            <span className="text-[10px] font-bold text-[var(--color-text-primary)]">{inst.rating}</span>
                                            <span className="text-[9px] text-[var(--color-text-muted)] ml-1 uppercase tracking-wider">{inst.exp}</span>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* STEP 2: Date */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <span className="text-xs font-bold text-[var(--color-accent)] uppercase tracking-[0.2em]">Étape 2</span>
                            <span className="text-sm font-bold text-[var(--color-text-primary)]">Choisir la date</span>
                            <div className="h-px flex-1 bg-[var(--color-sidebar)]" />
                        </div>
                        <div className="flex gap-3 overflow-x-auto pb-2">
                            {availableDates.map((dayItem, idx) => {
                                const isSelected = selectedDate.getDate() === dayItem.date.getDate();
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => { setSelectedDate(dayItem.date); setSelectedTime(null); }}
                                        className={`flex-1 min-w-[100px] p-4 rounded-xl text-center border transition-all ${isSelected ? 'bg-[var(--color-sidebar)] border-[var(--color-border-subtle)] text-[var(--color-accent)]' : 'border-transparent text-[var(--color-text-muted)] bg-[var(--color-card)] hover:text-[var(--color-text-primary)]'}`}
                                    >
                                        <p className="text-xs font-bold uppercase tracking-widest">{dayItem.label.split(' ')[0]}</p>
                                        <p className={`text-xl font-black mt-1 ${isSelected ? 'text-[var(--color-text-primary)]' : ''}`}>{dayItem.label.split(' ')[1]}</p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* STEP 3: Slots */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <span className="text-xs font-bold text-[var(--color-accent)] uppercase tracking-[0.2em]">Étape 3</span>
                            <span className="text-sm font-bold text-[var(--color-text-primary)]">Disponibilités de {selectedInstructor?.name.split(' ')[0]}</span>
                            <div className="h-px flex-1 bg-[var(--color-sidebar)]" />
                        </div>

                        {currentSlots.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {currentSlots.map((slot, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedTime(slot.time)}
                                        className={`premium-card p-4 flex flex-col gap-2 text-left transition-all ${selectedTime === slot.time ? 'border-[var(--color-accent)]/50 bg-[var(--color-accent)]/[0.03] shadow-[0_0_20px_rgba(0,245,255,0.05)]' : 'hover:border-white/20'}`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-xl font-semibold text-[var(--color-text-primary)]">{slot.time}</span>
                                            {selectedTime === slot.time ? (
                                                <CheckCircle2 size={16} className="text-[var(--color-accent)]" />
                                            ) : (
                                                <Clock size={14} className="text-[var(--color-text-muted)]" />
                                            )}
                                        </div>
                                        <span className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">{slot.type}</span>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center rounded-2xl border border-dashed border-[var(--color-border-subtle)]">
                                <p className="text-sm font-medium text-[var(--color-text-secondary)]">Aucun créneau disponible pour ce jour avec ce formateur.</p>
                            </div>
                        )}
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
                        ) : selectedTime ? (
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
                                                    {selectedDate?.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'short' }).replace(/^\w/, (c) => c.toUpperCase())} • {selectedTime}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-[var(--color-sidebar)] flex items-center justify-center text-[var(--color-text-secondary)]">
                                                <Car size={24} />
                                            </div>
                                            <div>
                                                <p className="secondary-info font-medium uppercase tracking-widest text-[10px]">Type de mission</p>
                                                <p className="text-lg font-semibold text-[var(--color-text-primary)]">{selectedSlotData?.type}</p>
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
                                        onClick={() => setSelectedTime(null)}
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
