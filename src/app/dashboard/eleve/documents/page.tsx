'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    Upload,
    CheckCircle2,
    Clock,
    AlertCircle,
    ChevronRight,
    Download,
    Eye,
    X,
    ShieldCheck,
    Plus,
    FileCheck
} from 'lucide-react';
import { getUser, type User } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export default function DocumentPage() {
    const [user, setUser] = useState<User | null>(null);
    const [documents, setDocuments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const docTypes = [
        { id: 'ID', label: 'Pièce d\'identité', required: true, desc: 'CNI ou Passeport en cours de validité' },
        { id: 'PHOTO', label: 'Photo Signature', required: true, desc: 'E-photo ANTS avec code 22 chiffres' },
        { id: 'CERFA', label: 'Dossier CERFA 02', required: true, desc: 'Attestation d\'inscription officielle' },
        { id: 'JDC', label: 'Attestation JDC', required: false, desc: 'Pour les moins de 25 ans' },
    ];

    useEffect(() => {
        const u = getUser();
        if (u) {
            setUser(u);
            fetchDocuments(u.id);
        }
    }, []);

    const fetchDocuments = async (userId: string) => {
        const { data } = await supabase
            .from('documents')
            .select('*')
            .eq('student_id', userId);
        setDocuments(data || []);
        setLoading(false);
    };

    const getDocStatus = (typeId: string) => {
        const doc = documents.find(d => d.type === typeId);
        if (!doc) return 'none';
        return doc.status; // pending, valid, rejected
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'valid': return { label: 'Validé', color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: <CheckCircle2 size={14} /> };
            case 'pending': return { label: 'En attente', color: 'text-amber-400', bg: 'bg-amber-500/10', icon: <Clock size={14} /> };
            case 'rejected': return { label: 'Refusé', color: 'text-red-400', bg: 'bg-red-500/10', icon: <AlertCircle size={14} /> };
            default: return { label: 'Non soumis', color: 'text-[#5F6B7A]', bg: 'bg-white/5', icon: <Plus size={14} /> };
        }
    };

    return (
        <div className="space-y-10 group/docs">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                <div>
                    <h1 className="page-title">Mes Documents</h1>
                    <p className="text-sm text-[#8A94A6] mt-1 font-medium">Gestion administrative et dossier ANTS.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[9px] font-black text-[#5F6B7A] uppercase tracking-widest flex items-center gap-2">
                        <ShieldCheck size={14} className="text-[#00F5FF]" />
                        Dossier Sécurisé
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Checklist Section */}
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="section-title">Pièces obligatoires</h3>
                    <div className="grid grid-cols-1 gap-4">
                        {docTypes.map((type) => {
                            const status = getDocStatus(type.id);
                            const config = getStatusConfig(status);
                            const doc = documents.find(d => d.type === type.id);

                            return (
                                <div key={type.id} className="premium-card p-6 flex flex-col md:flex-row items-center justify-between gap-6 group/item hover:border-white/10 transition-all">
                                    <div className="flex items-center gap-5 flex-1 min-w-0">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${status === 'valid' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-[#8A94A6]'}`}>
                                            <FileText size={24} />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-sm font-bold text-white uppercase tracking-tight truncate">{type.label}</h4>
                                                {type.required && <span className="text-[8px] font-black bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded uppercase tracking-tighter">Obligatoire</span>}
                                            </div>
                                            <p className="text-[11px] text-[#5F6B7A] font-medium mt-1 leading-relaxed">{type.desc}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className={`px-4 py-2 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${config.color} ${config.bg}`}>
                                            {config.icon}
                                            {config.label}
                                        </div>

                                        {status === 'none' ? (
                                            <button className="p-3 rounded-xl bg-[#00F5FF] text-black hover:scale-105 active:scale-95 transition-all shadow-[0_10px_20px_-5px_rgba(0,245,255,0.3)]">
                                                <Upload size={18} />
                                            </button>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <button className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#8A94A6] hover:text-white transition-all">
                                                    <Eye size={16} />
                                                </button>
                                                <button className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#8A94A6] hover:text-white transition-all">
                                                    <Download size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="premium-card p-6 border-l-4 border-l-emerald-500">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                                <FileCheck size={18} />
                            </div>
                            <h3 className="text-xs font-black text-white uppercase tracking-widest">État du Dossier</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] text-[#5F6B7A] font-bold uppercase tracking-widest">Complétion</span>
                                <span className="text-sm font-black text-white">{Math.round((documents.filter(d => d.status === 'valid').length / 3) * 100)}%</span>
                            </div>
                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500" style={{ width: `${(documents.filter(d => d.status === 'valid').length / 3) * 100}%` }} />
                            </div>
                            <p className="text-[10px] text-[#5F6B7A] leading-relaxed italic">Une fois toutes les pièces validées, nous pourrons déclencher votre demande d'examen.</p>
                        </div>
                    </div>

                    <div className="premium-card p-8 bg-[radial-gradient(circle_at_100%_0%,rgba(0,245,255,0.05)_0%,transparent_50%)]">
                        <h3 className="card-title mb-6">Besoin d'aide ?</h3>
                        <p className="text-xs text-[#8A94A6] leading-relaxed mb-6 font-medium">Nos conseillers sont disponibles pour vous accompagner dans la constitution de votre dossier ANTS.</p>
                        <button className="w-full btn-secondary justify-center py-4">
                            Contacter l'agence
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
