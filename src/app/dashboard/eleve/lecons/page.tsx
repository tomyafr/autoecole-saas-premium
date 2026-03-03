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
import { AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const currentYear = new Date().getFullYear();
const currentMonth = new Date().toLocaleDateString('fr-FR', { month: 'short' });

const LESSONS = [
    { id: 'CITY-101', date: `10 ${currentMonth} ${currentYear}`, time: '09:00', moniteur: 'Marie Dupont', vehicule: 'Renault Clio 5', score: '18/20', status: 'Effectué' },
    { id: 'PARK-102', date: `08 ${currentMonth} ${currentYear}`, time: '14:30', moniteur: 'Sophie Martin', vehicule: 'Peugeot 208', score: '15/20', status: 'Effectué' },
    { id: 'HWY-103', date: `12 ${currentMonth} ${currentYear}`, time: '11:00', moniteur: 'Sophie Martin', vehicule: 'Peugeot 208', score: null, status: 'Prévu' },
    { id: 'NIGHT-104', date: `15 ${currentMonth} ${currentYear}`, time: '18:00', moniteur: 'Marie Dupont', vehicule: 'Renault Clio 5', score: null, status: 'Prévu' },
];

export default function LeconsPage() {
    const router = useRouter();
    const [user, setUser] = useState<UserType | null>(null);
    const [loading, setLoading] = useState(true);

    const [selectedLesson, setSelectedLesson] = useState<any>(null);
    const [iaReportModal, setIaReportModal] = useState(false);
    const [actionFeedback, setActionFeedback] = useState<string | null>(null);

    const triggerFeedback = (msg: string) => {
        setActionFeedback(msg);
        setTimeout(() => setActionFeedback(null), 3000);
    };

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
                <div className="w-6 h-6 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }
    return (
        <div className="space-y-10 group/lecons">
            {/* Page Header with Controls */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-2">
                <div>
                    <h1 className="page-title">Historique leçons</h1>
                    <p className="text-sm text-[var(--color-text-secondary)] mt-1 font-medium">Analyse historique de vos performances en mission.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative w-full sm:w-80 group">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] transition-colors group-focus-within:text-[var(--color-accent)]" />
                        <input
                            type="text"
                            placeholder="RECHERCHER UNE SESSION..."
                            className="w-full pl-12 pr-6 py-3.5 bg-[var(--color-card)] border border-[var(--color-border-subtle)] rounded-xl text-xs font-bold uppercase tracking-widest text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)]/40 transition-all placeholder:text-[var(--color-text-muted)]"
                        />
                    </div>
                    <button onClick={() => triggerFeedback("Filtres avancés en cours d'intégration")} className="btn-secondary h-[46px] w-[46px] p-0 flex items-center justify-center">
                        <Filter size={18} />
                    </button>
                    <button onClick={() => triggerFeedback("Exportation PDF générée (simulation)")} className="btn-primary h-[46px]">
                        <Download size={18} />
                        Exporter
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {actionFeedback && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-6 right-6 z-50 bg-[#00F5FF]/10 border border-[#00F5FF]/30 text-[#00F5FF] px-6 py-3 rounded-xl shadow-[0_0_20px_rgba(0,245,255,0.2)] text-xs font-bold tracking-widest uppercase flex items-center gap-3"
                    >
                        {actionFeedback}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Performance Stats Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="premium-card p-6 flex flex-col justify-between space-y-4">
                    <div className="flex justify-between items-start">
                        <div className="p-2.5 rounded-xl bg-[var(--color-card)] border border-[var(--color-border-subtle)] text-[var(--color-accent)]">
                            <Star size={18} fill="currentColor" className="text-[var(--color-accent)]/40" />
                        </div>
                        <span className="card-title">Score de Maîtrise</span>
                    </div>
                    <div>
                        <div className="primary-value">7.8/10</div>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="h-1 flex-1 bg-[var(--color-card)] rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-400 w-[78%]" />
                            </div>
                            <span className="text-[10px] font-bold text-emerald-400 font-mono tracking-tighter">+12%</span>
                        </div>
                    </div>
                </div>

                <div className="premium-card p-6 flex flex-col justify-between space-y-4">
                    <div className="flex justify-between items-start">
                        <div className="p-2.5 rounded-xl bg-[var(--color-card)] border border-[var(--color-border-subtle)] text-[var(--color-text-secondary)]">
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
                        <div className="p-2.5 rounded-xl bg-[var(--color-card)] border border-[var(--color-border-subtle)] text-[var(--color-text-secondary)]">
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
                                            <span className="text-[var(--color-text-primary)] font-semibold">
                                                {lesson.date}
                                            </span>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-[0.2em] group-hover:text-[var(--color-accent)] transition-colors">{lesson.id}</span>
                                                <div className="w-1 h-1 rounded-full bg-white/10" />
                                                <span className="text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">{lesson.time}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-[var(--color-card)] border border-[var(--color-border-subtle)] flex items-center justify-center text-[10px] font-black text-[var(--color-text-muted)] group-hover:bg-[var(--color-accent)]/10 group-hover:text-[var(--color-accent)] transition-all">
                                                {lesson.moniteur.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <span className="text-sm font-medium text-[var(--color-text-muted)]">{lesson.moniteur}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="p-1.5 rounded-lg bg-[var(--color-card)] border border-[var(--color-border-subtle)] text-[var(--color-text-muted)]">
                                                <Car size={14} />
                                            </div>
                                            <span className="text-xs font-semibold text-[var(--color-text-muted)] group-hover:text-[var(--color-text-primary)] transition-colors">{lesson.vehicule}</span>
                                        </div>
                                    </td>
                                    <td>
                                        {lesson.score ? (
                                            <div className="flex flex-col gap-1.5 min-w-[120px]">
                                                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                                                    <span className="text-[var(--color-text-muted)]">Maîtrise Globale</span>
                                                    <span className="text-emerald-400 font-mono">{lesson.score}</span>
                                                </div>
                                                <div className="h-1 w-full bg-[var(--color-card)] rounded-full overflow-hidden">
                                                    <div className="h-full bg-emerald-400 opacity-60 rounded-full" style={{ width: `${(parseInt(lesson.score) / 20) * 100}%` }} />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
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
                                        <button onClick={() => setSelectedLesson(lesson)} className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
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
            <div className="premium-card p-10 bg-[radial-gradient(circle_at_0%_0%,rgba(0,245,255,0.03)_0%,transparent_50%)] border-[var(--color-accent)]/10 shadow-[0_0_30px_rgba(0,245,255,0.02)] flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-8 text-center md:text-left">
                    <div className="w-20 h-20 rounded-[2rem] bg-[var(--color-accent)]/5 border border-[var(--color-accent)]/10 flex items-center justify-center text-[var(--color-accent)] shadow-[0_0_20px_rgba(0,245,255,0.2)]">
                        <Zap size={36} fill="currentColor" className="animate-pulse" />
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 justify-center md:justify-start">
                            <h3 className="section-title">Analyse AutoDrive AI™</h3>
                            <div className="px-2 py-0.5 rounded bg-[var(--color-card)] border border-white/10 text-[8px] font-black text-[var(--color-text-primary)]/40 uppercase tracking-widest">PRO</div>
                        </div>
                        <p className="secondary-info max-w-lg leading-relaxed">
                            Sur la base de vos 2 dernières sessions, nous recommandons de focaliser votre prochain entrainement sur les <span className="text-[var(--color-accent)] font-semibold italic">contrôles d'angle mort lors des insertions rapides</span>. Votre note de confiance a augmenté de 15%.
                        </p>
                    </div>
                </div>
                <button onClick={() => setIaReportModal(true)} className="btn-secondary py-4 px-8 border-[var(--color-accent)]/20 text-[var(--color-accent)] hover:bg-[var(--color-accent)]/5 uppercase text-[10px] font-black tracking-[0.2em]">
                    Voir Rapport IA Complet
                </button>
            </div>

            {/* Modal Détails Leçon */}
            <AnimatePresence>
                {selectedLesson && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedLesson(null)}
                            className="absolute inset-0 bg-[#0B0F14]/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg premium-card overflow-hidden flex flex-col"
                        >
                            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[var(--color-card)]">
                                <h3 className="text-lg font-black text-white uppercase tracking-wider">Mission <span className="text-[var(--color-accent)]">{selectedLesson.id}</span></h3>
                                <button onClick={() => setSelectedLesson(null)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[var(--color-text-muted)] hover:text-white transition-colors">
                                    <X size={16} />
                                </button>
                            </div>
                            <div className="p-8 space-y-8 bg-[var(--color-background)]">
                                <div className="flex flex-col sm:flex-row justify-between gap-6">
                                    <div>
                                        <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-1">Date</p>
                                        <p className="text-lg font-semibold text-white">{selectedLesson.date}</p>
                                        <p className="text-sm font-medium text-[var(--color-text-secondary)] mt-0.5">{selectedLesson.time}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-1">Formateur</p>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-[var(--color-card)] border border-[var(--color-border-subtle)] flex items-center justify-center text-xs font-black">
                                                {selectedLesson.moniteur.charAt(0)}
                                            </div>
                                            <p className="text-base font-semibold text-white">{selectedLesson.moniteur}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl bg-[var(--color-sidebar)] border border-white/5">
                                        <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-1">Véhicule</p>
                                        <p className="text-sm font-semibold text-white">{selectedLesson.vehicule}</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-[var(--color-sidebar)] border border-white/5">
                                        <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-1">Évaluation</p>
                                        <p className={`text-sm font-semibold ${selectedLesson.score ? 'text-emerald-400' : 'text-amber-400'}`}>{selectedLesson.score || 'En attente'}</p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedLesson(null)} className="btn-primary w-full justify-center">
                                    Fermer
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Modal IA Report */}
            <AnimatePresence>
                {iaReportModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIaReportModal(false)}
                            className="absolute inset-0 bg-[#0B0F14]/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-xl premium-card overflow-hidden flex flex-col"
                        >
                            <div className="p-6 border-b border-[var(--color-border-subtle)] flex items-center justify-between bg-gradient-to-r from-[var(--color-accent)]/10 to-transparent">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-[var(--color-accent)]/20 text-[var(--color-accent)]">
                                        <Zap size={20} fill="currentColor" />
                                    </div>
                                    <h3 className="text-lg font-black text-white uppercase tracking-wider">Rapport Cognitif IA</h3>
                                </div>
                                <button onClick={() => setIaReportModal(false)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[var(--color-text-muted)] hover:text-white transition-colors">
                                    <X size={16} />
                                </button>
                            </div>
                            <div className="p-8 space-y-6">
                                <p className="text-sm font-medium leading-relaxed text-[var(--color-text-secondary)]">L'analyse heuristique des deux dernières missions indique une <strong className="text-emerald-400">amélioration de 15%</strong> de la vélocité sur les manœuvres de précision urbaine. La prise de décision aux intersections complexes est stable.</p>

                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-2 text-white">
                                            <span>Contrôles Dynamiques</span>
                                            <span className="text-[var(--color-accent)]">85%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-[var(--color-accent)] w-[85%] shadow-[0_0_10px_rgba(0,245,255,0.4)]" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-2 text-white">
                                            <span>Fluidité Trajectoire</span>
                                            <span className="text-emerald-400">92%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-400 w-[92%]" />
                                        </div>
                                    </div>
                                </div>

                                <button onClick={() => setIaReportModal(false)} className="btn-primary w-full justify-center">
                                    Terminer
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
