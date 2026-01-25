"use client";

import { motion } from "framer-motion";

interface ResultsDisplayProps {
    results: string[];
}

export default function ResultsDisplay({ results }: ResultsDisplayProps) {
    if (results.length === 0) return null;

    // Group by length
    const grouped = results.reduce((acc, word) => {
        const len = word.length;
        if (!acc[len]) acc[len] = [];
        acc[len].push(word);
        return acc;
    }, {} as Record<number, string[]>);

    const lengths = Object.keys(grouped)
        .map(Number)
        .sort((a, b) => a - b);

    return (
        <div className="w-full max-w-4xl mx-auto mt-12 space-y-8">
            {lengths.map((len, index) => (
                <motion.div
                    key={len}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm"
                >
                    <h3 className="text-xl font-bold text-slate-200 mb-4 flex items-center gap-3">
                        <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-lg text-sm">
                            Length {len}
                        </span>
                        <span className="text-slate-500 text-sm font-normal">
                            {grouped[len].length} words
                        </span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {grouped[len].sort().map((word) => (
                            <span
                                key={word}
                                className="bg-slate-700/50 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-md text-base transition-colors border border-slate-600/30"
                            >
                                {word}
                            </span>
                        ))}
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
