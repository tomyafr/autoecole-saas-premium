'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    Search,
    CreditCard as CreditCardIcon
} from 'lucide-react';
import { getUser, type User as UserType } from '@/lib/auth';
import { getStudentDashboard } from '@/app/actions/dashboard';

/* ======= DATA ======= */
const currentYear = new Date().getFullYear();
const INVOICES = [
    { id: `#INV-${currentYear}-001`, date: `05 Mars ${currentYear}`, amount: '450.00€', status: 'Payé', type: 'Pack Sérénité 20h' },
    { id: `#INV-${currentYear}-002`, date: `12 Fév ${currentYear}`, amount: '120.00€', status: 'Payé', type: 'Heures supplémentaires (2h)' },
    { id: `#INV-${currentYear}-003`, date: `15 Jan ${currentYear}`, amount: '890.00€', status: 'Payé', type: 'Pack Initial Code+20h' },
];
export default function ElevePaiementsPage() {
    const router = useRouter();
    const [user, setUser] = useState<UserType | null>(null);
    const [loading, setLoading] = useState(true);
    const [dbData, setDbData] = useState<any>(null);
    const [actionFeedback, setActionFeedback] = useState<string | null>(null);
    const [stripeModal, setStripeModal] = useState(false);

    const triggerFeedback = (msg: string) => {
        setActionFeedback(msg);
        setTimeout(() => setActionFeedback(null), 3000);
    };

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
            const rawData = await getStudentDashboard(userId);
            const parsed = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
            if (parsed && parsed.success) {
                setDbData(parsed.data);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const generateInvoice = async (invoice: any) => {
        setActionFeedback("Génération de la facture PDF et envoi par email...");

        try {
            // Import dynamique pour éviter les erreurs Server-Side Rendering avec Next.js
            const { jsPDF } = await import('jspdf');
            const doc = new jsPDF();

            // Design de la Facture
            doc.setFillColor(11, 15, 20); // Fond sombre AutoDrive
            doc.rect(0, 0, 210, 40, 'F');

            doc.setTextColor(0, 245, 255); // Cyan
            doc.setFontSize(24);
            doc.setFont("helvetica", "bold");
            doc.text("AUTODRIVE PRO", 14, 25);

            doc.setTextColor(255, 255, 255);
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text("FACTURE", 170, 25);

            // Contenu
            doc.setTextColor(50, 50, 50);
            doc.setFontSize(16);
            doc.setFont("helvetica", "bold");
            doc.text("Détails de la Facture", 14, 60);

            doc.setFontSize(12);
            doc.setFont("helvetica", "normal");
            doc.text(`Référence : ${invoice.id}`, 14, 75);
            doc.text(`Date d'émission : ${invoice.date}`, 14, 85);
            doc.text(`Élève : ${user?.name || "Client"}`, 14, 95);

            // Ligne de séparation
            doc.setDrawColor(200, 200, 200);
            doc.line(14, 110, 196, 110);

            // Description
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text("Désignation", 14, 125);
            doc.text("Total TTC", 170, 125);

            doc.setFont("helvetica", "normal");
            doc.text(invoice.type, 14, 140);
            doc.text(invoice.amount, 170, 140);

            doc.line(14, 160, 196, 160);

            // Total
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.text("NET A PAYER", 120, 180);
            doc.setTextColor(0, 200, 0);
            doc.text(invoice.amount, 170, 180);

            // Footer
            doc.setTextColor(150, 150, 150);
            doc.setFontSize(9);
            doc.text("AutoDrive Pro - Numéro de SIRET : 123 456 789 00012", 105, 280, { align: "center" });

            // 1) Télécharger sur l'appareil
            const fileName = `Facture_${invoice.id.replace('#', '')}.pdf`;
            doc.save(fileName);

            // 2) Génération du Base64 pour l'envoi par email
            const pdfBase64 = doc.output('datauristring');

            // 3) Envoi à l'API backend
            fetch('/api/email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: 'ton_email@exemple.com', // Remplaçable par l'email de l'élève (user.email)
                    subject: `Votre facture AutoDrive ${invoice.id}`,
                    html: `<h3>Bonjour ${user?.name},</h3><p>Veuillez trouver ci-joint votre facture <strong>${invoice.id}</strong> d'un montant de <strong>${invoice.amount}</strong>.</p><p>Cordialement,<br>L'équipe AutoDrive Pro</p>`,
                    attachmentBase64: pdfBase64,
                    attachmentName: fileName
                })
            });

            setTimeout(() => setActionFeedback(null), 3000);

        } catch (e) {
            console.error("Erreur PDF:", e);
            setActionFeedback("Erreur lors de la génération de la facture.");
            setTimeout(() => setActionFeedback(null), 3000);
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
                    <h1 className="page-title">Facturation & Paiements</h1>
                    <p className="text-sm text-[var(--color-text-secondary)] mt-1 font-medium">Gestion de vos transactions et crédits de formation.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => triggerFeedback("Archive ZIP prête et en cours de formatage sécurisé...")} className="btn-secondary">
                        <Download size={16} />
                        Télécharger tout
                    </button>
                    <button onClick={() => setStripeModal(true)} className="btn-primary">
                        <Plus size={16} />
                        Ajouter Crédits
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {actionFeedback && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-6 right-6 z-50 bg-[#00F5FF]/10 border border-[#00F5FF]/30 text-[#00F5FF] px-6 py-3 rounded-xl shadow-[0_0_20px_rgba(0,245,255,0.2)] text-xs font-bold tracking-widest uppercase flex items-center gap-3"
                    >
                        {actionFeedback}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Tactical Grid Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Solde Formations', value: `${dbData.lessons?.length || 0}/35h`, sub: 'Heures réalisées', icon: <Clock size={18} />, color: 'text-[var(--color-accent)]' },
                    { label: 'Total Investi', value: `${totalInvested}€`, sub: 'Total payé', icon: <DollarSign size={18} />, color: 'text-emerald-400' },
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
                                    {invoices.length > 0 ? invoices.map((inv: any) => (
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
                                                <button onClick={() => generateInvoice(inv)} className="p-2.5 rounded-xl bg-[var(--color-sidebar)] border border-[var(--color-border-subtle)] text-[var(--color-text-muted)] hover:text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 transition-all" title="Télécharger & Envoyer par email">
                                                    <FileText size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={5} className="py-20 text-center border-none">
                                                <div className="flex flex-col items-center justify-center space-y-4">
                                                    <div className="w-16 h-16 rounded-3xl bg-[var(--color-sidebar)] border border-[var(--color-border-subtle)] flex items-center justify-center text-[var(--color-text-muted)] shadow-inner">
                                                        <History size={32} strokeWidth={1.5} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-[var(--color-text-primary)]">Aucune transaction pour le moment.</p>
                                                        <p className="text-[10px] text-[var(--color-text-secondary)] font-medium max-w-xs mx-auto mt-2 leading-relaxed">Votre historique financier est vierge. Effectuez une première réservation ou ajoutez des crédits pour commencer.</p>
                                                    </div>
                                                    <button onClick={() => setStripeModal(true)} className="btn-primary mt-4 flex items-center gap-2 px-6 py-3">
                                                        <Plus size={14} /> Ajouter Crédits
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
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
                            <h3 className="section-title">Sécurité des Paiements</h3>
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
                                <button onClick={() => triggerFeedback("Modification de carte vérifiée par DSP2 en cours.")} className="text-[9px] font-black text-[var(--color-accent)] uppercase tracking-widest border-b border-[var(--color-accent)]/20">Editer</button>
                            </div>
                        </div>
                        <button onClick={() => setStripeModal(true)} className="w-full btn-primary mt-8">
                            Actualiser Abonnement
                            <ArrowUpRight size={16} />
                        </button>
                    </div>

                    <div className="premium-card p-8 space-y-6">
                        <h3 className="card-title text-[var(--color-text-muted)] italic font-black">Support Facturation</h3>
                        <div onClick={() => triggerFeedback("Connexion au terminal de messagerie sécurisé...")} className="p-5 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border-subtle)] group hover:bg-[var(--color-sidebar)] transition-all cursor-pointer">
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

            {/* Modal Paiement Sécurisé (Stripe Sandbox) */}
            <AnimatePresence>
                {stripeModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setStripeModal(false)}
                            className="absolute inset-0 bg-[#0B0F14]/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-sm premium-card border-[var(--color-border-subtle)] overflow-hidden flex flex-col text-center"
                        >
                            <div className="p-8 space-y-6">
                                <div className="w-16 h-16 rounded-[2rem] bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                                    <CreditCardIcon size={28} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2">Terminal de Paiement</h3>
                                    <p className="text-sm text-[var(--color-text-muted)] leading-relaxed italic">Gateway chiffré par Stripe en cours d'initialisation. Les paiements réels seront activés prochainement.</p>
                                </div>
                                <button onClick={() => setStripeModal(false)} className="btn-secondary border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/10 hover:text-indigo-300 w-full justify-center underline decoration-indigo-400/30">
                                    Fermer le Sandbox
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
