import React from 'react';
import { PieChart } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';

export function SurveyDonut({ stats = {} }) {
  const { isDark } = useTheme();
  const total = stats.surveys || 0;
  const allowed = stats.allowed || 0;
  const denied = stats.denied || 0;
  const pending = Math.max(total - allowed - denied, 0);

  const allowedPct = total > 0 ? (allowed / total) * 100 : 0;
  const deniedPct = total > 0 ? (denied / total) * 100 : 0;
  const pendingPct = total > 0 ? (pending / total) * 100 : 0;

  const donutGradient =
    total > 0
      ? `conic-gradient(#00d49a 0% ${allowedPct}%, #ff4f67 ${allowedPct}% ${allowedPct + deniedPct}%, #8b5cf6 ${allowedPct + deniedPct}% 100%)`
      : 'conic-gradient(#00d49a 0% 0%, #1e293b 0% 100%)';

  return (
    <GlassCard className="flex flex-col" hoverEffect={false}>
      {/* Panel Title */}
      <div className={cn('flex items-center gap-2 pb-4 border-b', isDark ? 'border-slate-800/80' : 'border-slate-200')}>
        <div
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-lg',
            isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700'
          )}
        >
          <PieChart className="h-4 w-4" />
        </div>
        <h2 className={cn('text-lg font-bold tracking-normal leading-normal', isDark ? 'text-white' : 'text-slate-900')}>
          สัดส่วนผลการสำรวจ
        </h2>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-around gap-6 pt-5">
        {/* Donut graphic */}
        <div
          className={cn(
            'relative flex h-36 w-36 items-center justify-center rounded-full p-3 transition-shadow',
            isDark ? 'shadow-[0_0_20px_rgba(0,0,0,0.4)]' : 'shadow-md'
          )}
          style={{ background: donutGradient }}
        >
          <div
            className={cn(
              'flex h-24 w-24 flex-col items-center justify-center rounded-full shadow-inner border transition-colors',
              isDark ? 'bg-[#051326] border-slate-800' : 'bg-white border-slate-200'
            )}
          >
            <span
              className={cn(
                'text-xl font-extrabold',
                isDark ? 'text-white' : 'text-slate-900'
              )}
            >
              {allowedPct.toFixed(1)}%
            </span>
            <span className={cn('text-[11px]', isDark ? 'text-slate-400' : 'text-slate-500')}>
              อนุญาต
            </span>
          </div>
        </div>

        {/* Breakdown details */}
        <div className="flex w-full flex-col gap-3 sm:max-w-[200px]">
          {/* Allowed */}
          <div
            className={cn(
              'flex items-center justify-between rounded-lg border px-3 py-2 transition-colors',
              isDark
                ? 'border-emerald-500/20 bg-emerald-950/20'
                : 'border-emerald-200 bg-emerald-50/70 shadow-2xs'
            )}
          >
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span className={cn('text-xs font-medium', isDark ? 'text-slate-200' : 'text-slate-800')}>
                อนุญาต
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className={cn('font-mono font-bold', isDark ? 'text-emerald-400' : 'text-emerald-700')}>
                {allowed.toLocaleString()}
              </span>
              <span className={cn('text-[10px]', isDark ? 'text-slate-400' : 'text-slate-500')}>
                ({allowedPct.toFixed(0)}%)
              </span>
            </div>
          </div>

          {/* Denied */}
          <div
            className={cn(
              'flex items-center justify-between rounded-lg border px-3 py-2 transition-colors',
              isDark
                ? 'border-rose-500/20 bg-rose-950/20'
                : 'border-rose-200 bg-rose-50/70 shadow-2xs'
            )}
          >
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
              <span className={cn('text-xs font-medium', isDark ? 'text-slate-200' : 'text-slate-800')}>
                ไม่อนุญาต
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className={cn('font-mono font-bold', isDark ? 'text-rose-400' : 'text-rose-700')}>
                {denied.toLocaleString()}
              </span>
              <span className={cn('text-[10px]', isDark ? 'text-slate-400' : 'text-slate-500')}>
                ({deniedPct.toFixed(0)}%)
              </span>
            </div>
          </div>

          {/* Pending */}
          <div
            className={cn(
              'flex items-center justify-between rounded-lg border px-3 py-2 transition-colors',
              isDark
                ? 'border-purple-500/20 bg-purple-950/20'
                : 'border-purple-200 bg-purple-50/70 shadow-2xs'
            )}
          >
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-purple-500" />
              <span className={cn('text-xs font-medium', isDark ? 'text-slate-200' : 'text-slate-800')}>
                รอพิจารณา
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className={cn('font-mono font-bold', isDark ? 'text-purple-400' : 'text-purple-700')}>
                {pending.toLocaleString()}
              </span>
              <span className={cn('text-[10px]', isDark ? 'text-slate-400' : 'text-slate-500')}>
                ({pendingPct.toFixed(0)}%)
              </span>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
