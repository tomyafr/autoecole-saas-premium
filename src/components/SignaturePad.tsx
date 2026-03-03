'use client';

import React, { useRef, useEffect, useState } from 'react';
import { X, Check, RotateCcw } from 'lucide-react';

interface SignaturePadProps {
    onSave: (signature: string) => void;
    onClose: () => void;
}

export default function SignaturePad({ onSave, onClose }: SignaturePadProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [isEmpty, setIsEmpty] = useState(true);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set line style
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // High DPI support
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
    }, []);

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDrawing(true);
        setIsEmpty(false);
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;

        const { x, y } = getCoordinates(e);
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;

        const { x, y } = getCoordinates(e);
        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };

        const rect = canvas.getBoundingClientRect();
        let clientX, clientY;

        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    };

    const clear = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setIsEmpty(true);
    };

    const save = () => {
        const canvas = canvasRef.current;
        if (!canvas || isEmpty) return;
        const signature = canvas.toDataURL('image/png');
        onSave(signature);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="premium-card w-full max-w-lg overflow-hidden flex flex-col">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-black text-white uppercase tracking-tighter">Signature de l'élève</h3>
                        <p className="text-xs text-[#8A94A6] font-bold uppercase tracking-widest mt-1">Validation de la leçon</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#8A94A6] hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    <div className="relative aspect-[2/1] bg-black/40 border-2 border-dashed border-white/10 rounded-2xl overflow-hidden cursor-crosshair">
                        <canvas
                            ref={canvasRef}
                            className="w-full h-full touch-none"
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                            onTouchStart={startDrawing}
                            onTouchMove={draw}
                            onTouchEnd={stopDrawing}
                        />
                        {isEmpty && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <p className="text-xs font-bold text-[#5F6B7A] uppercase tracking-[0.2em] opacity-50">Signez ici</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-6 bg-white/[0.02] border-t border-white/5 flex gap-4">
                    <button
                        onClick={clear}
                        className="flex-1 btn-secondary justify-center py-4"
                    >
                        <RotateCcw size={16} />
                        Effacer
                    </button>
                    <button
                        onClick={save}
                        disabled={isEmpty}
                        className="flex-1 btn-primary justify-center py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Check size={16} />
                        Valider la signature
                    </button>
                </div>
            </div>
        </div>
    );
}
