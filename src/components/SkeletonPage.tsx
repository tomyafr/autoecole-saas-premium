'use client';

import { motion } from 'framer-motion';

export default function SkeletonPage({ title, subtitle }: { title: string, subtitle?: string }) {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-6"
        >
            <motion.div variants={item}>
                <h2 className="text-2xl font-bold text-white">{title}</h2>
                {subtitle && <p className="text-sm text-white/30 mt-1">{subtitle}</p>}
            </motion.div>

            {/* Hero Skeleton */}
            <motion.div variants={item} className="glass-card p-8 h-48 flex flex-col justify-end gap-3">
                <div className="skeleton h-8 w-1/3" />
                <div className="skeleton h-4 w-1/2 opacity-50" />
            </motion.div>

            {/* Grid skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <motion.div key={i} variants={item} className="glass-card p-6 space-y-4">
                        <div className="flex justify-between items-start">
                            <div className="w-10 h-10 rounded-lg skeleton" />
                            <div className="w-16 h-4 skeleton opacity-30" />
                        </div>
                        <div className="space-y-2">
                            <div className="h-6 w-3/4 skeleton" />
                            <div className="h-3 w-1/2 skeleton opacity-40" />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* List skeleton */}
            <motion.div variants={item} className="glass-card p-6 space-y-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-4 py-3 border-b border-white/[0.04] last:border-0">
                        <div className="w-10 h-10 rounded-full skeleton flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 w-1/4 skeleton" />
                            <div className="h-3 w-1/2 skeleton opacity-40" />
                        </div>
                        <div className="w-20 h-8 rounded-lg skeleton opacity-60" />
                    </div>
                ))}
            </motion.div>
        </motion.div>
    );
}
