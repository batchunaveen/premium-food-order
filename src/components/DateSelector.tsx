"use client";

import { useStore } from "@/store/useStore";
import { useState, useRef, useEffect } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function DateSelector() {
    const { selectedDate, setSelectedDate } = useStore();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Calendar state
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

    // Get days in month
    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    // Get first day of month (0 = Sun, 1 = Mon, ..., 6 = Sat)
    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay();
    };

    const daysInMonth = getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());
    const firstDay = getFirstDayOfMonth(currentMonth.getFullYear(), currentMonth.getMonth());

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    // Logic to only allow Fri(5)/Sat(6)/Sun(0) that are today or in the future
    const isDateSelectable = (date: Date) => {
        if (date < today) return false;
        const day = date.getDay();
        return day === 0 || day === 5 || day === 6;
    };

    const isSameDate = (d1: Date, d2: Date) => {
        return d1.getDate() === d2.getDate() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getFullYear() === d2.getFullYear();
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex mb-4 w-full items-center justify-between p-4 bg-neutral-100 dark:bg-neutral-800 rounded-2xl hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <CalendarIcon className="w-5 h-5 text-accent" />
                    <div className="flex flex-col items-start">
                        <span className="text-xs text-neutral-500 font-bold uppercase tracking-wider">Order Date</span>
                        <span className="font-medium">
                            {selectedDate ? formatDate(selectedDate) : "Select a weekend"}
                        </span>
                    </div>
                </div>
                <span className="text-xs font-bold text-accent bg-accent/10 px-2 py-1 rounded-md">
                    Required
                </span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-full left-0 mb-2 w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl overflow-hidden z-50 origin-bottom"
                    >
                        <div className="p-4 w-72 sm:w-80">
                            {/* Calendar Header */}
                            <div className="flex justify-between items-center mb-4">
                                <button
                                    onClick={(e) => { e.preventDefault(); prevMonth(); }}
                                    className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                                >
                                    <ChevronLeft className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                                </button>
                                <div className="font-bold text-sm">
                                    {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                                </div>
                                <button
                                    onClick={(e) => { e.preventDefault(); nextMonth(); }}
                                    className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                                >
                                    <ChevronRight className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                                </button>
                            </div>

                            {/* Days of Week */}
                            <div className="grid grid-cols-7 gap-1 mb-2 text-center text-xs font-bold text-neutral-400">
                                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(day => (
                                    <div key={day} className="py-1">{day}</div>
                                ))}
                            </div>

                            {/* Calendar Grid */}
                            <div className="grid grid-cols-7 gap-1">
                                {Array.from({ length: firstDay }).map((_, i) => (
                                    <div key={`empty-${i}`} className="p-2" />
                                ))}

                                {Array.from({ length: daysInMonth }).map((_, i) => {
                                    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1);
                                    const isSelectable = isDateSelectable(date);
                                    const isSelected = selectedDate ? isSameDate(date, selectedDate) : false;
                                    const isToday = isSameDate(date, today);

                                    return (
                                        <button
                                            key={date.toISOString()}
                                            disabled={!isSelectable}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (isSelectable) {
                                                    setSelectedDate(date);
                                                    setIsOpen(false);
                                                }
                                            }}
                                            className={cn(
                                                "aspect-square flex items-center justify-center rounded-full text-sm font-medium transition-all relative",
                                                isSelected
                                                    ? "bg-accent text-white shadow-md shadow-accent/30"
                                                    : isSelectable
                                                        ? "hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200"
                                                        : "text-neutral-300 dark:text-neutral-700 cursor-not-allowed",
                                                isToday && !isSelected && "border border-accent text-accent"
                                            )}
                                        >
                                            {date.getDate()}
                                            {/* small dot to highlight weekends */}
                                            {isSelectable && !isSelected && (
                                                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-accent/50" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
