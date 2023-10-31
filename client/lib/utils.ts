import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const errorHandler = (error: any) => {
    if (!error.response.data.success)
        throw new Error(error.response.data.message);
    return error.response.data;
};
