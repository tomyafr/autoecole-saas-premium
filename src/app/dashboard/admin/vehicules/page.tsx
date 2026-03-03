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
import { useState } from 'react';

// Mock data for initial UI (will be replaced by DB fetch)
const mockVehicles = [
    { id: '1', name: 'Peugeot 208 #01', brand: 'Peugeot', model: '208', plate: 'AB-123-CD', status: 'active', mileage: '42,500 km', nextService: '12/05/2026' },
    { id: '2', name: 'Citroën C3 #04', brand: 'Citroën', model: 'C3', plate: 'EF-456-GH', status: 'maintenance', mileage: '68,200 km', nextService: 'Immédiat' },
    { id: '3', name: 'Renault Clio #02', brand: 'Renault', model: 'Clio', plate: 'IJ-789-KL', status: 'active', mileage: '12,100 km', nextService: '20/11/2026' },
];

export default function VehiclesPage() {
    const [searchTerm, setSearchTerm] = useState('');

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
                            <th>PROCHAINE RÉVISION</th>
                            <th>STATUT</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockVehicles.map((v, i) => (
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
                                    <span className={`text-xs font-semibold ${v.status === 'maintenance' ? 'text-red-400' : 'text-[#8A94A6]'}`}>
                                        {v.nextService}
                                    </span>
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
