'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Search,
    Filter,
    MoreHorizontal,
    TrendingUp,
    Clock,
    CheckCircle2,
    Calendar,
    ChevronRight,
    ArrowUpRight,
    GraduationCap,
    Plus,
    FileText
} from 'lucide-react';

/* ======= DATA ======= */
const STUDENTS = [
    { id: 1, name: 'Lucas Bernard', progress: 68, hours: '24/35h', lastSession: 'Hier', status: 'À l\'heure', score: 8.5 },
    { id: 2, name: 'Emma Petit', progress: 42, hours: '15/35h', lastSession: 'Il y a 2j', status: 'En retard', score: 7.2 },
    { id: 3, name: 'Hugo Roux', progress: 95, hours: '33/35h', lastSession: 'Aujourd\'hui', status: 'Prêt examen', score: 9.8 },
    { id: 4, name: 'Chloé Moreau', progress: 12, hours: '4/35h', lastSession: 'Il y a 5j', status: 'Débutant', score: 6.5 },
    { id: 5, name: 'Marc Simon', progress: 55, hours: '19/35h', lastSession: 'Hier', status: 'À l\'heure', score: 8.0 },
];

export default function MoniteurStudentsPage() {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="space-y-10 group/students">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                <div>
                    <h1 className="page-title">Mes Engagements</h1>
                    <p className="text-sm text-[#8A94A6] mt-1 font-medium">Suivi tactique et pilotage de la progression de vos élèves.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="btn-secondary">
                        <FileText size={16} />
                        Exporter Rapport
                    </button>
                    <button className="btn-primary">
                        <Plus size={16} />
                        Inscrire Élève
                    </button>
                </div>
            </div>

            {/* Tactical Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="premium-card p-6 flex flex-col justify-between space-y-4">
                    <div className="flex justify-between items-start">
                        <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-[#00F5FF]">
                            <GraduationCap size={18} />
                        </div>
                        <span className="card-title">Formation Active</span>
                    </div>
                    <div>
                        <div className="primary-value">42 Élèves</div>
                        <p className="secondary-info mt-1 font-medium italic">Sous votre supervision directe</p>
                    </div>
                </div>

                <div className="premium-card p-6 flex flex-col justify-between space-y-4">
                    <div className="flex justify-between items-start">
                        <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-emerald-400">
                            <TrendingUp size={18} />
                        </div>
                        <span className="card-title">Taux de Réussite</span>
                    </div>
                    <div>
                        <div className="primary-value">91.4%</div>
                        <div className="flex items-center gap-1.5 mt-2">
                            <span className="text-[10px] font-bold text-emerald-400 font-mono">+4.2% VS NETWORK</span>
                            <ArrowUpRight size={10} className="text-emerald-400" />
                        </div>
                    </div>
                </div>

                <div className="premium-card p-6 flex flex-col justify-between space-y-4">
                    <div className="flex justify-between items-start">
                        <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-amber-400">
                            <Clock size={18} />
                        </div>
                        <span className="card-title">Charge de Vol</span>
                    </div>
                    <div>
                        <div className="primary-value">148h / Mois</div>
                        <p className="secondary-info mt-1 font-medium">Capacité optimisée à 85%</p>
                    </div>
                </div>
            </div>

            {/* Students Audit Table */}
            <div className="premium-card overflow-hidden">
                <div className="px-8 py-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h3 className="section-title">Audit des Élèves</h3>
                    <div className="flex items-center gap-4">
                        <div className="relative group/search">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5F6B7A] group-focus-within/search:text-[#00F5FF] transition-colors" size={16} />
                            <input
                                type="text"
                                placeholder="Identifier un profil..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 bg-white/[0.02] border border-white/5 rounded-xl text-sm font-medium text-white focus:outline-none focus:border-[#00F5FF]/20 transition-all w-full md:w-64"
                            />
                        </div>
                        <button className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-[#8A94A6] hover:text-white transition-colors">
                            <Filter size={18} />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="premium-table">
                        <thead>
                            <tr>
                                <th>IDENTITÉ / MODULE</th>
                                <th>PROGRESSION FLUX</th>
                                <th>DERNIER CONTACT</th>
                                <th>STATUS TACTIQUE</th>
                                <th>EVAL</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {STUDENTS.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())).map((student) => (
                                <tr key={student.id} className="group cursor-pointer">
                                    <td>
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs font-black text-[#8A94A6] group-hover:text-[#00F5FF] transition-colors">
                                                {student.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-sm font-semibold text-white truncate">{student.name}</span>
                                                <span className="text-[10px] text-[#5F6B7A] font-bold uppercase tracking-widest mt-0.5">{student.hours} validées</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="w-32 space-y-2">
                                            <div className="flex justify-between items-center text-[9px] font-black text-[#5F6B7A] uppercase tracking-tighter">
                                                <span>Flux Global</span>
                                                <span className="text-white">{student.progress}%</span>
                                            </div>
                                            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${student.progress}%` }}
                                                    transition={{ duration: 1, ease: "easeOut" }}
                                                    className="h-full bg-gradient-to-r from-blue-600 to-[#00F5FF]"
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} className="text-[#5F6B7A]" />
                                            <span className="text-xs font-medium text-[#8A94A6]">{student.lastSession}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${student.status === 'En retard' ? 'bg-red-500/10 text-red-400' :
                                                student.status === 'Prêt examen' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                                    'status-badge-gray'
                                            }`}>
                                            {student.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-1.5">
                                            <div className="p-1 rounded bg-white/5">
                                                <TrendingUp size={10} className={student.score >= 8 ? 'text-emerald-400' : 'text-amber-400'} />
                                            </div>
                                            <span className="text-xs font-bold text-white font-mono">{student.score}</span>
                                        </div>
                                    </td>
                                    <td className="text-right">
                                        <button className="w-9 h-9 rounded-lg flex items-center justify-center text-[#5F6B7A] hover:bg-[#00F5FF]/10 hover:text-[#00F5FF] transition-all">
                                            <ChevronRight size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="px-8 py-4 border-t border-white/5 bg-white/[0.01] flex items-center justify-between">
                    <p className="text-[10px] text-[#5F6B7A] font-bold uppercase tracking-widest">Affichage de {STUDENTS.length} profils élites</p>
                    <div className="flex gap-2">
                        <button className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[10px] font-black text-[#5F6B7A] hover:text-white transition-colors">PREC</button>
                        <button className="px-3 py-1.5 rounded-lg bg-[#00F5FF]/10 border border-[#00F5FF]/20 text-[10px] font-black text-[#00F5FF]">SUIV</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
