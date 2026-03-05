'use client';

import { motion } from 'framer-motion';
import { Send, Loader2, Sparkles } from 'lucide-react';

interface PromptInputProps {
    value: string;
    onChange: (val: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    loading: boolean;
    error?: string;
}

export default function PromptInput({ value, onChange, onSubmit, loading, error }: PromptInputProps) {
    return (
        <div className="w-full">
            <form onSubmit={onSubmit} className="space-y-6">
                <div className="relative group">
                    <div className="absolute -top-3 left-6 flex items-center gap-2 bg-background px-3 text-[10px] font-orbitron font-black text-primary uppercase tracking-widest z-10 border border-primary/20 rounded-full group-focus-within:border-primary transition-all">
                        <Sparkles size={10} /> Neural Construct
                    </div>
                    <textarea
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full bg-white/5 border-2 border-white/10 rounded-[32px] px-8 py-10 focus:outline-none focus:border-primary focus:bg-primary/5 text-white text-lg font-medium placeholder:text-white/10 min-h-[220px] transition-all resize-none shadow-2xl"
                        required
                        placeholder="Type your imagination here..."
                    />
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                        className="text-accent text-[10px] font-orbitron font-black uppercase tracking-widest px-4"
                    >
                        ⚠️ {error}
                    </motion.div>
                )}

                <button
                    type="submit"
                    disabled={loading || !value.trim()}
                    className="w-full relative group transform active:scale-95 disabled:scale-100 disabled:opacity-50 transition-all"
                >
                    <div className="absolute inset-0 bg-primary blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                    <div className="relative bg-primary hover:bg-white text-black px-6 py-6 rounded-[24px] font-black font-orbitron text-lg uppercase tracking-widest flex items-center justify-center gap-3 transition-all">
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" />
                                <span>Analyzing...</span>
                            </>
                        ) : (
                            <>
                                <span>Send Prompt</span>
                                <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </>
                        )}
                    </div>
                </button>
            </form>
        </div>
    );
}
