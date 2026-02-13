'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    MapPin,
    Building2,
    Users,
    Activity,
    TrendingUp,
    Plus,
    Search,
    Filter,
    ArrowUpRight,
    Map,
    ArrowRight,
    MoreVertical,
    CheckCircle2,
    Clock,
    AlertCircle,
    Phone,
    Mail,
    ChevronRight,
    Navigation,
    Home
} from 'lucide-react';

/* ======= DATA ======= */
const CENTRES = [
    { id: 1, name: 'Paris - République', address: '12 Boulevard du Temple, 75011 Paris', students: 450, instructors: 12, status: 'nominal', load: 85 },
    { id: 2, name: 'Versailles', address: '5 Avenue de Saint-Cloud, 78000 Versailles', students: 280, instructors: 8, status: 'nominal', load: 62 },
    { id: 3, name: 'Nanterre', address: '24 Rue de la Liberté, 92000 Nanterre', students: 195, instructors: 5, status: 'maintenance', load: 45 },
    { id: 4, name: 'Lyon Center', address: '10 Place Bellecour, 69002 Lyon', students: 310, instructors: 10, status: 'alerte', load: 92 },
];

export default function AdminCentresPage() {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="space-y-10 group/admin-centres">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                <div>
                    <h1 className="page-title">Nodes Opérationnels</h1>
                    <p className="text-sm text-[#8A94A6] mt-1 font-medium">Administration des centres de formation et déploiement stratégique.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="btn-secondary">
                        <Map size={16} />
                        Vue Map Flux
                    </button>
                    <button className="btn-primary">
                        <Plus size={16} />
                        Déployer Node
                    </button>
                </div>
            </div>

            {/* Tactical Grid Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Nodes Actifs', value: '4 Centres', icon: <Home size={18} />, color: 'text-[#00F5FF]' },
                    { label: 'Empreinte Réseau', value: '3 Villes', icon: <Navigation size={18} />, color: 'text-blue-400' },
                    { label: 'Flux Moyen / Node', value: '71%', icon: <Activity size={18} />, color: 'text-emerald-400' },
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {CENTRES.map((centre, i) => (
                    <motion.div
                        key={centre.id}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="premium-card group cursor-pointer hover:border-[#00F5FF]/20 transition-all p-8"
                    >
                        <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
                            <div className="flex gap-5">
                                <div className={`w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center transition-all group-hover:bg-[#00F5FF]/10 ${centre.status === 'nominal' ? 'text-emerald-400' : 'text-amber-400'}`}>
                                    <Building2 size={24} />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-xl font-black text-white uppercase italic tracking-tight">{centre.name}</h3>
                                    <div className="flex items-center gap-2">
                                        <MapPin size={12} className="text-[#5F6B7A]" />
                                        <span className="text-[10px] font-bold text-[#8A94A6] uppercase tracking-widest">{centre.address}</span>
                                    </div>
                                </div>
                            </div>
                            <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 ${centre.status === 'nominal' ? 'bg-emerald-400/10 border-emerald-400/20 text-emerald-400' :
                                centre.status === 'maintenance' ? 'bg-amber-400/10 border-amber-400/20 text-amber-400' :
                                    'bg-red-400/10 border-red-400/20 text-red-400'
                                }`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${centre.status === 'nominal' ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
                                <span className="text-[9px] font-black uppercase tracking-widest">{centre.status}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mt-10">
                            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                                <span className="text-[9px] font-black text-[#5F6B7A] uppercase tracking-[0.2em]">Effectif Étudiant</span>
                                <div className="flex items-center gap-3">
                                    <Users size={16} className="text-[#00F5FF]" />
                                    <span className="text-lg font-black text-white">{centre.students}</span>
                                </div>
                            </div>
                            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                                <span className="text-[9px] font-black text-[#5F6B7A] uppercase tracking-[0.2em]">Flux de Charge</span>
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between items-center tabular-nums">
                                        <span className="text-lg font-black text-white">{centre.load}%</span>
                                        <TrendingUp size={14} className={centre.load > 80 ? 'text-amber-400' : 'text-emerald-400'} />
                                    </div>
                                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                        <div className={`h-full ${centre.load > 90 ? 'bg-red-500' : 'bg-[#00F5FF]'}`} style={{ width: `${centre.load}%` }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                            <div className="flex gap-4">
                                <button className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-[#5F6B7A] hover:text-white transition-colors">
                                    <Phone size={16} />
                                </button>
                                <button className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-[#5F6B7A] hover:text-white transition-colors">
                                    <Mail size={16} />
                                </button>
                            </div>
                            <button className="flex items-center gap-2 text-[10px] font-black text-[#00F5FF] uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                                Manager Node
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    </motion.div>
                ))}

                {/* Add New Centre Placeholder */}
                <div className="border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center p-12 group cursor-pointer hover:border-[#00F5FF]/20 transition-all">
                    <div className="w-16 h-16 rounded-2xl bg-white/[0.02] flex items-center justify-center text-[#5F6B7A] group-hover:text-[#00F5FF] group-hover:scale-110 transition-all mb-4">
                        <Plus size={32} />
                    </div>
                    <span className="text-xs font-black text-[#5F6B7A] uppercase tracking-widest group-hover:text-white">Ajouter un Node Tactique</span>
                </div>
            </div>
        </div>
    );
}
