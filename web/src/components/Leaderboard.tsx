'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal } from 'lucide-react';

interface Player {
    name: string;
    score: number;
}

export default function Leaderboard({ players }: { players: Player[] }) {
    const top3 = players.slice(0, 3);
    const others = players.slice(3, 10);

    const getMedalColor = (idx: number) => {
        switch (idx) {
            case 0: return 'text-gold';
            case 1: return 'text-gray-300';
            case 2: return 'text-orange-400';
            default: return 'text-primary';
        }
    };

    return (
        <div className="flex flex-col h-full bg-glass p-8 rounded-[32px] border border-white/10 cyber-gradient relative overflow-hidden">
            <div className="flex items-center gap-3 mb-8">
                <Trophy className="text-gold animate-pulse" size={28} />
                <h2 className="text-2xl font-black font-orbitron tracking-tighter uppercase italic">Leaderboard</h2>
            </div>

            <div className="space-y-4 mb-8">
                <AnimatePresence>
                    {top3.map((player, idx) => (
                        <motion.div
                            key={player.name}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            layout
                            className={`flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 ${idx === 0 ? 'neon-border-blue bg-primary/5' : ''}`}
                        >
                            <div className="flex items-center gap-4">
                                <span className={`text-xl font-black font-orbitron w-8 ${getMedalColor(idx)}`}>
                                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                                </span>
                                <span className="font-bold uppercase tracking-tight truncate max-w-[120px]">{player.name}</span>
                            </div>
                            <span className={`text-xl font-black font-orbitron ${getMedalColor(idx)}`}>
                                {Math.round(player.score || 0)}%
                            </span>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div className="flex-1">
                <h3 className="text-[10px] font-orbitron font-black text-primary/40 uppercase tracking-[0.4em] mb-4">Live Scores</h3>
                <div className="space-y-2">
                    <AnimatePresence>
                        {others.map((player, idx) => (
                            <motion.div
                                key={player.name}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                layout
                                className="flex items-center justify-between px-4 py-2 bg-white/5 rounded-xl border border-white/5"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-mono text-white/30">{idx + 4}</span>
                                    <span className="text-xs font-bold uppercase tracking-tight text-white/70">{player.name}</span>
                                </div>
                                <span className="text-xs font-black font-orbitron text-primary/60">{Math.round(player.score || 0)}%</span>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {others.length === 0 && Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-10 border-2 border-dashed border-white/5 rounded-xl opacity-20" />
                    ))}
                </div>
            </div>

            <style jsx>{`
        .cyber-gradient::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--primary), transparent);
          opacity: 0.5;
        }
      `}</style>
        </div>
    );
}
