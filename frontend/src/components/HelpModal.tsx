"use client";

import { X, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-slate-400 hover:text-white"
            title="Copy to clipboard"
        >
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
    );
}

function PatternRow({ pattern, description, example }: { pattern: string; description: string; example: string }) {
    return (
        <tr className="hover:bg-white/5 transition-colors">
            <td className="p-4 font-mono text-blue-400">
                <div className="flex items-center gap-2">
                    <span>{pattern}</span>
                    <CopyButton text={pattern} />
                </div>
            </td>
            <td className="p-4">{description}</td>
            <td className="p-4 font-mono text-slate-400 truncate" title={example}>{example}</td>
        </tr>
    );
}

interface HelpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function HelpModal({ isOpen, onClose }: HelpModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl max-h-[85vh] overflow-y-auto z-50 p-4"
                    >
                        <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">

                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-slate-700/50 bg-slate-800/50">
                                <h2 className="text-2xl font-bold text-white">Search Patterns Guide</h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <div className="overflow-hidden rounded-xl border border-slate-700/50">
                                    <table className="w-full text-left border-collapse table-fixed">
                                        <thead>
                                            <tr className="bg-slate-800/50 text-slate-300">
                                                <th className="p-4 border-b border-slate-700/50 font-semibold w-[25%]">Pattern</th>
                                                <th className="p-4 border-b border-slate-700/50 font-semibold w-[35%]">Description</th>
                                                <th className="p-4 border-b border-slate-700/50 font-semibold w-[40%]">Example</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-700/50 text-slate-300">
                                            <PatternRow
                                                pattern="va......"
                                                description="Use . to represent any single letter"
                                                example="vacantly vacating vacation vaccines"
                                            />
                                            <PatternRow
                                                pattern="q[aeiou]..."
                                                description="Use [abcd] to represent any single letter in the bracket"
                                                example="qadis qajar qilar qanat qatar quota"
                                            />
                                            <PatternRow
                                                pattern="[b-f].a..s"
                                                description="Use [a-z] to represent any single letter in the range"
                                                example="beanos beards beasts beaths beauts"
                                            />
                                            <PatternRow
                                                pattern="[c-k][^aer]....."
                                                description="Use [^abcd] to not include the letters in the bracket in that position"
                                                example="ceasing densely embread fencers gnashed"
                                            />
                                            <PatternRow
                                                pattern="@@##"
                                                description="Use @ to represent any vowel and # to represent any consonant"
                                                example="aery aids east easy eath iamb ions "
                                            />
                                            <PatternRow
                                                pattern=".z*m*"
                                                description="Use * to represent any number of any letter"
                                                example="azym izmir azimuth czarism tzimmes"
                                            />
                                            <PatternRow
                                                pattern="8-10:tw*"
                                                description="Use number-number: to filter words by length in the range"
                                                example="twaddler twitters twinking twilights"
                                            />
                                            <PatternRow
                                                pattern="11-:*x*x*"
                                                description="Leave blank on any ends to represent any length"
                                                example="executrixes exxonvaldez xanthoxylum"
                                            />
                                            <PatternRow
                                                pattern="6:@y*"
                                                description="Use single number to fix the length of the word"
                                                example="azym izmir azimuth czarism tzimmes"
                                            />
                                            <PatternRow
                                                pattern="*x*x*"
                                                description="Use * to represent any number of any letter"
                                                example="azym izmir azimuth czarism tzimmes"
                                            />
                                            <PatternRow
                                                pattern="/scarab"
                                                description="Use / in front of a set of letter to find anagram of those letters"
                                                example="barcas barsac scarab"
                                            />
                                            <PatternRow
                                                pattern="/dance."
                                                description="Use . in the anagram pattern to represent any single letter"
                                                example="caned ascend candle canned"
                                            />
                                            <PatternRow
                                                pattern="/wzx*"
                                                description="Use * in the anagram pattern to represent any number of any letter"
                                                example="thequickbrownfoxjumpsoverthelazydog"
                                            />
                                            <PatternRow
                                                pattern="AiA"
                                                description="Use capital letters (A-Z) to represent variable"
                                                example="seise derider dosidos trinitrin"
                                            />
                                            <PatternRow
                                                pattern="AB.BA"
                                                description="Use capital letters (A-Z) to represent variable"
                                                example="servers overdrove sentients"
                                            />
                                            <PatternRow
                                                pattern="Aing; endA"
                                                description="Use ; to seperate the query and find many words simutenously"
                                                example="(owing endow) (angering endanger)"
                                            />
                                            <PatternRow
                                                pattern="AsB;AtB;AyB;ApB"
                                                description="Use ; to seperate the query and find many words simutenously"
                                                example="(tosing toting toying toping)"
                                            />
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
