'use client';

import { useState, useEffect } from 'react';
import { Users, GraduationCap, Search, FileText, Calendar, CheckSquare, MessageSquare, ExternalLink, Check, X as XIcon, Clock } from 'lucide-react';
import { getStudentDocuments, updateDocumentStatus } from '@/app/actions/admin';
import { sendWhatsAppNotification } from '@/app/actions/crm';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { getStudentsData, getStudentsDashboardStats } from '@/app/actions/admin';

export default function AdminElevesPage() {
    const [students, setStudents] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [stats, setStats] = useState({ totalStudents: 0, examReady: 0, weeklyLessons: 0 });
    const [selectedStudentDocs, setSelectedStudentDocs] = useState<any[] | null>(null);
    const [currentStudent, setCurrentStudent] = useState<any>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        let mounted = true;
        const fetchData = async () => {
            const data = await getStudentsData();
            if (mounted && data) {
                // Pour chaque élève, on pourrait récupérer le statut doc en une fois, 
                // mais pour la démo on va ajouter un champ docStatus simulé ou réel si on a le temps.
                setStudents(data);
            }
            const s = await getStudentsDashboardStats();
            if (mounted && s) setStats(s);
        };
        fetchData();
        return () => { mounted = false; };
    }, []);

    const handleViewDocs = async (student: any) => {
        setCurrentStudent(student);
        const docs = await getStudentDocuments(student.id);
        setSelectedStudentDocs(docs);
    };

    const handleUpdateDocStatus = async (docId: string, status: 'valid' | 'rejected') => {
        const res = await updateDocumentStatus(docId, status);
        if (res.success) {
            toast.success(`Document ${status === 'valid' ? 'validé' : 'refusé'}`);
            // Rafraîchir
            if (currentStudent) {
                const docs = await getStudentDocuments(currentStudent.id);
                setSelectedStudentDocs(docs);
            }
        }
    };

    const handleWhatsAppReminder = async (student: any) => {
        const phone = student.phone || "+33600000000"; // Simulé
        const res = await sendWhatsAppNotification(phone, `Bonjour ${student.name}, il manque des documents à votre dossier AutoDrive. Merci de les ajouter sur votre espace.`);
        if (res.success) {
            toast.success("Rappel WhatsApp envoyé !");
        }
    };

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-white/5">
                <div>
                    <h1 className="page-title">Parcours Élèves</h1>
                    <p className="text-sm text-[#8A94A6] mt-1 font-medium">Suivi pédagogique global de tous les inscrits.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="btn-primary">
                        <GraduationCap size={16} />
                        Ajouter un Élève
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Élèves en Formation', value: stats.totalStudents.toString(), icon: <Users size={18} />, color: 'text-blue-400' },
                    { label: 'Présentations Examen', value: stats.examReady.toString(), icon: <CheckSquare size={18} />, color: 'text-emerald-400' },
                    { label: 'Leçons de la Semaine', value: stats.weeklyLessons.toString(), icon: <Calendar size={18} />, color: 'text-[#00F5FF]' },
                ].map((stat, i) => (
                    <div key={i} className="premium-card p-6 flex flex-col justify-between space-y-4">
                        <div className="flex justify-between items-start">
                            <div className={`p-2 rounded-lg bg-white/[0.03] border border-white/5 ${stat.color}`}>
                                {stat.icon}
                            </div>
                            <span className="card-title">{stat.label}</span>
                        </div>
                        <div className="primary-value">{stat.value}</div>
                    </div>
                ))}
            </div>

            <div className="premium-card overflow-hidden">
                <div className="px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-white/5">
                    <h3 className="section-title">Base de Données Élèves</h3>
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5F6B7A]" size={14} />
                        <input
                            type="text"
                            placeholder="Chercher un élève..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-white/[0.02] border border-white/5 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-[#00F5FF]/20 transition-all"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="premium-table">
                        <thead>
                            <tr>
                                <th>ÉLÈVE & CENTRE</th>
                                <th>AVANCEMENT</th>
                                <th>MONITEUR ATTITRÉ</th>
                                <th>DERNIÈRE LEÇON</th>
                                <th>STATUT GLOBAL</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())).map((student) => (
                                <tr key={student.id} className="group">
                                    <td>
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-white group-hover:text-[#00F5FF] transition-colors">{student.name}</span>
                                            <span className="text-[10px] text-[#5F6B7A] mt-1">{student.center}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex flex-col gap-1.5 w-full max-w-[120px]">
                                            <div className="flex justify-between text-[10px] font-bold text-[#8A94A6]">
                                                <span>{student.hours}h</span>
                                                <span>{student.hoursTotal}h</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-emerald-400" style={{ width: `${(student.hours / student.hoursTotal) * 100}%` }} />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="font-medium text-white">{student.moniteur}</td>
                                    <td className="text-xs text-[#8A94A6]">{student.date}</td>
                                    <td>
                                        <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${student.status === 'Prêt examen' ? 'bg-amber-500/10 text-amber-500' : 'bg-white/5 text-[#5F6B7A]'}`}>
                                            {student.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL DOSSIER ADMINISTRATIF */}
            <AnimatePresence>
                {selectedStudentDocs && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedStudentDocs(null)}
                            className="absolute inset-0 bg-[#0B0F14]/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl premium-card overflow-hidden flex flex-col"
                        >
                            <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-black text-white uppercase tracking-tighter">Dossier : {currentStudent?.name}</h3>
                                    <p className="text-[10px] text-[#5F6B7A] font-bold uppercase tracking-widest mt-1">Validation des pièces ANTS</p>
                                </div>
                                <button onClick={() => setSelectedStudentDocs(null)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#8A94A6] hover:text-red-400 transition-colors">
                                    <XIcon size={20} />
                                </button>
                            </div>

                            <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
                                {['ID', 'PHOTO', 'CERFA', 'JDC'].map((typeCode) => {
                                    const doc = selectedStudentDocs.find(d => d.type === typeCode);
                                    return (
                                        <div key={typeCode} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between group/doc">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${doc ? 'bg-[#00F5FF]/10 text-[#00F5FF]' : 'bg-white/5 text-[#5F6B7A]'}`}>
                                                    <FileText size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-white uppercase">{typeCode === 'ID' ? 'Pièce d\'identité' : typeCode === 'PHOTO' ? 'E-Photo' : typeCode === 'CERFA' ? 'CERFA 02' : 'JDC'}</p>
                                                    {doc ? (
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className={`text-[9px] font-black uppercase tracking-widest ${doc.status === 'valid' ? 'text-emerald-400' : doc.status === 'pending' ? 'text-amber-400' : 'text-red-400'}`}>
                                                                {doc.status === 'valid' ? 'Document Validé' : doc.status === 'pending' ? 'En attente' : 'Refusé'}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <p className="text-[10px] text-[#5F6B7A] mt-1 italic">Non fourni</p>
                                                    )}
                                                </div>
                                            </div>

                                            {doc && (
                                                <div className="flex items-center gap-2">
                                                    <button className="btn-secondary py-2 px-3 text-[9px]">Voir</button>
                                                    {doc.status === 'pending' && (
                                                        <div className="flex gap-1">
                                                            <button
                                                                onClick={() => handleUpdateDocStatus(doc.id, 'valid')}
                                                                className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center hover:bg-emerald-500 transition-all hover:text-white"
                                                            >
                                                                <Check size={14} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleUpdateDocStatus(doc.id, 'rejected')}
                                                                className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 transition-all hover:text-white"
                                                            >
                                                                <XIcon size={14} />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="p-8 bg-white/[0.01] border-t border-white/5">
                                <button
                                    onClick={() => handleWhatsAppReminder(currentStudent)}
                                    className="w-full btn-primary justify-center gap-3"
                                >
                                    <MessageSquare size={16} />
                                    Relancer l'élève par WhatsApp
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
