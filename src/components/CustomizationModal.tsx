"use client";

import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";

interface CustomizationModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: {
        id: string;
        name: string;
        price: number;
        image: string;
    };
}

export function CustomizationModal({ isOpen, onClose, item }: CustomizationModalProps) {
    const [specialInstructions, setSpecialInstructions] = useState("");
    const addToCart = useStore((state) => state.addToCart);

    const handleAdd = () => {
        addToCart({
            ...item,
            quantity: 1,
            specialInstructions: specialInstructions.trim() || undefined,
        });
        onClose();
        setSpecialInstructions("");
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                    />
                    <motion.div
                        initial={{ opacity: 0, y: "100%", scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: "100%", scale: 0.95 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed bottom-0 md:bottom-auto md:top-1/2 md:-translate-y-1/2 left-0 right-0 md:left-1/2 md:-translate-x-1/2 bg-white dark:bg-neutral-900 w-full md:w-[500px] md:rounded-3xl rounded-t-3xl p-6 shadow-2xl z-50 overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="flex gap-4 items-center mb-6 pt-2">
                            <div
                                className="w-16 h-16 rounded-xl bg-cover bg-center shrink-0"
                                style={{ backgroundImage: `url(${item.image})` }}
                            />
                            <div>
                                <h3 className="text-lg font-bold">{item.name}</h3>
                                <p className="text-accent font-medium">${item.price.toFixed(2)}</p>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto hide-scrollbar mb-6">
                            <label className="block text-sm font-bold mb-2">
                                Special Instructions
                            </label>
                            <textarea
                                value={specialInstructions}
                                onChange={(e) => setSpecialInstructions(e.target.value)}
                                placeholder="e.g. No onions, sauce on the side..."
                                className="w-full h-32 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border-none outline-none focus:ring-2 focus:ring-accent resize-none placeholder:text-neutral-400"
                            />
                        </div>

                        <button
                            onClick={handleAdd}
                            className="w-full bg-foreground text-background py-4 rounded-xl font-bold tracking-wide hover:opacity-90 transition-opacity active:scale-[0.98]"
                        >
                            Add to Cart • ${(item.price).toFixed(2)}
                        </button>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
