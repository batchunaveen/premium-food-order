"use client";

import { Plus, Minus } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useState } from "react";
import { CustomizationModal } from "./CustomizationModal";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface MenuItemCardProps {
    item: {
        id: string;
        name: string;
        description: string;
        price: number;
        category: string;
        image: string;
    };
}

export function MenuItemCard({ item }: MenuItemCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const cart = useStore((state) => state.cart);
    const updateQuantity = useStore((state) => state.updateQuantity);

    // For simplicity on the card, we'll just check if ANY variant of this item is in the cart
    // and show the total quantity. Real apps might separate this per variant.
    const cartItems = cart.filter((i) => i.id === item.id);
    const totalQuantity = cartItems.reduce((acc, i) => acc + i.quantity, 0);

    const handleAddClick = () => {
        setIsModalOpen(true);
    };

    const handleIncrement = () => {
        // If they click + directly on the card, we just add another of the first variant found
        // or open modal if none found (handled above)
        if (cartItems.length > 0) {
            updateQuantity(cartItems[0].id, cartItems[0].quantity + 1, cartItems[0].specialInstructions);
        } else {
            setIsModalOpen(true);
        }
    };

    const handleDecrement = () => {
        if (cartItems.length > 0) {
            const current = cartItems[0];
            updateQuantity(current.id, Math.max(0, current.quantity - 1), current.specialInstructions);
        }
    };

    return (
        <>
            <div className="group relative flex flex-col bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden border border-neutral-100 dark:border-neutral-800 hover:shadow-2xl transition-all duration-300">
                <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{ backgroundImage: `url(${item.image})` }}
                    />
                </div>

                <div className="flex flex-col flex-1 p-5 lg:p-6">
                    <div className="flex justify-between items-start mb-2 gap-4">
                        <h3 className="font-bold text-lg leading-tight">{item.name}</h3>
                        <span className="font-bold text-accent shrink-0">${item.price.toFixed(2)}</span>
                    </div>
                    <p className="text-neutral-500 dark:text-neutral-400 text-sm line-clamp-2 mb-4 flex-1">
                        {item.description}
                    </p>

                    <div className="mt-auto flex items-center justify-between">
                        {totalQuantity === 0 ? (
                            <button
                                onClick={handleAddClick}
                                className="w-full bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-foreground py-3 rounded-xl font-bold tracking-wide transition-colors active:scale-[0.98]"
                            >
                                Add Option
                            </button>
                        ) : (
                            <div className="w-full flex items-center justify-between bg-neutral-100 dark:bg-neutral-800 rounded-xl p-1">
                                <button
                                    onClick={handleDecrement}
                                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-white dark:bg-neutral-700 shadow-sm hover:scale-105 transition-transform"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <div className="font-bold w-12 text-center text-lg">{totalQuantity}</div>
                                <button
                                    onClick={handleIncrement}
                                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-foreground text-background shadow-sm hover:scale-105 transition-transform"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <CustomizationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                item={item}
            />
        </>
    );
}
