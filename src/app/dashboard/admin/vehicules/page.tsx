'use client';

import { motion } from 'framer-motion';
import {
    Car,
    Plus,
    Settings,
    Wrench,
    AlertTriangle,
    CheckCircle2,
    Search
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { getVehiclesData } from '@/app/actions/admin';

export default function VehiclesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getVehiclesData().then(data => {
            setVehicles(data);
            setLoading(false);
        });
    }, []);

    if (loading) return <div className="p-10 text-center text-[#5F6B7A]">Synchronisation de la flotte...</div>;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                <div>
                    <h1 className="page-title">Gestion de Flotte</h1>
                    <p className="text-sm text-[#8A94A6] mt-1 font-medium">Contrôle technique, maintenance et attribution des véhicules.</p>
                </div>
                <button className="btn-primary">
                    <Plus size={16} />
                    Ajouter un véhicule
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="premium-card p-6 border-l-4 border-emerald-500/50">
                    <div className="flex items-center gap-3 text-emerald-400 mb-2">
                        <CheckCircle2 size={18} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Opérationnels</span>
                    </div>
                    <div className="primary-value">12</div>
                    <p className="text-[10px] text-[#5F6B7A] mt-1">Sains et disponibles</p>
                </div>
                <div className="premium-card p-6 border-l-4 border-amber-500/50">
                    <div className="flex items-center gap-3 text-amber-500 mb-2">
                        <Wrench size={18} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">En maintenance</span>
                    </div>
                    <div className="primary-value">2</div>
                    <p className="text-[10px] text-[#5F6B7A] mt-1">Révision en cours</p>
                </div>
                <div className="premium-card p-6 border-l-4 border-red-500/50">
                    <div className="flex items-center gap-3 text-red-400 mb-2">
                        <AlertTriangle size={18} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Alertes critiques</span>
                    </div>
                    <div className="primary-value">0</div>
                    <p className="text-[10px] text-[#5F6B7A] mt-1">Aucun incident majeur</p>
                </div>
            </div>

            {/* Content Control */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5F6B7A]" size={18} />
                    <input
                        type="text"
                        placeholder="Rechercher par plaque ou modèle..."
                        className="w-full pl-12 pr-4 py-3 bg-white/[0.03] border border-white/5 rounded-2xl text-sm text-white focus:outline-none focus:border-[#00F5FF]/30 transition-all font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Vehicles Table */}
            <div className="premium-card overflow-hidden">
                <table className="premium-table">
                    <thead>
                        <tr>
                            <th>VÉHICULE</th>
                            <th>PLAQUE</th>
                            <th>KILOMÉTRAGE</th>
                            <th>PROCHAIN CT</th>
                            <th>STATUT</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {vehicles.filter(v => v.name.toLowerCase().includes(searchTerm.toLowerCase()) || v.plate.toLowerCase().includes(searchTerm.toLowerCase())).map((v, i) => (
                            <tr key={v.id} className="group">
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white/5 rounded-lg text-[#8A94A6] group-hover:text-[#00F5FF] transition-colors">
                                            <Car size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-white">{v.name}</p>
                                            <p className="text-[10px] text-[#5F6B7A] font-medium uppercase tracking-wider">{v.brand} {v.model}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="font-mono text-xs text-[#8A94A6] font-bold">{v.plate}</td>
                                <td className="text-sm font-medium text-[#8A94A6]">{v.mileage}</td>
                                <td>
                                    <div className="flex flex-col">
                                        <span className={`text-[11px] font-bold ${v.nextCT === 'Non défini' ? 'text-[#5F6B7A]' : 'text-white'}`}>{v.nextCT}</span>
                                        <span className="text-[9px] text-[#5F6B7A] font-medium uppercase tracking-widest mt-1">Assur: {v.insuranceExpiry}</span>
                                    </div>
                                </td>
                                <td>
                                    <span className={`status-badge ${v.status === 'active' ? 'status-badge-cyan' : 'status-badge-gray'}`}>
                                        {v.status === 'active' ? 'EN SERVICE' : 'MAINTENANCE'}
                                    </span>
                                </td>
                                <td className="text-right">
                                    <button className="p-2 text-[#5F6B7A] hover:text-white transition-colors">
                                        <Settings size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div >
    );
}
