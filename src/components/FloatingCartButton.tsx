"use client";

import { ShoppingBag } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useState } from "react";
import { MobileCart } from "./MobileCart";
import { motion, AnimatePresence } from "framer-motion";

export function FloatingCartButton() {
    const cart = useStore((state) => state.cart);
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);

    if (cartCount === 0) return null;

    return (
        <>
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 xl:hidden">
                <button
                    onClick={() => setIsMobileCartOpen(true)}
                    className="flex items-center gap-3 bg-foreground text-background px-6 py-4 rounded-full shadow-2xl font-bold tracking-wide hover:opacity-90 transition-opacity active:scale-[0.98]"
                >
                    <div className="relative">
                        <ShoppingBag className="w-5 h-5" />
                        <motion.div
                            key={cartCount}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 bg-accent text-white text-[10px] rounded-full border-2 border-foreground"
                        >
                            {cartCount}
                        </motion.div>
                    </div>
                    <span>View Order</span>
                </button>
            </div>
            <MobileCart isOpen={isMobileCartOpen} onClose={() => setIsMobileCartOpen(false)} />
        </>
    );
}
