"use client";

import { useState } from "react";
import { Search, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SearchBarProps {
    onSearch: (pattern: string, length: string) => void;
    isLoading: boolean;
}

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
    const [pattern, setPattern] = useState("");
    const [lengthInput, setLengthInput] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!pattern.trim()) return;
        onSearch(pattern, lengthInput);
    };

    return (
        <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onSubmit={handleSubmit}
            className="w-full max-w-2xl mx-auto flex flex-col sm:flex-row gap-3"
        >
            <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input
                    type="text"
                    placeholder="Enter pattern (e.g. A*B, A@#, etc.)"
                    value={pattern}
                    onChange={(e) => setPattern(e.target.value)}
                    className={cn(
                        "w-full bg-slate-800 text-white placeholder-slate-400 pl-10 pr-4 py-3 rounded-xl border border-slate-700",
                        "focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all",
                        "shadow-lg shadow-black/20"
                    )}
                />
            </div>

            <div className="relative w-full sm:w-32">
                <input
                    type="text"
                    placeholder="Length (opt)"
                    value={lengthInput}
                    onChange={(e) => setLengthInput(e.target.value)}
                    className={cn(
                        "w-full bg-slate-800 text-white placeholder-slate-400 px-4 py-3 rounded-xl border border-slate-700",
                        "focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all",
                        "shadow-lg shadow-black/20 text-center"
                    )}
                />
            </div>

            <button
                type="submit"
                disabled={isLoading || !pattern.trim()}
                className={cn(
                    "bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    "shadow-lg shadow-blue-900/20 active:scale-95"
                )}
            >
                {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <>
                        Search <ArrowRight className="w-4 h-4" />
                    </>
                )}
            </button>
        </motion.form>
    );
}
