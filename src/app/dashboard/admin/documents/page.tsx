'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    Search,
    Filter,
    CheckCircle2,
    Clock,
    AlertCircle,
    Download,
    Eye,
    X,
    FileCheck,
    ArrowUpRight,
    UserCircle
} from 'lucide-react';
import { getAdminDocuments, updateDocumentStatus } from '@/app/actions/documents';

export default function AdminDocumentsPage() {
    const [loading, setLoading] = useState(true);
    const [documents, setDocuments] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState<'all' | 'pending' | 'valid' | 'rejected'>('pending');
    const [actionFeedback, setActionFeedback] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        const res = await getAdminDocuments();
        if (res.success) {
            setDocuments(res.data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const triggerFeedback = (msg: string) => {
        setActionFeedback(msg);
        setTimeout(() => setActionFeedback(null), 3000);
    };

    const handleUpdateStatus = async (docId: string, status: 'valid' | 'rejected') => {
        setIsProcessing(docId);
        const res = await updateDocumentStatus(docId, status);
        if (res.success) {
            triggerFeedback(status === 'valid' ? 'Document validé !' : 'Document rejeté');
            fetchData();
        } else {
            triggerFeedback('Erreur lors de la mise à jour');
        }
        setIsProcessing(null);
    };

    const filteredDocs = documents.filter(doc => {
        const matchesSearch = doc.student?.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === 'all' || doc.status === filter;
        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#00F5FF] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const stats = {
        pending: documents.filter(d => d.status === 'pending').length,
        valid: documents.filter(d => d.status === 'valid').length,
        rejected: documents.filter(d => d.status === 'rejected').length
    };

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                <div>
                    <h1 className="page-title">Validation Documents</h1>
                    <p className="text-sm text-[#8A94A6] mt-1 font-medium italic">Audit et conformité des dossiers ANTS élèves.</p>
                </div>
                <div className="flex bg-white/[0.02] border border-white/5 rounded-xl p-1">
                    {['pending', 'valid', 'rejected', 'all'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-[#00F5FF]/10 text-[#00F5FF]' : 'text-[#5F6B7A] hover:text-white'}`}
                        >
                            {f === 'pending' ? 'À Valider' : f === 'valid' ? 'Validés' : f === 'rejected' ? 'Refusés' : 'Tous'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="premium-card p-6 border-l-4 border-l-amber-500">
                    <div className="flex justify-between items-start">
                        <div className="p-2.5 rounded-xl bg-amber-500/5 text-amber-500">
                            <Clock size={18} />
                        </div>
                        <span className="card-title">En attente</span>
                    </div>
                    <div className="primary-value mt-4">{stats.pending}</div>
                </div>
                <div className="premium-card p-6 border-l-4 border-l-emerald-500">
                    <div className="flex justify-between items-start">
                        <div className="p-2.5 rounded-xl bg-emerald-500/5 text-emerald-400">
                            <CheckCircle2 size={18} />
                        </div>
                        <span className="card-title">Validés (30j)</span>
                    </div>
                    <div className="primary-value mt-4">{stats.valid}</div>
                </div>
                <div className="premium-card p-6 border-l-4 border-l-red-500">
                    <div className="flex justify-between items-start">
                        <div className="p-2.5 rounded-xl bg-red-500/5 text-red-500">
                            <AlertCircle size={18} />
                        </div>
                        <span className="card-title">Litiges / Refus</span>
                    </div>
                    <div className="primary-value mt-4">{stats.rejected}</div>
                </div>
            </div>

            {/* Documents Table */}
            <div className="premium-card overflow-hidden">
                <div className="px-8 py-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/[0.01]">
                    <h3 className="section-title">Audit Réglementaire</h3>
                    <div className="relative group/search">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5F6B7A] transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Nom de l'élève..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-white/[0.02] border border-white/5 rounded-xl text-sm font-medium text-white focus:outline-none focus:border-[#00F5FF]/20 transition-all w-full md:w-64"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="premium-table">
                        <thead>
                            <tr>
                                <th>Élève / Profil</th>
                                <th>Type de Document</th>
                                <th>Date Soumission</th>
                                <th>Statut</th>
                                <th className="text-right pr-8">Audit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDocs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-20 text-[#5F6B7A]">Aucun document à traiter via ce filtre.</td>
                                </tr>
                            ) : filteredDocs.map((doc, idx) => (
                                <motion.tr
                                    key={doc.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="group hover:bg-white/[0.02] transition-colors"
                                >
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#5F6B7A] text-[10px] font-bold">
                                                {doc.student?.name.split(' ').map((n: string) => n[0]).join('')}
                                            </div>
                                            <span className="text-sm font-semibold text-white group-hover:text-[#00F5FF] transition-colors">{doc.student?.name}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-white uppercase tracking-tight">
                                                {doc.type === 'ID' ? 'Pièce d\'identité' : doc.type === 'PHOTO' ? 'Photo ANTS' : doc.type === 'CERFA' ? 'CERFA 02' : 'Attestation JDC'}
                                            </span>
                                            <span className="text-[10px] text-[#5F6B7A] mt-0.5">Format: PDF/Images</span>
                                        </div>
                                    </td>
                                    <td className="text-xs text-[#8A94A6] font-medium">
                                        {new Date(doc.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </td>
                                    <td>
                                        <span className={`status-badge ${doc.status === 'valid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                doc.status === 'rejected' ? 'bg-red-500/10 text-red-400' :
                                                    'bg-amber-500/10 text-amber-400'
                                            }`}>
                                            {doc.status === 'valid' ? 'Validé' : doc.status === 'rejected' ? 'Rejeté' : 'À Valider'}
                                        </span>
                                    </td>
                                    <td className="text-right pr-8">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => window.open(doc.url, '_blank')}
                                                className="p-2 rounded-xl bg-white/5 hover:bg-[#00F5FF]/10 text-[#5F6B7A] hover:text-[#00F5FF] transition-all"
                                                title="Visualiser"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            {doc.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleUpdateStatus(doc.id, 'valid')}
                                                        disabled={isProcessing === doc.id}
                                                        className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-all disabled:opacity-50"
                                                        title="Valider"
                                                    >
                                                        <FileCheck size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateStatus(doc.id, 'rejected')}
                                                        disabled={isProcessing === doc.id}
                                                        className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all disabled:opacity-50"
                                                        title="Rejeter"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ACTION FEEDBACK TOAST */}
            <AnimatePresence>
                {actionFeedback && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl bg-[#0B0F14] border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
                    >
                        <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                            <CheckCircle2 size={16} />
                        </div>
                        <p className="text-sm font-medium text-white">{actionFeedback}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
