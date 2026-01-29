"use client";

import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import ResultsDisplay from "@/components/ResultsDisplay";
import HelpModal from "@/components/HelpModal";
import { motion } from "framer-motion";
import { Toaster, toast } from "sonner";
import { CircleHelp } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  const [results, setResults] = useState<string[] | string[][]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [searchTime, setSearchTime] = useState<number | null>(null);

  const handleSearch = async (pattern: string, dictionary: string) => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setResults([]);
    setSearchTime(null);

    try {
      const params = new URLSearchParams({ pattern });
      if (dictionary) params.append("dictionary", dictionary);

      // Note: Assumes backend is running on port 8000
      const res = await fetch(`http://localhost:8000/search?${params.toString()}`);

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Failed to fetch results");
      }

      const data = await res.json();
      setResults(data.results || []);
      setSearchTime(data.elapsed_time || null);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-6 sm:p-24 selection:bg-blue-500/30 relative">
      <Toaster position="top-center" />

      {/* Search Help Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={() => setIsHelpOpen(true)}
        className={cn(
          "absolute top-6 right-6 sm:top-10 sm:right-10",
          "flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-all",
          "border border-slate-700 shadow-lg"
        )}
      >
        <CircleHelp className="w-4 h-4" />
        <span className="text-sm font-medium">How To Use?</span>
      </motion.button>

      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <div className="mx-auto w-full flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 space-y-4"
        >
          <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-500">
            Word Finder
          </h1>
          <p className="text-slate-400 text-lg">
            Find words matching your advanced patterns instantly.
          </p>
        </motion.div>

        <SearchBar
          onSearch={handleSearch}
          isLoading={isLoading}
          onDictionaryChange={(name) => toast.success(`Dictionary swapped to ${name.replace(/\.txt$/i, "").toUpperCase()}`)}
        />

        {error && (
          <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl">
            {error}
          </div>
        )}

        {!isLoading && hasSearched && results.length === 0 && !error && (
          <div className="mt-12 text-slate-500">
            No results found for that pattern.
          </div>
        )}

        <ResultsDisplay results={results} searchTime={searchTime} />
      </div>
    </main>
  );
}
