"use client";

import { useState } from "react";
import { Search, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import DictionarySelector from "@/components/DictionarySelector";

interface SearchBarProps {
    onSearch: (pattern: string, dictionary: string) => void;
    onDictionaryChange?: (filename: string) => void;
    isLoading: boolean;
}

export default function SearchBar({ onSearch, isLoading, onDictionaryChange }: SearchBarProps) {
    const [pattern, setPattern] = useState("");
    const [selectedDict, setSelectedDict] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!pattern.trim()) return;
        onSearch(pattern, selectedDict);
    };

    const handleDictChange = (val: string) => {
        setSelectedDict(val);
        if (onDictionaryChange) onDictionaryChange(val);
    }

    return (
        <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onSubmit={handleSubmit}
            className="w-full max-w-5xl mx-auto flex flex-col sm:flex-row gap-3"
        >
            <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input
                    type="text"
                    placeholder="Enter pattern (e.g. A*B, A@#, 5:A...)"
                    value={pattern}
                    onChange={(e) => setPattern(e.target.value)}
                    className={cn(
                        "w-full bg-slate-800 text-white placeholder-slate-400 pl-10 pr-4 py-3 rounded-xl border border-slate-700",
                        "focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all",
                        "shadow-lg shadow-black/20"
                    )}
                />
            </div>

            <div className="flex-shrink-0">
                <DictionarySelector onDictionaryChange={handleDictChange} />
            </div>

            <button
                type="submit"
                disabled={isLoading || !pattern.trim()}
                className={cn(
                    "bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    "shadow-lg shadow-blue-900/20 active:scale-95",
                    "min-w-[140px]"
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
