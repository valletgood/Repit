import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const inputVariants = cva(
  // 기본 스타일 (공통)
  'w-full min-w-0 rounded-md border bg-transparent text-sm transition-all outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'border-input h-9 px-3 py-1 shadow-xs file:text-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        auth: 'border-[#D9D9D9] text-foreground placeholder:text-muted-foreground rounded-[5px] px-4 py-3 focus:ring-2 focus:ring-ring',
      },
      inputSize: {
        default: 'h-9',
        sm: 'h-8 text-xs',
        lg: 'h-12 px-4 py-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      inputSize: 'default',
    },
  }
);

interface InputProps
  extends
    Omit<React.ComponentProps<'input'>, 'size'>,
    Omit<VariantProps<typeof inputVariants>, 'inputSize'> {
  inputSize?: 'default' | 'sm' | 'lg';
}

function Input({ className, type, variant, inputSize, ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputVariants({ variant, inputSize, className }))}
      {...props}
    />
  );
}

export { Input, inputVariants };
