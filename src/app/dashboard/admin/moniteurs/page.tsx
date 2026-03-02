'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Target, Shield, ArrowUpRight, Lock, MapPin, Briefcase } from 'lucide-react';
import { useRouter } from 'next/navigation';

const currentYear = new Date().getFullYear();
const INSTRUCTORS = [
    { id: 1, name: 'Marc Dupont', email: 'm.dupont@autodrive.pro', status: 'Actif', students: 24, hours: 32, center: 'Paris - République', joined: '05 Nov 2023', score: '9.8' },
    { id: 2, name: 'Sophie Martin', email: 's.martin@autodrive.pro', status: 'Actif', students: 18, hours: 28, center: 'Paris - République', joined: '20 Déc 2023', score: '9.6' },
    { id: 3, name: 'Julien Morel', email: 'j.morel@autodrive.pro', status: 'Repos', students: 12, hours: 0, center: 'Versailles', joined: `12 Jan ${currentYear}`, score: '8.9' },
    { id: 4, name: 'Emma Leroux', email: 'e.leroux@autodrive.pro', status: 'Actif', students: 29, hours: 35, center: 'Nanterre', joined: `15 Fév ${currentYear}`, score: '9.2' },
];

export default function AdminMoniteursPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-white/5">
                <div>
                    <h1 className="page-title">Équipe Pédagogique</h1>
                    <p className="text-sm text-[#8A94A6] mt-1 font-medium">Gestion et supervision des formateurs du réseau.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="btn-primary">
                        <Briefcase size={16} />
                        Recruter Formateur
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Formateurs Actifs', value: '42', icon: <Users size={18} />, color: 'text-blue-400' },
                    { label: 'Heures Dispensées', value: '1,240h', icon: <Target size={18} />, color: 'text-emerald-400' },
                    { label: 'Moyenne Évaluations', value: '9.4/10', icon: <ArrowUpRight size={18} />, color: 'text-amber-400' },
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

            <div className="premium-card overflow-hidden">
                <div className="px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-white/5">
                    <h3 className="section-title">Liste des Moniteurs</h3>
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5F6B7A]" size={14} />
                        <input
                            type="text"
                            placeholder="Rechercher un formateur..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-white/[0.02] border border-white/5 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-[#00F5FF]/20 transition-all"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="premium-table">
                        <thead>
                            <tr>
                                <th>IDENTITÉ</th>
                                <th>CENTRE</th>
                                <th>PERFORMANCE</th>
                                <th>ÉLÈVES & HEURES</th>
                                <th>STATUT</th>
                            </tr>
                        </thead>
                        <tbody>
                            {INSTRUCTORS.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase())).map((inst) => (
                                <tr key={inst.id} className="group">
                                    <td>
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-white group-hover:text-[#00F5FF] transition-colors">{inst.name}</span>
                                            <span className="text-[10px] text-[#5F6B7A] font-medium mt-1">{inst.email}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-2 text-[#8A94A6]">
                                            <MapPin size={12} />
                                            <span className="text-xs font-medium">{inst.center}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="text-sm font-bold text-emerald-400 font-mono tracking-tighter">{inst.score}</span>
                                        <span className="text-[10px] text-[#5F6B7A] uppercase ml-1">/10</span>
                                    </td>
                                    <td>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-medium text-white">{inst.students} élèves actifs</span>
                                            <span className="text-[10px] text-[#5F6B7A] uppercase mt-0.5">{inst.hours}h / semaine</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${inst.status === 'Actif' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-[#5F6B7A]'}`}>
                                            {inst.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
