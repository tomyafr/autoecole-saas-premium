'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ClipboardCheck,
    Star,
    TrendingUp,
    FileText,
    Search,
    Filter,
    ArrowUpRight,
    Trophy,
    Target,
    Zap,
    History,
    ChevronRight,
    Plus,
    X,
    User,
    CheckCircle2
} from 'lucide-react';

/* ======= DATA ======= */
const RECENT_EVALS = [
    { id: 1, student: 'Lucas Bernard', date: 'Aujourd\'hui', score: 8.8, comment: 'Excellente maîtrise du gabarit en milieu urbain. Vigilance accrue.', category: 'Conduite Urbaine' },
    { id: 2, student: 'Emma Petit', date: 'Hier', score: 7.2, comment: 'Gestion du stress lors des insertions sur voie rapide à améliorer.', category: 'Autoroute' },
    { id: 3, student: 'Hugo Roux', date: 'Il y a 2j', score: 9.5, comment: 'Prêt pour l\'examen final. Niveau de sérénité optimal.', category: 'Examen Blanc' },
    { id: 4, student: 'Chloé Moreau', date: 'Il y a 3j', score: 6.5, comment: 'Difficultés persistsantes sur les angles morts et les priorités.', category: 'Intersection' },
];

export default function MoniteurEvaluationsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedReport, setSelectedReport] = useState<any>(null);
    const [actionFeedback, setActionFeedback] = useState<string | null>(null);

    const triggerFeedback = (msg: string) => {
        setActionFeedback(msg);
        setTimeout(() => setActionFeedback(null), 3000);
    };

    return (
        <div className="space-y-10 group/evals">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                <div>
                    <h1 className="page-title">Journal Pédagogique</h1>
                    <p className="text-sm text-[#8A94A6] mt-1 font-medium">Suivi de performance et archivage des évaluations.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => triggerFeedback("L'historique global se synchronise...")} className="btn-secondary">
                        <History size={16} />
                        Historique Global
                    </button>
                    <button onClick={() => triggerFeedback("Création d'un nouvel audit requiert un créneau de planning")} className="btn-primary">
                        <Plus size={16} />
                        Nouvel Audit
                    </button>
                </div>
            </div>

            {/* Tactical Grid Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Audits de la Semaine', value: '28', icon: <ClipboardCheck size={18} />, color: 'text-[#00F5FF]' },
                    { label: 'Moyenne Promotion', value: '7.8/10', icon: <Star size={18} />, color: 'text-amber-400' },
                    { label: 'Progression Moyenne', value: '+12%', icon: <TrendingUp size={18} />, color: 'text-emerald-400' },
                    { label: 'Top Performeurs', value: '8', icon: <Trophy size={18} />, color: 'text-blue-400' },
                ].map((stat, i) => (
                    <div key={i} className="premium-card p-6 flex flex-col justify-between space-y-4">
                        <div className="flex justify-between items-start">
                            <div className={`p-2 rounded-lg bg-white/[0.03] border border-white/5 ${stat.color}`}>
                                {stat.icon}
                            </div>
                            <span className="card-title">{stat.label}</span>
                        </div>
                        <div className="primary-value">{stat.value}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Recent Evals List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="section-title">Activités de Contrôle Récentes</h3>
                        <div className="relative group/search">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5F6B7A] group-focus-within/search:text-[#00F5FF] transition-colors" size={14} />
                            <input
                                type="text"
                                placeholder="Identifier un profil..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 pr-4 py-2 bg-white/[0.02] border border-white/5 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-[#00F5FF]/20 transition-all w-full md:w-64"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        {RECENT_EVALS.map((evalItem, i) => (
                            <motion.div
                                key={evalItem.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="premium-card p-6 group cursor-pointer hover:border-[#00F5FF]/20 transition-all"
                            >
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-[#00F5FF] flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
                                            <span className="text-sm font-black text-black">{evalItem.score}</span>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-3">
                                                <span className="text-base font-bold text-white leading-none">{evalItem.student}</span>
                                                <span className="text-[10px] font-black text-[#8A94A6] uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded border border-white/5">{evalItem.category}</span>
                                            </div>
                                            <p className="text-xs text-[#5F6B7A] font-medium leading-relaxed max-w-lg">
                                                {evalItem.comment}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-3 min-w-[120px]">
                                        <span className="text-[10px] font-bold text-[#5F6B7A] uppercase tracking-widest">{evalItem.date}</span>
                                        <button onClick={(e) => { e.stopPropagation(); setSelectedReport(evalItem); }} className="flex items-center gap-2 text-[10px] font-black text-[#00F5FF] uppercase tracking-widest hover:translate-x-1 transition-transform">
                                            Rapport Full
                                            <ChevronRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Right Rail: Pedagogical Insights */}
                <div className="space-y-6">
                    <div className="premium-card p-8 bg-gradient-to-br from-[#00F5FF]/10 to-transparent border-[#00F5FF]/10">
                        <div className="flex items-center gap-3 mb-6">
                            <Target size={20} className="text-[#00F5FF]" />
                            <h3 className="section-title">Objectifs du Mois</h3>
                        </div>
                        <div className="space-y-6">
                            {[
                                { label: 'Audit Sécurité Urbaine', progress: 85 },
                                { label: 'Certification Autoroute', progress: 62 },
                                { label: 'Validation Manœuvres', progress: 41 },
                            ].map((goal, i) => (
                                <div key={i} className="space-y-2.5">
                                    <div className="flex justify-between items-center text-[10px] font-black text-[#8A94A6] uppercase tracking-widest">
                                        <span>{goal.label}</span>
                                        <span className="text-white">{goal.progress}%</span>
                                    </div>
                                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-[#00F5FF] shadow-[0_0_10px_rgba(0,245,255,0.5)]" style={{ width: `${goal.progress}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="premium-card p-8 space-y-6">
                        <div className="flex items-center gap-3">
                            <Zap size={20} className="text-amber-400" />
                            <h3 className="section-title">Vigilance Requise</h3>
                        </div>
                        <div className="space-y-4">
                            {[
                                { name: 'Chloé Moreau', reason: 'Retard sur module Intersection' },
                                { name: 'Emma Petit', reason: 'Stress Autoroute critique' },
                            ].map((v, i) => (
                                <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 group hover:bg-white/[0.04] transition-colors cursor-pointer">
                                    <span className="text-xs font-bold text-white">{v.name}</span>
                                    <p className="text-[10px] text-red-400 font-bold uppercase tracking-tight mt-1">{v.reason}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Rapport Complet */}
            <AnimatePresence>
                {selectedReport && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedReport(null)}
                            className="absolute inset-0 bg-[#0B0F14]/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl premium-card overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="p-6 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[var(--color-card)] z-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-[#00F5FF]/10 text-[#00F5FF] flex items-center justify-center">
                                        <FileText size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-white uppercase tracking-tighter">Rapport Pédagogique</h3>
                                        <p className="text-sm font-medium text-[#8A94A6]">{selectedReport.category} — {selectedReport.date}</p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedReport(null)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#8A94A6] hover:text-white transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-8 overflow-y-auto w-full flex-1 space-y-8">
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex-1 premium-card p-6 bg-white/[0.02]">
                                        <h4 className="text-[10px] font-black text-[#5F6B7A] uppercase tracking-[0.2em] mb-4">Profil Évalué</h4>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#8A94A6]">
                                                <User size={20} />
                                            </div>
                                            <div>
                                                <p className="text-lg font-bold text-white">{selectedReport.student}</p>
                                                <p className="text-[10px] text-[#5F6B7A] uppercase font-bold tracking-widest mt-1">Élève Conducteur/trice</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="premium-card p-6 bg-gradient-to-br from-[#00F5FF]/10 to-transparent flex flex-col justify-center items-center md:min-w-[160px]">
                                        <h4 className="text-[10px] font-black text-[#8A94A6] uppercase tracking-[0.2em] mb-2">Note Globale</h4>
                                        <div className="text-4xl font-black text-white">{selectedReport.score}</div>
                                        <div className="text-[10px] uppercase font-bold text-[#00F5FF] mt-1 tracking-widest">Sur 10</div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-[#5F6B7A] uppercase tracking-[0.2em]">Observations du Formateur</h4>
                                    <div className="p-5 rounded-xl border border-white/5 bg-white/[0.02] text-sm text-[#8A94A6] leading-relaxed">
                                        <p>{selectedReport.comment}</p>
                                        <p className="mt-4 italic">Note : Ce rapport est automatiquement synchronisé dans le livret d'apprentissage de l'élève.</p>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/5 flex gap-4">
                                    <button className="flex-1 btn-primary" onClick={() => setSelectedReport(null)}>
                                        Fermer et Archiver
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ACTION FEEDBACK TOAST */}
            <AnimatePresence>
                {actionFeedback && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl bg-[#0B0F14] border border-[var(--color-border-subtle)] shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
                    >
                        <div className="w-8 h-8 rounded-full bg-[var(--color-accent)]/10 flex items-center justify-center text-[var(--color-accent)]">
                            <CheckCircle2 size={16} />
                        </div>
                        <p className="text-sm font-medium text-[var(--color-text-primary)]">{actionFeedback}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
