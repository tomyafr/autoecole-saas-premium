'use client';

import { motion } from 'framer-motion';
import {
    Calendar,
    Star,
    CreditCard,
    ArrowUpRight,
    Play,
    Zap,
    Timer,
    Target,
    Hexagon,
    FileText,
    Clock,
    AlertCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getUser, type User } from '@/lib/auth';
import { getStudentDashboard } from '@/app/actions/dashboard';
import Link from 'next/link';
import { AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { getStudentPedagogyData } from '@/app/actions/pedagogie';

export default function EleveDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [dbData, setDbData] = useState<any>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [selectedDetails, setSelectedDetails] = useState<any>(null);
    const [boosterModal, setBoosterModal] = useState(false);
    const [pedagogyData, setPedagogyData] = useState<any>(null);

    useEffect(() => {
        const u = getUser();
        if (u) {
            setUser(u);
            fetchDashboardData(u.id);
        } else {
            router.replace('/login');
        }
    }, [router]);

    const fetchDashboardData = async (userId: string) => {
        try {
            const rawData = await getStudentDashboard(userId);
            const parsed = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;

            if (parsed && !parsed.success) {
                setErrorMsg(`Erreur Interne: ${parsed.error}`);
                console.error("Dashboard error:", parsed.error);
                return;
            }

            const data = parsed.data;

            if (!data) {
                // This means the user ID in localStorage does not exist in the DB (like after a DB reset/seed)
                // Force logout to re-authenticate with the correct Database IDs.
                localStorage.removeItem('autodrive_user');
                router.replace('/login');
                return;
            }
            setDbData(data);

            // Fetch pedagogy data
            const peda = await getStudentPedagogyData(userId);
            if (peda) setPedagogyData(peda);
        } catch (error: any) {
            console.error('Failed to fetch dashboard data:', error);
            setErrorMsg(error.message || 'Erreur lors du chargement des données.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center flex-col gap-4">
                <div className="w-8 h-8 border-2 border-[#00F5FF] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs text-[#5F6B7A] font-medium tracking-widest uppercase">Connexion à la base de données...</p>
            </div>
        );
    }

    if (errorMsg || !user || !dbData) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <div className="premium-card p-8 max-w-md text-center">
                    <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Target size={24} />
                    </div>
                    <h2 className="text-lg font-bold text-white mb-2">Impossible de charger le tableau de bord</h2>
                    <p className="text-sm text-[#8A94A6] mb-6">{errorMsg || 'Vos données ne sont plus synchronisées.'}</p>
                    <button onClick={() => { localStorage.removeItem('autodrive_user'); router.replace('/login'); }} className="btn-primary w-full justify-center">
                        Se reconnecter
                    </button>
                </div>
            </div>
        );
    }

    // Derived stats from DB
    const hoursDone = dbData.lessons?.length || 0;
    const nextLesson = dbData.appointmentsAsStudent?.[0];
    const rawAvgScore = dbData.lessons?.length > 0
        ? (dbData.lessons.reduce((acc: number, l: any) => acc + (l.score || 0), 0) / dbData.lessons.length)
        : 0;
    const avgScore = rawAvgScore % 1 === 0 ? rawAvgScore.toFixed(0) : rawAvgScore.toFixed(1);

    const stats = [
        { label: 'Heures effectuées', value: `${hoursDone}/35h`, sub: `Formation à ${Math.round(hoursDone / 35 * 100)}%`, icon: <Timer size={18} />, color: 'text-[#00F5FF]' },
        { label: 'Prochaine leçon', value: nextLesson ? new Date(nextLesson.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : 'Aucune', sub: nextLesson ? `${nextLesson.time} — ${nextLesson.type}` : 'Planifiez votre leçon', icon: <Calendar size={18} />, color: 'text-blue-400' },
        { label: 'Maîtrise estimée', value: `${avgScore}/20`, sub: 'Performance moyenne constatée', icon: <Star size={18} />, color: 'text-emerald-400' },
        { label: 'Solde restant', value: `${35 - hoursDone}h`, sub: 'Heures de conduite disponibles', icon: <CreditCard size={18} />, color: 'text-amber-400' },
    ];

    return (
        <div className="space-y-10 group/dashboard">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                <div>
                    <h1 className="page-title">Tableau de bord</h1>
                    <p className="text-sm text-[#8A94A6] mt-1 font-medium">Bon retour parmi nous, {dbData.name?.split(' ')[0] || user.name}. Voici votre progression en temps réel.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.push('/dashboard/eleve/documents')}
                        className="btn-secondary"
                    >
                        <FileText size={16} />
                        Documents
                    </button>
                    <button
                        onClick={() => router.push('/dashboard/eleve/livret')}
                        className="btn-secondary"
                    >
                        <Hexagon size={16} />
                        Dossier Pédagogique
                    </button>
                    <button
                        onClick={() => router.push('/dashboard/eleve/reservation')}
                        className="btn-primary"
                    >
                        Nouvelle session
                    </button>
                </div>
            </div>

            {/* Tactical Grid Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div
                        key={i}
                        className="premium-card p-6 flex flex-col justify-between space-y-4 min-h-[160px]"
                    >
                        <div className="flex justify-between items-start">
                            <div className={`p-2.5 rounded-xl bg-white/[0.03] border border-white/5 ${stat.color}`}>
                                {stat.icon}
                            </div>
                            <span className="card-title">{stat.label}</span>
                        </div>
                        <div>
                            <div className="primary-value">{stat.value}</div>
                            <p className="secondary-info mt-1 font-medium">{stat.sub}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Visual Training Arc */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="premium-card p-8">
                        <div className="flex justify-between items-center mb-10">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-[#00F5FF]/5 rounded-2xl border border-[#00F5FF]/10 text-[#00F5FF]">
                                    <Target size={22} />
                                </div>
                                <div>
                                    <h3 className="section-title">Progression Pédagogique (REM)</h3>
                                    <p className="secondary-info">Suivi des 4 compétences obligatoires</p>
                                </div>
                            </div>
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-2xl font-semibold text-white">{pedagogyData?.globalProgress || 0}</span>
                                <span className="text-xs font-bold text-[#5F6B7A] uppercase">%</span>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden flex">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${pedagogyData?.globalProgress || 0}%` }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-[#00F5FF]/40 to-[#00F5FF] rounded-full shadow-[0_0_15px_rgba(0,245,255,0.4)]"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8 pt-4">
                                {(pedagogyData?.pedagogy || [
                                    { id: 'C1', title: 'Compétence 1', progress: 0 },
                                    { id: 'C2', title: 'Compétence 2', progress: 0 },
                                    { id: 'C3', title: 'Compétence 3', progress: 0 },
                                    { id: 'C4', title: 'Compétence 4', progress: 0 }
                                ]).map((cat: any, idx: number) => (
                                    <div key={idx} className="flex items-center gap-4 group/item">
                                        <div className={`w-2 h-2 rounded-full ${cat.progress >= 100 ? 'bg-emerald-500' : cat.progress > 0 ? 'bg-amber-500' : 'bg-red-500'} shadow-[0_0_8px_currentColor] opacity-80 group-hover/item:opacity-100 transition-opacity duration-300`} />
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center mb-1">
                                                <p className="text-sm font-medium text-white group-hover/item:text-[#00F5FF] transition-colors">{cat.title}</p>
                                                <span className="text-[10px] text-[#5F6B7A] font-bold">{cat.progress}%</span>
                                            </div>
                                            <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                <div className={`h-full ${cat.progress >= 100 ? 'bg-emerald-500' : 'bg-[#00F5FF]'} transition-all`} style={{ width: `${cat.progress}%` }} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="premium-card overflow-hidden">
                        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
                            <h3 className="section-title">Dernières missions</h3>
                            <Link
                                href="/dashboard/eleve/lecons"
                                className="text-xs font-bold text-[#00F5FF] hover:underline uppercase tracking-wider"
                            >
                                Toutes
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="premium-table">
                                <thead>
                                    <tr>
                                        <th>Date / Mission</th>
                                        <th>Formateur</th>
                                        <th>Maîtrise</th>
                                        <th>Statut</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dbData.lessons && dbData.lessons.slice(0, 5).map((lesson: any) => (
                                        <tr key={lesson.id} className="group">
                                            <td>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-white">
                                                        {new Date(lesson.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </span>
                                                    <span className="text-[10px] text-[#5F6B7A] uppercase font-bold tracking-widest mt-1 group-hover:text-[#00F5FF] transition-colors">
                                                        {lesson.title}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="font-medium">{lesson.instructor?.name || 'Non assigné'}</td>
                                            <td className="font-semibold text-emerald-400">{lesson.score != null ? `${lesson.score}/20` : '-'}</td>
                                            <td><span className={`status-badge ${lesson.status === 'done' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/10 text-white'}`}>{lesson.status === 'done' ? 'Effectué' : 'Prévu'}</span></td>
                                        </tr>
                                    ))}
                                    {dbData.lessons.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="text-center py-10 text-xs text-[#5F6B7A]">Aucune leçon effectuée</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Rail Context */}
                <div className="space-y-6">
                    <div className="premium-card p-6 border-l-4 border-l-[#00F5FF] shadow-[0_0_40px_rgba(0,245,255,0.02)]">
                        <div className="flex items-center gap-2.5 mb-8">
                            <Clock size={14} className="text-[#00F5FF] fill-[#00F5FF]" />
                            <h3 className="text-[10px] font-bold text-[#00F5FF] uppercase tracking-[0.2em]">Priorité administrative</h3>
                        </div>
                        <div className="space-y-6">
                            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] text-[#5F6B7A] font-bold uppercase tracking-widest">Dossier ANTS</span>
                                    <span className="text-xs font-black text-white">1/3 PIÈCES</span>
                                </div>
                                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#00F5FF]" style={{ width: '33%' }} />
                                </div>
                                <button
                                    onClick={() => router.push('/dashboard/eleve/documents')}
                                    className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[9px] font-black uppercase tracking-widest text-[#8A94A6] hover:text-white transition-all border border-white/5"
                                >
                                    Compléter mon dossier
                                </button>
                            </div>

                            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 border-dashed space-y-3">
                                <div className="flex items-center gap-2 text-amber-500">
                                    <AlertCircle size={14} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Action requise</span>
                                </div>
                                <p className="text-[11px] text-[#8A94A6] leading-relaxed">Vous avez 1 leçon en attente de signature pour valider vos heures REM.</p>
                                <button
                                    onClick={() => router.push('/dashboard/eleve/livret')}
                                    className="text-[10px] font-bold text-amber-500 hover:underline underline-offset-4"
                                >
                                    Signer maintenant →
                                </button>
                            </div>
                        </div>

                        <div className="h-px w-full bg-white/5 my-8" />

                        <div className="flex items-center gap-2.5 mb-8">
                            <Play size={14} className="text-[#00F5FF] fill-[#00F5FF]" />
                            <h3 className="text-[10px] font-bold text-[#00F5FF] uppercase tracking-[0.2em]">Prochaine étape</h3>
                        </div>
                        <div className="space-y-8">
                            {nextLesson ? (
                                <>
                                    <div>
                                        <p className="text-3xl font-semibold text-white">
                                            {new Date(nextLesson.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </p>
                                        <p className="secondary-info mt-1.5 font-medium">{nextLesson.time} — {nextLesson.type}</p>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                                        <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs font-black text-[#8A94A6]">
                                            {nextLesson.instructor?.name.split(' ').map((n: any) => n[0]).join('')}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-white truncate">{nextLesson.instructor?.name}</p>
                                            <p className="text-[10px] text-[#5F6B7A] uppercase font-bold tracking-widest mt-0.5">Formateur</p>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div>
                                    <p className="text-xl font-semibold text-white">Pas de leçon prévue</p>
                                    <p className="secondary-info mt-1.5 font-medium">Réservez votre prochain créneau pour progresser.</p>
                                </div>
                            )}
                            <button
                                onClick={() => nextLesson ? setSelectedDetails(nextLesson) : router.push('/dashboard/eleve/reservation')}
                                className="w-full btn-primary"
                            >
                                {nextLesson ? 'Détails de la session' : 'Réserver maintenant'}
                                <ArrowUpRight size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="premium-card p-6">
                        <h3 className="card-title mb-6">Centre de ressources</h3>
                        <div className="space-y-2">
                            {['Règlementation Autoroute', 'Les contrôles visuels', 'Mécanique & Sécurité'].map((item, i) => (
                                <Link key={i} href="#" target="_blank" className="w-full flex items-center justify-between p-3.5 rounded-xl hover:bg-white/5 transition-all text-xs font-medium text-[#8A94A6] hover:text-white group border border-transparent hover:border-white/5">
                                    <span>{item}</span>
                                    <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#00F5FF]" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div onClick={() => setBoosterModal(true)} className="p-6 rounded-2xl bg-[#00F5FF]/[0.02] border border-[#00F5FF]/10 flex items-center gap-4 cursor-pointer hover:bg-[#00F5FF]/[0.05] transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-[#00F5FF]/10 flex items-center justify-center text-[#00F5FF]">
                            <Zap size={20} fill="currentColor" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-white uppercase tracking-wider italic">Mode Booster</p>
                            <p className="text-[10px] text-[#5F6B7A] font-medium leading-relaxed mt-1">
                                Vos 4 prochaines heures sont accélérées. Focus sur l'examen.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Détails Session */}
            <AnimatePresence>
                {selectedDetails && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedDetails(null)}
                            className="absolute inset-0 bg-[#0B0F14]/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-sm premium-card overflow-hidden flex flex-col"
                        >
                            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                                <h3 className="text-lg font-black text-white uppercase">Détails de la Session</h3>
                                <button onClick={() => setSelectedDetails(null)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#8A94A6] hover:text-white transition-colors">
                                    <X size={16} />
                                </button>
                            </div>
                            <div className="p-6 space-y-6">
                                <div>
                                    <p className="text-[10px] font-bold text-[#5F6B7A] uppercase tracking-widest mb-1">Date Prévue</p>
                                    <p className="text-base font-semibold text-white">{new Date(selectedDetails.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                    <p className="text-sm font-medium text-emerald-400 mt-1">{selectedDetails.time}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-[#5F6B7A] uppercase tracking-widest mb-1">Formateur</p>
                                    <p className="text-base font-semibold text-white">{selectedDetails.instructor?.name || 'Moniteur'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-[#5F6B7A] uppercase tracking-widest mb-1">Catégorie</p>
                                    <p className="text-sm font-medium text-white p-3 rounded-lg border border-white/5 bg-white/[0.02]">{selectedDetails.type}</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Modal Mode Booster */}
            <AnimatePresence>
                {boosterModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setBoosterModal(false)}
                            className="absolute inset-0 bg-[#0B0F14]/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-sm premium-card border-[#00F5FF]/30 overflow-hidden flex flex-col text-center p-8"
                        >
                            <div className="w-16 h-16 rounded-full bg-[#00F5FF]/10 text-[#00F5FF] flex items-center justify-center mx-auto mb-6">
                                <Zap size={32} fill="currentColor" />
                            </div>
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2">Mode Booster</h3>
                            <p className="text-sm text-[#8A94A6] leading-relaxed mb-6">Cette exclusivité premium sera disponible prochainement. Augmentez l'intensité de vos leçons pour viser l'examen sereinement.</p>
                            <button onClick={() => setBoosterModal(false)} className="btn-primary w-full justify-center">
                                Compris
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
