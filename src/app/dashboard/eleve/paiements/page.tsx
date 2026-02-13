'use client';

import { motion } from 'framer-motion';
import {
    CreditCard,
    DollarSign,
    Download,
    FileText,
    History,
    Plus,
    CheckCircle2,
    Clock,
    ShieldCheck,
    ArrowUpRight,
    Search
} from 'lucide-react';

/* ======= DATA ======= */
const INVOICES = [
    { id: '#INV-2026-001', date: '05 Mars 2026', amount: '450.00€', status: 'Payé', type: 'Pack Sérénité 20h' },
    { id: '#INV-2026-002', date: '12 Fév 2026', amount: '120.00€', status: 'Payé', type: 'Heures supplémentaires (2h)' },
    { id: '#INV-2026-003', date: '15 Jan 2026', amount: '890.00€', status: 'Payé', type: 'Pack Initial Code+20h' },
];

export default function ElevePaiementsPage() {
    return (
        <div className="space-y-10 group/paiements">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                <div>
                    <h1 className="page-title">Facturation & Flux</h1>
                    <p className="text-sm text-[#8A94A6] mt-1 font-medium">Gestion de vos transactions et crédits de formation.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="btn-secondary">
                        <Download size={16} />
                        Télécharger tout
                    </button>
                    <button className="btn-primary">
                        <Plus size={16} />
                        Ajouter Crédits
                    </button>
                </div>
            </div>

            {/* Tactical Grid Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Solde Formations', value: '11h', sub: 'Crédits disponibles', icon: <Clock size={18} />, color: 'text-[#00F5FF]' },
                    { label: 'Total Investi', value: '1,460.00€', sub: 'Depuis l\'inscription', icon: <DollarSign size={18} />, color: 'text-emerald-400' },
                    { label: 'Méthode Active', value: '•••• 4242', sub: 'Visa Infinite', icon: <CreditCard size={18} />, color: 'text-blue-400' },
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
                            <p className="secondary-info mt-1 font-medium italic">{stat.sub}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Invoice History */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="section-title">Historique des Transactions</h3>
                        <div className="relative group/search">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5F6B7A] group-focus-within/search:text-[#00F5FF] transition-colors" size={14} />
                            <input
                                type="text"
                                placeholder="Identifier une facture..."
                                className="pl-9 pr-4 py-2 bg-white/[0.02] border border-white/5 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-[#00F5FF]/20 transition-all w-full md:w-64"
                            />
                        </div>
                    </div>

                    <div className="premium-card overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="premium-table">
                                <thead>
                                    <tr>
                                        <th>RÉFÉRENCE / TYPE</th>
                                        <th>DATE</th>
                                        <th>MONTANT</th>
                                        <th>STATUT</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {INVOICES.map((inv) => (
                                        <tr key={inv.id} className="group">
                                            <td>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold text-white">{inv.id}</span>
                                                    <span className="text-[10px] text-[#5F6B7A] font-bold uppercase tracking-widest mt-0.5">{inv.type}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="text-xs font-medium text-[#8A94A6]">{inv.date}</span>
                                            </td>
                                            <td>
                                                <span className="text-sm font-black text-white font-mono">{inv.amount}</span>
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-2 text-emerald-400">
                                                    <CheckCircle2 size={14} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">{inv.status}</span>
                                                </div>
                                            </td>
                                            <td className="text-right">
                                                <button className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-[#5F6B7A] hover:text-[#00F5FF] hover:bg-[#00F5FF]/10 transition-all">
                                                    <FileText size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Rail: Security & Subscription */}
                <div className="space-y-6">
                    <div className="premium-card p-8 bg-gradient-to-br from-[#00F5FF]/10 to-transparent border-[#00F5FF]/10">
                        <div className="flex items-center gap-3 mb-6">
                            <ShieldCheck size={20} className="text-[#00F5FF]" />
                            <h3 className="section-title">Sécurité Flux</h3>
                        </div>
                        <p className="text-[11px] text-[#8A94A6] font-medium leading-relaxed mb-8">
                            Toutes vos transactions sont chiffrées de bout-en-bout via le protocole AutoDrive Secure Vault.
                        </p>
                        <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-white/[0.04] border border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#00F5FF]/20 flex items-center justify-center text-[#00F5FF]">
                                        <CreditCard size={14} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-white uppercase tracking-tighter">Visa Infinite</span>
                                        <span className="text-[9px] text-[#5F6B7A] font-bold uppercase tracking-widest">Expire 08/28</span>
                                    </div>
                                </div>
                                <button className="text-[9px] font-black text-[#00F5FF] uppercase tracking-widest border-b border-[#00F5FF]/20">Editer</button>
                            </div>
                        </div>
                        <button className="w-full btn-primary mt-8">
                            Actualiser Abonnement
                            <ArrowUpRight size={16} />
                        </button>
                    </div>

                    <div className="premium-card p-8 space-y-6">
                        <h3 className="card-title text-[#5F6B7A] italic font-black">Support Facturation</h3>
                        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 group hover:bg-white/[0.04] transition-all cursor-pointer">
                            <p className="text-xs font-bold text-white mb-2">Besoin d'un échéancier ?</p>
                            <p className="text-[10px] text-[#5F6B7A] font-medium leading-relaxed">
                                Contactez notre service financier pour étaler vos paiements sans frais.
                            </p>
                            <div className="mt-4 flex items-center gap-2 text-[10px] font-black text-[#00F5FF] uppercase tracking-[0.2em] group-hover:translate-x-1 transition-transform">
                                Ouvrir un ticket
                                <ArrowUpRight size={12} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
