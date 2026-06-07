import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * cn() — class name utility
 *
 * Combines clsx (conditional classes) with tailwind-merge (deduplication).
 *
 * Example:
 *   cn("px-4 py-2", isActive && "bg-red-500", "px-6")
 *   → "py-2 bg-red-500 px-6"   (px-4 is overridden by px-6, no duplicate)
 *
 * Without tailwind-merge you'd get "px-4 py-2 bg-red-500 px-6" which is
 * ambiguous — browsers apply the last one but it's messy.
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
