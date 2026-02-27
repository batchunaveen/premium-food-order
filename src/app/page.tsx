"use client";

import { CategoryNav } from "@/components/CategoryNav";
import { MenuItemCard } from "@/components/MenuItemCard";
import { CartSidebar } from "@/components/CartSidebar";
import { MENU_ITEMS, CATEGORIES } from "@/data/dummy";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="container mx-auto px-4 lg:px-8 mt-8">
      <div className="flex flex-col lg:flex-row gap-8 xl:gap-12 relative">
        <CategoryNav />

        <div className="flex-1 space-y-12">
          {CATEGORIES.map((category) => {
            const items = MENU_ITEMS.filter((item) => item.category === category);

            if (items.length === 0) return null;

            return (
              <section key={category} id={`category-${category.replace(/\s+/g, '-').toLowerCase()}`} className="scroll-mt-32">
                <h2 className="text-3xl font-black tracking-tight mb-8 flex items-center gap-4">
                  {category}
                  <span className="hidden sm:block h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                  {items.map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <MenuItemCard item={item} />
                    </motion.div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <CartSidebar />
      </div>
    </div>
  );
}
