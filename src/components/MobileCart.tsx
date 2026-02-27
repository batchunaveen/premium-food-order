"use client";

import { useStore } from "@/store/useStore";
import { Plus, Minus, Trash2, ArrowRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DateSelector } from "./DateSelector";

interface MobileCartProps {
    isOpen: boolean;
    onClose: () => void;
}

export function MobileCart({ isOpen, onClose }: MobileCartProps) {
    const cart = useStore((state) => state.cart);
    const updateQuantity = useStore((state) => state.updateQuantity);
    const removeFromCart = useStore((state) => state.removeFromCart);
    const selectedDate = useStore((state) => state.selectedDate);
    const setIsCheckoutOpen = useStore((state) => state.setIsCheckoutOpen);

    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const tax = subtotal * 0.08875; // 8.875% tax rate
    const total = subtotal + tax;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 xl:hidden"
                    />
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-900 rounded-t-3xl shadow-2xl z-50 xl:hidden flex flex-col h-[85vh]"
                    >
                        <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 flex justify-between items-center shrink-0">
                            <div className="flex bg-neutral-100 dark:bg-neutral-800 w-12 h-1.5 rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-3" />
                            <h2 className="text-xl font-black mt-2">Your Order</h2>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition-colors mt-2"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6 hide-scrollbar">
                            {cart.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-neutral-400 py-12">
                                    <span className="text-4xl mb-4">🛒</span>
                                    <p>Your cart is empty</p>
                                </div>
                            ) : (
                                <AnimatePresence initial={false}>
                                    {cart.map((item) => (
                                        <motion.div
                                            key={`${item.id}-${item.specialInstructions || ""}`}
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="flex gap-4 group"
                                        >
                                            <div
                                                className="w-16 h-16 rounded-2xl bg-cover bg-center shrink-0 border border-neutral-100 shadow-sm"
                                                style={{ backgroundImage: `url(${item.image})` }}
                                            />

                                            <div className="flex flex-col flex-1 pb-4 border-b border-neutral-100 dark:border-neutral-800 group-last:border-0">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className="font-bold text-sm line-clamp-2 leading-tight pr-4">{item.name}</h4>
                                                    <span className="font-bold text-sm shrink-0">${(item.price * item.quantity).toFixed(2)}</span>
                                                </div>

                                                {item.specialInstructions && (
                                                    <p className="text-xs text-neutral-500 line-clamp-2 mb-2 italic">
                                                        "{item.specialInstructions}"
                                                    </p>
                                                )}

                                                <div className="mt-auto flex items-center justify-between">
                                                    <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1), item.specialInstructions)}
                                                            className="w-6 h-6 flex items-center justify-center rounded bg-white dark:bg-neutral-700 shadow-sm"
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </button>
                                                        <span className="text-xs font-bold w-8 text-center">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.specialInstructions)}
                                                            className="w-6 h-6 flex items-center justify-center rounded bg-foreground text-background shadow-sm"
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </button>
                                                    </div>

                                                    <button
                                                        onClick={() => removeFromCart(item.id, item.specialInstructions)}
                                                        className="text-neutral-400 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            )}
                        </div>

                        {cart.length > 0 && (
                            <div className="p-6 bg-neutral-50 dark:bg-neutral-800/50 border-t border-neutral-200 dark:border-neutral-800 shrink-0 pb-safe">
                                <DateSelector />
                                <div className="space-y-3 mb-6 mt-4">
                                    <div className="flex justify-between text-sm text-neutral-500">
                                        <span>Subtotal</span>
                                        <span>${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-neutral-500">
                                        <span>Tax (8.875%)</span>
                                        <span>${tax.toFixed(2)}</span>
                                    </div>
                                    <div className="h-px w-full bg-neutral-200 dark:bg-neutral-800 my-2" />
                                    <div className="flex justify-between font-black text-xl">
                                        <span>Total</span>
                                        <span className="text-accent">${total.toFixed(2)}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        onClose();
                                        setIsCheckoutOpen(true);
                                    }}
                                    disabled={!selectedDate}
                                    className="w-full flex items-center justify-between bg-foreground text-background py-4 px-6 rounded-xl font-bold tracking-wide group hover:opacity-90 transition-opacity active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span>{selectedDate ? "Checkout" : "Select a date"}</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
