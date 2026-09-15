import React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';

export const RadioGroup = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn('grid gap-3', className)}
      {...props}
      ref={ref}
    />
  );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

export const RadioGroupItem = React.forwardRef(({ className, ...props }, ref) => {
  const { isDark } = useTheme();
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        'aspect-square h-5 w-5 rounded-full border ring-offset-background transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        isDark
          ? 'border-[rgba(115,149,174,0.4)] text-blue-400 focus-visible:ring-blue-500 data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500/20'
          : 'border-slate-300 bg-white text-sky-600 focus-visible:ring-sky-500 data-[state=checked]:border-sky-500 data-[state=checked]:bg-sky-50',
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className={cn('h-2.5 w-2.5', isDark ? 'fill-cyan-400 text-cyan-400' : 'fill-sky-600 text-sky-600')} />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;
