'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CreditCard,
    Download,
    Plus,
    CheckCircle2,
    ShieldCheck,
    Clock,
    BadgeCent,
    FileText,
    ArrowUpRight,
    Search,
    Filter,
    ArrowRight
} from 'lucide-react';

/* ======= DATA ======= */
const INVOICES = [
    { id: 'INV-2026-001', date: '01 Fév 2026', amount: '890.00', description: 'Forfait Premium 35h', status: 'Payé' },
    { id: 'INV-2026-002', date: '15 Jan 2026', amount: '45.00', description: 'Heure supplémentaire (1h)', status: 'Payé' },
    { id: 'INV-2025-089', date: '20 Déc 2025', amount: '150.00', description: 'Frais inscription examen', status: 'Payé' },
];

const PACKS = [
    { id: 1, title: 'Pack Liberté', hours: '5h', price: '235€', popular: false },
    { id: 2, title: 'Pack Sérénité', hours: '10h', price: '440€', popular: true },
    { id: 3, title: 'Pack Intensif', hours: '20h', price: '820€', popular: false },
];

export default function PaiementsPage() {
    return (
        <div className="space-y-10 group/paiements">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                <div>
                    <h1 className="page-title">Facturation & Flux</h1>
                    <p className="text-sm text-[#8A94A6] mt-1 font-medium">Gestion de vos actifs de formation et historique transactionnel.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="btn-primary">
                        <Plus size={18} />
                        Alimenter solde
                    </button>
                </div>
            </div>

            {/* Tactical Financial Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="premium-card p-6 flex flex-col justify-between space-y-4">
                    <div className="flex justify-between items-start">
                        <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-[#00F5FF]">
                            <Clock size={18} />
                        </div>
                        <span className="card-title">Solde de vol</span>
                    </div>
                    <div>
                        <div className="primary-value">11 Heures</div>
                        <p className="secondary-info mt-1 font-medium">Dernier achat: 01 Fév 2026</p>
                    </div>
                </div>

                <div className="premium-card p-6 flex flex-col justify-between space-y-4">
                    <div className="flex justify-between items-start">
                        <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-[#8A94A6]">
                            <BadgeCent size={18} />
                        </div>
                        <span className="card-title">Total Investi</span>
                    </div>
                    <div>
                        <div className="primary-value">1,085.00€</div>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-[10px] font-bold text-emerald-400 font-mono tracking-tighter uppercase">+12% vs MOIS DERNIER</span>
                        </div>
                    </div>
                </div>

                <div className="premium-card p-6 flex flex-col justify-between space-y-4">
                    <div className="flex justify-between items-start">
                        <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-[#8A94A6]">
                            <ShieldCheck size={18} />
                        </div>
                        <span className="card-title">Statut financier</span>
                    </div>
                    <div>
                        <div className="primary-value text-emerald-400">Opérationnel</div>
                        <p className="secondary-info mt-1 font-medium italic">Compte vérifié & sécurisé</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Acquisition Surface */}
                <div className="xl:col-span-2 space-y-8">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-4">
                            <h3 className="section-title">Nouveaux forfaits</h3>
                            <div className="h-px w-12 bg-white/5" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {PACKS.map((pack) => (
                            <div
                                key={pack.id}
                                className={`premium-card p-6 flex flex-col justify-between space-y-8 relative overflow-hidden group ${pack.popular ? 'border-[#00F5FF]/20 shadow-[0_0_40px_rgba(0,245,255,0.02)]' : ''}`}
                            >
                                {pack.popular && (
                                    <div className="absolute top-4 right-[-32px] rotate-45 bg-[#00F5FF] text-black text-[8px] font-black uppercase tracking-widest px-10 py-1 shadow-xl">
                                        Popular
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex flex-col">
                                            <span className="card-title mb-1">{pack.title}</span>
                                            <span className="text-3xl font-semibold text-white tracking-tighter">{pack.hours}</span>
                                        </div>
                                    </div>
                                    <p className="secondary-info text-[10px] font-bold uppercase tracking-widest">Modules de formation inclus</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-2xl font-semibold text-white">{pack.price}</span>
                                        <span className="text-[10px] font-bold text-[#5F6B7A] uppercase tracking-widest">TTC</span>
                                    </div>
                                    <button className={`w-full py-4 text-[10px] font-black uppercase tracking-[.25em] rounded-xl transition-all duration-300 ${pack.popular ? 'bg-[#00F5FF] text-black hover:scale-[1.02] shadow-[0_0_20px_rgba(0,245,255,0.2)]' : 'bg-white/5 text-[#8A94A6] hover:bg-white/10 hover:text-white border border-white/5'}`}>
                                        Sélectionner
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="premium-card p-10 bg-[radial-gradient(circle_at_0%_0%,rgba(0,245,255,0.03)_0%,transparent_50%)] border-[#00F5FF]/10 flex flex-col md:flex-row items-center gap-10">
                        <div className="w-16 h-16 rounded-2xl bg-[#00F5FF]/5 border border-[#00F5FF]/10 flex items-center justify-center text-[#00F5FF] shrink-0">
                            <ShieldCheck size={28} />
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-white">Garantie Restitution Directe</h4>
                            <p className="text-xs text-[#5F6B7A] leading-relaxed max-w-lg font-medium">
                                En cas d'échec constaté lors de l'examen final par AutoDrive Pro, nous créditons immédiatement <span className="text-[#00F5FF]">10% de votre investissement total</span> pour vos sessions de rattrapage.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Audit Surface */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <FileText size={18} className="text-[#8A94A6]" />
                        <h3 className="section-title">Audit financier</h3>
                    </div>

                    <div className="space-y-4">
                        {INVOICES.map((inv) => (
                            <div key={inv.id} className="premium-card p-6 flex flex-col justify-between space-y-4 group hover:border-[#00F5FF]/20 transition-all duration-300 border-l-2 border-l-transparent hover:border-l-[#00F5FF]">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-[#5F6B7A] group-hover:text-[#00F5FF] transition-colors">
                                            <FileText size={20} />
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-sm font-semibold text-white truncate">{inv.id}</span>
                                            <span className="text-[10px] text-[#5F6B7A] font-bold uppercase tracking-widest mt-0.5">{inv.date}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-white">{inv.amount}€</p>
                                        <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-tighter">Acquittée</span>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                                    <p className="text-[10px] text-[#5F6B7A] font-medium leading-relaxed max-w-[160px] truncate">{inv.description}</p>
                                    <button className="p-2 text-[#5F6B7A] hover:text-white transition-colors">
                                        <Download size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="w-full btn-secondary py-4 text-[10px] font-black uppercase tracking-[.25em] border-none">
                        Voir archives complètes
                        <ArrowRight size={16} />
                    </button>

                    <div className="p-6 rounded-2xl bg-amber-500/[0.02] border border-amber-500/10 flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0 mt-1">
                            <ShieldCheck size={14} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Sécurité 3D-Secure</p>
                            <p className="text-[10px] text-[#5F6B7A] leading-relaxed font-medium">
                                Vos données bancaires ne sont jamais stockées sur nos serveurs. Transactions opérées via Stripe.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
