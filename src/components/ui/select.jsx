import React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';

export const Select = SelectPrimitive.Root;
export const SelectGroup = SelectPrimitive.Group;
export const SelectValue = SelectPrimitive.Value;

export const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => {
  const { isDark } = useTheme();
  return (
    <SelectPrimitive.Trigger
      ref={ref}
      data-radix-select-trigger=""
      className={cn(
        'flex h-11 w-full items-center justify-between rounded-xl border px-4 py-2 text-base ring-offset-background transition-colors duration-150 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50',
        isDark
          ? 'border-[rgba(115,149,174,0.25)] bg-[rgba(6,19,33,0.7)] text-slate-100 placeholder:text-slate-500 hover:border-blue-500/50 hover:bg-[rgba(6,19,33,0.9)] focus:border-blue-500 focus:ring-blue-500/40 shadow-sm'
          : 'border-slate-300 bg-white text-slate-800 placeholder:text-slate-400 hover:border-sky-400 hover:bg-slate-50 focus:border-sky-500 focus:ring-sky-500/20 shadow-2xs',
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown
          className={cn(
            'h-4 w-4 transition-transform duration-200',
            isDark ? 'text-slate-400 opacity-80' : 'text-slate-500 opacity-90'
          )}
        />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
});
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

export const SelectScrollUpButton = React.forwardRef(({ className, ...props }, ref) => {
  const { isDark } = useTheme();
  return (
    <SelectPrimitive.ScrollUpButton
      ref={ref}
      className={cn(
        'flex cursor-default items-center justify-center py-1 transition-colors',
        isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800',
        className
      )}
      {...props}
    >
      <ChevronUp className="h-4 w-4" />
    </SelectPrimitive.ScrollUpButton>
  );
});
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

export const SelectScrollDownButton = React.forwardRef(({ className, ...props }, ref) => {
  const { isDark } = useTheme();
  return (
    <SelectPrimitive.ScrollDownButton
      ref={ref}
      className={cn(
        'flex cursor-default items-center justify-center py-1 transition-colors',
        isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800',
        className
      )}
      {...props}
    >
      <ChevronDown className="h-4 w-4" />
    </SelectPrimitive.ScrollDownButton>
  );
});
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;

export const SelectContent = React.forwardRef(
  ({ className, children, position = 'popper', ...props }, ref) => {
    const { isDark } = useTheme();
    return (
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          ref={ref}
          data-radix-select-content=""
          className={cn(
            'relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-xl border backdrop-blur-xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            isDark
              ? 'border-[rgba(56,149,255,0.3)] bg-[#051329]/95 text-slate-100 shadow-2xl shadow-blue-950/50'
              : 'border-slate-200 bg-white/98 text-slate-800 shadow-xl shadow-slate-200/60',
            position === 'popper' &&
              'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
            className
          )}
          position={position}
          {...props}
        >
          <SelectScrollUpButton />
          <SelectPrimitive.Viewport
            className={cn(
              'p-1.5',
              position === 'popper' &&
                'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]'
            )}
          >
            {children}
          </SelectPrimitive.Viewport>
          <SelectScrollDownButton />
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    );
  }
);
SelectContent.displayName = SelectPrimitive.Content.displayName;

export const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => {
  const { isDark } = useTheme();
  return (
    <SelectPrimitive.Item
      ref={ref}
      data-radix-select-item=""
      className={cn(
        'relative flex w-full cursor-pointer select-none items-center rounded-lg py-2.5 pl-9 pr-3 text-sm font-medium outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        isDark
          ? 'text-slate-200 focus:bg-blue-600/30 focus:text-cyan-300 hover:bg-slate-800/60'
          : 'text-slate-700 focus:bg-sky-50 focus:text-sky-700 hover:bg-sky-50/80',
        className
      )}
      {...props}
    >
      <span className="absolute left-2.5 flex h-3.5 w-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check className={cn('h-4 w-4', isDark ? 'text-emerald-400' : 'text-sky-600')} />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
});
SelectItem.displayName = SelectPrimitive.Item.displayName;
