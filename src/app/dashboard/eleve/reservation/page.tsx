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
    Car,
    X,
    RotateCcw
} from 'lucide-react';
import { getUser, type User as UserType } from '@/lib/auth';
import { createAppointment, getBookedSlots } from '@/app/actions/appointment';

const INSTRUCTORS = [
    { id: '1', name: 'Marie Dupont', exp: 'Senior - 15 ans exp.', rating: 4.9, avatar: 'MD', color: 'emerald' },
    { id: '2', name: 'Sophie Martin', exp: 'Expert - Examen', rating: 5.0, avatar: 'SM', color: 'blue' },
];

const ALL_HOURS = [
    '08:00', '09:00', '10:00', '11:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
];

export default function ReservationPage() {
    const router = useRouter();
    const [user, setUser] = useState<UserType | null>(null);
    const [loading, setLoading] = useState(true);

    // Multi-step state
    const [selectedInstructorId, setSelectedInstructorId] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date>(() => {
        const d = new Date();
        d.setHours(12, 0, 0, 0);
        d.setDate(d.getDate() + 1); // Demain par défaut
        return d;
    });
    const [weekOffset, setWeekOffset] = useState(0);
    const [availableDates, setAvailableDates] = useState<{ label: string, date: Date }[]>([]);

    const [selectedDuration, setSelectedDuration] = useState<number>(1);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [calendarAdded, setCalendarAdded] = useState(false);
    const [bookedSlots, setBookedSlots] = useState<string[]>([]);
    const [actionFeedback, setActionFeedback] = useState<string | null>(null);

    const triggerFeedback = (msg: string) => {
        setActionFeedback(msg);
        setTimeout(() => setActionFeedback(null), 3000);
    };

    const selectedInstructor = INSTRUCTORS.find(i => i.id === selectedInstructorId);

    useEffect(() => {
        if (selectedInstructor && selectedDate) {
            getBookedSlots(selectedInstructor.name, selectedDate).then(slots => setBookedSlots(slots));
        }
    }, [selectedInstructor, selectedDate]);

    useEffect(() => {
        const u = getUser();
        if (u) {
            setUser(u);
            setLoading(false);

            const dates = [];
            const today = new Date();
            today.setHours(12, 0, 0, 0);
            today.setDate(today.getDate() + (weekOffset * 7));
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
            if (weekOffset !== 0 || !selectedDate || dates.findIndex(d => d.date.toDateString() === selectedDate.toDateString()) === -1) {
                // Only auto-select if we shifted weeks and the current selection is lost
                if (weekOffset !== 0) setSelectedDate(dates[0].date);
            }

        } else {
            router.replace('/login');
        }
    }, [router, weekOffset]);

    const handleConfirm = async () => {
        if (!selectedTime || !user || !selectedDate || !selectedInstructor) return;

        setLoading(true);
        const result = await createAppointment(
            user.id,
            selectedInstructor.name,
            selectedDate,
            selectedTime,
            `Leçon de conduite (${selectedDuration}H)`
        );

        if (result.success) {
            setIsConfirmed(true);
            const newBooked = [...bookedSlots, selectedTime];
            if (selectedDuration === 2) {
                const hour = parseInt(selectedTime.split(':')[0], 10);
                const nextTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
                newBooked.push(nextTime);
            }
            setBookedSlots(newBooked);
            setLoading(false);
        } else {
            setLoading(false);
            triggerFeedback('Erreur lors de la réservation. Veuillez réessayer.');
        }
    };

    if (loading || !user) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-[#00F5FF] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-10 group/reservation">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                <div>
                    <h1 className="page-title">Réserver une mission</h1>
                    <p className="text-sm text-[#8A94A6] mt-1 font-medium">Configurez votre prochaine session d'apprentissage sur-mesure.</p>
                </div>
                {selectedInstructorId && (
                    <button
                        onClick={() => { setSelectedInstructorId(null); setSelectedTime(null); }}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest text-[#5F6B7A] hover:text-white transition-all border border-white/5"
                    >
                        <RotateCcw size={12} />
                        Changer de formateur
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 space-y-8">

                    {/* STEP 1: Instructor */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <span className="text-xs font-bold text-[#00F5FF] uppercase tracking-[0.2em]">Étape 1</span>
                            <span className="text-sm font-bold text-white">Choisir un Formateur</span>
                            <div className="h-px flex-1 bg-white/5" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                            {INSTRUCTORS.map(inst => (
                                <button
                                    key={inst.id}
                                    onClick={() => { setSelectedInstructorId(inst.id); setSelectedTime(null); }}
                                    className={`premium-card p-6 flex items-center gap-5 transition-all relative overflow-hidden ${selectedInstructorId === inst.id ? 'border-[#00F5FF] ring-2 ring-[#00F5FF]/20 bg-[#00F5FF]/[0.05] shadow-[0_0_30px_rgba(0,245,255,0.1)]' : 'hover:border-white/20'}`}
                                >
                                    {selectedInstructorId === inst.id && (
                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-3 right-3 text-[#00F5FF]">
                                            <CheckCircle2 size={20} fill="currentColor" className="text-[#0B0F14]" />
                                        </motion.div>
                                    )}
                                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-lg font-black text-[#5F6B7A]">
                                        {inst.avatar}
                                    </div>
                                    <div className="text-left">
                                        <p className="text-lg font-black text-white uppercase tracking-tight">{inst.name}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-lg">
                                                <Star size={10} className="text-amber-500 fill-amber-500" />
                                                <span className="text-[10px] font-black text-amber-500">{inst.rating}</span>
                                            </div>
                                            <span className="text-[10px] text-[#5F6B7A] font-bold uppercase tracking-wider">{inst.exp}</span>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {selectedInstructorId ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-8"
                            >
                                {/* STEP 2: Date */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4 flex-1">
                                            <span className="text-xs font-bold text-[#00F5FF] uppercase tracking-[0.2em]">Étape 2</span>
                                            <span className="text-sm font-bold text-white">Choisir la date</span>
                                            <div className="h-px flex-1 bg-white/5" />
                                        </div>
                                        <div className="flex items-center gap-2 ml-4">
                                            <div className="relative">
                                                <input
                                                    type="date"
                                                    className="absolute inset-0 opacity-0 cursor-pointer z-20 w-8"
                                                    min={new Date().toISOString().split('T')[0]}
                                                    onChange={(e) => {
                                                        const d = new Date(e.target.value);
                                                        d.setHours(12, 0, 0, 0);
                                                        setSelectedDate(d);
                                                        setSelectedTime(null);
                                                        setWeekOffset(0);
                                                    }}
                                                />
                                                <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#00F5FF]/50 hover:text-[#00F5FF] transition-all">
                                                    <CalendarIcon size={14} />
                                                    <span className="text-[10px] font-black uppercase tracking-wider">Calendrier</span>
                                                </button>
                                            </div>
                                            <div className="w-px h-6 bg-white/10 mx-2" />
                                            <div className="flex gap-1">
                                                <button disabled={weekOffset === 0} onClick={() => setWeekOffset(prev => Math.max(0, prev - 1))} className={`p-1.5 rounded-lg border ${weekOffset === 0 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-white/5 border-white/10 hover:text-[#00F5FF]'}`}>
                                                    <ChevronRight size={14} className="rotate-180" />
                                                </button>
                                                <button onClick={() => setWeekOffset(prev => prev + 1)} className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5 hover:text-[#00F5FF]">
                                                    <ChevronRight size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                                        {availableDates.map((dayItem, idx) => {
                                            const isSelected = selectedDate.getDate() === dayItem.date.getDate() && selectedDate.getMonth() === dayItem.date.getMonth();
                                            return (
                                                <button
                                                    key={idx}
                                                    onClick={() => { setSelectedDate(dayItem.date); setSelectedTime(null); }}
                                                    className={`flex-1 min-w-[110px] p-5 rounded-[1.5rem] text-center border transition-all duration-300 ${isSelected ? 'bg-white/5 border-[#00F5FF] text-[#00F5FF] shadow-[0_10px_30px_rgba(0,245,255,0.1)] scale-105' : 'border-white/5 text-[#5F6B7A] bg-[#0B0F14] hover:border-white/20'}`}
                                                >
                                                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">{dayItem.label.split(' ')[0]}</p>
                                                    <p className={`text-2xl font-black mt-1 ${isSelected ? 'text-white' : ''}`}>{dayItem.label.split(' ')[1]}</p>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* STEP 3: Slots */}
                                <div className="space-y-4 pt-4">
                                    <div className="flex items-center gap-4">
                                        <span className="text-xs font-bold text-[#00F5FF] uppercase tracking-[0.2em]">Étape 3</span>
                                        <span className="text-sm font-bold text-white">Disponibilités de {selectedInstructor?.name.split(' ')[0]}</span>
                                        <div className="h-px flex-1 bg-white/5" />
                                    </div>

                                    <div className="flex gap-4 mb-6">
                                        <button
                                            onClick={() => { setSelectedDuration(1); setSelectedTime(null); }}
                                            className={`flex-1 py-3 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${selectedDuration === 1 ? 'border-[#00F5FF] bg-[#00F5FF]/10 text-white shadow-[0_0_20px_rgba(0,245,255,0.1)]' : 'border-white/5 text-[#5F6B7A] hover:bg-white/5'}`}
                                        >
                                            Session 1 Heure
                                        </button>
                                        <button
                                            onClick={() => { setSelectedDuration(2); setSelectedTime(null); }}
                                            className={`flex-1 py-3 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${selectedDuration === 2 ? 'border-[#00F5FF] bg-[#00F5FF]/10 text-white shadow-[0_0_20px_rgba(0,245,255,0.1)]' : 'border-white/5 text-[#5F6B7A] hover:bg-white/5'}`}
                                        >
                                            Session 2 Heures
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {ALL_HOURS.map((time, idx) => {
                                            let isBooked = bookedSlots.includes(time);
                                            if (!isBooked && selectedDuration === 2) {
                                                const nextHour = ALL_HOURS[idx + 1];
                                                if (!nextHour || bookedSlots.includes(nextHour)) isBooked = true;
                                            }

                                            return (
                                                <button
                                                    key={idx}
                                                    disabled={isBooked}
                                                    onClick={() => !isBooked && setSelectedTime(time)}
                                                    className={`premium-card p-5 group transition-all duration-300 ${isBooked ? 'opacity-20 cursor-not-allowed grayscale' : selectedTime === time ? 'border-[#00F5FF] bg-[#00F5FF]/5 shadow-[0_0_25px_rgba(0,245,255,0.05)] scale-[1.02]' : 'hover:border-white/20 hover:bg-white/[0.02]'}`}
                                                >
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className={`text-2xl font-black ${selectedTime === time ? 'text-white' : 'text-[#8A94A6]'}`}>{time}</span>
                                                        {selectedTime === time ? (
                                                            <CheckCircle2 size={16} className="text-[#00F5FF]" />
                                                        ) : (
                                                            <Clock size={16} className="text-[#5F6B7A] opacity-20 group-hover:opacity-100 transition-opacity" />
                                                        )}
                                                    </div>
                                                    <span className="text-[9px] font-black text-[#5F6B7A] uppercase tracking-widest">{selectedDuration}H DISPONIBLE</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="lg:col-span-3 py-24 text-center rounded-[2.5rem] border border-dashed border-white/5 bg-white/[0.01]">
                                <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-6 text-[#5F6B7A]">
                                    <User size={32} strokeWidth={1} />
                                </div>
                                <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2">En attente de formateur</h3>
                                <p className="text-sm text-[#5F6B7A] max-w-[280px] mx-auto italic leading-relaxed">Veuillez sélectionner votre moniteur préféré pour accéder à son planning de conduite et réserver votre session.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="space-y-6">
                    <AnimatePresence mode="wait">
                        {isConfirmed ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="premium-card p-10 flex flex-col justify-center space-y-8 min-h-[450px] border-[#00F5FF]/20 shadow-[0_0_50px_rgba(0,245,255,0.05)]"
                            >
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-8 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                                        <CheckCircle2 size={40} />
                                    </div>
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">C'est validé !</h3>
                                    <p className="text-sm text-[#8A94A6] leading-relaxed">Votre session a été enregistrée. Retrouvez là dans votre historique.</p>
                                </div>
                                <div className="space-y-3">
                                    <button onClick={() => setCalendarAdded(true)} className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${calendarAdded ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-white/5 text-white border-white/10 hover:bg-white/10'}`}>
                                        <CalendarIcon size={14} /> {calendarAdded ? "Ajouté à l'agenda" : "Ajouter au calendrier"}
                                    </button>
                                    <button onClick={() => router.push('/dashboard/eleve')} className="w-full btn-primary py-4 justify-center">
                                        Tableau de bord <ArrowRight size={14} />
                                    </button>
                                </div>
                            </motion.div>
                        ) : selectedTime ? (
                            <motion.div
                                key="selection"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="premium-card p-8 flex flex-col justify-between space-y-8 min-h-[450px] border-l-4 border-l-[#00F5FF] shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
                            >
                                <div className="space-y-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-6 bg-[#00F5FF] rounded-full" />
                                        <h3 className="text-xs font-black text-white uppercase tracking-widest">Confirmation</h3>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 rounded-2xl bg-[#00F5FF]/10 flex items-center justify-center text-[#00F5FF]">
                                                <CalendarIcon size={28} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-[#5F6B7A] uppercase tracking-widest mb-1">Date & Heure</p>
                                                <p className="text-lg font-black text-white leading-tight">
                                                    {selectedDate?.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'short' }).replace(/^\w/, (c) => c.toUpperCase())}
                                                    <br /><span className="text-[#00F5FF]">{selectedTime}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-[#8A94A6]">
                                                <User size={28} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-[#5F6B7A] uppercase tracking-widest mb-1">Formateur</p>
                                                <p className="text-lg font-black text-white">{selectedInstructor?.name}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4">
                                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-[#5F6B7A]">
                                            <span>Session</span>
                                            <span className="text-white">{selectedDuration}H CONDUITE</span>
                                        </div>
                                        <div className="h-px bg-white/5" />
                                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-[#5F6B7A]">
                                            <span>Prix</span>
                                            <span className="text-[#00F5FF]">INCLUS PACK</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <button onClick={handleConfirm} className="w-full btn-primary py-5 justify-center text-xs font-black tracking-[0.2em]">
                                        CONFIRMER <ArrowRight size={18} />
                                    </button>
                                    <button onClick={() => setSelectedTime(null)} className="w-full text-[10px] font-bold text-[#5F6B7A] uppercase tracking-widest hover:text-white transition-colors">
                                        ANNULER
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="premium-card p-12 flex flex-col items-center justify-center text-center space-y-8 min-h-[450px]">
                                <div className="w-24 h-24 rounded-[2rem] bg-white/[0.02] border border-white/5 flex items-center justify-center text-[#5F6B7A]">
                                    <CalendarIcon size={40} strokeWidth={1} className="opacity-10" />
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-sm font-black text-white uppercase tracking-widest">Sélection incomplète</h3>
                                    <p className="text-[11px] text-[#5F6B7A] leading-relaxed px-4 italic">Choisissez un créneau horaire sur le planning pour finaliser votre réservation.</p>
                                </div>
                            </div>
                        )}
                    </AnimatePresence>

                    <div className="premium-card p-6 border-l-2 border-l-emerald-500/50">
                        <div className="flex items-center gap-3 mb-3 text-emerald-400">
                            <ShieldCheck size={18} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Protection Premium</span>
                        </div>
                        <p className="text-[10px] text-[#5F6B7A] leading-relaxed font-bold italic">
                            Annulation gratuite jusqu'à 24h avant. Mission assurée par AXA Pro.
                        </p>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {actionFeedback && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
                        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 px-8 py-5 rounded-[2rem] bg-[#0B0F14] border border-[#00F5FF]/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                    >
                        <div className="w-10 h-10 rounded-full bg-[#00F5FF]/10 flex items-center justify-center text-[#00F5FF]">
                            <CheckCircle2 size={20} />
                        </div>
                        <p className="text-sm font-bold text-white uppercase tracking-tighter">{actionFeedback}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
