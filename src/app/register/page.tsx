'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { UserPlus, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await new Promise(r => setTimeout(r, 1500));
        setStep(2);
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#000000] flex items-center justify-center p-6 relative overflow-hidden text-white">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,_rgba(139,92,246,0.07)_0%,_transparent_50%)]" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-[450px] relative z-10"
            >
                <Link
                    href="/login"
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-colors mb-8 group"
                >
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    Retour connexion
                </Link>

                <div className="premium-card p-10 border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                    {step === 1 ? (
                        <>
                            <div className="mb-10 text-center">
                                <h1 className="text-3xl font-black tracking-tighter mb-2">Rejoindre AutoDrive</h1>
                                <p className="text-slate-500 text-sm font-medium italic">Commencez votre formation elite aujourd'hui.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Prénom</label>
                                        <input required className="w-full px-4 py-4 bg-white/[0.03] border border-white/5 rounded-xl text-sm focus:border-violet-500/50 transition-colors focus:outline-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Nom</label>
                                        <input required className="w-full px-4 py-4 bg-white/[0.03] border border-white/5 rounded-xl text-sm focus:border-violet-500/50 transition-colors focus:outline-none" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Email Académique</label>
                                    <input type="email" required className="w-full px-4 py-4 bg-white/[0.03] border border-white/5 rounded-xl text-sm focus:border-violet-500/50 transition-colors focus:outline-none" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Mot de passe</label>
                                    <input type="password" required className="w-full px-4 py-4 bg-white/[0.03] border border-white/5 rounded-xl text-sm focus:border-violet-500/50 transition-colors focus:outline-none" />
                                </div>

                                <button
                                    disabled={loading}
                                    className="btn-primary w-full py-4 text-xs font-black tracking-[0.2em] uppercase bg-violet-600 hover:bg-violet-500 flex justify-center"
                                >
                                    {loading ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <UserPlus size={16} />
                                            Initialiser Compte
                                        </div>
                                    )}
                                </button>
                            </form>
                        </>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-10 space-y-8"
                        >
                            <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
                                <CheckCircle2 size={40} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black tracking-tight mb-2">Inscription Validée</h1>
                                <p className="text-slate-500 text-sm leading-relaxed">
                                    Votre demande d'adhésion est en cours de traitement.<br />
                                    Vous recevrez un email de confirmation sous peu.
                                </p>
                            </div>
                            <button
                                onClick={() => router.push('/login')}
                                className="w-full btn-secondary py-4 uppercase text-[10px] font-black tracking-widest"
                            >
                                Retour à la console
                            </button>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
