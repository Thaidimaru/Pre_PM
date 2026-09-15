import React, { useState } from 'react';
import { Clock, ArrowRight, CheckCircle2, XCircle, AlertCircle, FileText, Printer } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { SurveyReportModal } from '@/components/export/SurveyReportModal';

export function RecentSurveys({ recent = [], onNavigate }) {
  const [selectedReport, setSelectedReport] = useState(null);

  const getBadge = (permit) => {
    if (permit === 'อนุญาต') {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
          <CheckCircle2 className="h-3 w-3" />
          {permit}
        </span>
      );
    }
    if (permit === 'ไม่อนุญาต') {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/15 border border-rose-500/30 px-2.5 py-0.5 text-xs font-semibold text-rose-400">
          <XCircle className="h-3 w-3" />
          {permit}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/15 border border-purple-500/30 px-2.5 py-0.5 text-xs font-semibold text-purple-400">
        <AlertCircle className="h-3 w-3" />
        {permit || 'รอพิจารณา'}
      </span>
    );
  };

  return (
    <>
      <GlassCard className="flex flex-col" hoverEffect={false}>
        {/* Panel Title & Action */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-300">
              <Clock className="h-4 w-4" />
            </div>
            <h2 className="text-lg font-bold text-white tracking-normal leading-normal">
              การสำรวจล่าสุด
            </h2>
          </div>

          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('field')}
              className="group inline-flex items-center gap-1.5 rounded-lg border border-blue-500/30 bg-blue-600/20 px-3 py-1.5 text-xs font-semibold text-blue-300 hover:bg-blue-600/30 hover:border-blue-500/50 hover:text-white transition-all duration-200"
            >
              <span>บันทึกใหม่</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          )}
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto pt-4">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400">
                <th className="pb-2.5 pr-3">รหัสรายการ</th>
                <th className="pb-2.5 px-3">สถานี</th>
                <th className="pb-2.5 px-3">จังหวัด</th>
                <th className="pb-2.5 px-3 text-center">ผล</th>
                <th className="pb-2.5 px-3 text-right">เวลาบันทึก</th>
                <th className="pb-2.5 pl-3 text-center">Export</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {recent.length > 0 ? (
                recent.map((item) => (
                  <tr key={item.recordId} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 pr-3 font-mono text-xs text-cyan-400">
                      {item.recordId}
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-200">
                      {item.station}
                    </td>
                    <td className="py-3 px-3 text-slate-300">
                      {item.province}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {getBadge(item.permit)}
                    </td>
                    <td className="py-3 px-3 text-right text-xs text-slate-400">
                      {new Date(item.savedAt).toLocaleString('th-TH', {
                        dateStyle: 'short',
                        timeStyle: 'short'
                      })}
                    </td>
                    <td className="py-3 pl-3 text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedReport(item)}
                        className="inline-flex items-center gap-1 rounded-lg border border-cyan-500/30 bg-cyan-950/40 px-2.5 py-1 text-xs font-semibold text-cyan-300 hover:bg-cyan-600/30 hover:border-cyan-400 hover:text-white transition-all"
                        title="ส่งออกรายงาน A4 (Export PDF)"
                      >
                        <Printer className="h-3.5 w-3.5" />
                        <span>Export</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    ยังไม่มีผลสำรวจ
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Survey Report Modal Export */}
      <SurveyReportModal
        isOpen={Boolean(selectedReport)}
        onClose={() => setSelectedReport(null)}
        surveyData={selectedReport || {}}
      />
    </>
  );
}

