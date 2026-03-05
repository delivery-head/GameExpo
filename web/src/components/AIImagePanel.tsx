'use client';

import { motion } from 'framer-motion';
import { Target, Sparkles } from 'lucide-react';

export default function AIImagePanel({ imageUrl, status }: { imageUrl: string, status: string }) {
    return (
        <div className="flex flex-col h-full gap-4">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                    <Target className="text-primary animate-pulse" size={18} />
                    <span className="text-[10px] font-orbitron font-black text-primary uppercase tracking-[0.4em]">Reference Vector</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                    <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                    <span className="text-[8px] font-orbitron text-success/80 uppercase">AI Synced</span>
                </div>
            </div>

            <div className="flex-1 bg-glass rounded-[40px] border-2 border-primary/30 relative overflow-hidden group shadow-[0_0_50px_rgba(0,210,255,0.1)]">
                {imageUrl ? (
                    <motion.img
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        src={imageUrl}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        alt="AI Archetype"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-4 opacity-20">
                        <Sparkles size={48} className="animate-spin-slow" />
                        <p className="font-orbitron text-xs tracking-[0.5em]">Waiting for System Start</p>
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />

                <div className="absolute bottom-8 left-8 right-8">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-1 bg-primary shadow-[0_0_15px_var(--primary)]" />
                        <div>
                            <p className="text-[8px] font-orbitron text-primary/60 uppercase tracking-widest leading-none mb-1">Target Description</p>
                            <p className="text-sm font-bold text-white uppercase tracking-tighter">Neural Network Masterpiece 0.1</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
