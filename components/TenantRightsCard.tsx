import { ShieldCheck, AlertTriangle } from "lucide-react";

interface Props {
  pricePerMonth: number;
  advanceMonths?: number;
  tenancyDuration?: string;
}

export default function TenantRightsCard({ pricePerMonth, advanceMonths, tenancyDuration }: Props) {
  const advance = advanceMonths ?? 6;
  const advanceTotal = pricePerMonth * advance;
  const isOverLimit = advance > 6;

  return (
    <div className={`rounded-2xl border p-5 space-y-3 ${isOverLimit ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"}`}>
      <div className="flex items-center gap-2">
        {isOverLimit ? (
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
        ) : (
          <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
        )}
        <h3 className={`text-sm font-bold ${isOverLimit ? "text-red-800" : "text-amber-900"}`}>
          Your Rights - Ghana Rent Act (Act 220)
        </h3>
      </div>

      <ul className={`text-xs space-y-1.5 leading-relaxed ${isOverLimit ? "text-red-700" : "text-amber-800"}`}>
        <li className="flex items-start gap-2">
          <span className="shrink-0"></span>
          <span>A landlord <strong>cannot legally demand more than 6 months advance rent</strong> at a time.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="shrink-0"></span>
          <span>You are entitled to a <strong>rent receipt</strong> every time you pay.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="shrink-0"></span>
          <span>Always insist on a <strong>written tenancy agreement</strong> before paying.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="shrink-0"></span>
          <span>Disputes can be reported to the <strong>Rent Control Department</strong> (call 0302-680802).</span>
        </li>
      </ul>

      {/* Advance summary */}
      <div className={`rounded-xl px-4 py-3 border flex items-center justify-between ${isOverLimit ? "bg-red-100 border-red-300" : "bg-white border-amber-200"}`}>
        <div>
          <p className={`text-xs font-semibold ${isOverLimit ? "text-red-800" : "text-amber-900"}`}>
            Advance rent for this listing
          </p>
          <p className={`text-[11px] mt-0.5 ${isOverLimit ? "text-red-600" : "text-amber-700"}`}>
            {advance} months{tenancyDuration ? ` - ${tenancyDuration} lease` : ""}
            {isOverLimit && " -  EXCEEDS LEGAL LIMIT"}
          </p>
        </div>
        <p className={`text-base font-bold ${isOverLimit ? "text-red-700" : "text-amber-900"}`}>
          GHS {advanceTotal.toLocaleString()}
        </p>
      </div>

      {isOverLimit && (
        <p className="text-xs text-red-700 font-semibold">
          If this landlord demands more than 6 months, use the Report button below to flag it.
        </p>
      )}
    </div>
  );
}
