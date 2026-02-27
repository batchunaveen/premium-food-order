"use client";

import { MapPin, ChevronDown } from "lucide-react";
import { LOCATIONS } from "@/data/dummy";
import { useStore } from "@/store/useStore";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

export function LocationSelector() {
    const { selectedLocation, setSelectedLocation } = useStore();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
                <MapPin className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium tracking-tight">
                    {selectedLocation || "Select Location"}
                </span>
                <ChevronDown
                    className={cn("w-4 h-4 transition-transform duration-200", {
                        "rotate-180": isOpen,
                    })}
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl overflow-hidden z-50 origin-top-left"
                    >
                        <div className="p-2 flex flex-col gap-1">
                            {LOCATIONS.map((loc) => (
                                <button
                                    key={loc}
                                    onClick={() => {
                                        setSelectedLocation(loc);
                                        setIsOpen(false);
                                    }}
                                    className={cn(
                                        "text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                                        selectedLocation === loc
                                            ? "bg-accent/10 text-accent"
                                            : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                    )}
                                >
                                    {loc}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
