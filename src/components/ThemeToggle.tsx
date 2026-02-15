'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ThemeToggle() {
    const [theme, setTheme] = useState('dark');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Check initial theme
        const savedTheme = localStorage.getItem('theme');
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        const initialTheme = savedTheme || systemTheme;

        setTheme(initialTheme);
        document.documentElement.classList.toggle('dark', initialTheme === 'dark');
    }, []);

    const toggleTheme = (newTheme: string) => {
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);

        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    if (!mounted) return null;

    return (
        <div className="flex bg-white/[0.03] border border-white/5 p-1.5 rounded-xl gap-1 w-full max-w-[300px]">
            {[
                { id: 'light', icon: Sun, label: 'Clair' },
                { id: 'dark', icon: Moon, label: 'Sombre' },
            ].map((option) => (
                <button
                    key={option.id}
                    onClick={() => toggleTheme(option.id)}
                    className={`
                        relative flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all
                        ${theme === option.id
                            ? 'text-black shadow-lg shadow-black/5'
                            : 'text-[#8A94A6] hover:text-white hover:bg-white/[0.05]'}
                    `}
                >
                    <div className="relative z-10 flex items-center gap-2">
                        <option.icon size={14} className={theme === option.id ? 'text-[#00F5FF]' : 'currentColor'} />
                        {option.label}
                    </div>
                    {theme === option.id && (
                        <motion.div
                            layoutId="active-theme"
                            className="absolute inset-0 bg-white rounded-lg -z-10"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                </button>
            ))}
        </div>
    );
}
