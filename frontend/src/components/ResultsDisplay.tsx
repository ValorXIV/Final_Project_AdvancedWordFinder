"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ResultsDisplayProps {
    results: string[] | string[][];
}

export default function ResultsDisplay({ results }: ResultsDisplayProps) {
    if (results.length === 0) return null;

    // Check if it's a 2D array (Multi Query)
    const isMultiQuery = Array.isArray(results[0]);

    if (isMultiQuery) {
        return <MultiQueryDisplay results={results as string[][]} />;
    }

    return <SingleQueryDisplay results={results as string[]} />;
}

function MultiQueryDisplay({ results }: { results: string[][] }) {
    // Group by length of the first word (assuming same length for group, or just use first)
    const grouped = results.reduce((acc, combination) => {
        if (combination.length === 0) return acc;
        const len = combination[0].length; // Grouping by length of first word
        if (!acc[len]) acc[len] = [];
        acc[len].push(combination);
        return acc;
    }, {} as Record<number, string[][]>);

    const lengths = Object.keys(grouped)
        .map(Number)
        .sort((a, b) => a - b);

    return (
        <div className="w-full mx-auto mt-12 space-y-8">
            {lengths.map((len, index) => (
                <motion.div
                    key={len}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm"
                >
                    <h3 className="text-xl font-bold text-slate-200 mb-6 flex items-center gap-3">
                        <span className="bg-purple-500/10 text-purple-400 px-3 py-1 rounded-lg text-sm">
                            Length {len}
                        </span>
                        <span className="text-slate-500 text-sm font-normal">
                            {grouped[len].length} combinations
                        </span>
                    </h3>

                    <div className="flex flex-wrap gap-4">
                        {grouped[len].map((combination, i) => (
                            <div
                                key={i}
                                className="flex items-center bg-slate-900/50 border border-slate-700/80 rounded-lg p-2 gap-2 hover:border-slate-500 transition-colors"
                            >
                                {combination.map((word, j) => (
                                    <span
                                        key={j}
                                        className={cn(
                                            "px-3 py-1.5 rounded-md text-base font-medium text-slate-200",
                                            "bg-slate-800 border border-slate-700 shadow-sm"
                                        )}
                                    >
                                        {word}
                                    </span>
                                ))}
                            </div>
                        ))}
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

function SingleQueryDisplay({ results }: { results: string[] }) {
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
        <div className="w-full mx-auto mt-12 space-y-8">
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
