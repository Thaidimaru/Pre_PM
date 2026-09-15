import React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';

export const TooltipProvider = TooltipPrimitive.Provider;
export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;

export const TooltipContent = React.forwardRef(
  ({ className, sideOffset = 4, ...props }, ref) => {
    const { isDark } = useTheme();
    return (
      <TooltipPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          'z-50 overflow-hidden rounded-md border px-3 py-1.5 text-xs leading-normal tracking-normal shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          isDark
            ? 'border-[rgba(56,149,255,0.3)] bg-[#041226] text-slate-200 shadow-blue-950/40'
            : 'border-slate-200 bg-white text-slate-800 shadow-slate-200/50',
          className
        )}
        {...props}
      />
    );
  }
);
TooltipContent.displayName = TooltipPrimitive.Content.displayName;
