'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, ShieldCheck, Database, FileText, Trash2, Mail, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function RgpdPage() {
    const router = useRouter();

    const handleExport = () => {
        toast.success("Demande d'exportation de données envoyée. Vous recevrez un email sous 48h.");
    };

    const handleDelete = () => {
        toast.error("Processus de suppression définitive initié. Un email de confirmation a été envoyé.");
    };

    return (
        <div className="space-y-10 group/rgpd max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-6 pb-4 border-b border-white/5">
                <button
                    onClick={() => router.back()}
                    className="p-3 bg-white/5 hover:bg-white/10 text-[#8A94A6] hover:text-white rounded-2xl transition-all"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-2xl font-black text-white uppercase tracking-tighter">
                        Protection des Données (RGPD)
                    </h1>
                    <p className="text-sm text-[#8A94A6] mt-1 font-medium">AutoDrive s'engage à protéger votre vie privée.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Main Readability Policy */}
                <div className="md:col-span-2 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="premium-card p-8 space-y-6"
                    >
                        <div className="flex items-center gap-4 text-[#00F5FF]">
                            <ShieldCheck size={28} />
                            <h2 className="text-lg font-bold text-white uppercase">Politique de Confidentialité</h2>
                        </div>
                        <div className="space-y-4 text-sm text-[#8A94A6] leading-relaxed">
                            <p>
                                Conformément au Règlement Général sur la Protection des Données (RGPD) en vigueur dans l'Union Européenne, nous vous informons que les données collectées sur <strong>AutoDrive Pro</strong> (nom, prénom, adresse e-mail, historique de conduite, évaluations pédagogiques) sont strictement confidentielles.
                            </p>
                            <h3 className="text-white font-bold mt-4">1. Finalité de la collecte</h3>
                            <p>
                                Vos données sont utilisées uniquement pour : la gestion administrative de votre dossier auto-école, la gestion de votre planning de réservation, votre progression pédagogique (livret électronique) et la facturation.
                            </p>
                            <h3 className="text-white font-bold mt-4">2. Partage des données</h3>
                            <p>
                                Nous ne vendons <strong>jamais</strong> vos données personnelles. Elles peuvent être transmises aux services de l'État (ANTS) exclusivement pour les nécessités d'enregistrement à l'examen du permis de conduire.
                            </p>
                            <h3 className="text-white font-bold mt-4">3. Conservation</h3>
                            <p>
                                Conformément à la loi française (arrêté du 22 décembre 2009), votre dossier d'auto-école complet est conservé pendant la durée de votre apprentissage, puis archivé pour une durée légale de 5 ans en cas de contrôle de la Déléguée au Permis de Conduire (DPC).
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Actions RGPD */}
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                        className="premium-card p-6 border-l-4 border-l-[#00F5FF] space-y-6"
                    >
                        <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                            <Database size={14} className="text-[#00F5FF]" /> Mes Droits Informatiques
                        </h3>

                        <div className="space-y-4">
                            <button onClick={handleExport} className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-left group">
                                <div>
                                    <span className="block text-sm font-bold text-white group-hover:text-[#00F5FF] transition-colors">Exporter mes données</span>
                                    <span className="text-[10px] text-[#5F6B7A]">Recevoir vos infos au format JSON/PDF</span>
                                </div>
                                <Download size={16} className="text-[#8A94A6] group-hover:text-[#00F5FF]" />
                            </button>

                            <button className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-left group">
                                <div>
                                    <span className="block text-sm font-bold text-white group-hover:text-[#00F5FF] transition-colors">Droit de rectification</span>
                                    <span className="text-[10px] text-[#5F6B7A]">Contacter le DPO de l'auto-école</span>
                                </div>
                                <Mail size={16} className="text-[#8A94A6] group-hover:text-[#00F5FF]" />
                            </button>

                            <button onClick={handleDelete} className="w-full flex items-center justify-between p-4 bg-red-500/10 hover:bg-red-500/20 border-red-500/20 border text-left rounded-xl transition-colors group">
                                <div>
                                    <span className="block text-sm font-bold text-red-500 group-hover:text-red-400">Supprimer mon compte</span>
                                    <span className="text-[10px] text-red-500/60">Droit à l'oubli total</span>
                                </div>
                                <Trash2 size={16} className="text-red-500" />
                            </button>
                        </div>
                    </motion.div>
                </div>

            </div>
        </div>
    );
}
