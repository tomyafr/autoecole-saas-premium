'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { authenticate, saveUser, getUser, getDashboardPath } from '@/lib/auth';

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (getUser()) router.replace('/dashboard/eleve');
    }, [router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        await new Promise((r) => setTimeout(r, 1000));
        const user = authenticate(username, password);

        if (user) {
            saveUser(user);
            router.push(getDashboardPath(user.role));
        } else {
            setError('Identifiants invalides');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#000000] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Subtle background effects */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,_rgba(0,229,255,0.07)_0%,_transparent_50%)]" />
            <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.05)_0%,_transparent_40%)]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[400px] relative z-10"
            >
                <div className="flex flex-col items-center mb-10">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                        <span className="text-black font-black text-xl italic">A</span>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">AutoDrive Pro</h1>
                    <p className="text-slate-500 text-sm mt-1">Plateforme SaaS Haute Fidelité</p>
                </div>

                <div className="premium-card p-8 sm:p-10 border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Identifiant</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-4 bg-white/[0.03] border border-white/5 rounded-xl text-sm text-white focus:border-cyan-500/50 transition-colors focus:outline-none"
                                placeholder="ex: eleve"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Mot de passe</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-4 bg-white/[0.03] border border-white/5 rounded-xl text-sm text-white focus:border-cyan-500/50 transition-colors focus:outline-none pr-12"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold"
                                >
                                    <AlertCircle size={14} />
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-4 text-xs tracking-widest uppercase font-black flex justify-center"
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <div className="flex items-center gap-2">
                                    <LogIn size={16} />
                                    Se connecter
                                </div>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-white/5">
                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter text-center mb-4">Accès rapide Démo</p>
                        <div className="grid grid-cols-3 gap-2">
                            {['eleve', 'moniteur', 'admin'].map(role => (
                                <button
                                    key={role}
                                    onClick={() => { setUsername(role); setPassword(`${role}54`); }}
                                    className="py-2 rounded-lg bg-white/[0.01] border border-white/5 text-[9px] font-bold text-slate-500 hover:border-cyan-500/30 hover:text-cyan-400 transition-all uppercase"
                                >
                                    {role}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <p className="text-center mt-10 text-[10px] text-slate-700 font-bold uppercase tracking-widest">
                    &copy; 2026 AutoDrive Pro — All rights reserved
                </p>
            </motion.div>
        </div>
    );
}
