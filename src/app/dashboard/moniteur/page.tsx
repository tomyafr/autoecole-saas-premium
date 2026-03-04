'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    Calendar,
    TrendingUp,
    Award,
    Clock,
    CheckCircle2,
    ChevronRight,
    MessageSquare,
    Zap,
    Play,
    Plus,
    X,
    Star
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getUser, type User } from '@/lib/auth';
import { getInstructorDashboard } from '@/app/actions/dashboard';
import SignaturePad from '@/components/SignaturePad';
import { completeLessonWithSignature } from '@/app/actions/pedagogie';

export default function MoniteurDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [dbData, setDbData] = useState<any>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [actionFeedback, setActionFeedback] = useState<string | null>(null);
    const [startLessonModal, setStartLessonModal] = useState(false);
    const [signingLessonId, setSigningLessonId] = useState<string | null>(null);

    const triggerFeedback = (msg: string) => {
        setActionFeedback(msg);
        setTimeout(() => setActionFeedback(null), 3000);
    };

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
            const rawData = await getInstructorDashboard(userId);
            const parsed = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;

            if (parsed && !parsed.success) {
                setErrorMsg(`Erreur Interne: ${parsed.error}`);
                console.error("Dashboard error:", parsed.error);
                return;
            }

            const data = parsed.data;

            if (!data) {
                localStorage.removeItem('autodrive_user');
                router.replace('/login');
                return;
            }
            setDbData(data);
        } catch (error: any) {
            console.error('Failed to fetch dashboard data:', error);
            setErrorMsg(error.message || 'Erreur lors du chargement des données.');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSignature = async (signature: string) => {
        if (!signingLessonId) return;

        try {
            const res = await completeLessonWithSignature(signingLessonId, signature);
            if (res.success) {
                triggerFeedback("Leçon signée et validée avec succès !");
                if (user) fetchDashboardData(user.id);
            } else {
                triggerFeedback("Erreur lors de la signature.");
            }
        } catch (error) {
            console.error("Signature error:", error);
            triggerFeedback("Une erreur est survenue.");
        } finally {
            setSigningLessonId(null);
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
                        <Users size={24} />
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

    const today = new Date().toISOString().split('T')[0];
    const todaySessionsAll = dbData.appointmentsAsInstructor?.filter((app: any) => app.date && new Date(app.date).toISOString().split('T')[0] === today) || [];

    const pendingToday = todaySessionsAll.filter((app: any) => app.status === 'pending').length;
    const studentsCount = dbData.totalStudents || 0;
    const hoursTotal = dbData.lessons?.length || 0;

    const avgScoreInst = dbData.lessons?.length > 0
        ? dbData.lessons.reduce((acc: number, l: any) => acc + (l.score || 0), 0) / dbData.lessons.length
        : 0;
    const successRate = avgScoreInst > 0 ? Math.round((avgScoreInst / 20) * 100) : 0;

    const stats = [
        { label: 'Sessions du jour', value: `${todaySessionsAll.length} M.`, sub: `${pendingToday} restantes`, icon: <Users size={18} />, color: 'text-[#00F5FF]' },
        { label: 'Volume horaire', value: `${hoursTotal}h`, sub: 'Heures effectuées', icon: <Clock size={18} />, color: 'text-blue-400' },
        { label: 'Note moyenne', value: '4.8/5', sub: 'Basé sur 24 avis', icon: <Star size={18} className="fill-current" />, color: 'text-amber-400' },
        { label: 'Taux Succès', value: `${successRate}%`, sub: 'Mov. réussite', icon: <TrendingUp size={18} />, color: 'text-emerald-400' },
    ];

    const todaySessions = todaySessionsAll.map((app: any) => ({
        id: app.id,
        studentId: app.student?.id || '',
        name: app.student?.name || 'Inconnu',
        time: app.time,
        type: app.type,
        status: app.status === 'completed' ? 'done' : 'upcoming',
        note: app.status === 'completed' ? 'Validé' : 'Prévu'
    })) || [];

    const doneToday = todaySessionsAll.length - pendingToday;

    return (
        <div className="space-y-10 group/moniteur">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                <div>
                    <h1 className="page-title">Espace Formateur</h1>
                    <p className="text-sm text-[#8A94A6] mt-1 font-medium">Gestion de vos leçons de conduite.</p>
                </div>
                <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-4 md:mt-0 w-full md:w-auto">
                    <button
                        onClick={() => router.push('/dashboard/moniteur/planning')}
                        className="btn-secondary"
                    >
                        <Calendar size={18} />
                        Planning Complet
                    </button>
                    <button
                        onClick={() => setStartLessonModal(true)}
                        className="btn-primary"
                    >
                        <Zap size={18} />
                        Lancer Leçon
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
                {/* Main Section: Schedule */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="premium-card overflow-hidden">
                        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
                            <h3 className="section-title">Sessions du jour</h3>
                            <div className="flex gap-3">
                                <span className="status-badge status-badge-cyan">{doneToday} Terminés</span>
                                <span className="status-badge status-badge-gray">{pendingToday} En attente</span>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="premium-table">
                                <thead>
                                    <tr>
                                        <th>HORAIRE</th>
                                        <th>ÉLÈVE / LEÇON</th>
                                        <th>ÉVALUATION</th>
                                        <th>ACTION</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {todaySessions.map((session: any) => (
                                        <tr key={session.id} className="group">
                                            <td>
                                                <div className="flex flex-col">
                                                    <span className="text-white font-semibold">{session.time}</span>
                                                    <span className="text-[10px] text-[#5F6B7A] font-bold uppercase tracking-widest mt-0.5">CRÉNEAU ACTIL</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs font-black text-[#5F6B7A] group-hover:text-[#00F5FF] transition-colors">
                                                        {session.name.split(' ').map((n: string) => n[0]).join('')}
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <span
                                                            className="text-sm font-semibold text-white truncate cursor-pointer hover:text-[#00F5FF] hover:underline transition-colors"
                                                            onClick={(e) => { e.stopPropagation(); router.push(`/dashboard/profile/${session.studentId}`); }}
                                                        >
                                                            {session.name}
                                                        </span>
                                                        <span className="text-[10px] text-[#5F6B7A] font-bold uppercase tracking-widest mt-0.5">{session.type}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                {session.status === 'done' ? (
                                                    <div className="flex items-center gap-2">
                                                        <CheckCircle2 size={14} className="text-emerald-400" />
                                                        <span className="text-emerald-400 font-mono font-bold">{session.note}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-[10px] text-[#5F6B7A] font-black uppercase tracking-widest italic opacity-40">Prévu</span>
                                                )}
                                            </td>
                                            <td>
                                                {session.status === 'done' ? (
                                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-emerald-400 bg-emerald-400/5">
                                                        <CheckCircle2 size={18} />
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => router.push(`/dashboard/moniteur/evaluations?student_id=${session.studentId}&lesson_id=${session.id}`)}
                                                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#00F5FF]/10 text-[#00F5FF] text-[10px] font-black uppercase tracking-widest hover:bg-[#00F5FF]/20 transition-all border border-[#00F5FF]/20 group/sign"
                                                    >
                                                        <Plus size={14} className="group-hover/sign:rotate-90 transition-transform" />
                                                        Évaluer
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="premium-card p-8 bg-[radial-gradient(circle_at_0%_0%,rgba(0,245,255,0.02)_0%,transparent_50%)]">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-blue-500/5 rounded-2xl border border-blue-500/10 text-blue-400">
                                <MessageSquare size={22} />
                            </div>
                            <div>
                                <h3 className="section-title">Journal Pédagogique</h3>
                                <p className="secondary-info">Dernières évaluations et remarques</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {dbData.lessons?.length > 0 ? (
                                <div
                                    onClick={() => router.push('/dashboard/moniteur/evaluations')}
                                    className="p-6 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-[#00F5FF]/20 transition-all group cursor-pointer"
                                >
                                    <p className="text-sm text-gray-300 leading-relaxed font-medium group-hover:text-white transition-colors">
                                        Note: {dbData.lessons[0].score}/20 — Compétences validées sur la leçon {dbData.lessons[0].title}.
                                    </p>
                                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black text-[#5F6B7A] uppercase tracking-widest">Élève</span>
                                            <div className="w-1 h-1 rounded-full bg-white/10" />
                                            <span className="text-[10px] font-black text-[#5F6B7A] uppercase tracking-widest">{dbData.lessons[0].student?.name || 'Inconnu'}</span>
                                        </div>
                                        <span className="text-[10px] font-black text-[#00F5FF] uppercase tracking-[0.2em]">Archivé</span>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-xs text-[#5F6B7A]">Aucune leçon passée à afficher.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Column: Week Planning */}
                <div className="space-y-6">
                    <div className="premium-card p-6 border-l-4 border-l-[#00F5FF] shadow-[0_0_40px_rgba(0,245,255,0.02)]">
                        <div className="flex items-center gap-2.5 mb-8">
                            <Play size={14} className="text-[#00F5FF] fill-[#00F5FF]" />
                            <h3 className="text-[10px] font-bold text-[#00F5FF] uppercase tracking-[0.2em]">Planning Hebdo</h3>
                        </div>
                        <div className="space-y-3">
                            {[...Array(5)].map((_, i) => {
                                const d = new Date();
                                d.setDate(d.getDate() + i);
                                const dayName = d.toLocaleDateString('fr-FR', { weekday: 'long' });
                                const dateStr = d.toISOString().split('T')[0];
                                const missionsCount = dbData.appointmentsAsInstructor?.filter((x: any) => x.date && new Date(x.date).toISOString().split('T')[0] === dateStr).length || 0;

                                return (
                                    <div
                                        key={i}
                                        onClick={() => router.push(`/dashboard/moniteur/planning?date=${dateStr}`)}
                                        className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 cursor-pointer
                                        ${i === 0 ? 'bg-[var(--color-accent)]/5 border-[var(--color-accent)]/20 shadow-[0_0_20px_rgba(var(--color-accent-rgb),0.05)]' : 'bg-white/[0.01] border-[var(--color-border-subtle)] hover:border-white/20'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className={`text-xs font-bold ${i === 0 ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-muted)]'}`}>{dayName.slice(0, 3).toUpperCase()}</span>
                                            <div className="w-1 h-3 rounded-full bg-white/5" />
                                            <span className="text-sm font-semibold text-[var(--color-text-primary)]">{missionsCount} Leçon{missionsCount > 1 ? 's' : ''}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <button
                            onClick={() => triggerFeedback("Module IA d'optimisation de planning de disponibilité est en cours d'entraînement.")}
                            className="w-full btn-primary mt-8 py-4"
                        >
                            Optimizer Planning
                            <ChevronRight size={16} />
                        </button>
                    </div>

                    <div className="premium-card p-6">
                        <h3 className="card-title mb-6">Expertise & Certifications</h3>
                        <div className="space-y-3">
                            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-between">
                                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Instructeur Elite</span>
                                <Award size={16} className="text-emerald-400" />
                            </div>
                            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                                <span className="text-xs font-bold text-[#5F6B7A] uppercase tracking-widest">Conduite de nuit</span>
                                <CheckCircle2 size={16} className="text-white/10" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ACTION FEEDBACK TOAST */}
            <AnimatePresence>
                {actionFeedback && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl bg-[#0B0F14] border border-[var(--color-border-subtle)] shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
                    >
                        <div className="w-8 h-8 rounded-full bg-[var(--color-accent)]/10 flex items-center justify-center text-[var(--color-accent)]">
                            <CheckCircle2 size={16} />
                        </div>
                        <p className="text-sm font-medium text-[var(--color-text-primary)]">{actionFeedback}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* START LESSON MODAL */}
            <AnimatePresence>
                {startLessonModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setStartLessonModal(false)}
                            className="absolute inset-0 bg-[#0B0F14]/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-sm premium-card border-[var(--color-border-subtle)] overflow-hidden flex flex-col"
                        >
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                                        <Zap size={24} />
                                    </div>
                                    <button onClick={() => setStartLessonModal(false)} className="p-2 text-[#5F6B7A] hover:text-white transition-colors">
                                        <X size={20} />
                                    </button>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">Sélectionnez le créneau</h3>
                                <p className="text-sm text-[#8A94A6] leading-relaxed mb-6">Démarrez une leçon instantanément en sélectionnant l'engagement de votre élève dans la vue planning.</p>
                                <button
                                    onClick={() => { setStartLessonModal(false); router.push('/dashboard/moniteur/planning'); }}
                                    className="btn-primary w-full justify-center"
                                >
                                    Accéder au planning
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* SIGNATURE PAD */}
            <AnimatePresence>
                {signingLessonId && (
                    <SignaturePad
                        onSave={handleSaveSignature}
                        onClose={() => setSigningLessonId(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
