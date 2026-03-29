import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export function withBase(path: string): string {
  const cleanPath = path.replace(/^\/+/, '')
  return `${import.meta.env.BASE_URL}${cleanPath}`
}
