'use client';

import { motion } from 'framer-motion';
import { CreditCard, TrendingUp, BarChart, ArrowUpRight, Calendar, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminFinancesPage() {
    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-white/5">
                <div>
                    <h1 className="page-title">Trésorerie & Finances</h1>
                    <p className="text-sm text-[#8A94A6] mt-1 font-medium">Contrôle des flux financiers, facturations et abonnements.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="btn-secondary">
                        <Calendar size={16} />
                        Exporter Rapport
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Revenu Mensuel (MRR)', value: '42,850€', sub: '+12.5%', icon: <TrendingUp size={18} />, color: 'text-emerald-400' },
                    { label: 'En attente de paiement', value: '3,240€', sub: '18 factures', icon: <CreditCard size={18} />, color: 'text-amber-400' },
                    { label: 'Coût Formateurs /h', value: '24.50€', sub: 'Moyenne globale', icon: <BarChart size={18} />, color: 'text-[#00F5FF]' },
                ].map((stat, i) => (
                    <div key={i} className="premium-card p-6 flex flex-col justify-between space-y-4">
                        <div className="flex justify-between items-start">
                            <div className={`p-2 rounded-lg bg-white/[0.03] border border-white/5 ${stat.color}`}>
                                {stat.icon}
                            </div>
                            <span className="card-title">{stat.label}</span>
                        </div>
                        <div>
                            <div className="primary-value font-mono tracking-tighter">{stat.value}</div>
                            <div className="flex items-center gap-1 mt-1 text-[10px] font-bold uppercase text-[#5F6B7A]">
                                <ArrowUpRight size={10} className={stat.color} />
                                {stat.sub}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="premium-card overflow-hidden">
                <div className="px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-white/5">
                    <h3 className="section-title">Transactions Récentes</h3>
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5F6B7A]" size={14} />
                        <input
                            type="text"
                            placeholder="Rechercher une transaction..."
                            className="w-full pl-9 pr-4 py-2 bg-white/[0.02] border border-white/5 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-[#00F5FF]/20 transition-all"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="premium-table">
                        <thead>
                            <tr>
                                <th>RÉFÉRENCE</th>
                                <th>CLIENT</th>
                                <th>DATE</th>
                                <th>MONTANT</th>
                                <th>STATUT</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { ref: 'TXN-001', client: 'Lucas Bernard', date: 'Aujourd\'hui', amount: '1,200€', status: 'Payé', type: 'Pack Complet 35h' },
                                { ref: 'TXN-002', client: 'Emma Leroux', date: 'Hier', amount: '800€', status: 'Payé', type: 'Pack Accéléré 20h' },
                                { ref: 'TXN-003', client: 'Hugo Roux', date: 'Il y a 2j', amount: '120€', status: 'En attente', type: 'Heures Supplémentaires' },
                            ].map((txn, idx) => (
                                <tr key={idx} className="group">
                                    <td>
                                        <div className="flex flex-col">
                                            <span className="font-mono text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">{txn.ref}</span>
                                            <span className="text-[10px] text-[#5F6B7A] mt-1">{txn.type}</span>
                                        </div>
                                    </td>
                                    <td className="font-semibold text-white">{txn.client}</td>
                                    <td className="text-xs text-[#8A94A6]">{txn.date}</td>
                                    <td className="font-bold text-white font-mono">{txn.amount}</td>
                                    <td>
                                        <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${txn.status === 'Payé' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-500'}`}>
                                            {txn.status}
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
