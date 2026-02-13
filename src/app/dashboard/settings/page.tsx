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
    Zap,
    Hexagon,
    AlertCircle
} from 'lucide-react';
import { getUser, logout, type User as UserType } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
    const router = useRouter();
    const [user, setUser] = useState<UserType | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState('profile');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const u = getUser();
        if (u) {
            setUser(u);
            setLoading(false);
        } else {
            // If No user found in Settings, layout will handle logout but let's be safe
            router.replace('/login');
        }
    }, [router]);

    const handleLogout = () => {
        logout();
        router.replace('/');
    };

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => setIsSaving(false), 1500);
    };

    if (loading || !user) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-[#00F5FF] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const sections = [
        { id: 'profile', label: 'Profil Personnel', icon: <User size={18} />, desc: 'Identité et préférences publiques' },
        { id: 'notifications', label: 'Alertes & Emails', icon: <Bell size={18} />, desc: 'Flux de communication tactique' },
        { id: 'security', label: 'Sécurité Avancée', icon: <Shield size={18} />, desc: 'Accréditations et persistances' },
        { id: 'preferences', label: 'Interface & Langue', icon: <Globe size={18} />, desc: 'Configuration de l\'environnement' },
    ];

    return (
        <div className="space-y-10 group/settings">
            {/* Superior Breadcrumb Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                <div>
                    <h1 className="page-title">Paramètres Système</h1>
                    <p className="text-sm text-[#8A94A6] mt-1 font-medium">Configuration de votre terminal opérationnel AutoDrive Pro.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/5 text-[9px] font-black text-[#5F6B7A] uppercase tracking-widest flex items-center gap-3">
                        <Monitor size={12} className="text-[#00F5FF]" />
                        Dernière synchro: <span className="text-white">Aujourd&#39;hui, 14:20</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-10">
                {/* Navigation Tactical Rail */}
                <div className="space-y-3">
                    {sections.map(section => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`
                                w-full flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 cursor-pointer group
                                ${activeSection === section.id
                                    ? 'bg-[#00F5FF]/[0.05] border-[#00F5FF]/20 text-[#00F5FF] shadow-[0_15px_30px_-10px_rgba(0,245,255,0.1)]'
                                    : 'bg-white/[0.01] border-white/5 text-[#5F6B7A] hover:text-white hover:bg-white/[0.03]'}
                            `}
                        >
                            <div className="flex items-center gap-4 text-left">
                                <div className={`transition-transform duration-300 group-hover:scale-110 ${activeSection === section.id ? 'text-[#00F5FF]' : 'text-[#8A94A6]'}`}>
                                    {section.icon}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[11px] font-black uppercase tracking-widest">{section.label}</span>
                                    <span className="text-[9px] text-[#5F6B7A] font-medium mt-0.5">{section.desc}</span>
                                </div>
                            </div>
                            {activeSection === section.id && (
                                <motion.div layoutId="setting-arrow">
                                    <ChevronRight size={14} className="text-[#00F5FF]" />
                                </motion.div>
                            )}
                        </button>
                    ))}

                    <div className="pt-8">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-4 p-5 rounded-2xl bg-red-500/[0.03] border border-red-500/10 text-red-500/60 hover:text-red-500 hover:bg-red-500/[0.08] transition-all cursor-pointer font-black text-[10px] uppercase tracking-[0.2em]"
                        >
                            <LogOut size={18} />
                            Quitter la Session
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
                            transition={{ duration: 0.3 }}
                            className="premium-card p-8 md:p-12 space-y-12"
                        >
                            {activeSection === 'profile' && (
                                <div className="space-y-12">
                                    <div className="flex flex-col sm:flex-row items-center gap-10">
                                        <div className="relative group">
                                            <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-tr from-blue-600 to-[#00F5FF] p-1 shadow-2xl transition-transform duration-700 group-hover:rotate-6">
                                                <div className="w-full h-full rounded-[2.3rem] bg-[#0E1319] flex items-center justify-center text-4xl font-black text-white">
                                                    {user.avatar}
                                                </div>
                                            </div>
                                            <button className="absolute -bottom-2 -right-2 p-3 rounded-2xl bg-[#00F5FF] text-black shadow-2xl hover:scale-110 active:scale-95 transition-all cursor-pointer border-4 border-[#0B0F14]">
                                                <Camera size={18} />
                                            </button>
                                        </div>
                                        <div className="text-center sm:text-left flex-1 min-w-0">
                                            <h3 className="text-3xl font-black text-white tracking-tighter uppercase">{user.name}</h3>
                                            <p className="text-[#8A94A6] text-xs font-bold mt-1">UUID: <span className="text-white font-mono tracking-tighter">{user.id}</span></p>
                                            <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-8">
                                                <div className="px-4 py-2 rounded-xl bg-[#00F5FF]/10 border border-[#00F5FF]/20 text-[#00F5FF] text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                                                    <Hexagon size={12} fill="currentColor" />
                                                    {user.role} conductrice
                                                </div>
                                                <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                    Session Vérifiée
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] text-[#5F6B7A] uppercase font-black tracking-[0.2em] ml-1">Call Sign / Nom Complet</label>
                                            <div className="relative group/input">
                                                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-[#5F6B7A] transition-colors group-focus-within/input:text-[#00F5FF]" size={18} />
                                                <input
                                                    type="text"
                                                    defaultValue={user.name}
                                                    className="w-full pl-14 pr-6 py-5 bg-white/[0.01] border border-white/5 rounded-2xl text-sm font-bold text-white focus:outline-none focus:border-[#00F5FF]/20 transition-all focus:bg-white/[0.03]"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] text-[#5F6B7A] uppercase font-black tracking-[0.2em] ml-1">Terminal de messagerie</label>
                                            <div className="relative group/input">
                                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-[#5F6B7A] transition-colors group-focus-within/input:text-[#00F5FF]" size={18} />
                                                <input
                                                    type="email"
                                                    placeholder="lucas.b@autodrive.pro"
                                                    className="w-full pl-14 pr-6 py-5 bg-white/[0.01] border border-white/5 rounded-2xl text-sm font-bold text-white focus:outline-none focus:border-[#00F5FF]/20 transition-all focus:bg-white/[0.03]"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] text-[#5F6B7A] uppercase font-black tracking-[0.2em] ml-1">Liaison Mobile</label>
                                            <div className="relative group/input">
                                                <Smartphone className="absolute left-5 top-1/2 -translate-y-1/2 text-[#5F6B7A] transition-colors group-focus-within/input:text-[#00F5FF]" size={18} />
                                                <input
                                                    type="tel"
                                                    placeholder="+33 6 00 00 00 00"
                                                    className="w-full pl-14 pr-6 py-5 bg-white/[0.01] border border-white/5 rounded-2xl text-sm font-bold text-white focus:outline-none focus:border-[#00F5FF]/20 transition-all focus:bg-white/[0.03]"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] text-[#5F6B7A] uppercase font-black tracking-[0.2em] ml-1">Région Opérationnelle</label>
                                            <div className="relative group/input">
                                                <Globe className="absolute left-5 top-1/2 -translate-y-1/2 text-[#5F6B7A] transition-colors group-focus-within/input:text-[#00F5FF]" size={18} />
                                                <select className="w-full pl-14 pr-6 py-5 bg-white/[0.01] border border-white/5 rounded-2xl text-sm font-bold text-white focus:outline-none focus:border-[#00F5FF]/20 transition-all appearance-none cursor-pointer">
                                                    <option>Île-de-France (HQ)</option>
                                                    <option>Lyon (Secteur B)</option>
                                                    <option>Marseille (Secteur C)</option>
                                                </select>
                                                <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 text-[#5F6B7A] rotate-90" size={16} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-10 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
                                        <div className="flex items-center gap-3 text-[#5F6B7A]">
                                            <Lock size={14} className="text-[#00F5FF]/50" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Protocoles de Chiffrement Actifs</span>
                                        </div>
                                        <button
                                            onClick={handleSave}
                                            disabled={isSaving}
                                            className="btn-primary"
                                        >
                                            {isSaving ? (
                                                <div className="flex items-center gap-3">
                                                    <div className="spinner-elegant" style={{ width: 14, height: 14, borderWidth: 1 }} />
                                                    Persistance...
                                                </div>
                                            ) : (
                                                <>
                                                    <Save size={18} />
                                                    Persister les Changements
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeSection !== 'profile' && (
                                <div className="py-24 text-center space-y-8 flex flex-col items-center">
                                    <div className="w-24 h-24 rounded-[2rem] bg-white/[0.01] border border-white/5 flex items-center justify-center text-[#5F6B7A] group/icon">
                                        {sections.find(s => s.id === activeSection) &&
                                            <div className="transition-transform duration-500 group-hover/icon:scale-110">
                                                {sections.find(s => s.id === activeSection)?.icon}
                                            </div>
                                        }
                                    </div>
                                    <div className="space-y-4 max-w-sm">
                                        <h3 className="text-white font-black uppercase tracking-widest text-sm">Secteur en Optimisation</h3>
                                        <p className="text-[#8A94A6] text-[11px] font-bold leading-relaxed px-6">
                                            Les segments de {sections.find(s => s.id === activeSection)?.label} sont en cours de calibrage pour votre terminal.
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3 px-6 py-2.5 rounded-xl bg-amber-500/5 border border-amber-500/10 text-amber-500 text-[9px] font-black uppercase tracking-widest">
                                        <AlertCircle size={12} fill="currentColor" className="opacity-50" />
                                        Accès Prioritaire Prochainement
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
