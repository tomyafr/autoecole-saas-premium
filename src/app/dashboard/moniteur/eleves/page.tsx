'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { getUser, type User } from '@/lib/auth';
import { getInstructorDashboard } from '@/app/actions/dashboard';
import {
    Users,
    Search,
    Filter,
    TrendingUp,
    Clock,
    CheckCircle2,
    Calendar,
    ChevronRight,
    ArrowUpRight,
    GraduationCap,
    Plus,
    FileText
} from 'lucide-react';

export default function MoniteurStudentsPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [students, setStudents] = useState<any[]>([]);
    const [statusFilter, setStatusFilter] = useState<'all' | 'examen' | 'en_cours' | 'debutant'>('all');

    useEffect(() => {
        const fetchStudents = async () => {
            const u = getUser();
            if (!u) {
                router.replace('/login');
                return;
            }
            try {
                const res = await getInstructorDashboard(u.id);
                const parsed = typeof res === 'string' ? JSON.parse(res) : res;
                if (parsed.success && parsed.data) {
                    const lessons = parsed.data.lessons || [];
                    const apps = parsed.data.appointmentsAsInstructor || [];

                    // Deduplicate students
                    const stuMap = new Map();
                    [...lessons, ...apps].forEach((item: any) => {
                        if (item.student) {
                            if (!stuMap.has(item.student.id)) {
                                stuMap.set(item.student.id, {
                                    id: item.student.id,
                                    name: item.student.name,
                                    lessonsCount: 0,
                                    totalScore: 0,
                                    lastSession: null,
                                });
                            }
                            const s = stuMap.get(item.student.id);

                            // On compte une heure si c'est une leçon validée OU un RDV complété
                            const isDone = item.status === 'completed' || item.status === 'done';
                            if (isDone || item.score !== undefined) {
                                s.lessonsCount++;
                                if (item.score != null) {
                                    s.totalScore += item.score;
                                    s.hasScoreCount = (s.hasScoreCount || 0) + 1;
                                }
                                if (item.date && (!s.lastSession || new Date(item.date) > new Date(s.lastSessionDate || 0))) {
                                    s.lastSessionDate = new Date(item.date);
                                    s.lastSession = new Date(item.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
                                }
                            }
                        }
                    });

                    const finalStudents = await Promise.all(Array.from(stuMap.values()).map(async (s: any) => {
                        const score = (s.hasScoreCount || 0) > 0 ? (s.totalScore / s.hasScoreCount).toFixed(1) : '-';

                        const { getStudentPedagogyData } = await import('@/app/actions/pedagogie');
                        const peda = await getStudentPedagogyData(s.id);
                        const progress = peda?.globalProgress || 0;

                        return {
                            ...s,
                            score,
                            progress,
                            hours: `${s.lessonsCount}/35h`,
                            status: progress > 80 ? 'Prêt examen' : (progress < 25 ? 'Débutant' : 'En cours')
                        };
                    }));
                    setStudents(finalStudents);
                }
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        };
        fetchStudents();
    }, [router]);

    const [actionFeedback, setActionFeedback] = useState<string | null>(null);

    const handleAction = (msg: string) => {
        setActionFeedback(msg);
        setTimeout(() => setActionFeedback(null), 3000);
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#00F5FF] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-10 group/students">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                <div>
                    <h1 className="page-title">Mes Élèves</h1>
                    <p className="text-sm text-[#8A94A6] mt-1 font-medium">Suivi et accompagnement de la progression de vos élèves.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => handleAction("Exportation du rapport en cours d'intégration.")} className="btn-secondary">
                        <FileText size={16} />
                        Exporter Rapport
                    </button>
                    <button onClick={() => handleAction("Formulaire d'inscription en cours d'intégration.")} className="btn-primary">
                        <Plus size={16} />
                        Inscrire Élève
                    </button>
                </div>
            </div>

            {/* Tactical Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="premium-card p-6 flex flex-col justify-between space-y-4">
                    <div className="flex justify-between items-start">
                        <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-[#00F5FF]">
                            <GraduationCap size={18} />
                        </div>
                        <span className="card-title">Formation Active</span>
                    </div>
                    <div>
                        <div className="primary-value">{students.length} Élèves</div>
                        <p className="secondary-info mt-1 font-medium italic">Sous votre supervision directe</p>
                    </div>
                </div>

                <div className="premium-card p-6 flex flex-col justify-between space-y-4">
                    <div className="flex justify-between items-start">
                        <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-emerald-400">
                            <TrendingUp size={18} />
                        </div>
                        <span className="card-title">Taux de Réussite</span>
                    </div>
                    <div>
                        <div className="primary-value">91.4%</div>
                        <div className="flex items-center gap-1.5 mt-2">
                            <span className="text-[10px] font-bold text-emerald-400 font-mono">+4.2% VS NETWORK</span>
                            <ArrowUpRight size={10} className="text-emerald-400" />
                        </div>
                    </div>
                </div>

                <div className="premium-card p-6 flex flex-col justify-between space-y-4">
                    <div className="flex justify-between items-start">
                        <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-amber-400">
                            <Clock size={18} />
                        </div>
                        <span className="card-title">Charge de Travail</span>
                    </div>
                    <div>
                        <div className="primary-value">148h / Mois</div>
                        <p className="secondary-info mt-1 font-medium">Capacité optimisée à 85%</p>
                    </div>
                </div>
            </div>

            {/* Students Audit Table */}
            <div className="premium-card overflow-hidden">
                <div className="px-8 py-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h3 className="section-title">Audit des Élèves</h3>
                    <div className="flex items-center gap-4">
                        <div className="relative group/search">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5F6B7A] group-focus-within/search:text-[#00F5FF] transition-colors" size={16} />
                            <input
                                type="text"
                                placeholder="Identifier un profil..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 bg-white/[0.02] border border-white/5 rounded-xl text-sm font-medium text-white focus:outline-none focus:border-[#00F5FF]/20 transition-all w-full md:w-64"
                            />
                        </div>
                        <button
                            onClick={() => {
                                const next: any = { all: 'examen', examen: 'en_cours', en_cours: 'debutant', debutant: 'all' };
                                setStatusFilter(next[statusFilter]);
                            }}
                            className={`p-2.5 rounded-xl border transition-all flex items-center gap-2 ${statusFilter !== 'all' ? 'bg-[#00F5FF]/10 border-[#00F5FF]/20 text-[#00F5FF]' : 'bg-white/[0.02] border-white/5 text-[#8A94A6] hover:text-white'}`}
                        >
                            <Filter size={18} />
                            {statusFilter !== 'all' && <span className="text-[10px] font-black uppercase">{statusFilter.replace('_', ' ')}</span>}
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="premium-table">
                        <thead>
                            <tr>
                                <th>IDENTITÉ / MODULE</th>
                                <th>PROGRESSION GLOBALE</th>
                                <th>DERNIER CONTACT</th>
                                <th>STATUT</th>
                                <th>EVAL</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {students
                                .filter((s: any) => {
                                    const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
                                    const matchStatus = statusFilter === 'all'
                                        ? true
                                        : statusFilter === 'examen' ? s.status === 'Prêt examen'
                                            : statusFilter === 'en_cours' ? s.status === 'En cours'
                                                : s.status === 'Débutant';
                                    return matchSearch && matchStatus;
                                })
                                .map((student: any) => (
                                    <tr
                                        key={student.id}
                                        className="group cursor-pointer hover:bg-white/[0.02] transition-colors"
                                        onClick={() => router.push(`/dashboard/profile/${student.id}`)}
                                    >
                                        <td>
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs font-black text-[#8A94A6] group-hover:text-[#00F5FF] transition-colors">
                                                    {student.name.split(' ').map((n: string) => n[0]).join('')}
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-sm font-semibold text-white group-hover:text-[#00F5FF] transition-colors truncate">{student.name}</span>
                                                    <span className="text-[10px] text-[#5F6B7A] font-bold uppercase tracking-widest mt-0.5">{student.hours} validées</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="w-32 space-y-2">
                                                <div className="flex justify-between items-center text-[9px] font-black text-[#5F6B7A] uppercase tracking-tighter">
                                                    <span>Progression</span>
                                                    <span className="text-white">{student.progress}%</span>
                                                </div>
                                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${student.progress}%` }}
                                                        transition={{ duration: 1, ease: "easeOut" }}
                                                        className="h-full bg-gradient-to-r from-blue-600 to-[#00F5FF]"
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} className="text-[#5F6B7A]" />
                                                <span className="text-xs font-medium text-[#8A94A6]">{student.lastSession || '-'}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${student.status === 'En retard' ? 'bg-red-500/10 text-red-400' :
                                                student.status === 'Prêt examen' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                                    'status-badge-gray'
                                                }`}>
                                                {student.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-1.5">
                                                <div className="p-1 rounded bg-white/5">
                                                    <TrendingUp size={10} className={student.score !== '-' && student.score >= 8 ? 'text-emerald-400' : 'text-amber-400'} />
                                                </div>
                                                <span className="text-xs font-bold text-white font-mono">{student.score}</span>
                                            </div>
                                        </td>
                                        <td className="text-right">
                                            <button className="w-9 h-9 rounded-lg flex items-center justify-center text-[#5F6B7A] hover:bg-[#00F5FF]/10 hover:text-[#00F5FF] transition-all">
                                                <ChevronRight size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            {students.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="text-center py-10 text-xs text-[#5F6B7A]">Aucun élève identifié</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="px-8 py-4 border-t border-white/5 bg-white/[0.01] flex items-center justify-between">
                    <p className="text-[10px] text-[#5F6B7A] font-bold uppercase tracking-widest">Affichage de {students.length} profils élites</p>
                    <div className="flex gap-2">
                        <button className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[10px] font-black text-[#5F6B7A] hover:text-white transition-colors">PREC</button>
                        <button className="px-3 py-1.5 rounded-lg bg-[#00F5FF]/10 border border-[#00F5FF]/20 text-[10px] font-black text-[#00F5FF]">SUIV</button>
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
        </div>
    );
}
