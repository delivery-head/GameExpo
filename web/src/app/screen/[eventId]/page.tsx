'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { getEvent } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Zap, ShieldCheck } from 'lucide-react';
import Leaderboard from '@/components/Leaderboard';
import AIImagePanel from '@/components/AIImagePanel';
import PlayerImagePanel from '@/components/PlayerImagePanel';
import QRDisplay from '@/components/QRDisplay';

export default function ScreenPage() {
    const { eventId } = useParams() as { eventId: string };
    const [event, setEvent] = useState<any>(null);
    const [players, setPlayers] = useState<any[]>([]);
    const [error, setError] = useState('');
    const [lastSubmission, setLastSubmission] = useState<any>(null);

    const fetchData = async () => {
        try {
            const eventData = await getEvent(eventId);
            setEvent(eventData);
            setPlayers(eventData.players || []);

            // Find most recent submission to show on Right Panel
            const submissions = (eventData.players || [])
                .filter((p: any) => p.generatedImageUrl)
                .sort((a: any, b: any) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime());

            if (submissions.length > 0) {
                setLastSubmission(submissions[0]);
            }
        } catch (err: any) {
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 3000);
        return () => clearInterval(interval);
    }, [eventId]);

    if (error) return (
        <div className="flex items-center justify-center min-h-screen bg-black text-rose-500 font-orbitron">
            <h1 className="text-4xl font-black">SYSTEM ERROR: {error}</h1>
        </div>
    );

    if (!event) return null;

    const playUrl = typeof window !== 'undefined' ? `${window.location.origin}/play/${eventId}` : '';

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground p-12 font-inter relative overflow-hidden">
            <div className="scanline" />

            {/* HEADER */}
            <header className="text-center mb-16 z-10">
                <motion.h1
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-7xl font-black font-orbitron tracking-tighter italic text-primary text-glow-blue leading-none mb-4"
                >
                    PROMPT ARENA
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    className="text-xl font-orbitron uppercase tracking-[0.4em] text-primary"
                >
                    Think It. Type It. Beat The AI.
                </motion.p>
            </header>

            <main className="flex gap-10 flex-1 z-10 items-stretch">
                {/* LEFT PANEL - Leaderboard */}
                <div className="w-[30%] min-w-[350px]">
                    <Leaderboard players={players} />
                </div>

                {/* CENTER PANEL - AI Reference */}
                <div className="flex-1 flex flex-col items-center justify-center">
                    {event.status === 'waiting' ? (
                        <QRDisplay url={playUrl} />
                    ) : (
                        <div className="w-full h-full flex flex-col">
                            <AIImagePanel imageUrl={event.referenceImageUrl} status={event.status} />
                        </div>
                    )}
                </div>

                {/* RIGHT PANEL - Player Image */}
                <div className="w-[30%] min-w-[350px]">
                    <PlayerImagePanel
                        imageUrl={lastSubmission?.generatedImageUrl}
                        lastPlayerName={lastSubmission?.name}
                    />
                </div>
            </main>

            {/* BOTTOM BAR */}
            <footer className="mt-12 flex justify-between items-center z-10 px-8">
                <div className="flex gap-12">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-orbitron font-black text-primary/40 uppercase tracking-widest mb-1">AI Wins</span>
                        <div className="flex items-center gap-3">
                            <Zap className="text-primary" size={20} />
                            <span className="text-4xl font-black font-orbitron text-glow-blue leading-none">{event.aiWins || 0}</span>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-orbitron font-black text-accent/40 uppercase tracking-widest mb-1">Human Wins</span>
                        <div className="flex items-center gap-3">
                            <Activity className="text-accent" size={20} />
                            <span className="text-4xl font-black font-orbitron text-glow-orange leading-none">{event.humanWins || 0}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 opacity-30 font-mono text-[10px] uppercase tracking-widest">
                    <ShieldCheck size={14} />
                    <span>Secure Neural Link v1.0.4</span>
                    <span className="h-1 w-1 bg-white rounded-full" />
                    <span>Realtime Sync: Active</span>
                </div>
            </footer>
        </div>
    );
}
