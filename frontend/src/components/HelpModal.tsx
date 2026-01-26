"use client";

import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl max-h-[85vh] overflow-y-auto z-50 p-4"
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
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-800/50 text-slate-300">
                                                <th className="p-4 border-b border-slate-700/50 font-semibold w-1/4">Pattern</th>
                                                <th className="p-4 border-b border-slate-700/50 font-semibold w-1/2">Description</th>
                                                <th className="p-4 border-b border-slate-700/50 font-semibold w-1/4">Example</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-700/50 text-slate-300">
                                            {/* Placeholder Rows */}
                                            <tr className="hover:bg-white/5 transition-colors">
                                                <td className="p-4 font-mono text-blue-400">TODO</td>
                                                <td className="p-4">Content to be filled later</td>
                                                <td className="p-4 font-mono text-slate-400">...</td>
                                            </tr>
                                            <tr className="hover:bg-white/5 transition-colors">
                                                <td className="p-4 font-mono text-blue-400">TODO</td>
                                                <td className="p-4">Content to be filled later</td>
                                                <td className="p-4 font-mono text-slate-400">...</td>
                                            </tr>
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
