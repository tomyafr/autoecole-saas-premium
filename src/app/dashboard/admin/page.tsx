'use client';

import { motion } from 'framer-motion';
import {
    BarChart3,
    Building2,
    Users,
    TrendingUp,
    Activity,
    ArrowUpRight,
    ChevronRight,
    CreditCard,
    Zap,
    Hexagon,
    Target
} from 'lucide-react';

export default function AdminDashboard() {
    const stats = [
        { label: 'Chiffre d\'Affaires', value: '42,850€', sub: '+12.5% vs mois dernier', icon: <CreditCard size={18} />, color: 'text-emerald-400' },
        { label: 'Nouveaux Élèves', value: '128', sub: 'Semaine en cours', icon: <Users size={18} />, color: 'text-[#00F5FF]' },
        { label: 'Taux de Réussite', value: '89.2%', sub: 'Permis B - 30j', icon: <TrendingUp size={18} />, color: 'text-blue-400' },
        { label: 'Centres Actifs', value: '4', sub: 'Île-de-France', icon: <Building2 size={18} />, color: 'text-amber-400' },
    ];

    const centers = [
        { name: 'Paris - République', students: 245, moniteurs: 12, revenue: '12,400€' },
        { name: 'Versailles - Rive Gauche', students: 112, moniteurs: 6, revenue: '6,200€' },
        { name: 'Nanterre - Université', students: 180, moniteurs: 8, revenue: '9,800€' },
        { name: 'Boulogne - Centre', students: 156, moniteurs: 7, revenue: '8,500€' },
    ];

    return (
        <div className="space-y-10">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                <div>
                    <h1 className="page-title">Executive Overview</h1>
                    <p className="text-sm text-[#8A94A6] mt-1 font-medium">Analyse globale de la performance du réseau AutoDrive.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="btn-secondary">
                        <Activity size={16} />
                        Flux système
                    </button>
                    <button className="btn-primary">
                        <Hexagon size={16} />
                        Nouveau centre
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
                            <div className="flex items-center gap-1.5 mt-2">
                                <span className={`text-[10px] font-bold font-mono ${stat.color}`}>{stat.sub}</span>
                                <ArrowUpRight size={10} className={stat.color} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Visual Analytics */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="premium-card p-8 bg-[radial-gradient(circle_at_bottom_right,_rgba(0,245,255,0.02)_0%,_transparent_50%)]">
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-500/5 rounded-2xl border border-blue-500/10 text-blue-400">
                                    <BarChart3 size={22} />
                                </div>
                                <div>
                                    <h3 className="section-title">Croissance Réseau</h3>
                                    <p className="secondary-info">Performance cumulative du CA mensuel</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {['30J', '90J', '12M'].map((period, idx) => (
                                    <button key={idx} className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${idx === 2 ? 'bg-white/5 border-white/10 text-white' : 'border-transparent text-[#5F6B7A] hover:text-white'}`}>
                                        {period}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="h-48 mt-12 flex items-end justify-between gap-4">
                            {[40, 65, 45, 90, 75, 100, 85, 95].map((h, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-4 group cursor-pointer">
                                    <div className="w-full relative">
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: `${h}%` }}
                                            transition={{ duration: 1, delay: i * 0.05 }}
                                            className="w-full bg-gradient-to-t from-blue-600/40 to-[#00F5FF]/60 rounded-t-lg group-hover:from-blue-600 group-hover:to-[#00F5FF] transition-all duration-300 shadow-[0_0_15px_rgba(0,245,255,0.05)] group-hover:shadow-[0_0_20px_rgba(0,245,255,0.2)]"
                                        />
                                    </div>
                                    <span className="text-[9px] font-black text-[#5F6B7A] uppercase tracking-tighter group-hover:text-white transition-colors">Oct {i + 1}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="premium-card overflow-hidden">
                        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
                            <h3 className="section-title">Contrôle des Centres</h3>
                            <button className="text-[10px] font-black text-[#00F5FF] hover:underline uppercase tracking-wider">Audit Global</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="premium-table">
                                <thead>
                                    <tr>
                                        <th>CENTRE LOGISTIQUE</th>
                                        <th>DENSITÉ ÉLÈVES</th>
                                        <th>EFFECTIF STAFF</th>
                                        <th>PERFORMANCE REVENU</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {centers.map((center, idx) => (
                                        <tr key={idx} className="group">
                                            <td className="font-semibold text-white group-hover:text-[#00F5FF] transition-colors">{center.name}</td>
                                            <td className="font-medium text-[#8A94A6]">{center.students} actifs</td>
                                            <td className="font-medium text-[#8A94A6]">{center.moniteurs} moniteurs</td>
                                            <td className="font-bold text-emerald-400 font-mono tracking-tighter">{center.revenue}</td>
                                            <td className="text-right">
                                                <button className="p-2 text-[#5F6B7A] hover:text-white transition-colors">
                                                    <ChevronRight size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Rail Insights */}
                <div className="space-y-6">
                    <div className="premium-card p-6 border-l-4 border-l-amber-500 shadow-[0_0_40px_rgba(245,158,11,0.02)]">
                        <div className="flex items-center gap-2.5 mb-8">
                            <Activity size={14} className="text-amber-500" />
                            <h3 className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.2em]">Flux d'Activité</h3>
                        </div>
                        <div className="space-y-6">
                            {[
                                { action: "Nouveau centre - Boulogne", time: "2h", status: "Terminé" },
                                { action: "Mise à jour tarifs 2026", time: "4h", status: "Terminé" },
                                { action: "Maintenance infrastructure", time: "12h", status: "En cours" }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 items-start group">
                                    <div className="w-1.5 h-1.5 rounded-full bg-white/10 mt-1.5 shrink-0 group-hover:bg-[#00F5FF] transition-colors" />
                                    <div>
                                        <p className="text-xs text-white font-medium">{item.action}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[9px] text-[#5F6B7A] uppercase font-bold tracking-widest">{item.time} AGO</span>
                                            <div className="w-1 h-1 rounded-full bg-white/5" />
                                            <span className="text-[9px] text-[#5F6B7A] uppercase font-bold tracking-widest">{item.status}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="premium-card p-6">
                        <h3 className="card-title mb-8">Top formateurs rattachés</h3>
                        <div className="space-y-4">
                            {[
                                { name: "Marc Dupont", score: "9.8/10", sessions: 142 },
                                { name: "Sophie Martin", score: "9.6/10", sessions: 128 }
                            ].map((m, i) => (
                                <div key={i} className="flex items-center justify-between p-3.5 rounded-xl hover:bg-white/5 transition-all group border border-transparent hover:border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs font-black text-[#8A94A6] group-hover:text-white transition-colors">
                                            {m.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-semibold text-white group-hover:text-[#00F5FF] transition-colors">{m.name}</span>
                                            <span className="text-[9px] text-[#5F6B7A] uppercase font-bold tracking-widest">{m.sessions} missions</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-emerald-400 font-mono tracking-tighter">{m.score}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#5F6B7A] hover:text-white transition-colors">
                            Voir tout l'effectif
                        </button>
                    </div>

                    <div className="p-6 rounded-2xl bg-[#00F5FF]/[0.02] border border-[#00F5FF]/10 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#00F5FF]/10 flex items-center justify-center text-[#00F5FF]">
                            <Target size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-white uppercase tracking-wider">Objectif Trimestriel</p>
                            <div className="h-1 w-32 bg-white/5 rounded-full mt-2 overflow-hidden">
                                <div className="h-full bg-[#00F5FF] w-[75%]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
