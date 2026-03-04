'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getUser, type User } from '@/lib/auth';
import { getUserProfile } from '@/app/actions/profile';
import { motion } from 'framer-motion';
import { User as UserIcon, Calendar, Clock, ArrowLeft, Building2, ChevronRight, GraduationCap, MapPin, Search, History } from 'lucide-react';

export default function PublicProfilePage() {
    const params = useParams();
    const router = useRouter();
    const targetId = params.id as string;

    const [viewer, setViewer] = useState<User | null>(null);
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        const u = getUser();
        if (!u) {
            router.replace('/login');
            return;
        }
        setViewer(u);

        getUserProfile(targetId, u.id, u.role).then(res => {
            if (res.success) {
                setProfile(res.profile);
            } else {
                setErrorMsg(res.error || 'Erreur inconnue');
            }
            setLoading(false);
        });
    }, [targetId, router]);

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center flex-col gap-4">
                <div className="w-8 h-8 border-2 border-[#00F5FF] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (errorMsg || !profile) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <div className="premium-card p-8 max-w-md text-center">
                    <UserIcon size={32} className="mx-auto mb-4 text-[#5F6B7A] opacity-50" />
                    <h2 className="text-lg font-bold text-white mb-2">Profil Inaccessible</h2>
                    <p className="text-sm text-[#8A94A6] mb-6">{errorMsg || 'Impossible de charger ce profil.'}</p>
                    <button onClick={() => router.back()} className="btn-secondary w-full justify-center">
                        Retour
                    </button>
                </div>
            </div>
        );
    }

    const { role } = profile;
    const isStudent = role === 'eleve';
    const isMoniteur = role === 'moniteur';

    // Seul un admin ou proprio peut voir l'historique complet, les autres voient juste les infos de base
    const canSeeHistory = profile.history !== undefined && profile.history.length > 0;

    return (
        <div className="space-y-10 group/profile">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-white/5">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#00F5FF]/30 hover:bg-white/5 text-[#5F6B7A] hover:text-[#00F5FF] transition-all group/back">
                        <ArrowLeft size={18} className="group-hover/back:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <h1 className="page-title">{profile.name}</h1>
                        <p className="text-sm text-[#8A94A6] mt-1 font-medium capitalize flex items-center gap-2">
                            {isStudent ? <GraduationCap size={14} className="text-[#00F5FF]" /> : <Search size={14} className="text-amber-400" />}
                            Profil {role}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Colonne gauche (Infos Générales) */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="premium-card p-8 text-center bg-[radial-gradient(circle_at_50%_0%,rgba(0,245,255,0.03)_0%,transparent_70%)] relative overflow-hidden">
                        <div className="w-24 h-24 rounded-full border-2 border-white/10 bg-[#0B0F14] shadow-2xl mx-auto flex items-center justify-center mb-6 relative z-10">
                            <span className="text-3xl font-black text-white/50">{profile.name.charAt(0)}</span>
                        </div>
                        <h2 className="text-xl font-black text-white capitalize">{profile.name}</h2>
                        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${isStudent ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                            }`}>
                            {role}
                        </span>

                        <div className="mt-8 space-y-3 text-left">
                            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                <div className="flex items-center gap-3">
                                    <Building2 size={16} className="text-[#5F6B7A]" />
                                    <span className="text-xs font-bold text-[#8A94A6]">Centre</span>
                                </div>
                                <span className="text-sm font-semibold text-white">{profile.centerName}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                <div className="flex items-center gap-3">
                                    <Calendar size={16} className="text-[#5F6B7A]" />
                                    <span className="text-xs font-bold text-[#8A94A6]">Inscrit le</span>
                                </div>
                                <span className="text-sm font-semibold text-white">{new Date(profile.createdAt).toLocaleDateString('fr-FR')}</span>
                            </div>
                            {profile.username && (
                                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <UserIcon size={16} className="text-[#5F6B7A]" />
                                        <span className="text-xs font-bold text-[#8A94A6]">Identifiant</span>
                                    </div>
                                    <span className="text-sm font-semibold text-white">{profile.username}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {isStudent && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="premium-card p-6 flex flex-col justify-between">
                                <div className="p-2.5 rounded-xl bg-[#00F5FF]/10 w-max mb-4 border border-[#00F5FF]/20 text-[#00F5FF]">
                                    <Clock size={18} />
                                </div>
                                <div>
                                    <div className="text-2xl font-black text-white">{profile.lessonsCount || 0}</div>
                                    <div className="text-[10px] font-bold text-[#5F6B7A] uppercase tracking-widest mt-1">Heures passées</div>
                                </div>
                            </div>
                            <div className="premium-card p-6 flex flex-col justify-between">
                                <div className="p-2.5 rounded-xl bg-indigo-500/10 w-max mb-4 border border-indigo-500/20 text-indigo-400">
                                    <Calendar size={18} />
                                </div>
                                <div>
                                    <div className="text-2xl font-black text-white">{profile.apptsCount || 0}</div>
                                    <div className="text-[10px] font-bold text-[#5F6B7A] uppercase tracking-widest mt-1">Sessions</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Colonne droite (Historique / Stats) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="premium-card p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-2xl bg-[#00F5FF]/10 flex items-center justify-center text-[#00F5FF]">
                                <History size={20} />
                            </div>
                            <h3 className="section-title">Historique des sessions</h3>
                        </div>

                        {canSeeHistory ? (
                            <div className="space-y-4">
                                {profile.history.map((item: any, i: number) => (
                                    <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.01] border border-white/5 hover:bg-white/[0.03] transition-colors group">
                                        <div className="flex items-center gap-6">
                                            <div className="text-center w-16 opacity-50 font-mono">
                                                <div className="text-[10px] font-bold uppercase tracking-widest">{new Date(item.date || item.created_at).toLocaleDateString('fr-FR', { month: 'short' })}</div>
                                                <div className="text-lg font-black">{new Date(item.date || item.created_at).getDate()}</div>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-white uppercase group-hover:text-[#00F5FF] transition-colors">{item.typeName}</h4>
                                                <p className="text-xs text-[#8A94A6] mt-1 flex items-center gap-2">
                                                    <UserIcon size={12} className="opacity-50" />
                                                    {isStudent ? 'Inst.' : 'Élève'} : <span className="text-white">{item.person}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${item.statusDisplay === 'Terminé' || item.statusDisplay === 'Terminée' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                                item.statusDisplay === 'À venir' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                                                    'bg-white/5 text-[#5F6B7A] border border-white/10'
                                                }`}>
                                                {item.statusDisplay}
                                            </span>
                                            {item.score && (
                                                <div className="text-xs font-bold text-amber-400 mt-2">
                                                    Note : {item.score}/20
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-[#5F6B7A] border-2 border-dashed border-white/5 rounded-2xl">
                                <Clock size={32} className="mx-auto mb-4 opacity-20" />
                                <p className="text-sm font-medium">L'historique n'est pas accessible ou est vide.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
