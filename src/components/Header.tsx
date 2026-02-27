"use client";

import { ShoppingBag, Menu, User, Receipt } from "lucide-react";
import { LocationSelector } from "./LocationSelector";
import { useStore } from "@/store/useStore";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { MobileCart } from "./MobileCart";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
    const cart = useStore((state) => state.cart);
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);

    return (
        <>
            <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-xl border-b border-neutral-200 dark:border-neutral-800">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4 md:gap-8">
                        <button className="md:hidden p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors">
                            <Menu className="w-5 h-5" />
                        </button>

                        <Link href="/" className="flex items-center gap-2">
                            <span className="text-xl md:text-2xl font-black tracking-tighter">
                                CRAVE<span className="text-accent">.</span>
                            </span>
                        </Link>

                        <div className="hidden sm:block">
                            <LocationSelector />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        <ThemeToggle />

                        <button className="hidden md:flex items-center justify-center w-10 h-10 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                            <User className="w-5 h-5" />
                        </button>

                        <button
                            onClick={() => setIsMobileCartOpen(true)}
                            className="relative flex xl:hidden items-center justify-center w-10 h-10 rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition-colors"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            {cartCount > 0 && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-accent text-white text-[10px] font-bold rounded-full border-2 border-background"
                                >
                                    {cartCount}
                                </motion.div>
                            )}
                        </button>

                        <button className="hidden xl:flex relative items-center justify-center w-10 h-10 rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition-colors">
                            <Receipt className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            <MobileCart isOpen={isMobileCartOpen} onClose={() => setIsMobileCartOpen(false)} />
        </>
    );
}
