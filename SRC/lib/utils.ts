/**
 * utils.ts — Utilitaire pour combiner des classes CSS Tailwind.
 * cn() fusionne les classes avec clsx et tailwind-merge pour éviter les conflits.
 * Exemple : cn('px-4', condition && 'bg-red-500', 'px-2') → 'px-2 bg-red-500'
 */
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
