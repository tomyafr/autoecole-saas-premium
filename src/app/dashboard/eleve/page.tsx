'use client';

import { motion } from 'framer-motion';
import {
    Calendar,
    Star,
    CreditCard,
    ArrowUpRight,
    Play,
    Zap,
    Timer,
    Target,
    Hexagon
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getUser, type User } from '@/lib/auth';

export default function EleveDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
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

    const stats = [
        { label: 'Heures effectuées', value: '24/35h', sub: 'Formation à 68%', icon: <Timer size={18} />, color: 'text-[#00F5FF]' },
        { label: 'Prochaine leçon', value: '12 Fév', sub: '11:00 — Examen blanc', icon: <Calendar size={18} />, color: 'text-blue-400' },
        { label: 'Maîtrise estimée', value: '7.8/10', sub: 'Élite Performance', icon: <Star size={18} />, color: 'text-emerald-400' },
        { label: 'Solde restant', value: '11h', sub: 'Pack Sérénité', icon: <CreditCard size={18} />, color: 'text-amber-400' },
    ];

    return (
        <div className="space-y-10 group/dashboard">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                <div>
                    <h1 className="page-title">Tableau de bord</h1>
                    <p className="text-sm text-[#8A94A6] mt-1 font-medium">Bon retour parmi nous, Lucas. Voici votre progression en temps réel.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.push('/dashboard/eleve/lecons')}
                        className="btn-secondary"
                    >
                        <Hexagon size={16} />
                        Rapport complet
                    </button>
                    <button
                        onClick={() => router.push('/dashboard/eleve/reservation')}
                        className="btn-primary"
                    >
                        Nouvelle session
                    </button>
                </div>
            </div>

            {/* Tactical Grid Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div
                        key={i}
                        className="premium-card p-6 flex flex-col justify-between space-y-4 min-h-[160px]"
                    >
                        <div className="flex justify-between items-start">
                            <div className={`p-2.5 rounded-xl bg-white/[0.03] border border-white/5 ${stat.color}`}>
                                {stat.icon}
                            </div>
                            <span className="card-title">{stat.label}</span>
                        </div>
                        <div>
                            <div className="primary-value">{stat.value}</div>
                            <p className="secondary-info mt-1 font-medium">{stat.sub}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Visual Training Arc */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="premium-card p-8">
                        <div className="flex justify-between items-center mb-10">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-[#00F5FF]/5 rounded-2xl border border-[#00F5FF]/10 text-[#00F5FF]">
                                    <Target size={22} />
                                </div>
                                <div>
                                    <h3 className="section-title">Objectifs de formation</h3>
                                    <p className="secondary-info">Analyse granulaire de vos compétences techniques</p>
                                </div>
                            </div>
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-2xl font-semibold text-white">68</span>
                                <span className="text-xs font-bold text-[#5F6B7A] uppercase">%</span>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden flex">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '68%' }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-[#00F5FF]/40 to-[#00F5FF] rounded-full shadow-[0_0_15px_rgba(0,245,255,0.4)]"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8 pt-4">
                                {[
                                    { label: 'Démarrage & Embrayage', status: 'Expertise acquise' },
                                    { label: 'Contrôle en milieu urbain', status: 'En cours d\'acquisition' },
                                    { label: 'Manoeuvres & Stationnement', status: 'Perfectionnement' },
                                    { label: 'Circulation voies rapides', status: 'Phase initiale' }
                                ].map((step, idx) => (
                                    <div key={idx} className="flex items-center gap-4 group/item">
                                        <div className="w-2 h-2 rounded-full bg-white/10 group-hover/item:bg-[#00F5FF] transition-colors duration-300" />
                                        <div>
                                            <p className="text-sm font-medium text-white group-hover/item:text-[#00F5FF] transition-colors">{step.label}</p>
                                            <p className="text-[10px] text-[#5F6B7A] uppercase font-bold tracking-wider mt-1">{step.status}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="premium-card overflow-hidden">
                        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
                            <h3 className="section-title">Dernières missions</h3>
                            <button
                                onClick={() => router.push('/dashboard/eleve/lecons')}
                                className="text-xs font-bold text-[#00F5FF] hover:underline uppercase tracking-wider"
                            >
                                Archives
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="premium-table">
                                <thead>
                                    <tr>
                                        <th>Date / Mission</th>
                                        <th>Formateur</th>
                                        <th>Maîtrise</th>
                                        <th>Statut</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="group">
                                        <td>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-white">10 Fév 2026</span>
                                                <span className="text-[10px] text-[#5F6B7A] uppercase font-bold tracking-widest mt-1 group-hover:text-[#00F5FF] transition-colors">CONDUITE_REPUBLIQUE</span>
                                            </div>
                                        </td>
                                        <td className="font-medium">Marc Dupont</td>
                                        <td className="font-semibold text-emerald-400">18/20</td>
                                        <td><span className="status-badge status-badge-cyan">Opérationnel</span></td>
                                    </tr>
                                    <tr className="group">
                                        <td>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-white">08 Fév 2026</span>
                                                <span className="text-[10px] text-[#5F6B7A] uppercase font-bold tracking-widest mt-1 group-hover:text-[#00F5FF] transition-colors">PARKING_STUDIO</span>
                                            </div>
                                        </td>
                                        <td className="font-medium">Sophie Martin</td>
                                        <td className="font-semibold text-emerald-400">15/20</td>
                                        <td><span className="status-badge status-badge-cyan">Opérationnel</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Rail Context */}
                <div className="space-y-6">
                    <div className="premium-card p-6 border-l-4 border-l-[#00F5FF] shadow-[0_0_40px_rgba(0,245,255,0.02)]">
                        <div className="flex items-center gap-2.5 mb-8">
                            <Play size={14} className="text-[#00F5FF] fill-[#00F5FF]" />
                            <h3 className="text-[10px] font-bold text-[#00F5FF] uppercase tracking-[0.2em]">Priorité actuelle</h3>
                        </div>
                        <div className="space-y-8">
                            <div>
                                <p className="text-3xl font-semibold text-white">12 Fév</p>
                                <p className="secondary-info mt-1.5 font-medium">Demain à 11:00 — Examen Blanc N°1</p>
                            </div>
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs font-black text-[#8A94A6]">SM</div>
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-white truncate">Sophie Martin</p>
                                    <p className="text-[10px] text-[#5F6B7A] uppercase font-bold tracking-widest mt-0.5">Examinatrice Senior</p>
                                </div>
                            </div>
                            <button
                                onClick={() => router.push('/dashboard/eleve/lecons')}
                                className="w-full btn-primary"
                            >
                                Détails de la mission
                                <ArrowUpRight size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="premium-card p-6">
                        <h3 className="card-title mb-6">Centre de ressources</h3>
                        <div className="space-y-2">
                            {['Règlementation Autoroute', 'Les contrôles visuels', 'Mécanique & Sécurité'].map((item, i) => (
                                <button key={i} className="w-full flex items-center justify-between p-3.5 rounded-xl hover:bg-white/5 transition-all text-xs font-medium text-[#8A94A6] hover:text-white group border border-transparent hover:border-white/5">
                                    <span>{item}</span>
                                    <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#00F5FF]" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-[#00F5FF]/[0.02] border border-[#00F5FF]/10 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#00F5FF]/10 flex items-center justify-center text-[#00F5FF]">
                            <Zap size={20} fill="currentColor" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-white uppercase tracking-wider italic">Mode Booster</p>
                            <p className="text-[10px] text-[#5F6B7A] font-medium leading-relaxed mt-1">
                                Vos 4 prochaines heures sont accélérées. Focus sur l'examen blanc.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
