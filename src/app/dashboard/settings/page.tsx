'use client';

import { useState, useEffect, useRef } from 'react';
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
import ThemeToggle from '@/components/ThemeToggle';
import { updateUserProfile } from '@/app/actions/auth';
import { toast } from 'sonner';

export default function SettingsPage() {
    const router = useRouter();
    const [user, setUser] = useState<UserType | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState('profile');
    const [isSaving, setIsSaving] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [currentTime, setCurrentTime] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        const now = new Date();
        setCurrentTime(`Aujourd'hui, ${now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`);
        const u = getUser();
        if (u) {
            setUser(u);
            setName(u.name || '');
            setPhone((u as any).phone || '');
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

    const handleSave = async () => {
        if (!user) return;
        setIsSaving(true);
        try {
            const res = await updateUserProfile(user.id, { name, phone });
            if (res.success) {
                toast.success("Profil mis à jour !");
            } else {
                toast.error("Erreur: " + res.error);
            }
        } catch (error) {
            toast.error("Une erreur est survenue.");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading || !user) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-[#00F5FF] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const displayAvatar = user.avatar !== '??'
        ? user.avatar
        : (user.name ? user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : '??');

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        // Simulation d'upload pour la démo, ou future implémentation Supabase Storage
        setTimeout(() => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64Avatar = event.target?.result as string;
                // Update local storage and state for quick feedback
                const updatedUser = { ...user, avatar: base64Avatar };
                if (typeof window !== 'undefined') {
                    localStorage.setItem('autodrive_user', JSON.stringify(updatedUser));
                }
                setUser(updatedUser);
                setIsUploading(false);
                toast.success("Photo de profil mise à jour !");
            };
            reader.readAsDataURL(file);
        }, 1500);
    };

    const sections = [
        { id: 'profile', label: 'Profil Personnel', icon: <User size={18} />, desc: 'Identité et préférences publiques' },
        { id: 'notifications', label: 'Alertes & Emails', icon: <Bell size={18} />, desc: 'Gestion de vos communications' },
        { id: 'security', label: 'Sécurité Avancée', icon: <Shield size={18} />, desc: 'Mots de passe et authentification' },
        { id: 'preferences', label: 'Interface & Langue', icon: <Globe size={18} />, desc: 'Paramètres régionaux & visuels' },
    ];

    return (
        <div className="space-y-10 group/settings">
            {/* Superior Breadcrumb Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                <div>
                    <h1 className="page-title">Mes Paramètres</h1>
                    <p className="text-sm text-[#8A94A6] mt-1 font-medium">Personnalisation de votre espace AutoDrive Pro.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 rounded-xl bg-[var(--color-sidebar)] border border-[var(--color-border-subtle)] text-[9px] font-black text-[#5F6B7A] uppercase tracking-widest flex items-center gap-3">
                        <Monitor size={12} className="text-[#00F5FF]" />
                        Dernière synchro: <span className="text-[var(--color-text-primary)]">{currentTime}</span>
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
                                    : 'bg-[var(--color-card)] border-[var(--color-border-subtle)] text-[#5F6B7A] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-sidebar)]'}
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
                                                <div className="w-full h-full rounded-[2.3rem] overflow-hidden bg-[#0E1319] flex items-center justify-center text-4xl font-black text-[var(--color-text-primary)]">
                                                    {isUploading ? (
                                                        <div className="w-8 h-8 border-2 border-[#00F5FF] border-t-transparent rounded-full animate-spin"></div>
                                                    ) : user.avatar && user.avatar.startsWith('data:image') ? (
                                                        <img src={user.avatar} className="w-full h-full object-cover" alt="Profile" />
                                                    ) : (
                                                        displayAvatar
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                className="absolute -bottom-2 -right-2 p-3 rounded-2xl bg-[#00F5FF] text-black shadow-2xl hover:scale-110 active:scale-95 transition-all cursor-pointer border-4 border-[#0B0F14]"
                                            >
                                                <Camera size={18} />
                                            </button>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleAvatarChange}
                                                accept="image/*"
                                                className="hidden"
                                                capture="environment"
                                            />
                                        </div>
                                        <div className="text-center sm:text-left flex-1 min-w-0">
                                            <h3 className="text-3xl font-black text-[var(--color-text-primary)] tracking-tighter uppercase">{user.name}</h3>
                                            <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-8">
                                                <div className="px-4 py-2 rounded-xl bg-[#00F5FF]/10 border border-[#00F5FF]/20 text-[#00F5FF] text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                                                    <Hexagon size={12} fill="currentColor" />
                                                    {user.role === 'eleve' ? 'Élève Conducteur/trice' : user.role}
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
                                            <label className="text-[10px] text-[#5F6B7A] uppercase font-black tracking-[0.2em] ml-1">Prénom & Nom</label>
                                            <div className="relative group/input">
                                                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-[#5F6B7A] transition-colors group-focus-within/input:text-[#00F5FF]" size={18} />
                                                <input
                                                    type="text"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    className="w-full pl-14 pr-6 py-5 bg-[var(--color-card)] border border-[var(--color-border-subtle)] rounded-2xl text-sm font-bold text-[var(--color-text-primary)] focus:outline-none focus:border-[#00F5FF]/20 transition-all focus:bg-[var(--color-sidebar)]"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] text-[#5F6B7A] uppercase font-black tracking-[0.2em] ml-1">Adresse Email</label>
                                            <div className="relative group/input">
                                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-[#5F6B7A] transition-colors group-focus-within/input:text-[#00F5FF]" size={18} />
                                                <input
                                                    type="email"
                                                    placeholder="lucas.b@autodrive.pro"
                                                    className="w-full pl-14 pr-6 py-5 bg-[var(--color-card)] border border-[var(--color-border-subtle)] rounded-2xl text-sm font-bold text-[var(--color-text-primary)] focus:outline-none focus:border-[#00F5FF]/20 transition-all focus:bg-[var(--color-sidebar)]"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] text-[#5F6B7A] uppercase font-black tracking-[0.2em] ml-1">Numéro de Téléphone</label>
                                            <div className="relative group/input">
                                                <Smartphone className="absolute left-5 top-1/2 -translate-y-1/2 text-[#5F6B7A] transition-colors group-focus-within/input:text-[#00F5FF]" size={18} />
                                                <input
                                                    type="tel"
                                                    placeholder="+33 6 00 00 00 00"
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                    className="w-full pl-14 pr-6 py-5 bg-[var(--color-card)] border border-[var(--color-border-subtle)] rounded-2xl text-sm font-bold text-[var(--color-text-primary)] focus:outline-none focus:border-[#00F5FF]/20 transition-all focus:bg-[var(--color-sidebar)]"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] text-[#5F6B7A] uppercase font-black tracking-[0.2em] ml-1">Centre de Rattachement</label>
                                            <div className="relative group/input">
                                                <Globe className="absolute left-5 top-1/2 -translate-y-1/2 text-[#5F6B7A] transition-colors group-focus-within/input:text-[#00F5FF]" size={18} />
                                                <select
                                                    disabled={user.role === 'eleve'}
                                                    className={`w-full pl-14 pr-6 py-5 bg-[var(--color-card)] border border-[var(--color-border-subtle)] rounded-2xl text-sm font-bold text-[var(--color-text-primary)] focus:outline-none focus:border-[#00F5FF]/20 transition-all appearance-none ${user.role === 'eleve' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                                >
                                                    <option>Île-de-France (Centre Principal)</option>
                                                    <option>Lyon (Agence Sud)</option>
                                                    <option>Marseille (Agence Mer)</option>
                                                </select>
                                                <ChevronRight className={`absolute right-5 top-1/2 -translate-y-1/2 text-[#5F6B7A] ${user.role === 'eleve' ? 'opacity-50' : 'rotate-90'}`} size={16} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-10 border-t border-[var(--color-border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-6">
                                        <div className="flex items-center gap-3 text-[#5F6B7A]">
                                            <Lock size={14} className="text-[#00F5FF]/50" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Connexion sécurisée</span>
                                        </div>
                                        <button
                                            onClick={handleSave}
                                            disabled={isSaving}
                                            className="btn-primary"
                                        >
                                            {isSaving ? (
                                                <div className="flex items-center gap-3">
                                                    <div className="spinner-elegant" style={{ width: 14, height: 14, borderWidth: 1 }} />
                                                    Enregistrement...
                                                </div>
                                            ) : (
                                                <>
                                                    <Save size={18} />
                                                    Enregistrer les modifications
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeSection === 'preferences' && (
                                <div className="space-y-12">
                                    <div className="flex items-center gap-6">
                                        <div className="p-4 rounded-2xl bg-[#00F5FF]/10 text-[#00F5FF]">
                                            <Monitor size={32} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-[var(--color-text-primary)] uppercase tracking-tighter">Affichage de l'Interface</h3>
                                            <p className="text-[#8A94A6] text-xs font-bold mt-1">Personnalisation de l'environnement visuel</p>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="p-6 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border-subtle)] space-y-6">
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                                                <div>
                                                    <h4 className="text-sm font-bold text-[var(--color-text-primary)] uppercase tracking-wide">Mode d'affichage</h4>
                                                    <p className="text-[10px] text-[#5F6B7A] font-medium mt-1">Choisissez entre le thème Clair et le Sombre</p>
                                                </div>
                                                <ThemeToggle />
                                            </div>
                                        </div>


                                    </div>
                                </div>
                            )}

                            {activeSection === 'notifications' && (
                                <div className="space-y-12">
                                    <div className="flex items-center gap-6">
                                        <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-500">
                                            <Bell size={32} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-[var(--color-text-primary)] uppercase tracking-tighter">Alertes & Emails</h3>
                                            <p className="text-[#8A94A6] text-xs font-bold mt-1">Préférences de communications</p>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        {[
                                            { title: 'Rappels de leçons (SMS / WhatsApp)', desc: 'Reçois un message 24h avant chaque heure de conduite', active: true },
                                            { title: 'Nouvelles disponibilités', desc: 'Alertes lors de l\'ajout de nouveaux créneaux', active: false },
                                            { title: 'Rapports hebdomadaires', desc: 'Analyse synthétique de ta progression par email', active: true }
                                        ].map((setting, idx) => (
                                            <div key={idx} className="p-6 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border-subtle)] flex items-center justify-between gap-4 transition-all hover:border-[#00F5FF]/20">
                                                <div>
                                                    <h4 className="text-sm font-bold text-[var(--color-text-primary)] uppercase tracking-wide">{setting.title}</h4>
                                                    <p className="text-[10px] text-[#5F6B7A] font-medium mt-1">{setting.desc}</p>
                                                </div>
                                                <div className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${setting.active ? 'bg-[#00F5FF]' : 'bg-[var(--color-sidebar)] border border-[var(--color-border-subtle)]'}`}>
                                                    <div className={`w-4 h-4 rounded-full transition-transform ${setting.active ? 'translate-x-6 bg-[#0B0F14]' : 'bg-[#5F6B7A]'}`} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeSection === 'security' && (
                                <div className="space-y-12">
                                    <div className="flex items-center gap-6">
                                        <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-500">
                                            <Shield size={32} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-[var(--color-text-primary)] uppercase tracking-tighter">Sécurité Avancée</h3>
                                            <p className="text-[#8A94A6] text-xs font-bold mt-1">Sécurisation du compte AutoDrive</p>
                                        </div>
                                    </div>

                                    <div className="p-6 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border-subtle)] space-y-6">
                                        <div>
                                            <h4 className="text-sm font-bold text-[var(--color-text-primary)] uppercase tracking-wide mb-4">Changement de mot de passe</h4>
                                            <div className="space-y-4">
                                                <div className="relative">
                                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-[#5F6B7A]" size={18} />
                                                    <input
                                                        type="password"
                                                        placeholder="Mot de passe actuel"
                                                        className="w-full pl-14 pr-6 py-4 bg-[var(--color-sidebar)] border border-[var(--color-border-subtle)] rounded-xl text-sm font-medium focus:border-[#00F5FF]/30 transition-all focus:outline-none"
                                                    />
                                                </div>
                                                <div className="relative">
                                                    <Shield className="absolute left-5 top-1/2 -translate-y-1/2 text-[#5F6B7A]" size={18} />
                                                    <input
                                                        type="password"
                                                        placeholder="Nouveau mot de passe"
                                                        className="w-full pl-14 pr-6 py-4 bg-[var(--color-sidebar)] border border-[var(--color-border-subtle)] rounded-xl text-sm font-medium focus:border-[#00F5FF]/30 transition-all focus:outline-none"
                                                    />
                                                </div>
                                                <button className="btn-secondary w-full sm:w-auto mt-2">
                                                    Mettre à jour le mot de passe
                                                </button>
                                            </div>
                                        </div>

                                        <div className="pt-6 border-t border-[var(--color-border-subtle)]">
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                                <div>
                                                    <h4 className="text-sm font-bold text-[var(--color-text-primary)] uppercase tracking-wide">Déconnexion de tous les appareils</h4>
                                                    <p className="text-[10px] text-[#5F6B7A] font-medium mt-1">Ferme les sessions web et mobile ouvertes.</p>
                                                </div>
                                                <button className="px-4 py-2.5 rounded-lg border border-red-500/20 text-red-500 text-xs font-bold uppercase hover:bg-red-500/10 transition-colors">
                                                    Forcer la déconnexion
                                                </button>
                                            </div>
                                        </div>
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
