'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
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
import { getUser, type User as UserType } from '@/lib/auth';

/* ======= DATA ======= */
const currentYear = new Date().getFullYear();
const INVOICES = [
    { id: `#INV-${currentYear}-001`, date: `05 Mars ${currentYear}`, amount: '450.00€', status: 'Payé', type: 'Pack Sérénité 20h' },
    { id: `#INV-${currentYear}-002`, date: `12 Fév ${currentYear}`, amount: '120.00€', status: 'Payé', type: 'Heures supplémentaires (2h)' },
    { id: `#INV-${currentYear}-003`, date: `15 Jan ${currentYear}`, amount: '890.00€', status: 'Payé', type: 'Pack Initial Code+20h' },
];

import { getStudentDashboard } from '@/lib/db/queries';

export default function ElevePaiementsPage() {
    const router = useRouter();
    const [user, setUser] = useState<UserType | null>(null);
    const [loading, setLoading] = useState(true);
    const [dbData, setDbData] = useState<any>(null);

    useEffect(() => {
        const u = getUser();
        if (u) {
            setUser(u);
            fetchData(u.id);
        } else {
            router.replace('/login');
        }
    }, [router]);

    const fetchData = async (userId: string) => {
        try {
            const data = await getStudentDashboard(userId);
            setDbData(data);
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || !user || !dbData) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const invoices = dbData.payments?.map((p: any) => ({
        id: `#INV-${p.id.slice(0, 8).toUpperCase()}`,
        date: new Date(p.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
        amount: `${parseFloat(p.amount).toFixed(2)}€`,
        status: p.status === 'paid' ? 'Payé' : p.status,
        type: p.description
    })) || [];

    const totalInvested = dbData.payments?.reduce((acc: number, p: any) => acc + parseFloat(p.amount), 0).toFixed(2) || '0.00';

    return (
        <div className="space-y-10 group/paiements">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                <div>
                    <h1 className="page-title">Facturation & Flux</h1>
                    <p className="text-sm text-[var(--color-text-secondary)] mt-1 font-medium">Gestion de vos transactions et crédits de formation.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => alert("Exportation PDF en cours d'intégration.")} className="btn-secondary">
                        <Download size={16} />
                        Télécharger tout
                    </button>
                    <button onClick={() => alert("Tunnel de paiement Stripe en cours d'intégration.")} className="btn-primary">
                        <Plus size={16} />
                        Ajouter Crédits
                    </button>
                </div>
            </div>

            {/* Tactical Grid Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Solde Formations', value: `${dbData.lessons?.length || 0}/35h`, sub: 'Heures réalisées', icon: <Clock size={18} />, color: 'text-[var(--color-accent)]' },
                    { label: 'Total Investi', value: `${totalInvested}€`, sub: 'Flux de trésorerie', icon: <DollarSign size={18} />, color: 'text-emerald-400' },
                    { label: 'Prochaine Session', value: dbData.appointmentsAsStudent?.[0]?.date ? new Date(dbData.appointmentsAsStudent[0].date).toLocaleDateString() : 'Aucune', sub: 'Engagement prévu', icon: <CreditCard size={18} />, color: 'text-blue-400' },
                ].map((stat, i) => (
                    <div key={i} className="premium-card p-6 flex flex-col justify-between space-y-4">
                        <div className="flex justify-between items-start">
                            <div className={`p-2 rounded-lg bg-[var(--color-sidebar)] border border-[var(--color-border-subtle)] ${stat.color}`}>
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
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] group-focus-within/search:text-[var(--color-accent)] transition-colors" size={14} />
                            <input
                                type="text"
                                placeholder="Identifier une facture..."
                                className="pl-9 pr-4 py-2 bg-[var(--color-card)] border border-[var(--color-border-subtle)] rounded-xl text-xs font-medium text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)]/20 transition-all w-full md:w-64"
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
                                    {invoices.map((inv: any) => (
                                        <tr key={inv.id} className="group">
                                            <td>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold text-[var(--color-text-primary)]">{inv.id}</span>
                                                    <span className="text-[10px] text-[var(--color-text-muted)] font-bold uppercase tracking-widest mt-0.5">{inv.type}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="text-xs font-medium text-[var(--color-text-secondary)]">{inv.date}</span>
                                            </td>
                                            <td>
                                                <span className="text-sm font-black text-[var(--color-text-primary)] font-mono">{inv.amount}</span>
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-2 text-emerald-400">
                                                    <CheckCircle2 size={14} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">{inv.status}</span>
                                                </div>
                                            </td>
                                            <td className="text-right">
                                                <button onClick={() => alert("Génération de la facture en cours...")} className="p-2.5 rounded-xl bg-[var(--color-sidebar)] border border-[var(--color-border-subtle)] text-[var(--color-text-muted)] hover:text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 transition-all">
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
                    <div className="premium-card p-8 bg-gradient-to-br from-[#00F5FF]/10 to-transparent border-[var(--color-accent)]/10">
                        <div className="flex items-center gap-3 mb-6">
                            <ShieldCheck size={20} className="text-[var(--color-accent)]" />
                            <h3 className="section-title">Sécurité Flux</h3>
                        </div>
                        <p className="text-[11px] text-[var(--color-text-secondary)] font-medium leading-relaxed mb-8">
                            Toutes vos transactions sont chiffrées de bout-en-bout via le protocole AutoDrive Secure Vault.
                        </p>
                        <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-[var(--color-sidebar)] border border-[var(--color-border-subtle)] flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)]/20 flex items-center justify-center text-[var(--color-accent)]">
                                        <CreditCard size={14} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-[var(--color-text-primary)] uppercase tracking-tighter">Visa Infinite</span>
                                        <span className="text-[9px] text-[var(--color-text-muted)] font-bold uppercase tracking-widest">Expire 08/28</span>
                                    </div>
                                </div>
                                <button onClick={() => alert("Édition des moyens de paiement à venir.")} className="text-[9px] font-black text-[var(--color-accent)] uppercase tracking-widest border-b border-[var(--color-accent)]/20">Editer</button>
                            </div>
                        </div>
                        <button onClick={() => alert("Gestion de l'abonnement à venir")} className="w-full btn-primary mt-8">
                            Actualiser Abonnement
                            <ArrowUpRight size={16} />
                        </button>
                    </div>

                    <div className="premium-card p-8 space-y-6">
                        <h3 className="card-title text-[var(--color-text-muted)] italic font-black">Support Facturation</h3>
                        <div onClick={() => alert("Ouverture du module de chat IA...")} className="p-5 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border-subtle)] group hover:bg-[var(--color-sidebar)] transition-all cursor-pointer">
                            <p className="text-xs font-bold text-[var(--color-text-primary)] mb-2">Besoin d'un échéancier ?</p>
                            <p className="text-[10px] text-[var(--color-text-muted)] font-medium leading-relaxed">
                                Contactez notre service financier pour étaler vos paiements sans frais.
                            </p>
                            <div className="mt-4 flex items-center gap-2 text-[10px] font-black text-[var(--color-accent)] uppercase tracking-[0.2em] group-hover:translate-x-1 transition-transform">
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
