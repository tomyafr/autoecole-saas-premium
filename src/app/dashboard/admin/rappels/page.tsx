'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bell,
    Search,
    Filter,
    Mail,
    MessageSquare,
    CheckCircle2,
    Clock,
    Calendar,
    ChevronRight,
    ArrowUpRight,
    Send,
    AlertCircle,
    Smartphone
} from 'lucide-react';
import { getAdminReminders, sendManualReminder } from '@/app/actions/reminder';

export default function AdminRemindersPage() {
    const [loading, setLoading] = useState(true);
    const [appointments, setAppointments] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState<'all' | 'sent' | 'pending'>('all');
    const [actionFeedback, setActionFeedback] = useState<string | null>(null);
    const [isSending, setIsSending] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        const res = await getAdminReminders();
        if (res.success) {
            setAppointments(res.data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const triggerFeedback = (msg: string) => {
        setActionFeedback(msg);
        setTimeout(() => setActionFeedback(null), 3000);
    };

    const handleSendReminder = async (apptId: string) => {
        setIsSending(apptId);
        const res = await sendManualReminder(apptId);
        if (res.success) {
            triggerFeedback('Rappel envoyé avec succès !');
            fetchData();
        } else {
            triggerFeedback(res.error || 'Erreur lors de l\'envoi');
        }
        setIsSending(null);
    };

    const filteredAppointments = appointments.filter(appt => {
        const studentName = appt.student?.name || '';
        const instructorName = appt.instructor?.name || '';
        const matchesSearch =
            studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            instructorName.toLowerCase().includes(searchQuery.toLowerCase());

        const isSent = appt.reminder_sent === true;
        const matchesFilter =
            filter === 'all' ||
            (filter === 'sent' && isSent) ||
            (filter === 'pending' && !isSent);

        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#00F5FF] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                <div>
                    <h1 className="page-title">Gestion des Rappels</h1>
                    <p className="text-sm text-[#8A94A6] mt-1 font-medium italic">Automatisation et suivi des notifications élèves.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-white/[0.02] border border-white/5 rounded-xl p-1">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'all' ? 'bg-[#00F5FF]/10 text-[#00F5FF]' : 'text-[#5F6B7A] hover:text-white'}`}
                        >
                            Tous
                        </button>
                        <button
                            onClick={() => setFilter('pending')}
                            className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'pending' ? 'bg-amber-500/10 text-amber-400' : 'text-[#5F6B7A] hover:text-white'}`}
                        >
                            À Envoyer
                        </button>
                        <button
                            onClick={() => setFilter('sent')}
                            className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'sent' ? 'bg-emerald-500/10 text-emerald-400' : 'text-[#5F6B7A] hover:text-white'}`}
                        >
                            Envoyés
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="premium-card p-6 flex flex-col justify-between space-y-4">
                    <div className="flex justify-between items-start">
                        <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-[#00F5FF]">
                            <Bell size={18} />
                        </div>
                        <span className="card-title">Volume Hebdomadaire</span>
                    </div>
                    <div>
                        <div className="primary-value">{appointments.length} Rappels</div>
                        <p className="secondary-info mt-1 font-medium">Flux de notifications actif</p>
                    </div>
                </div>

                <div className="premium-card p-6 flex flex-col justify-between space-y-4 shadow-[0_0_30px_rgba(16,185,129,0.05)]">
                    <div className="flex justify-between items-start">
                        <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-emerald-400">
                            <Mail size={18} />
                        </div>
                        <span className="card-title">Taux d'Ouverture</span>
                    </div>
                    <div>
                        <div className="primary-value">94.8%</div>
                        <p className="secondary-info mt-1 font-medium uppercase tracking-tighter text-emerald-400/80">Excellent Engagement</p>
                    </div>
                </div>

                <div className="premium-card p-6 flex flex-col justify-between space-y-4">
                    <div className="flex justify-between items-start">
                        <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-amber-400">
                            <Smartphone size={18} />
                        </div>
                        <span className="card-title">SMS / WhatsApp</span>
                    </div>
                    <div>
                        <div className="primary-value">Mode Hybride</div>
                        <p className="secondary-info mt-1 font-medium">Email + WhatsApp activé</p>
                    </div>
                </div>
            </div>

            {/* List Table */}
            <div className="premium-card overflow-hidden">
                <div className="px-8 py-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/[0.01]">
                    <h3 className="section-title">Audit des Notifications</h3>
                    <div className="relative group/search">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5F6B7A] group-focus-within/search:text-[#00F5FF] transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Rechercher un élève..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-white/[0.02] border border-white/5 rounded-xl text-sm font-medium text-white focus:outline-none focus:border-[#00F5FF]/20 transition-all w-full md:w-64"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="premium-table">
                        <thead>
                            <tr>
                                <th>Élève / Contact</th>
                                <th>Date / Heure</th>
                                <th>Type / Moniteur</th>
                                <th>Status Rappel</th>
                                <th className="text-right pr-8">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAppointments.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-20">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-[#5F6B7A]">
                                                <Search size={24} />
                                            </div>
                                            <p className="text-sm font-medium text-[#5F6B7A]">Aucun rendez-vous trouvé pour ces critères.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredAppointments.map((appt, idx) => (
                                <motion.tr
                                    key={appt.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="group hover:bg-white/[0.02] transition-colors"
                                >
                                    <td>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-white group-hover:text-[#00F5FF] transition-colors">{appt.student?.name}</span>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] text-[#5F6B7A] font-bold uppercase tracking-widest">{appt.student?.email || 'Pas d\'email'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={12} className="text-[#00F5FF]" />
                                                <span className="text-sm font-medium text-white">
                                                    {new Date(appt.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                                                </span>
                                            </div>
                                            <span className="text-[10px] text-[#5F6B7A] font-bold uppercase mt-1 ml-5 tracking-widest">{appt.time}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-semibold text-[#8A94A6]">{appt.type || 'Session conduite'}</span>
                                            <span className="text-[10px] text-[#5F6B7A] font-bold uppercase mt-1 tracking-widest">{appt.instructor?.name}</span>
                                        </div>
                                    </td>
                                    <td>
                                        {appt.reminder_sent ? (
                                            <div className="flex items-center gap-2 text-emerald-400">
                                                <CheckCircle2 size={14} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Envoyé</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-amber-400">
                                                <Clock size={14} className="animate-pulse" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">En attente</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="text-right pr-8">
                                        <button
                                            onClick={() => handleSendReminder(appt.id)}
                                            disabled={isSending === appt.id}
                                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all inline-flex items-center gap-2 ${appt.reminder_sent
                                                ? 'bg-white/5 text-[#5F6B7A] hover:bg-white/10 hover:text-white'
                                                : 'bg-[#00F5FF]/10 text-[#00F5FF] hover:bg-[#00F5FF]/20'
                                                } disabled:opacity-50`}
                                        >
                                            {isSending === appt.id ? (
                                                <Clock size={12} className="animate-spin" />
                                            ) : (
                                                <Send size={12} />
                                            )}
                                            {appt.reminder_sent ? 'Renvoyer' : 'Envoyer Rappel'}
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Notification Logic Toggle Card */}
            <div className="premium-card p-8 border-l-4 border-l-[#00F5FF] bg-gradient-to-r from-[#00F5FF]/[0.02] to-transparent">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-[#00F5FF]/10 border border-[#00F5FF]/20 flex items-center justify-center text-[#00F5FF]">
                            <Smartphone size={32} />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-white uppercase tracking-tight">Automatisation intelligente</h3>
                            <p className="text-sm text-[#8A94A6] mt-1 max-w-md">Le système envoie automatiquement un rappel Email & WhatsApp 24h avant chaque session. Vous pouvez forcer l'envoi manuel ici.</p>
                        </div>
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
                        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl bg-[#0B0F14] border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
                    >
                        <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                            <CheckCircle2 size={16} />
                        </div>
                        <p className="text-sm font-medium text-white">{actionFeedback}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
