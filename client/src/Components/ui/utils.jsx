import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from 'date-fns';
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return format(date, 'dd MM yyyy');
};
