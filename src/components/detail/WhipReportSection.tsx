import React from 'react';
import { DisclosedIssue, ServiceRecord } from '../../types';
import { generateBuyerInspectionQuestions } from '../../services/whipReportService';
import {
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Wrench,
  FileText,
  DollarSign,
  Calendar,
  AlertCircle,
  ShieldAlert,
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
          <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-red-200">
            Critical Concern
          </span>
        );
      case 'major':
        return (
          <span className="bg-orange-100 text-orange-900 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-orange-200">
            Major Item
          </span>
        );
      case 'moderate':
        return (
          <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-amber-200">
            Moderate Item
          </span>
        );
      default:
        return (
          <span className="bg-zinc-100 text-zinc-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-zinc-200">
            Minor Flaw
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-xs">
      {/* Header Banner */}
      <div className="bg-[#12151A] text-white p-5 sm:p-6 border-b border-zinc-800">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] uppercase font-bold tracking-widest bg-[#EA580C] text-white px-2 py-0.5 rounded font-mono">
            CORE DIFFERENTIATOR
          </span>
          <span className="text-xs text-zinc-400 font-semibold">Self-Disclosed by Seller</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black font-heading tracking-tight uppercase">
          THE WHIP REPORT
        </h2>
        <p className="text-xs sm:text-sm text-zinc-300 mt-1">
          Honest disclosure of known mechanical issues, cosmetic imperfections, and maintenance records.
        </p>
      </div>

      <div className="p-5 sm:p-7 space-y-8">
        {/* Section 1: Seller's Own Words */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono mb-2">
            1. SELLER DESCRIPTION
          </h3>
          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 text-sm text-zinc-800 leading-relaxed font-sans whitespace-pre-line">
            {sellerDescription || 'No additional seller description provided.'}
          </div>
        </div>

        {/* Section 2: Known Issues (Honesty disclosure) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono">
              2. KNOWN ISSUES & DISCLOSURES ({issues.length})
            </h3>
            {issues.length > 0 ? (
              <span className="text-xs text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Disclosed Upfront
              </span>
            ) : (
              <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                No Issues Reported
              </span>
            )}
          </div>

          {issues.length > 0 ? (
            <div className="space-y-3">
              {issues.map((issue) => (
                <div
                  key={issue.id}
                  className="p-4 rounded-xl border border-zinc-200 bg-[#FFFDF9] hover:border-zinc-300 transition"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <h4 className="font-bold text-sm text-zinc-900">{issue.title}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      {getSeverityBadge(issue.severity)}
                      {issue.affectsDrivability ? (
                        <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">
                          Affects Daily Drivability
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded">
                          Safe to Drive
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-700 pl-6 leading-relaxed">
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

        {/* Section 3: Smart In-Person Inspection Checklist (Auto-generated from issues) */}
        <div className="bg-orange-50/70 border border-orange-200 rounded-2xl p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-[#EA580C] text-white rounded-xl shadow-xs shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#EA580C]">
                TAILORED IN-PERSON INSPECTION
              </span>
              <h3 className="text-base sm:text-lg font-black text-zinc-900 font-heading tracking-tight mt-0.5">
                WHAT TO ASK THE SELLER
              </h3>
              <p className="text-xs text-zinc-600 mt-1">
                Generated automatically from the seller's disclosures to guide your in-person walkthrough.
              </p>

              <div className="mt-4 space-y-2.5">
                {buyerChecklist.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white rounded-xl border border-orange-200/80 shadow-2xs flex items-start gap-2.5"
                  >
                    <span className="text-xs font-mono font-bold text-[#EA580C] bg-orange-100 rounded-full w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-wide">
                        Regarding: {item.issueTitle}
                      </div>
                      <div className="text-xs sm:text-sm font-semibold text-zinc-900 mt-0.5">
                        "{item.question}"
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Disclaimer on inspection guidance */}
              <div className="mt-4 pt-3 border-t border-orange-200/80 flex items-center gap-2 text-[11px] text-zinc-500">
                <ShieldAlert className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span>
                  MyNextWhip does not diagnose vehicles or provide warranties. These questions are tailored tools for your independent test drive.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Recent Work & Service Records */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono">
              3. RECENT MAINTENANCE & SERVICE RECORDS ({serviceRecords.length})
            </h3>
            {serviceRecords.length > 0 && (
              <span className="text-xs text-zinc-500 font-mono">
                Total documented: ${serviceRecords.reduce((sum, r) => sum + r.cost, 0).toLocaleString()}
              </span>
            )}
          </div>

          {serviceRecords.length > 0 ? (
            <div className="border border-zinc-200 rounded-xl overflow-hidden divide-y divide-zinc-200">
              {serviceRecords.map((record) => (
                <div key={record.id} className="p-3.5 sm:p-4 bg-zinc-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
                  <div className="flex-1">
                    <div className="font-bold text-zinc-900">{record.workPerformed}</div>
                    <div className="flex items-center gap-3 text-zinc-500 text-xs mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-zinc-400" />
                        <span>{record.date}</span>
                      </span>
                      <span>·</span>
                      <span className="font-mono font-medium">
                        {record.mileage.toLocaleString()} mi
                      </span>
                      <span>·</span>
                      <span className="italic">{record.shopOrDiy}</span>
                    </div>
                  </div>

                  <div className="text-right sm:border-l sm:border-zinc-200 sm:pl-4 shrink-0">
                    <div className="font-mono font-black text-sm text-zinc-900">
                      ${record.cost.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-emerald-700 font-bold uppercase">
                      Receipt Verified
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-500">
              No formal service receipts uploaded by seller. Verify wear items (fluids, brakes, tires) during in-person inspection.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
