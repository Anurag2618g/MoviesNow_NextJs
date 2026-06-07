'use client';

import { cn } from '@/lib/utils';
import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, id, ...props }, ref) => {
        return (
            <div className="flex flex-col gap-1.5">
                {label && (
                    <label htmlFor={id} className="text-sm text-gray-300">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={id}
                    className={cn(
                        'w-full px-4 py-3 rounded bg-[#333] text-white placeholder-gray-500',
                        'border border-transparent focus:border-white focus:outline-none transition-colors',
                        error && 'border-red-500',
                        className
                    )}
                    {...props}
                />
                {error && <p className="text-xs text-red-400">{error}</p>}
            </div>
        );
    }
);

Input.displayName = 'Input';
export default Input;
