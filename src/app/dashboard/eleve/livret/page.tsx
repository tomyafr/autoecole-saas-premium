'use client';

import { motion } from 'framer-motion';
import {
    Hexagon,
    ChevronLeft,
    CheckCircle2,
    Clock,
    AlertCircle,
    ShieldCheck,
    BookOpen,
    ArrowRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getUser, type User } from '@/lib/auth';
import { getStudentPedagogyData, completeLessonWithSignature } from '@/app/actions/pedagogie';
import SignaturePad from '@/components/SignaturePad';

export default function LivretPedagogiquePage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [pedagogyData, setPedagogyData] = useState<any>(null);

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
            const data = await getStudentPedagogyData(userId);
            if (data) setPedagogyData(data);
        } catch (error) {
            console.error('Failed to fetch pedagogy data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSignatureComplete = async (lessonId: string, signature: string) => {
        const res = await completeLessonWithSignature(lessonId, signature);
        if (res.success) {
            if (user) fetchData(user.id);
        }
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center flex-col gap-4">
                <div className="w-8 h-8 border-2 border-[#00F5FF] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs text-[#5F6B7A] font-medium tracking-widest uppercase text-center">Chargement de votre livret numérique...</p>
            </div>
        );
    }

    const getLevelInfo = (level: number) => {
        switch (level) {
            case 3: return { label: 'Assimilé', color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: <ShieldCheck size={14} /> };
            case 2: return { label: 'Acquis', color: 'text-[#00F5FF]', bg: 'bg-[#00F5FF]/10', icon: <CheckCircle2 size={14} /> };
            case 1: return { label: 'En cours', color: 'text-amber-400', bg: 'bg-amber-500/10', icon: <Clock size={14} /> };
            default: return { label: 'Non commencé', color: 'text-[#5F6B7A]', bg: 'bg-white/5', icon: <AlertCircle size={14} /> };
        }
    };

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-white/5">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#5F6B7A] hover:text-white transition-all"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <h1 className="page-title">Livret Numérique (REM)</h1>
                        <p className="text-sm text-[#8A94A6] mt-1 font-medium italic">Suivi officiel de votre progression réglementaire.</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 px-6 py-3 rounded-2xl bg-[#00F5FF]/5 border border-[#00F5FF]/10">
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-[#00F5FF] uppercase tracking-widest">Progression Globale</p>
                        <p className="text-xl font-black text-white">{pedagogyData?.globalProgress || 0}%</p>
                    </div>
                    <div className="w-12 h-12 rounded-full border-2 border-[#00F5FF]/20 flex items-center justify-center relative">
                        <svg className="w-12 h-12 -rotate-90">
                            <circle
                                cx="24"
                                cy="24"
                                r="20"
                                fill="transparent"
                                stroke="currentColor"
                                strokeWidth="3"
                                className="text-white/5"
                            />
                            <circle
                                cx="24"
                                cy="24"
                                r="20"
                                fill="transparent"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeDasharray={`${2 * Math.PI * 20}`}
                                strokeDashoffset={`${2 * Math.PI * 20 * (1 - (pedagogyData?.globalProgress || 0) / 100)}`}
                                className="text-[#00F5FF]"
                            />
                        </svg>
                        <BookOpen size={16} className="absolute text-[#00F5FF]" />
                    </div>
                </div>
            </div>

            {/* ALERT SIGNATURES */}
            {pedagogyData?.pendingSignatures?.length > 0 && (
                <div className="space-y-4">
                    <h3 className="section-title text-amber-500 flex items-center gap-2">
                        <AlertCircle size={18} />
                        Signatures requises
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                        {pedagogyData.pendingSignatures.map((lesson: any) => (
                            <div key={lesson.id} className="premium-card p-8 bg-amber-500/5 border-amber-500/20 flex flex-col md:flex-row items-center justify-between gap-8">
                                <div>
                                    <p className="text-lg font-bold text-white uppercase tracking-tight">{lesson.title}</p>
                                    <p className="text-xs text-[#8A94A6] mt-1 font-medium">Réalisée le {new Date(lesson.date).toLocaleDateString('fr-FR')}</p>
                                </div>
                                <div className="w-full md:w-64 bg-[#0B0F14] rounded-2xl p-2 border border-white/5">
                                    <SignaturePad
                                        onSave={(sig: string) => handleSignatureComplete(lesson.id, sig)}
                                        onClose={() => { }}
                                    />
                                    <p className="text-[9px] text-center text-[#5F6B7A] font-bold uppercase tracking-[0.2em] mt-2">Signer ici pour valider</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Competency Grid */}
            <div className="grid grid-cols-1 gap-12">
                {pedagogyData?.pedagogy.map((category: any) => (
                    <section key={category.id} className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-white font-black text-lg">
                                    {category.id}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white uppercase tracking-tight">{category.title}</h2>
                                    <p className="text-xs text-[#5F6B7A] font-medium">Validation du comportement routier</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {category.items.map((item: any) => {
                                const level = getLevelInfo(item.level);
                                return (
                                    <div
                                        key={item.code}
                                        className="premium-card p-6 group hover:border-[#00F5FF]/20 transition-all cursor-default"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="text-[10px] font-black text-[#5F6B7A] group-hover:text-[#00F5FF] transition-colors tracking-widest">
                                                ID: {item.code}
                                            </span>
                                            <div className={`px-2 py-1 rounded-lg ${level.bg} ${level.color} flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest transition-all`}>
                                                {level.icon}
                                                {level.label}
                                            </div>
                                        </div>
                                        <h4 className="text-base font-semibold text-white mb-1">{item.title}</h4>
                                        <p className="text-xs text-[#8A94A6] leading-relaxed mb-4">{item.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                ))}
            </div>

            {/* Footer Memo */}
            <div className="p-8 rounded-3xl bg-white/[0.01] border border-white/5 text-center max-w-2xl mx-auto">
                <Hexagon size={32} className="mx-auto mb-4 text-[#5F6B7A] opacity-20" />
                <h3 className="text-white font-bold mb-2 uppercase tracking-widest text-xs">Note Réglementaire</h3>
                <p className="text-xs text-[#5F6B7A] leading-relaxed">
                    Ce livret numérique est conforme aux exigences de la sécurité routière. Toutes les validations sont effectuées par vos moniteurs diplômés d'État.
                </p>
            </div>
        </div>
    );
}
