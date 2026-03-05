'use client';

import { motion } from 'framer-motion';
import { User, Cpu } from 'lucide-react';

export default function PlayerImagePanel({ imageUrl, lastPlayerName }: { imageUrl: string | null, lastPlayerName: string | null }) {
    return (
        <div className="flex flex-col h-full gap-4">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                    <Cpu className="text-accent" size={18} />
                    <span className="text-[10px] font-orbitron font-black text-accent uppercase tracking-[0.4em]">Player Transmission</span>
                </div>
            </div>

            <div className="flex-1 bg-glass rounded-[40px] border border-white/10 relative overflow-hidden flex flex-col items-center justify-center p-8 group transition-all hover:border-accent/30">
                {imageUrl ? (
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="w-full h-full relative"
                    >
                        <img
                            src={imageUrl}
                            className="w-full h-full object-cover rounded-[32px] border-2 border-accent/20"
                            alt="Player Generation"
                        />
                        <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center border border-accent/40">
                                    <User size={14} className="text-accent" />
                                </div>
                                <p className="font-orbitron font-black text-sm text-white tracking-widest">{lastPlayerName}</p>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <div className="text-center space-y-6 opacity-30 group-hover:opacity-50 transition-opacity">
                        <div className="w-24 h-24 rounded-full border-4 border-dashed border-white/20 mx-auto flex items-center justify-center">
                            <User size={40} />
                        </div>
                        <p className="font-orbitron text-xs tracking-[0.5em] max-w-[200px] leading-relaxed">Your image will appear here</p>
                    </div>
                )}
            </div>
        </div>
    );
}
