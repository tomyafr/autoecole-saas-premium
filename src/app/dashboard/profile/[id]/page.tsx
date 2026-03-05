'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getUser, type User } from '@/lib/auth';
import { getUserProfile } from '@/app/actions/profile';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User as UserIcon, Calendar, Clock, ArrowLeft, Building2,
    GraduationCap, History, Star, BookOpen, CreditCard,
    FileText, Award, Target, TrendingUp, CheckCircle2,
    Phone, Shield, ChevronRight, Users, X, PenTool, AlertTriangle
} from 'lucide-react';

export default function PublicProfilePage() {
    const params = useParams();
    const router = useRouter();
    const targetId = params.id as string;

    const [viewer, setViewer] = useState<User | null>(null);
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'competencies'>('overview');
    const [selectedHistoryItem, setSelectedHistoryItem] = useState<any | null>(null);
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
                <p className="text-xs text-[#5F6B7A] font-medium">Chargement du profil...</p>
            </div>
        );
    }

    if (errorMsg || !profile) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <div className="premium-card p-8 max-w-md text-center">
                    <Shield size={32} className="mx-auto mb-4 text-red-400 opacity-50" />
                    <h2 className="text-lg font-bold text-white mb-2">Profil Inaccessible</h2>
                    <p className="text-sm text-[#8A94A6] mb-6">{errorMsg || 'Impossible de charger ce profil.'}</p>
                    <button onClick={() => router.back()} className="btn-secondary w-full justify-center">
                        <ArrowLeft size={16} /> Retour
                    </button>
                </div>
            </div>
        );
    }

    const { role } = profile;
    const isStudent = role === 'eleve';
    const isMoniteur = role === 'moniteur';
    const stats = profile.stats || {};
    const canSeeHistory = profile.history && profile.history.length > 0;
    const hasCompetencies = profile.competencies && Object.keys(profile.competencies).length > 0;

    const tabs = [
        { id: 'overview' as const, label: 'Vue d\'ensemble', icon: <Target size={14} /> },
        { id: 'history' as const, label: 'Historique', icon: <History size={14} /> },
        ...(isStudent && hasCompetencies ? [{ id: 'competencies' as const, label: 'Compétences', icon: <BookOpen size={14} /> }] : []),
    ];

    const getLevelColor = (level: number) => {
        if (level >= 3) return 'bg-emerald-500';
        if (level >= 2) return 'bg-amber-400';
        if (level >= 1) return 'bg-orange-500';
        return 'bg-white/10';
    };

    return (
        <div className="space-y-8">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-white/5">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#00F5FF]/30 hover:bg-white/5 text-[#5F6B7A] hover:text-[#00F5FF] transition-all group/back">
                        <ArrowLeft size={18} className="group-hover/back:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <h1 className="page-title">{profile.name}</h1>
                        <p className="text-sm text-[#8A94A6] mt-1 font-medium capitalize flex items-center gap-2">
                            {isStudent ? <GraduationCap size={14} className="text-[#00F5FF]" /> : isMoniteur ? <Award size={14} className="text-amber-400" /> : <Shield size={14} className="text-emerald-400" />}
                            {isStudent ? 'Élève' : isMoniteur ? 'Formateur' : 'Administrateur'}
                        </p>
                    </div>
                </div>
                {/* TABS */}
                <div className="flex items-center gap-1 bg-white/[0.02] border border-white/5 rounded-xl p-1 overflow-x-auto max-w-full no-scrollbar">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-3 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id
                                ? 'bg-[#00F5FF]/10 text-[#00F5FF] border border-[#00F5FF]/20'
                                : 'text-[#5F6B7A] hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* CONTENT */}
            <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                    <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Colonne gauche — Carte identité */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="premium-card p-8 text-center bg-[radial-gradient(circle_at_50%_0%,rgba(0,245,255,0.03)_0%,transparent_70%)] relative overflow-hidden">
                                <div className="w-24 h-24 rounded-full border-2 border-white/10 bg-[#0B0F14] shadow-2xl mx-auto flex items-center justify-center mb-6 relative z-10">
                                    <span className="text-3xl font-black text-white/50">{profile.name.split(' ').map((n: string) => n[0]).join('')}</span>
                                </div>
                                <h2 className="text-xl font-black text-white">{profile.name}</h2>
                                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${isStudent ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                    isMoniteur ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                        'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                    }`}>
                                    {isStudent ? 'Élève' : isMoniteur ? 'Formateur' : 'Admin'}
                                </span>

                                <div className="mt-8 space-y-3 text-left">
                                    <InfoRow icon={<Building2 size={16} />} label="Centre" value={profile.centerName} />
                                    {profile.centerCity && <InfoRow icon={<Target size={16} />} label="Ville" value={profile.centerCity} />}
                                    <InfoRow icon={<Calendar size={16} />} label="Inscrit le" value={new Date(profile.createdAt).toLocaleDateString('fr-FR')} />
                                    {profile.phone && <InfoRow icon={<Phone size={16} />} label="Téléphone" value={profile.phone} />}
                                </div>
                            </div>

                            {/* Avancement (Élève) */}
                            {isStudent && stats.progressPercent !== undefined && (
                                <div className="premium-card p-6">
                                    <h3 className="text-[10px] font-black text-[#5F6B7A] uppercase tracking-widest mb-4">Avancement Global</h3>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-2xl font-black text-white">{stats.progressPercent}%</span>
                                        <span className="text-[10px] font-bold text-[#5F6B7A]">{stats.validatedComps}/{stats.totalComps} compétences</span>
                                    </div>
                                    <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${stats.progressPercent}%` }}
                                            transition={{ duration: 1, ease: 'easeOut' }}
                                            className="h-full bg-gradient-to-r from-[#00F5FF] to-emerald-400 rounded-full"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Colonne droite — Stats */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Stats Cards */}
                            {isStudent && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <StatCard icon={<Clock size={18} />} value={`${stats.totalHours || 0}h`} label="Heures effectuées" color="text-[#00F5FF]" sub={`/ ${stats.totalTarget || 35}h`} />
                                    <StatCard icon={<Calendar size={18} />} value={stats.completedSessions || 0} label="Sessions terminées" color="text-emerald-400" />
                                    <StatCard icon={<Target size={18} />} value={stats.pendingSessions || 0} label="Sessions à venir" color="text-amber-400" />
                                    <StatCard icon={<TrendingUp size={18} />} value={stats.avgScore ? `${stats.avgScore}/20` : 'N/A'} label="Moyenne notes" color="text-indigo-400" />
                                </div>
                            )}

                            {isMoniteur && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <StatCard icon={<Users size={18} />} value={stats.totalStudents || 0} label="Élèves suivis" color="text-[#00F5FF]" />
                                    <StatCard icon={<Clock size={18} />} value={`${stats.totalHoursGiven || 0}h`} label="Heures dispensées" color="text-emerald-400" />
                                    <StatCard icon={<Calendar size={18} />} value={stats.totalApptsPending || 0} label="Sessions à venir" color="text-amber-400" />
                                    <StatCard icon={<Star size={18} />} value={stats.avgRating ? `${stats.avgRating}/5` : 'N/A'} label="Note moyenne" color="text-indigo-400" />
                                </div>
                            )}

                            {/* Heures progression (Élève) */}
                            {isStudent && (
                                <div className="premium-card p-6">
                                    <h3 className="card-title mb-4">Progression des heures</h3>
                                    <div className="flex items-end gap-3 mb-2">
                                        <span className="text-3xl font-black text-white">{stats.totalHours || 0}</span>
                                        <span className="text-sm text-[#5F6B7A] font-bold mb-1">/ {stats.totalTarget || 35} heures</span>
                                    </div>
                                    <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden mt-2">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min(((stats.totalHours || 0) / (stats.totalTarget || 35)) * 100, 100)}%` }}
                                            transition={{ duration: 1.2, ease: 'easeOut' }}
                                            className="h-full bg-gradient-to-r from-[#00F5FF] via-blue-500 to-indigo-500 rounded-full relative"
                                        >
                                            <div className="absolute right-0 top-0 h-full w-2 bg-white/30 rounded-full" />
                                        </motion.div>
                                    </div>
                                </div>
                            )}

                            {/* Finances (élève - admin/moniteur uniquement) */}
                            {isStudent && (stats.totalPaid > 0 || stats.totalDue > 0) && (
                                <div className="premium-card p-6">
                                    <h3 className="card-title mb-4 flex items-center gap-2"><CreditCard size={16} className="text-emerald-400" /> Finances</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                                            <div className="text-xs text-emerald-400 font-bold uppercase tracking-widest mb-1">Payé</div>
                                            <div className="text-xl font-black text-emerald-400">{stats.totalPaid?.toLocaleString('fr-FR') || 0}€</div>
                                        </div>
                                        <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
                                            <div className="text-xs text-amber-400 font-bold uppercase tracking-widest mb-1">En attente</div>
                                            <div className="text-xl font-black text-amber-400">{stats.totalDue?.toLocaleString('fr-FR') || 0}€</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Documents (élève) */}
                            {isStudent && stats.docsStatus && (
                                <div className="premium-card p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="card-title flex items-center gap-2"><FileText size={16} className="text-blue-400" /> Dossier Administratif</h3>
                                            <p className="text-[9px] text-[#5F6B7A] font-bold uppercase tracking-widest mt-1">Conformité documents (CNI, Photos, etc.)</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                                            <div className="text-lg font-black text-white">{stats.docsStatus.total}</div>
                                            <div className="text-[9px] text-[#5F6B7A] font-bold uppercase tracking-widest mt-1">Total</div>
                                        </div>
                                        <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-center">
                                            <div className="text-lg font-black text-emerald-400">{stats.docsStatus.valid}</div>
                                            <div className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest mt-1">Validés</div>
                                        </div>
                                        <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 text-center">
                                            <div className="text-lg font-black text-amber-400">{stats.docsStatus.pending}</div>
                                            <div className="text-[9px] text-amber-400 font-bold uppercase tracking-widest mt-1">En attente</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Avis (moniteur) */}
                            {isMoniteur && profile.reviews && profile.reviews.length > 0 && (
                                <div className="premium-card p-6">
                                    <h3 className="card-title mb-4 flex items-center gap-2"><Star size={16} className="text-amber-400" /> Derniers avis</h3>
                                    <div className="space-y-3">
                                        {profile.reviews.map((r: any, i: number) => (
                                            <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-xs font-bold text-white">{r.studentName}</span>
                                                    <div className="flex items-center gap-1">
                                                        {[...Array(5)].map((_, j) => (
                                                            <Star key={j} size={12} className={j < r.rating ? 'text-amber-400 fill-amber-400' : 'text-white/10'} />
                                                        ))}
                                                    </div>
                                                </div>
                                                {r.comment && <p className="text-xs text-[#8A94A6]">{r.comment}</p>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {activeTab === 'history' && (
                    <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        <div className="premium-card p-8">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 rounded-2xl bg-[#00F5FF]/10 flex items-center justify-center text-[#00F5FF]">
                                    <History size={20} />
                                </div>
                                <div>
                                    <h3 className="section-title">Historique complet</h3>
                                    <p className="text-xs text-[#5F6B7A] mt-0.5">{canSeeHistory ? `${profile.history.length} entrées` : 'Aucune donnée'}</p>
                                </div>
                            </div>

                            {canSeeHistory ? (
                                <div className="space-y-4">
                                    {profile.history.map((item: any, i: number) => {
                                        const isLesson = item.typeName?.toLowerCase().includes('leçon');
                                        const isDone = item.statusDisplay?.toLowerCase().includes('terminé') || item.statusDisplay?.toLowerCase().includes('complété');
                                        const clickable = isLesson && isDone;

                                        return (
                                            <div
                                                key={i}
                                                onClick={() => clickable && setSelectedHistoryItem(item)}
                                                className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-2xl bg-white/[0.01] border border-white/5 hover:bg-white/[0.03] transition-colors group gap-4 ${clickable ? 'cursor-pointer' : ''}`}
                                            >
                                                <div className="flex items-center gap-5">
                                                    <div className="text-center w-14 shrink-0 opacity-60 font-mono">
                                                        <div className="text-[10px] font-bold uppercase tracking-widest text-[#8A94A6]">{new Date(item.date).toLocaleDateString('fr-FR', { month: 'short' })}</div>
                                                        <div className="text-lg font-black text-white">{new Date(item.date).getDate()}</div>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-bold text-white group-hover:text-[#00F5FF] transition-colors">{item.typeName}</h4>
                                                        <p className="text-xs text-[#8A94A6] mt-1 flex items-center gap-2">
                                                            <UserIcon size={12} className="opacity-50" />
                                                            {isStudent ? 'Formateur' : 'Élève'} : <span className="text-white font-medium">{item.person}</span>
                                                            {item.time && <span className="text-[#5F6B7A]">— {item.time}</span>}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 shrink-0">
                                                    {item.score && (
                                                        <span className="text-sm font-bold text-amber-400">{item.score}/20</span>
                                                    )}
                                                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${item.statusDisplay === 'Terminé' || item.statusDisplay === 'Terminée' || item.statusDisplay === 'Complété' || item.statusDisplay === 'Complétée' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                                        item.statusDisplay === 'À venir' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                                                            'bg-white/5 text-[#5F6B7A] border border-white/10'
                                                        }`}>
                                                        {item.statusDisplay}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-16 text-[#5F6B7A] border-2 border-dashed border-white/5 rounded-2xl">
                                    <Clock size={36} className="mx-auto mb-4 opacity-20" />
                                    <p className="text-sm font-medium">Aucune session dans l'historique.</p>
                                    <p className="text-xs text-[#5F6B7A] mt-1">Les sessions apparaîtront ici au fur et à mesure.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {activeTab === 'competencies' && isStudent && hasCompetencies && (
                    <motion.div key="competencies" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        <div className="space-y-8">
                            {Object.entries(profile.competencies).map(([category, comps]: [string, any]) => (
                                <div key={category} className="premium-card p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                                            <BookOpen size={20} />
                                        </div>
                                        <div>
                                            <h3 className="section-title">{category}</h3>
                                            <p className="text-xs text-[#5F6B7A] mt-0.5">{comps.length} compétence{comps.length > 1 ? 's' : ''}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        {comps.map((comp: any, i: number) => (
                                            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.03] transition-colors">
                                                <span className="text-sm font-medium text-white">{comp.title}</span>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex gap-1">
                                                        {[0, 1, 2, 3].map(lvl => (
                                                            <div key={lvl} className={`w-6 h-2 rounded-full transition-colors ${lvl < comp.level ? getLevelColor(comp.level) : 'bg-white/10'}`} />
                                                        ))}
                                                    </div>
                                                    <span className="text-[10px] font-black text-[#5F6B7A] w-6 text-right">{comp.level}/3</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* MODAL DÉTAILS LEÇON */}
            <AnimatePresence>
                {selectedHistoryItem && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setSelectedHistoryItem(null)} />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 30 }}
                            className="relative w-full max-w-2xl bg-[#0B0F14] border border-[#00F5FF]/30 rounded-[2.5rem] shadow-[0_0_100px_rgba(0,245,255,0.15)] overflow-hidden max-h-[90vh] flex flex-col"
                        >
                            {/* Modal Header */}
                            <div className="p-8 pb-6 border-b border-white/5 flex items-center justify-between bg-gradient-to-b from-white/[0.02] to-transparent">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-[#00F5FF]/10 flex items-center justify-center text-[#00F5FF] shadow-[0_0_20px_rgba(0,245,255,0.1)]">
                                        <FileText size={28} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Bilan de Séance</h2>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] font-black text-[#8A94A6] uppercase tracking-[0.2em] bg-white/5 px-2 py-0.5 rounded">
                                                {new Date(selectedHistoryItem.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </span>
                                            {selectedHistoryItem.time && (
                                                <span className="text-[10px] font-black text-[#00F5FF] uppercase tracking-[0.2em] bg-[#00F5FF]/5 px-2 py-0.5 rounded">
                                                    {selectedHistoryItem.time}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedHistoryItem(null)} className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-[#5F6B7A] hover:text-white transition-all">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
                                {/* Core Stats Row */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-gradient-to-br from-[#00F5FF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <p className="text-[10px] font-black text-[#5F6B7A] uppercase tracking-[0.2em] mb-2 relative">Note Globale</p>
                                        <p className="text-4xl font-black text-white relative flex items-baseline gap-1">
                                            {selectedHistoryItem.score || '-'}
                                            <span className="text-sm text-[#5F6B7A]">/20</span>
                                        </p>
                                    </div>
                                    <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 md:col-span-2 flex items-center gap-6">
                                        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xl font-black text-[#5F6B7A]">
                                            {selectedHistoryItem.person.split(' ').map((n: string) => n[0]).join('')}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-[#5F6B7A] uppercase tracking-[0.2em] mb-1">{isStudent ? 'Votre Moniteur' : 'Votre Élève'}</p>
                                            <p className="text-xl font-black text-white uppercase tracking-tight">{selectedHistoryItem.person}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Comments Section */}
                                <div className="space-y-6">
                                    {selectedHistoryItem.note && (
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                                                    <Star size={16} fill="currentColor" />
                                                </div>
                                                <h3 className="text-xs font-black text-white uppercase tracking-widest">Points forts & Feedback</h3>
                                            </div>
                                            <div className="p-6 rounded-3xl bg-[#00F5FF]/[0.02] border border-[#00F5FF]/10 text-base italic text-[#8A94A6] leading-relaxed shadow-inner">
                                                "{selectedHistoryItem.note}"
                                            </div>
                                        </div>
                                    )}

                                    {selectedHistoryItem.negative_points && (
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                                                    <AlertTriangle size={16} />
                                                </div>
                                                <h3 className="text-xs font-black text-white uppercase tracking-widest">Axes de progression</h3>
                                            </div>
                                            <div className="p-6 rounded-3xl bg-amber-500/[0.02] border border-amber-500/10 text-base text-[#8A94A6] leading-relaxed shadow-inner">
                                                {selectedHistoryItem.negative_points}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Signatures Area */}
                                {selectedHistoryItem.signature && (
                                    <div className="pt-8 border-t border-white/5 space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                                                    <PenTool size={16} />
                                                </div>
                                                <h3 className="text-xs font-black text-white uppercase tracking-widest">Signatures numériques</h3>
                                            </div>
                                            {selectedHistoryItem.signed_at && (
                                                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/5 px-3 py-1 rounded-full border border-emerald-500/10">
                                                    Validé le {new Date(selectedHistoryItem.signed_at).toLocaleDateString('fr-FR')} • {new Date(selectedHistoryItem.signed_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <div className="h-32 bg-white/[0.02] rounded-[1.5rem] border border-white/5 flex items-center justify-center overflow-hidden p-4 relative group">
                                                    <div className="absolute top-2 left-3 text-[8px] font-black text-[#5F6B7A] uppercase tracking-widest">Élève</div>
                                                    {(() => {
                                                        try {
                                                            if (!selectedHistoryItem.signature) return <span className="text-[10px]">Indisponible</span>;
                                                            let src = selectedHistoryItem.signature;
                                                            if (src.startsWith('{')) src = JSON.parse(src).student;
                                                            return <img src={src} alt="Signature Eleve" className="max-h-full max-w-full opacity-60 invert brightness-200 contrast-125" />;
                                                        } catch (e) { return <span className="text-[10px]">Corrompu</span>; }
                                                    })()}
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="h-32 bg-white/[0.02] rounded-[1.5rem] border border-white/5 flex items-center justify-center overflow-hidden p-4 relative">
                                                    <div className="absolute top-2 left-3 text-[8px] font-black text-[#5F6B7A] uppercase tracking-widest">Formateur</div>
                                                    {(() => {
                                                        try {
                                                            if (!selectedHistoryItem.signature) return <span className="text-[10px]">Indisponible</span>;
                                                            if (!selectedHistoryItem.signature.startsWith('{')) return <span className="text-[10px] opacity-20">Auto-validé</span>;
                                                            const src = JSON.parse(selectedHistoryItem.signature).instructor;
                                                            return <img src={src} alt="Signature Moniteur" className="max-h-full max-w-full opacity-60 invert brightness-200 contrast-125" />;
                                                        } catch (e) { return <span className="text-[10px]">Corrompu</span>; }
                                                    })()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="p-8 bg-white/[0.02] border-t border-white/5 flex justify-end">
                                <button
                                    onClick={() => setSelectedHistoryItem(null)}
                                    className="px-8 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white text-xs font-black uppercase tracking-widest transition-all"
                                >
                                    Fermer le bilan
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            Broadway
        </div>
    );
}

// Composants utilitaires
function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="flex items-center gap-3">
                <span className="text-[#5F6B7A]">{icon}</span>
                <span className="text-xs font-bold text-[#8A94A6]">{label}</span>
            </div>
            <span className="text-sm font-semibold text-white">{value}</span>
        </div>
    );
}

function StatCard({ icon, value, label, color, sub }: { icon: React.ReactNode; value: any; label: string; color: string; sub?: string }) {
    return (
        <div className="premium-card p-5 flex flex-col justify-between min-h-[130px]">
            <div className={`p-2 rounded-lg bg-white/[0.03] border border-white/5 w-max ${color}`}>
                {icon}
            </div>
            <div className="mt-3">
                <div className="flex items-baseline gap-1">
                    <span className="text-xl font-black text-white">{value}</span>
                    {sub && <span className="text-[10px] font-bold text-[#5F6B7A]">{sub}</span>}
                </div>
                <div className="text-[9px] font-bold text-[#5F6B7A] uppercase tracking-widest mt-1">{label}</div>
            </div>
        </div>
    );
}
