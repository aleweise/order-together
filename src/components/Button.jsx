import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Button = ({ children, onClick, variant = 'primary', className, disabled, type = 'button' }) => {
    const baseStyles = "w-full py-3 px-6 rounded-lg font-bold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex items-center justify-center gap-2";

    const variants = {
        primary: "bg-primary hover:opacity-90 active:scale-[0.98]",
        secondary: "bg-secondary hover:opacity-90 active:scale-[0.98]",
        outline: "bg-transparent border-2 border-primary text-primary hover:bg-orange-50",
        ghost: "bg-transparent text-gray-600 hover:bg-gray-100 font-normal shadow-none",
        danger: "bg-red-500 hover:bg-red-600"
    };

    return (
        <button
            type={type}
            className={twMerge(baseStyles, variants[variant], className)}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};
