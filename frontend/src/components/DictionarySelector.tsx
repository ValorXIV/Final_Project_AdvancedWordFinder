"use client";

import { useEffect, useState } from "react";
import { Book } from "lucide-react";
import { cn } from "@/lib/utils";

interface DictionarySelectorProps {
    onDictionaryChange?: (filename: string) => void;
}

export default function DictionarySelector({ onDictionaryChange }: DictionarySelectorProps) {
    const [dictionaries, setDictionaries] = useState<string[]>([]);
    const [currentDict, setCurrentDict] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchDictionaries();
    }, []);

    const fetchDictionaries = async () => {
        try {
            const res = await fetch("http://localhost:8000/dictionaries");
            if (res.ok) {
                const data = await res.json();
                setDictionaries(data.dictionaries);
                setCurrentDict(data.current);
            }
        } catch (error) {
            console.error("Failed to fetch dictionaries:", error);
        }
    };

    const handleDictionaryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newDict = e.target.value;
        if (!newDict || newDict === currentDict) return;

        setCurrentDict(newDict);
        if (onDictionaryChange) {
            onDictionaryChange(newDict);
        }
    };

    return (
        <div className="h-full flex items-center gap-2 bg-slate-800 text-white px-4 py-3 rounded-xl border border-slate-700 shadow-lg shadow-black/20">
            <Book className="w-5 h-5 text-slate-400 flex-shrink-0" />
            <select
                value={currentDict}
                onChange={handleDictionaryChange}
                disabled={isLoading}
                className={cn(
                    "bg-transparent text-slate-200 focus:outline-none cursor-pointer w-full h-full",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
            >
                {dictionaries.map((dict) => (
                    <option key={dict} value={dict} className="bg-slate-800 text-slate-200">
                        {dict.replace(/\.txt$/i, "")}
                    </option>
                ))}
            </select>
            {isLoading && (
                <div className="w-3 h-3 border-2 border-slate-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
            )}
        </div>
    );
}
