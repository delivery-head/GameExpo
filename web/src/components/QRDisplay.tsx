'use client';

import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Scan, Zap } from 'lucide-react';

export default function QRDisplay({ url }: { url: string }) {
    return (
        <div className="flex flex-col items-center justify-center h-full gap-10">
            <div className="relative group">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="absolute -inset-10 border-2 border-primary/10 border-dashed rounded-full pointer-events-none"
                />
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                    className="absolute -inset-16 border border-accent/10 border-dashed rounded-full pointer-events-none opacity-50"
                />

                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white p-8 rounded-[40px] shadow-[0_0_80px_rgba(0,210,255,0.2)] border-8 border-primary relative"
                >
                    <div className="absolute inset-0 border-[20px] border-white rounded-[32px] pointer-events-none" />
                    <QRCodeSVG value={url} size={300} level="H" />

                    <div className="absolute -top-6 -right-6 bg-accent p-4 rounded-3xl shadow-lg border-4 border-background animate-bounce">
                        <Scan size={24} className="text-white" />
                    </div>
                </motion.div>
            </div>

            <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 bg-primary/10 px-6 py-2 rounded-full border border-primary/30">
                    <Zap className="text-primary" size={14} fill="currentColor" />
                    <span className="text-[10px] font-orbitron font-black text-primary uppercase tracking-[0.4em]">Initialize Connection</span>
                </div>
                <h2 className="text-4xl font-black font-orbitron text-glow-blue uppercase italic">Scan to join the game</h2>
                <p className="font-mono text-primary/40 text-xs tracking-widest uppercase">{url}</p>
            </div>
        </div>
    );
}
