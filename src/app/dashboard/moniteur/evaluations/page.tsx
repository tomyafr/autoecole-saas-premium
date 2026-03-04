'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ClipboardCheck,
    Star,
    TrendingUp,
    FileText,
    Search,
    Target,
    Zap,
    History,
    ChevronRight,
    Plus,
    X,
    User as UserIcon,
    CheckCircle2,
    Save,
    Clock,
    ShieldCheck,
    AlertCircle,
    Hexagon,
    PenTool
} from 'lucide-react';
import { getUser, type User } from '@/lib/auth';
import { getStudentsList, getStudentPedagogyData, updateStudentCompetency } from '@/app/actions/pedagogie';
import { completeAppointmentWithEvaluation } from '@/app/actions/appointment';
import { useSearchParams, useRouter } from 'next/navigation';

function MoniteurEvaluationsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const lessonId = searchParams.get('lesson_id');
    const urlStudentId = searchParams.get('student_id');

    const [moniteur, setMoniteur] = useState<User | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [students, setStudents] = useState<any[]>([]);
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
    const [studentData, setStudentData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);
    const [actionFeedback, setActionFeedback] = useState<string | null>(null);
    const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);

    // Formulaire d'évaluation
    const [evalNote, setEvalNote] = useState<number>(20);
    const [evalComment, setEvalComment] = useState('');
    const [evalNegatives, setEvalNegatives] = useState('');

    // Pour la gestion basique des signatures
    const studentCanvasRef = useRef<HTMLCanvasElement>(null);
    const instrCanvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [activeCanvas, setActiveCanvas] = useState<'student' | 'instr' | null>(null);
    const [studentSigned, setStudentSigned] = useState(false);
    const [instrSigned, setInstrSigned] = useState(false);

    useEffect(() => {
        const u = getUser();
        if (u) setMoniteur(u);
        fetchStudents();
        if (urlStudentId) {
            setSelectedStudentId(urlStudentId);
        }
    }, [urlStudentId]);

    useEffect(() => {
        if (selectedStudentId) {
            fetchStudentPedagogy(selectedStudentId);
        }
    }, [selectedStudentId]);

    const fetchStudents = async () => {
        const data = await getStudentsList();
        setStudents(data);
        setLoading(false);
    };

    const fetchStudentPedagogy = async (id: string) => {
        setLoading(true);
        const data = await getStudentPedagogyData(id);
        setStudentData(data);
        setLoading(false);
    };

    const handleUpdateLevel = async (code: string, level: number) => {
        if (!selectedStudentId || !moniteur) return;
        setUpdating(code);
        const res = await updateStudentCompetency(selectedStudentId, code, level, moniteur.id);
        if (res.success) {
            triggerFeedback(`Compétence ${code} mise à jour !`);
            fetchStudentPedagogy(selectedStudentId);
        }
        setUpdating(null);
    };

    const triggerFeedback = (msg: string) => {
        setActionFeedback(msg);
        setTimeout(() => setActionFeedback(null), 3000);
    };

    // Drawing Logic
    const startDrawing = (e: any, type: 'student' | 'instr') => {
        const canvas = type === 'student' ? studentCanvasRef.current : instrCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        // Support mouse and touch
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        ctx.beginPath();
        ctx.moveTo(clientX - rect.left, clientY - rect.top);
        setIsDrawing(true);
        setActiveCanvas(type);
        if (type === 'student') setStudentSigned(true);
        if (type === 'instr') setInstrSigned(true);
    };

    const draw = (e: any, type: 'student' | 'instr') => {
        if (!isDrawing || activeCanvas !== type) return;
        const canvas = type === 'student' ? studentCanvasRef.current : instrCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        ctx.lineTo(clientX - rect.left, clientY - rect.top);
        ctx.strokeStyle = '#00F5FF';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.stroke();
    };

    const endDrawing = () => {
        setIsDrawing(false);
        setActiveCanvas(null);
    };

    const clearCanvas = (type: 'student' | 'instr') => {
        const canvas = type === 'student' ? studentCanvasRef.current : instrCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (type === 'student') setStudentSigned(false);
        if (type === 'instr') setInstrSigned(false);
    };

    const handleCloturer = async () => {
        if (!studentSigned || !instrSigned) {
            triggerFeedback('Veuillez recueillir les deux signatures requises.');
            return;
        }

        if (lessonId && selectedStudentId && moniteur) {
            const stuStr = studentCanvasRef.current?.toDataURL('image/png') || '';
            const instrStr = instrCanvasRef.current?.toDataURL('image/png') || '';

            const res = await completeAppointmentWithEvaluation(
                lessonId,
                selectedStudentId,
                moniteur.id,
                evalNote,
                evalComment,
                evalNegatives,
                stuStr,
                instrStr
            );

            if (res.success) {
                setIsSignatureModalOpen(false);
                triggerFeedback('Séance clôturée et évaluée avec succès !');
                setTimeout(() => router.push('/dashboard/moniteur'), 1500);
            } else {
                triggerFeedback('Erreur lors de la clôture : ' + res.error);
            }
        } else {
            setIsSignatureModalOpen(false);
            triggerFeedback('Séance clôturée (Test UI).');
        }
    };

    const getLevelConfig = (level: number) => {
        switch (level) {
            case 3: return { label: 'Assimilé', color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: <ShieldCheck size={14} /> };
            case 2: return { label: 'Acquis', color: 'text-[#00F5FF]', bg: 'bg-[#00F5FF]/10', icon: <CheckCircle2 size={14} /> };
            case 1: return { label: 'En cours', color: 'text-amber-400', bg: 'bg-amber-500/10', icon: <Clock size={14} /> };
            default: return { label: 'Non commencé', color: 'text-[#5F6B7A]', bg: 'bg-white/5', icon: <AlertCircle size={14} /> };
        }
    };

    const filteredStudents = students.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="space-y-10 group/evals">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                <div>
                    <h1 className="page-title">Validation des Compétences</h1>
                    <p className="text-sm text-[#8A94A6] mt-1 font-medium">Référentiel REM — Livret d'apprentissage numérique.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left: Student Selection */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="section-title">Sélectionner un élève</h3>
                    </div>
                    <div className="relative group/search">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5F6B7A] group-focus-within/search:text-[#00F5FF] transition-colors" size={14} />
                        <input
                            type="text"
                            placeholder="Rechercher un élève..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-white/[0.02] border border-white/5 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-[#00F5FF]/20 transition-all w-full"
                        />
                    </div>

                    <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                        {filteredStudents.map((s) => (
                            <button
                                key={s.id}
                                onClick={() => setSelectedStudentId(s.id)}
                                className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group ${selectedStudentId === s.id
                                    ? 'bg-[#00F5FF]/5 border-[#00F5FF]/30 text-white'
                                    : 'bg-white/[0.02] border-white/5 text-[#8A94A6] hover:bg-white/5'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${selectedStudentId === s.id ? 'bg-[#00F5FF]/10 text-[#00F5FF]' : 'bg-white/5'}`}>
                                        <UserIcon size={16} />
                                    </div>
                                    <span className="font-bold text-sm">{s.name}</span>
                                </div>
                                <ChevronRight size={14} className={selectedStudentId === s.id ? 'text-[#00F5FF]' : 'opacity-0'} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content: Competency Validation */}
                <div className="lg:col-span-2 space-y-8">
                    {!selectedStudentId ? (
                        <div className="premium-card p-12 text-center">
                            <Hexagon size={48} className="mx-auto mb-4 text-[#5F6B7A] opacity-20" />
                            <h3 className="text-white font-bold mb-2 uppercase tracking-widest text-xs">Aucun élève sélectionné</h3>
                            <p className="text-xs text-[#5F6B7A]">Veuillez choisir un élève dans la liste pour valider ses compétences.</p>
                        </div>
                    ) : loading && !studentData ? (
                        <div className="h-40 flex items-center justify-center">
                            <div className="w-6 h-6 border-2 border-[#00F5FF] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                        >
                            {/* Student Header Info */}
                            <div className="premium-card p-6 flex flex-col md:flex-row justify-between items-center gap-6 border-l-4 border-l-[#00F5FF]">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-[#00F5FF]/10 flex items-center justify-center text-[#00F5FF]">
                                        <Target size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black text-white uppercase">{students.find(s => s.id === selectedStudentId)?.name}</h2>
                                        <p className="text-xs text-[#8A94A6] font-medium tracking-wide italic">Progression REM : {studentData?.globalProgress || 0}%</p>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row items-center gap-4">
                                    <div className="h-2 w-32 bg-white/5 rounded-full overflow-hidden shrink-0">
                                        <div className="h-full bg-[#00F5FF] shadow-[0_0_10px_rgba(0,245,255,0.4)]" style={{ width: `${studentData?.globalProgress || 0}%` }} />
                                    </div>
                                    <button
                                        onClick={() => setIsSignatureModalOpen(true)}
                                        className="px-4 py-2.5 rounded-xl bg-[#00F5FF] hover:bg-[#00F5FF]/90 text-black font-black uppercase text-[10px] tracking-widest flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(0,245,255,0.3)]">
                                        <PenTool size={14} /> Clôturer séance
                                    </button>
                                </div>
                            </div>

                            {/* Section Évaluation de Leçon (seulement si lessonId) */}
                            {lessonId && (
                                <div className="premium-card p-6 border-l-4 border-l-[#00F5FF]/50 bg-white/[0.01]">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2 rounded-lg bg-white/5 text-white">
                                            <FileText size={20} />
                                        </div>
                                        <div>
                                            <h3 className="section-title">Compte-rendu de leçon</h3>
                                            <p className="secondary-info">Remplissez ces informations avant de clôturer.</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="text-[10px] font-black text-[#8A94A6] uppercase tracking-widest block mb-2">Note de la séance (/20)</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="20"
                                                    value={evalNote}
                                                    onChange={e => setEvalNote(Number(e.target.value))}
                                                    className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-white focus:border-[#00F5FF]/30 transition-colors"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-[#8A94A6] uppercase tracking-widest block mb-2">Commentaire global</label>
                                                <input
                                                    type="text"
                                                    placeholder="Bien, mais attention à la priorité..."
                                                    value={evalComment}
                                                    onChange={e => setEvalComment(e.target.value)}
                                                    className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-white focus:border-[#00F5FF]/30 transition-colors"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-[#8A94A6] uppercase tracking-widest block mb-2">Points à améliorer (négatifs)</label>
                                            <textarea
                                                rows={2}
                                                placeholder="Contrôle des angles morts, vitesse excessive..."
                                                value={evalNegatives}
                                                onChange={e => setEvalNegatives(e.target.value)}
                                                className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-white focus:border-[#00F5FF]/30 transition-colors resize-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Competencies Categories */}
                            <div className="space-y-12">
                                {studentData?.pedagogy.map((category: any) => (
                                    <div key={category.id} className="space-y-6">
                                        <div className="flex items-center gap-4 px-2">
                                            <span className="text-2xl font-black text-white/10">{category.id}</span>
                                            <h3 className="text-sm font-black text-[#8A94A6] uppercase tracking-widest">{category.title}</h3>
                                            <div className="flex-1 h-px bg-white/5" />
                                        </div>

                                        <div className="grid grid-cols-1 gap-4">
                                            {category.items.map((item: any) => (
                                                <div key={item.code} className="premium-card p-5 group hover:border-white/10 transition-all">
                                                    <div className="flex flex-col md:flex-row justify-between gap-6">
                                                        <div className="space-y-1 flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[10px] font-black text-[#5F6B7A] tracking-tighter">{item.code}</span>
                                                                <h4 className="text-sm font-bold text-white uppercase group-hover:text-[#00F5FF] transition-colors">{item.title}</h4>
                                                            </div>
                                                            <p className="text-xs text-[#5F6B7A] leading-relaxed">{item.description}</p>
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            {[0, 1, 2, 3].map((lv) => {
                                                                const config = getLevelConfig(lv);
                                                                const isActive = item.level === lv;
                                                                return (
                                                                    <button
                                                                        key={lv}
                                                                        onClick={() => handleUpdateLevel(item.code, lv)}
                                                                        disabled={updating === item.code}
                                                                        className={`p-2 rounded-lg border flex items-center justify-center transition-all ${isActive
                                                                            ? `${config.bg} ${config.color} border-current`
                                                                            : 'bg-transparent border-white/5 text-[#5F6B7A] hover:bg-white/5 hover:border-white/10'
                                                                            } ${updating === item.code ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                                        title={config.label}
                                                                    >
                                                                        {updating === item.code && isActive ? (
                                                                            <div className="w-3.5 h-3.5 border border-current border-t-transparent rounded-full animate-spin" />
                                                                        ) : (
                                                                            config.icon
                                                                        )}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* SIGNATURE MODAL */}
            <AnimatePresence>
                {isSignatureModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsSignatureModalOpen(false)} />

                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-2xl bg-[#0B0F14] border border-[#00F5FF]/20 rounded-[2rem] p-8 shadow-2xl overflow-hidden">
                            <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Clôture de la séance</h2>
                            <p className="text-sm text-[#8A94A6] mb-8">Signatures obligatoires pour attester le suivi de la formation (Livret REM).</p>

                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Student Signature */}
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-center gap-2 justify-between">
                                        <label className="text-xs font-black text-[#5F6B7A] tracking-widest uppercase">Signature Élève</label>
                                        <button onClick={() => clearCanvas('student')} className="text-[#00F5FF] text-[10px] font-bold uppercase hover:underline">Effacer</button>
                                    </div>
                                    <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden cursor-crosshair h-40">
                                        <canvas
                                            ref={studentCanvasRef}
                                            width={400} height={160}
                                            className="w-full h-full touch-none"
                                            onMouseDown={(e) => startDrawing(e, 'student')}
                                            onMouseMove={(e) => draw(e, 'student')}
                                            onMouseUp={endDrawing}
                                            onMouseLeave={endDrawing}
                                            onTouchStart={(e) => startDrawing(e, 'student')}
                                            onTouchMove={(e) => draw(e, 'student')}
                                            onTouchEnd={endDrawing}
                                        />
                                    </div>
                                </div>

                                {/* Instructor Signature */}
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-center gap-2 justify-between">
                                        <label className="text-xs font-black text-[#5F6B7A] tracking-widest uppercase">Signature Moniteur</label>
                                        <button onClick={() => clearCanvas('instr')} className="text-[#00F5FF] text-[10px] font-bold uppercase hover:underline">Effacer</button>
                                    </div>
                                    <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden cursor-crosshair h-40">
                                        <canvas
                                            ref={instrCanvasRef}
                                            width={400} height={160}
                                            className="w-full h-full touch-none"
                                            onMouseDown={(e) => startDrawing(e, 'instr')}
                                            onMouseMove={(e) => draw(e, 'instr')}
                                            onMouseUp={endDrawing}
                                            onMouseLeave={endDrawing}
                                            onTouchStart={(e) => startDrawing(e, 'instr')}
                                            onTouchMove={(e) => draw(e, 'instr')}
                                            onTouchEnd={endDrawing}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end gap-4">
                                <button onClick={() => setIsSignatureModalOpen(false)} className="px-6 py-3 rounded-xl border border-white/10 text-white text-xs font-bold uppercase hover:bg-white/5 transition-all">Annuler</button>
                                <button
                                    onClick={handleCloturer}
                                    disabled={!studentSigned || !instrSigned}
                                    className="px-6 py-3 rounded-xl bg-[#00F5FF] text-black text-xs font-black uppercase tracking-widest hover:shadow-[0_0_20px_rgba(0,245,255,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Valider la leçon
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ACTION FEEDBACK TOAST */}
            <AnimatePresence>
                {actionFeedback && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl bg-[#0B0F14] border border-[#00F5FF]/30 shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
                    >
                        <div className="w-8 h-8 rounded-full bg-[#00F5FF]/10 flex items-center justify-center text-[#00F5FF]">
                            <CheckCircle2 size={16} />
                        </div>
                        <p className="text-sm font-medium text-white">{actionFeedback}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function MoniteurEvaluationsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#0B0F14]">
                <div className="w-8 h-8 border-2 border-[#00F5FF] border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            <MoniteurEvaluationsContent />
        </Suspense>
    );
}
