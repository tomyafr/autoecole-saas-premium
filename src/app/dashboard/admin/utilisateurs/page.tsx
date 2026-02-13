'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    UserPlus,
    Search,
    Filter,
    Shield,
    GraduationCap,
    Clock,
    MoreVertical,
    CheckCircle2,
    XCircle,
    UserCheck,
    Mail,
    Phone,
    MapPin,
    ArrowUpRight,
    Lock,
    Edit2,
    Trash2
} from 'lucide-react';

/* ======= DATA ======= */
const USERS = [
    { id: 1, name: 'Lucas Bernard', role: 'eleve', email: 'lucas.b@gmail.com', status: 'actif', joined: '12 Jan 2026', center: 'Paris - République' },
    { id: 2, name: 'Marc Dupont', role: 'moniteur', email: 'm.dupont@autodrive.pro', status: 'actif', joined: '05 Nov 2025', center: 'Versailles' },
    { id: 3, name: 'Sophie Martin', role: 'moniteur', email: 's.martin@autodrive.pro', status: 'actif', joined: '20 Déc 2025', center: 'Paris - République' },
    { id: 4, name: 'Emma Petit', role: 'eleve', email: 'emma.p@yahoo.fr', status: 'suspendu', joined: '02 Fév 2026', center: 'Nanterre' },
    { id: 5, name: 'Admin Core', role: 'admin', email: 'admin@autodrive.io', status: 'actif', joined: '01 Jan 2025', center: 'HQ Paris' },
];

export default function AdminUsersPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRole, setSelectedRole] = useState('tous');

    return (
        <div className="space-y-10 group/admin-users">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                <div>
                    <h1 className="page-title">Management System</h1>
                    <p className="text-sm text-[#8A94A6] mt-1 font-medium">Contrôle global des accréditations et des profils utilisateurs.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="btn-secondary">
                        <Lock size={16} />
                        Audit Sécurité
                    </button>
                    <button className="btn-primary">
                        <UserPlus size={16} />
                        Créer Profil
                    </button>
                </div>
            </div>

            {/* Tactical Grid Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Total Actifs', value: '1,240', icon: <Users size={18} />, color: 'text-[#00F5FF]' },
                    { label: 'Moniteurs', value: '82', icon: <UserCheck size={18} />, color: 'text-blue-400' },
                    { label: 'En Attente', value: '14', icon: <Clock size={18} />, color: 'text-amber-400' },
                    { label: 'Taux Engagement', value: '92%', icon: <ArrowUpRight size={18} />, color: 'text-emerald-400' },
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

            {/* Filters Surface */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white/[0.01] border border-white/5 p-4 rounded-2xl backdrop-blur-sm">
                <div className="flex flex-wrap items-center gap-3">
                    {['tous', 'eleve', 'moniteur', 'admin'].map((role) => (
                        <button
                            key={role}
                            onClick={() => setSelectedRole(role)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedRole === role ? 'bg-[#00F5FF] text-black shadow-[0_0_15px_rgba(0,245,255,0.2)]' : 'bg-white/5 text-[#5F6B7A] hover:text-white'}`}
                        >
                            {role}
                        </button>
                    ))}
                </div>
                <div className="relative group/search w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5F6B7A] group-focus-within/search:text-[#00F5FF] transition-colors" size={16} />
                    <input
                        type="text"
                        placeholder="Rechercher par nom ou email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-6 py-3 bg-white/[0.02] border border-white/5 rounded-xl text-sm font-medium text-white focus:outline-none focus:border-[#00F5FF]/20 transition-all"
                    />
                </div>
            </div>

            {/* Users Audit List */}
            <div className="premium-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="premium-table">
                        <thead>
                            <tr>
                                <th>UTILISATEUR / CENTRE</th>
                                <th>RÔLE SYSTÈME</th>
                                <th>DATE INSCRIPTION</th>
                                <th>STATUT RÉSEAU</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {USERS.filter(u =>
                                (selectedRole === 'tous' || u.role === selectedRole) &&
                                (u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()))
                            ).map((user) => (
                                <tr key={user.id} className="group">
                                    <td>
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs font-black text-[#8A94A6] group-hover:text-[#00F5FF] transition-colors">
                                                {user.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-sm font-semibold text-white truncate">{user.name}</span>
                                                <span className="text-[10px] text-[#5F6B7A] font-bold uppercase tracking-widest mt-0.5">{user.center}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <div className={`p-1.5 rounded bg-white/5 ${user.role === 'admin' ? 'text-purple-400' : user.role === 'moniteur' ? 'text-blue-400' : 'text-[#00F5FF]'}`}>
                                                {user.role === 'admin' ? <Shield size={12} /> : user.role === 'moniteur' ? <UserCheck size={12} /> : <GraduationCap size={12} />}
                                            </div>
                                            <span className="text-xs font-bold text-[#8A94A6] uppercase tracking-widest">{user.role}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="text-xs font-medium text-[#5F6B7A]">{user.joined}</span>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'actif' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.4)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]'}`} />
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${user.status === 'actif' ? 'text-emerald-400' : 'text-red-500'}`}>{user.status}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 rounded-lg hover:bg-white/5 text-[#5F6B7A] hover:text-white transition-colors">
                                                <Edit2 size={16} />
                                            </button>
                                            <button className="p-2 rounded-lg hover:bg-red-500/5 text-[#5F6B7A] hover:text-red-400 transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                            <button className="p-2 rounded-lg hover:bg-white/5 text-[#5F6B7A] hover:text-white transition-colors">
                                                <MoreVertical size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Legend / Info */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2 text-[10px] text-[#5F6B7A] font-bold uppercase tracking-widest">
                        <div className="w-2 h-2 rounded-full bg-emerald-400" />
                        Profil Audité
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-[#5F6B7A] font-bold uppercase tracking-widest">
                        <div className="w-2 h-2 rounded-full bg-white/10" />
                        Session Chiffrée
                    </div>
                </div>
                <p className="text-[10px] text-[#5F6B7A] font-black uppercase tracking-[0.2em]">Système de Management Pro © 2026</p>
            </div>
        </div>
    );
}
