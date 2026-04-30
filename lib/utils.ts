/** Shared utility helpers used across components. */
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merges Tailwind CSS class names, resolving conflicts via tailwind-merge.
 * @param inputs - Any number of class values (strings, arrays, objects, or falsy values).
 * @returns A single deduplicated, conflict-resolved class string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
