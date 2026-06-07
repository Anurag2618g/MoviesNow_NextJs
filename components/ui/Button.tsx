'use client';

import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
        const base = 'inline-flex items-center justify-center font-semibold rounded transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';

        const variants = {
            primary: 'bg-white text-black hover:bg-gray-200',
            secondary: 'bg-[#333] text-white hover:bg-[#444]',
            ghost: 'bg-transparent text-white hover:bg-white/10',
            danger: 'bg-[#e50914] text-white hover:bg-[#f40612]',
        };

        const sizes = {
            sm: 'px-3 py-1.5 text-sm',
            md: 'px-5 py-2.5 text-sm',
            lg: 'px-8 py-3 text-base',
        };

        return (
            <button
                ref={ref}
                className={cn(base, variants[variant], sizes[size], className)}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading ? (
                    <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Loading...
                    </span>
                ) : children}
            </button>
        );
    }
);

Button.displayName = 'Button';
export default Button;
