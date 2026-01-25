"use client";

import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import ResultsDisplay from "@/components/ResultsDisplay";
import { motion } from "framer-motion";

export default function Home() {
  const [results, setResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (pattern: string, length: string) => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setResults([]);

    try {
      const params = new URLSearchParams({ pattern });
      if (length) params.append("length", length);

      // Note: Assumes backend is running on port 8000
      const res = await fetch(`http://localhost:8000/search?${params.toString()}`);

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Failed to fetch results");
      }

      const data = await res.json();
      setResults(data.results || []);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-6 sm:p-24 selection:bg-blue-500/30">
      <div className="max-w-5xl mx-auto flex flex-col items-center">
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

        <SearchBar onSearch={handleSearch} isLoading={isLoading} />

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

        <ResultsDisplay results={results} />
      </div>
    </main>
  );
}
