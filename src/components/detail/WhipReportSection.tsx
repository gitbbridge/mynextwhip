import React from 'react';
import { DisclosedIssue, ServiceRecord } from '../../types';
import { generateBuyerInspectionQuestions } from '../../services/whipReportService';
import {
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Wrench,
  Calendar,
  AlertCircle,
  FileText,
} from 'lucide-react';

interface WhipReportSectionProps {
  sellerDescription: string;
  issues: DisclosedIssue[];
  serviceRecords: ServiceRecord[];
}

export const WhipReportSection: React.FC<WhipReportSectionProps> = ({
  sellerDescription,
  issues,
  serviceRecords,
}) => {
  const buyerChecklist = generateBuyerInspectionQuestions(issues);

  const getSeverityBadge = (severity: DisclosedIssue['severity']) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="bg-red-50 text-red-800 text-[11px] font-semibold px-2 py-0.5 rounded border border-red-200">
            Critical Concern
          </span>
        );
      case 'major':
        return (
          <span className="bg-orange-50 text-orange-900 text-[11px] font-semibold px-2 py-0.5 rounded border border-orange-200">
            Major Item
          </span>
        );
      case 'moderate':
        return (
          <span className="bg-amber-50 text-amber-900 text-[11px] font-semibold px-2 py-0.5 rounded border border-amber-200">
            Moderate Item
          </span>
        );
      default:
        return (
          <span className="bg-slate-100 text-slate-700 text-[11px] font-medium px-2 py-0.5 rounded border border-slate-200">
            Minor Flaw
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-7 border-b border-slate-800">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-orange-400">
            Upfront Disclosure
          </span>
          <span className="text-slate-400 text-xs">·</span>
          <span className="text-xs text-slate-300">Self-reported by vehicle owner</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-heading tracking-tight text-white">
          The Whip Transparency Report
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed max-w-2xl">
          Honest disclosure of known mechanical conditions, cosmetic flaws, and documented service history.
        </p>
      </div>

      <div className="p-6 sm:p-8 space-y-8">
        {/* Section 1: Seller's Statement */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
            Seller Description & Overview
          </h3>
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 sm:p-5 text-sm text-slate-800 leading-relaxed font-sans whitespace-pre-line">
            {sellerDescription || 'No additional seller description provided.'}
          </div>
        </div>

        {/* Section 2: Disclosed Issues */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Disclosed Issues & Imperfections ({issues.length})
            </h3>
            {issues.length > 0 ? (
              <span className="text-xs text-amber-800 font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Disclosed by owner
              </span>
            ) : (
              <span className="text-xs text-emerald-800 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                No major issues reported
              </span>
            )}
          </div>

          {issues.length > 0 ? (
            <div className="space-y-3">
              {issues.map((issue) => (
                <div
                  key={issue.id}
                  className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <h4 className="font-semibold text-sm text-slate-900">{issue.title}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      {getSeverityBadge(issue.severity)}
                      {issue.affectsDrivability ? (
                        <span className="text-[11px] font-medium text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                          Affects Drivability
                        </span>
                      ) : (
                        <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          Safe to Drive
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 pl-6 leading-relaxed">
                    {issue.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs sm:text-sm text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Seller stated there are no known mechanical issues or active warning lights.</span>
            </div>
          )}
        </div>

        {/* Section 3: Smart In-Person Inspection Questions */}
        <div className="bg-orange-50/50 border border-orange-200/80 rounded-2xl p-5 sm:p-6">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 bg-[#C2410C] text-white rounded-xl flex items-center justify-center shrink-0 shadow-2xs">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#C2410C]">
                Inspection Guidance
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading mt-0.5">
                Questions to Ask When You Inspect This Vehicle
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Generated from the seller's disclosures to help you verify conditions during your test drive.
              </p>

              <div className="mt-4 space-y-2.5">
                {buyerChecklist.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-white rounded-xl border border-orange-200/70 shadow-2xs flex items-start gap-3"
                  >
                    <span className="text-xs font-semibold text-[#C2410C] bg-orange-100 rounded-full w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="text-[11px] font-medium text-slate-400">
                        Regarding: {item.issueTitle}
                      </div>
                      <div className="text-xs sm:text-sm font-medium text-slate-900 mt-0.5">
                        "{item.question}"
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Documented Service History */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Documented Maintenance & Service Records ({serviceRecords.length})
            </h3>
            {serviceRecords.length > 0 && (
              <span className="text-xs text-slate-500 tabular-nums">
                Total documented: ${serviceRecords.reduce((sum, r) => sum + r.cost, 0).toLocaleString()}
              </span>
            )}
          </div>

          {serviceRecords.length > 0 ? (
            <div className="border border-slate-200/90 rounded-xl overflow-hidden divide-y divide-slate-100">
              {serviceRecords.map((record) => (
                <div key={record.id} className="p-3.5 sm:p-4 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900">{record.workPerformed}</div>
                    <div className="flex items-center gap-3 text-slate-500 text-xs mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{record.date}</span>
                      </span>
                      <span>·</span>
                      <span className="tabular-nums font-medium text-slate-700">
                        {record.mileage.toLocaleString()} mi
                      </span>
                      <span>·</span>
                      <span className="text-slate-600">{record.shopOrDiy}</span>
                    </div>
                  </div>

                  <div className="text-right sm:border-l sm:border-slate-200 sm:pl-4 shrink-0">
                    <div className="font-bold text-sm text-slate-900 tabular-nums">
                      ${record.cost.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-emerald-800 font-semibold uppercase">
                      Receipt Verified
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500">
              No formal service receipts uploaded by seller. Please inspect fluids, brakes, and tires during your test drive.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
