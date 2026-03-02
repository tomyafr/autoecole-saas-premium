'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#000000] flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,_rgba(0,229,255,0.07)_0%,_transparent_50%)] z-0" />
            <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.05)_0%,_transparent_40%)] z-0" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-[400px] relative z-10 text-center"
            >
                <div className="premium-card p-10 flex flex-col items-center">
                    <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 text-[#5F6B7A] shadow-[0_0_30px_rgba(255,255,255,0.02)]">
                        <AlertTriangle size={40} />
                    </div>

                    <h1 className="text-4xl font-black text-white mb-2 tracking-tighter">404</h1>
                    <p className="text-xs font-medium text-[#8A94A6] mb-8 uppercase tracking-widest leading-relaxed">
                        Module En Construction<br />ou Interdit.<br />
                        <span className="text-[10px] text-red-500 mt-2 block italic">L'accès n'a pas pu être résolu.</span>
                    </p>

                    <button
                        onClick={() => router.back()}
                        className="btn-primary w-full justify-center py-4 text-xs font-black tracking-widest uppercase flex items-center gap-2"
                    >
                        <ArrowLeft size={16} />
                        Retour Sécurisé
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
