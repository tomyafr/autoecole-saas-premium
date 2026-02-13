'use client';

import { motion } from 'framer-motion';
import {
    Activity,
    TrendingUp,
    Users,
    CreditCard,
    ArrowUpRight,
    ArrowDownRight,
    Search,
    Filter,
    Calendar,
    Download,
    Eye,
    Zap,
    Globe,
    ShieldCheck
} from 'lucide-react';

export default function AdminStatsPage() {
    return (
        <div className="space-y-10 group/admin-stats">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                <div>
                    <h1 className="page-title">Système d&#19;Analyse Globale</h1>
                    <p className="text-sm text-[#8A94A6] mt-1 font-medium">Monitoring haute-fidélité des performances et de la santé du réseau.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="btn-secondary">
                        <Download size={16} />
                        Données Brutes (CSV)
                    </button>
                    <button className="btn-primary">
                        <Calendar size={16} />
                        Mars 2026
                    </button>
                </div>
            </div>

            {/* Tactical Grid Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Revenu Mensuel (MRR)', value: '€142,400', sub: '+12.4%', up: true, icon: <CreditCard size={18} />, color: 'text-[#00F5FF]' },
                    { label: 'Taux Acquisition', value: '482', sub: '+8.2%', up: true, icon: <TrendingUp size={18} />, color: 'text-blue-400' },
                    { label: 'Engagement Réseau', value: '94.2%', sub: '-1.4%', up: false, icon: <Activity size={18} />, color: 'text-emerald-400' },
                    { label: 'Uptime Système', value: '99.99%', sub: 'H-FIDELITY', up: true, icon: <ShieldCheck size={18} />, color: 'text-purple-400' },
                ].map((stat, i) => (
                    <div key={i} className="premium-card p-6 flex flex-col justify-between space-y-4">
                        <div className="flex justify-between items-start">
                            <div className={`p-2 rounded-lg bg-white/[0.03] border border-white/5 ${stat.color}`}>
                                {stat.icon}
                            </div>
                            <span className="card-title">{stat.label}</span>
                        </div>
                        <div>
                            <div className="primary-value">{stat.value}</div>
                            <div className="flex items-center gap-1.5 mt-2">
                                <span className={`text-[10px] font-black uppercase tracking-widest ${stat.up ? 'text-emerald-400' : 'text-red-400'}`}>{stat.sub}</span>
                                {stat.up ? <ArrowUpRight size={10} className="text-emerald-400" /> : <ArrowDownRight size={10} className="text-red-400" />}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Advanced Plot 1: Growth */}
                <div className="premium-card p-8 space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <TrendingUp size={20} className="text-[#00F5FF]" />
                            <h3 className="section-title">Projection de Croissance</h3>
                        </div>
                        <div className="flex bg-white/5 p-1 rounded-xl">
                            <button className="px-3 py-1.5 rounded-lg bg-[#00F5FF] text-black text-[10px] font-black uppercase tracking-widest">Flux</button>
                            <button className="px-3 py-1.5 rounded-lg text-[#5F6B7A] text-[10px] font-black uppercase tracking-widest hover:text-white">Audit</button>
                        </div>
                    </div>

                    <div className="h-64 flex items-end justify-between gap-2">
                        {[40, 65, 45, 80, 55, 90, 75, 85, 60, 95, 80, 100].map((h, i) => (
                            <div key={i} className="flex-1 group relative flex flex-col items-center justify-end h-full">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ duration: 1, delay: i * 0.05 }}
                                    className={`w-full rounded-t-lg transition-all duration-300 ${i === 11 ? 'bg-[#00F5FF] shadow-[0_0_20px_rgba(0,245,255,0.4)]' : 'bg-white/5 group-hover:bg-white/10'}`}
                                />
                                <span className={`text-[8px] font-black mt-3 uppercase tracking-tighter ${i % 2 === 0 ? 'text-[#5F6B7A]' : 'hidden'}`}>M{i + 1}</span>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-3 gap-6 pt-4 border-t border-white/5">
                        {[
                            { label: 'Visibilité', val: '0.82ms' },
                            { label: 'Précision', val: '98.5%' },
                            { label: 'SLA', val: 'Tier 1' },
                        ].map((d, i) => (
                            <div key={i} className="flex flex-col gap-1">
                                <span className="text-[9px] font-black text-[#5F6B7A] uppercase tracking-widest">{d.label}</span>
                                <span className="text-sm font-bold text-white uppercase">{d.val}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Advanced List: Critical Monitoring */}
                <div className="premium-card p-8 space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Eye size={20} className="text-blue-400" />
                            <h3 className="section-title">Segments en Observation</h3>
                        </div>
                        <button className="text-[10px] font-black text-[#00F5FF] uppercase tracking-widest border-b border-[#00F5FF]/20 pb-0.5">Audit Full</button>
                    </div>

                    <div className="space-y-4">
                        {[
                            { name: 'Région Paris-HQ', state: 'Stable', load: 88, health: 'Optimisé' },
                            { name: 'Cluster Sud-East', state: 'Alerte', load: 94, health: 'Saturé' },
                            { name: 'Node Versailles', state: 'Stable', load: 42, health: 'Nominal' },
                            { name: 'Cloud Provider D', state: 'Latence', load: 12, health: 'Lent' },
                        ].map((seg, i) => (
                            <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:bg-white/[0.04] transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`w-2 h-2 rounded-full ${seg.state === 'Stable' ? 'bg-emerald-400' : seg.state === 'Alerte' ? 'bg-red-500' : 'bg-amber-400'}`} />
                                    <div>
                                        <div className="text-xs font-bold text-white">{seg.name}</div>
                                        <div className="text-[9px] font-black text-[#5F6B7A] uppercase tracking-widest mt-0.5">{seg.health}</div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] font-black text-white tabular-nums">{seg.load}%</span>
                                    <div className="w-16 h-1 bg-white/5 rounded-full mt-1 overflow-hidden">
                                        <div className={`h-full ${seg.load > 90 ? 'bg-red-500' : 'bg-blue-400'}`} style={{ width: `${seg.load}%` }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 rounded-xl bg-blue-600/10 border border-blue-600/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-600/10 text-blue-400">
                                <Zap size={14} />
                            </div>
                            <p className="text-[10px] font-bold text-blue-100 uppercase tracking-tight">Intelligence Artificielle en Observation active sur les segments instables.</p>
                        </div>
                        <button className="whitespace-nowrap px-4 py-2 rounded-lg bg-blue-600/20 text-blue-400 text-[9px] font-black uppercase tracking-widest">Détails IA</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
