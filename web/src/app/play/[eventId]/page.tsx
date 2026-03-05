'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { joinEvent, getEvent, submitPrompt } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Send, CheckCircle2, Loader2, Sparkles, Cpu } from 'lucide-react';
import PromptInput from '@/components/PromptInput';

export default function PlayPage() {
    const { eventId } = useParams() as { eventId: string };
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [prompt, setPrompt] = useState('');
    const [status, setStatus] = useState<'joining' | 'waiting' | 'active' | 'finished'>('joining');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [score, setScore] = useState<number | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [eventData, setEventData] = useState<any>(null);

    // Initial load for session
    useEffect(() => {
        const savedPlayer = localStorage.getItem(`player_${eventId}`);
        if (savedPlayer) {
            const { name, email } = JSON.parse(savedPlayer);
            setName(name);
            setEmail(email);
            setStatus('waiting');
        }
    }, [eventId]);

    // Polling for event status
    useEffect(() => {
        if (status === 'joining') return;

        const checkStatus = async () => {
            try {
                const event = await getEvent(eventId);
                setEventData(event);

                if (event.status === 'active' && status === 'waiting') {
                    setStatus('active');
                } else if (event.status === 'finished' && status !== 'finished') {
                    setStatus('finished');
                }
            } catch (err) { }
        };

        checkStatus();
        const interval = setInterval(checkStatus, 3000);
        return () => clearInterval(interval);
    }, [eventId, status]);

    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await joinEvent(eventId, name, email, phone);
            localStorage.setItem(`player_${eventId}`, JSON.stringify({ name, email }));
            setStatus('waiting');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitPrompt = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await submitPrompt(eventId, email, prompt);
            setScore(res.score);
            setGeneratedImage(res.imageUrl);
            setStatus('finished');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const containerVariants = {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 1.05 }
    };

    // STEP 1 - JOIN FORM
    if (status === 'joining') {
        return (
            <div className="flex flex-col min-h-screen bg-background text-white p-8 relative overflow-hidden">
                <div className="scanline" />
                <motion.div
                    variants={containerVariants}
                    initial="initial"
                    animate="animate"
                    className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full relative z-10"
                >
                    <header className="mb-14">
                        <h1 className="text-5xl font-black font-orbitron italic tracking-tighter uppercase leading-[0.8] mb-4">
                            JOIN <br /><span className="text-primary text-glow-blue">ARENA</span>
                        </h1>
                        <p className="text-primary/40 font-orbitron font-bold text-[10px] uppercase tracking-[0.3em]">Initialize Combat Link</p>
                    </header>

                    <form onSubmit={handleJoin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-orbitron font-black uppercase text-primary/40 flex items-center gap-2">
                                <User size={12} /> Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-black/40 border-b-2 border-white/10 p-4 focus:border-primary focus:outline-none transition-all font-orbitron text-sm uppercase tracking-widest text-white"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-orbitron font-black uppercase text-primary/40 flex items-center gap-2">
                                <Mail size={12} /> Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black/40 border-b-2 border-white/10 p-4 focus:border-primary focus:outline-none transition-all font-orbitron text-sm text-white"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-10 bg-primary text-black py-6 rounded-2xl font-black font-orbitron text-lg uppercase tracking-widest hover:bg-white transition-all shadow-2xl"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'JOIN GAME'}
                        </button>
                    </form>
                </motion.div>
            </div>
        );
    }

    // STEP 2 - WAITING STATE
    if (status === 'waiting') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background text-white p-12 text-center overflow-hidden">
                <div className="scanline" />
                <motion.div variants={containerVariants} initial="initial" animate="animate" className="z-10">
                    <div className="w-40 h-40 border-4 border-dashed border-primary/20 rounded-full animate-spin-slow flex items-center justify-center mb-10 mx-auto">
                        <Cpu size={48} className="text-primary animate-pulse" />
                    </div>
                    <h2 className="text-2xl font-black font-orbitron uppercase tracking-tighter mb-4 text-glow-blue">CONNECTED: {name}</h2>
                    <p className="text-primary/40 font-mono text-xs uppercase tracking-[0.3em]">Waiting for the game to start...</p>
                </motion.div>
            </div>
        );
    }

    // STEP 3 & 4 - GAME ACTIVE
    if (status === 'active') {
        return (
            <div className="flex flex-col min-h-screen bg-background text-white p-8 relative overflow-hidden">
                <div className="scanline" />
                <motion.div variants={containerVariants} initial="initial" animate="animate" className="z-10 max-w-sm mx-auto w-full">
                    <header className="mb-8">
                        <div className="flex items-center gap-2 text-primary opacity-50 mb-2 font-orbitron text-[10px] font-black uppercase tracking-widest">
                            <Sparkles size={12} /> Neural Link Active
                        </div>
                        <h2 className="text-xl font-bold uppercase text-white/80">Recreate this image using a prompt.</h2>
                    </header>

                    {eventData?.referenceImageUrl && (
                        <div className="w-full aspect-video rounded-3xl overflow-hidden border-2 border-primary/20 mb-10 shadow-2xl">
                            <img src={eventData.referenceImageUrl} className="w-full h-full object-cover" alt="Target" />
                        </div>
                    )}

                    <PromptInput
                        value={prompt}
                        onChange={setPrompt}
                        onSubmit={handleSubmitPrompt}
                        loading={loading}
                        error={error}
                    />
                </motion.div>
            </div>
        );
    }

    // STEP 5 - RESULT
    if (status === 'finished' || (status === 'active' && generatedImage)) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background text-white p-8 relative overflow-hidden">
                <div className="scanline" />
                <motion.div variants={containerVariants} initial="initial" animate="animate" className="z-10 w-full max-w-sm flex flex-col items-center gap-8">
                    <div className="text-center">
                        <div className="text-[10px] font-orbitron font-black text-success uppercase tracking-[0.5em] mb-4">Transmission Success</div>
                        {score !== null && (
                            <div>
                                <h1 className="text-xl font-orbitron font-bold text-primary/60 uppercase tracking-widest leading-none mb-1">ACCURACY</h1>
                                <span className="text-7xl font-black font-orbitron italic tracking-tighter text-glow-blue leading-none">{score}%</span>
                            </div>
                        )}
                    </div>

                    {generatedImage && (
                        <div className="w-full rounded-[40px] overflow-hidden border-2 border-accent/20 shadow-2xl">
                            <img src={generatedImage} className="w-full object-cover" alt="Neural Output" />
                        </div>
                    )}

                    <p className="text-primary/40 text-[10px] font-orbitron uppercase text-center tracking-[0.3em] leading-relaxed">
                        Session archived. Check main screen for final rankings.
                    </p>
                </motion.div>
            </div>
        );
    }

    return null;
}
