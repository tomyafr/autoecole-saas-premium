'use client';

import { useState } from 'react';
import { Users, GraduationCap, Search, FileText, Calendar, CheckSquare } from 'lucide-react';

const STUDENTS = [
    { id: 1, name: 'Lucas Bernard', moniteur: 'Marc Dupont', date: 'Aujourd\'hui', hours: 24, hoursTotal: 35, status: 'En formation', center: 'Paris - République' },
    { id: 2, name: 'Emma Leroux', moniteur: 'Sophie Martin', date: 'Hier', hours: 32, hoursTotal: 35, status: 'Prêt examen', center: 'Nanterre' },
    { id: 3, name: 'Hugo Roux', moniteur: 'Julien Morel', date: 'Il y a 2j', hours: 8, hoursTotal: 20, status: 'Nouveau', center: 'Versailles' },
];

export default function AdminElevesPage() {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-white/5">
                <div>
                    <h1 className="page-title">Parcours Élèves</h1>
                    <p className="text-sm text-[#8A94A6] mt-1 font-medium">Suivi pédagogique global de tous les inscrits.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="btn-primary">
                        <GraduationCap size={16} />
                        Ajouter un Élève
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Élèves en Formation', value: '450', icon: <Users size={18} />, color: 'text-blue-400' },
                    { label: 'Présentations Examen', value: '38', icon: <CheckSquare size={18} />, color: 'text-emerald-400' },
                    { label: 'Leçons de la Semaine', value: '840', icon: <Calendar size={18} />, color: 'text-[#00F5FF]' },
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
                    <h3 className="section-title">Base de Données Élèves</h3>
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5F6B7A]" size={14} />
                        <input
                            type="text"
                            placeholder="Chercher un élève..."
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
                                <th>ÉLÈVE & CENTRE</th>
                                <th>AVANCEMENT</th>
                                <th>MONITEUR ATTITRÉ</th>
                                <th>DERNIÈRE LEÇON</th>
                                <th>STATUT GLOBAL</th>
                            </tr>
                        </thead>
                        <tbody>
                            {STUDENTS.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())).map((student) => (
                                <tr key={student.id} className="group">
                                    <td>
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-white group-hover:text-[#00F5FF] transition-colors">{student.name}</span>
                                            <span className="text-[10px] text-[#5F6B7A] mt-1">{student.center}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex flex-col gap-1.5 w-full max-w-[120px]">
                                            <div className="flex justify-between text-[10px] font-bold text-[#8A94A6]">
                                                <span>{student.hours}h</span>
                                                <span>{student.hoursTotal}h</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-emerald-400" style={{ width: `${(student.hours / student.hoursTotal) * 100}%` }} />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="font-medium text-white">{student.moniteur}</td>
                                    <td className="text-xs text-[#8A94A6]">{student.date}</td>
                                    <td>
                                        <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${student.status === 'Prêt examen' ? 'bg-amber-500/10 text-amber-500' : 'bg-white/5 text-[#5F6B7A]'}`}>
                                            {student.status}
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
