'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    Mail,
    Bell,
    Shield,
    Smartphone,
    Globe,
    Save,
    Camera,
    LogOut,
    ChevronRight,
    Lock,
    Eye,
    Monitor,
    Zap
} from 'lucide-react';
import { getUser, logout, type User as UserType } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
    const router = useRouter();
    const [user, setUser] = useState<UserType | null>(null);
    const [activeSection, setActiveSection] = useState('profile');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setUser(getUser());
    }, []);

    const handleLogout = () => {
        logout();
        router.replace('/');
    };

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => setIsSaving(false), 1500);
    };

    if (!user) return null;

    const sections = [
        { id: 'profile', label: 'Profil Personnel', icon: <User size={18} /> },
        { id: 'notifications', label: 'Alertes & Emails', icon: <Bell size={18} /> },
        { id: 'security', label: 'Sécurité Avancée', icon: <Shield size={18} /> },
        { id: 'preferences', label: 'Interface & Langue', icon: <Globe size={18} /> },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-10">
            {/* Superior Breadcrumb Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tighter">Paramètres Système</h2>
                    <p className="text-slate-500 text-sm mt-1">Configurez votre environnement AutoDrive Pro.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 rounded-2xl bg-white/[0.03] border border-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        Dernière synchro: <span className="text-white">Aujourd&#39;hui, 14:20</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-10">
                {/* Navigation Tactical Rail */}
                <div className="space-y-2">
                    {sections.map(section => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`
                                w-full flex items-center justify-between p-5 rounded-2xl border transition-all duration-500 cursor-pointer group
                                ${activeSection === section.id
                                    ? 'bg-cyan-500/[0.08] border-cyan-500/20 text-cyan-400 shadow-[0_15px_30px_-10px_rgba(0,229,255,0.1)]'
                                    : 'bg-white/[0.015] border-white/5 text-slate-500 hover:text-slate-300 hover:bg-white/[0.03]'}
                            `}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`transition-transform duration-500 group-hover:scale-110 ${activeSection === section.id ? 'text-cyan-400' : 'text-slate-600'}`}>
                                    {section.icon}
                                </div>
                                <span className="text-[11px] font-black uppercase tracking-widest">{section.label}</span>
                            </div>
                            {activeSection === section.id && (
                                <motion.div layoutId="setting-arrow">
                                    <ChevronRight size={14} className="text-cyan-400" />
                                </motion.div>
                            )}
                        </button>
                    ))}

                    <div className="pt-10">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-4 p-5 rounded-2xl bg-red-500/[0.03] border border-red-500/10 text-red-500/60 hover:text-red-500 hover:bg-red-500/[0.08] transition-all cursor-pointer font-black text-[10px] uppercase tracking-[0.2em]"
                        >
                            <LogOut size={18} />
                            Déconnexion
                        </button>
                    </div>
                </div>

                {/* Major Content Panel */}
                <div className="xl:col-span-3">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeSection}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.4 }}
                            className="premium-card p-10 space-y-12"
                        >
                            {activeSection === 'profile' && (
                                <div className="space-y-12">
                                    <div className="flex flex-col sm:flex-row items-center gap-10">
                                        <div className="relative group">
                                            <div className="w-28 h-28 rounded-[2.5rem] bg-gradient-to-tr from-cyan-600 to-blue-600 p-1 shadow-2xl transition-transform duration-700 group-hover:rotate-6">
                                                <div className="w-full h-full rounded-[2.3rem] bg-black flex items-center justify-center text-3xl font-black text-white">
                                                    {user.avatar}
                                                </div>
                                            </div>
                                            <button className="absolute -bottom-2 -right-2 p-3 rounded-2xl bg-white text-black shadow-2xl hover:scale-110 active:scale-95 transition-all cursor-pointer">
                                                <Camera size={18} />
                                            </button>
                                        </div>
                                        <div className="text-center sm:text-left flex-1 min-w-0">
                                            <h3 className="text-2xl font-black text-white tracking-tighter uppercase">{user.name}</h3>
                                            <p className="text-slate-500 text-xs font-bold mt-1">Session ID: <span className="text-slate-100 font-mono tracking-tighter">{user.id}</span></p>
                                            <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-6">
                                                <span className="px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[9px] font-black uppercase tracking-widest">{user.role} conductrice</span>
                                                <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                    Vérifié
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-3">
                                            <label className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] ml-1">Identité Complète</label>
                                            <div className="relative group/input">
                                                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 transition-colors group-focus-within/input:text-cyan-400" size={18} />
                                                <input
                                                    type="text"
                                                    defaultValue={user.name}
                                                    className="w-full pl-14 pr-6 py-5 bg-white/[0.015] border border-white/5 rounded-2xl text-sm font-bold text-white focus:outline-none focus:border-cyan-500/30 transition-all focus:bg-white/[0.03]"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] ml-1">Système de messagerie</label>
                                            <div className="relative group/input">
                                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 transition-colors group-focus-within/input:text-cyan-400" size={18} />
                                                <input
                                                    type="email"
                                                    placeholder="lucas.b@autodrive.pro"
                                                    className="w-full pl-14 pr-6 py-5 bg-white/[0.015] border border-white/5 rounded-2xl text-sm font-bold text-white focus:outline-none focus:border-cyan-500/30 transition-all focus:bg-white/[0.03]"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] ml-1">Canal de secours (Mobile)</label>
                                            <div className="relative group/input">
                                                <Smartphone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 transition-colors group-focus-within/input:text-cyan-400" size={18} />
                                                <input
                                                    type="tel"
                                                    placeholder="+33 6 00 00 00 00"
                                                    className="w-full pl-14 pr-6 py-5 bg-white/[0.015] border border-white/5 rounded-2xl text-sm font-bold text-white focus:outline-none focus:border-cyan-500/30 transition-all focus:bg-white/[0.03]"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] ml-1">Région Opérationnelle</label>
                                            <div className="relative group/input">
                                                <Globe className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 transition-colors group-focus-within/input:text-cyan-400" size={18} />
                                                <select className="w-full pl-14 pr-6 py-5 bg-white/[0.015] border border-white/5 rounded-2xl text-sm font-bold text-white focus:outline-none focus:border-cyan-500/30 transition-all appearance-none cursor-pointer">
                                                    <option>Île-de-France (Lutetia)</option>
                                                    <option>Lyon (Lugdunum)</option>
                                                    <option>Marseille (Massalia)</option>
                                                </select>
                                                <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-700 rotate-90" size={16} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-10 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
                                        <div className="flex items-center gap-3 text-slate-600">
                                            <Lock size={14} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Données encryptées AES-256</span>
                                        </div>
                                        <button
                                            onClick={handleSave}
                                            disabled={isSaving}
                                            className="btn-wow btn-wow-accent px-10 py-5 text-[10px] uppercase font-black tracking-[0.3em]"
                                        >
                                            {isSaving ? (
                                                <div className="flex items-center gap-3">
                                                    <div className="spinner-elegant" style={{ width: 14, height: 14, borderWidth: 1 }} />
                                                    Persistance...
                                                </div>
                                            ) : (
                                                <>
                                                    <Save size={18} />
                                                    Sauvegarder la configuration
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeSection !== 'profile' && (
                                <div className="py-24 text-center space-y-8 flex flex-col items-center">
                                    <div className="w-24 h-24 rounded-[2rem] bg-white/[0.01] border border-white/5 flex items-center justify-center text-slate-800 animate-pulse">
                                        {sections.find(s => s.id === activeSection)?.icon}
                                    </div>
                                    <div className="space-y-4 max-w-sm">
                                        <h3 className="text-slate-100 font-black uppercase tracking-widest text-sm">Module en optimisation</h3>
                                        <p className="text-slate-500 text-[11px] font-bold leading-relaxed">
                                            Les fonctions de {sections.find(s => s.id === activeSection)?.label} sont en cours de déploiement pour votre secteur.
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-cyan-500/5 border border-cyan-500/10 text-cyan-400 text-[9px] font-black uppercase tracking-widest">
                                        <Zap size={12} fill="currentColor" />
                                        Déploiement Prochain
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
