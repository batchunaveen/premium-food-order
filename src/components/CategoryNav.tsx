"use client";

import { CATEGORIES } from "@/data/dummy";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function CategoryNav() {
    const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);

    return (
        <nav className="w-full lg:w-48 xl:w-64 shrink-0">
            <div className="sticky top-24">
                <h3 className="hidden lg:block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-4 px-3">
                    Categories
                </h3>

                {/* Mobile Horizontal Scroll */}
                <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-2 pb-4 lg:pb-0 hide-scrollbar px-4 lg:px-0 mx-[-1rem] lg:mx-0">
                    {CATEGORIES.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={cn(
                                "whitespace-nowrap rounded-full lg:rounded-xl px-4 py-2 flex items-center gap-2 text-sm font-medium transition-all duration-200 min-w-max",
                                activeCategory === category
                                    ? "bg-foreground text-background shadow-md lg:bg-accent/10 lg:text-accent lg:shadow-none"
                                    : "bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 lg:bg-transparent lg:hover:bg-neutral-100 dark:lg:hover:bg-neutral-800 text-foreground/80"
                            )}
                        >
                            <span className={cn(
                                "hidden lg:block w-1.5 h-1.5 rounded-full transition-colors",
                                activeCategory === category ? "bg-accent" : "bg-transparent"
                            )} />
                            {category}
                        </button>
                    ))}
                </div>
            </div>
        </nav>
    );
}
