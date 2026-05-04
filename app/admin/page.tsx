"use client";

import { useState } from "react";
import { Clock, CheckCircle2, XCircle, ChevronDown, ChevronUp, X, RotateCcw, Copy } from "lucide-react";
import type { Room } from "@/lib/types";
import { getPaidListingRevenue, getPendingListingRevenue } from "@/lib/monetization";
import { getOpenReports, REPORT_REASON_LABELS } from "@/lib/reports";
import { useToast } from "@/components/providers/ToastProvider";
import { useListings } from "@/components/providers/ListingsProvider";
import { useReports } from "@/components/providers/ReportsProvider";
import { usePayments } from "@/components/providers/PaymentsProvider";
import { getPaidPaymentTotal, PAYMENT_METHOD_LABELS, sortPaymentsNewest } from "@/lib/payments";
import Nav from "@/components/Nav";

type AdminAction = "approve_paid" | "approve_free" | "reject";

interface ActionRecord {
  id: string;
  action: AdminAction;
  at: string;
}

const ACTION_LABEL: Record<AdminAction, string> = {
  approve_paid: "Approved (Req. Payment)",
  approve_free: "Approved Free -> Live",
  reject: "Rejected",
};

const ACTION_BADGE: Record<AdminAction, string> = {
  approve_paid: "bg-blue-100 text-blue-700",
  approve_free: "bg-green-100 text-green-700",
  reject: "bg-red-100 text-red-600",
};

interface ConfirmModalProps {
  action: AdminAction;
  listing: Room;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmModal({ action, listing, onConfirm, onCancel }: ConfirmModalProps) {
  const labels: Record<AdminAction, { title: string; btn: string; btnClass: string }> = {
    approve_paid: {
      title: "Approve + Require Payment",
      btn: "Confirm Approve + Pay",
      btnClass: "border-2 border-brand text-brand hover:bg-[#ECFDF5]",
    },
    approve_free: {
      title: "Approve Free",
      btn: "Confirm Approve Free",
      btnClass: "bg-[#0F6E56] text-white hover:bg-[#0D5E4A]",
    },
    reject: {
      title: "Reject Listing",
      btn: "Confirm Reject",
      btnClass: "border-2 border-red-500 text-red-500 hover:bg-red-50",
    },
  };
  const meta = labels[action];

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-sm p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-[#0F172A] text-base">Confirm Action</h3>
          <button onClick={onCancel} className="p-1.5 rounded-lg hover:bg-gray-100 text-[#94A3B8]">
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-sm text-[#64748B]">
          Are you sure you want to <strong className="text-[#0F172A]">&ldquo;{meta.title}&rdquo;</strong> this listing?
        </p>
        <div className="bg-[#F8FAFC] rounded-xl p-3 border border-[#E2E8F0]">
          <p className="text-sm font-semibold text-[#0F172A]">{listing.title}</p>
          <p className="text-xs text-[#64748B] mt-0.5">Landlord: {listing.landlord_name}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 border-[#E2E8F0] text-[#64748B] hover:border-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${meta.btnClass}`}
          >
            {meta.btn}
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminListingCard({
  listing,
  onAction,
}: {
  listing: Room;
  onAction: (id: string, action: AdminAction) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [pendingAction, setPendingAction] = useState<AdminAction | null>(null);

  const confirm = (action: AdminAction) => {
    onAction(listing.id, action);
    setPendingAction(null);
  };

  const submittedDate = new Date(listing.created_at).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <>
      <div className="rd-card rounded-[1.35rem] overflow-hidden">
        {/* Header row */}
        <div className="flex gap-3 p-4">
          <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
            {listing.photos[0] ? (
              <img src={listing.photos[0]} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300 text-2xl"></div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-[#0F172A] text-sm leading-snug">{listing.title}</p>
            <p className="text-xs text-[#64748B] mt-0.5">
               {listing.location}, {listing.region} - GHS {listing.price_per_month.toLocaleString()}/mo
            </p>
            <p className="text-xs text-[#64748B] mt-0.5 flex items-center gap-1.5 flex-wrap">
               {listing.landlord_name}
              <span className="text-[10px] font-bold text-brand border border-green-300 bg-brand-light px-1.5 py-0.5 rounded tracking-wide">[Property Owner]</span>
              - {listing.landlord_phone}
            </p>
            {listing.landlord_ghana_card ? (
              <p className="text-xs mt-0.5">
                <span className="bg-[#ECFDF5] text-[#0F6E56] font-mono font-medium px-1.5 py-0.5 rounded text-[10px] tracking-wide border border-green-200">
                   {listing.landlord_ghana_card}
                </span>
              </p>
            ) : (
              <p className="text-xs text-[#F59E0B] mt-0.5"> No Ghana Card provided</p>
            )}
            {listing.landlord_photo_url ? (
              <p className="text-xs text-[#10B981] mt-0.5"> Passport photo uploaded</p>
            ) : (
              <p className="text-xs text-[#F59E0B] mt-0.5"> No passport photo</p>
            )}
            <p className="text-xs text-[#94A3B8] mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Submitted {submittedDate}
            </p>
          </div>
        </div>

        {/* Expand toggle */}
        <div className="border-t border-[#E2E8F0]">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-[#64748B] hover:bg-[#F8FAFC] transition-colors"
          >
            <span>{expanded ? "Hide Details" : " View Details"}</span>
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Expanded details */}
        {expanded && (
          <div className="border-t border-[#E2E8F0] px-4 py-4 space-y-4 bg-[#F8FAFC]">
            <div>
              <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-1">Description</p>
              <p className="text-sm text-[#64748B] leading-relaxed">{listing.description}</p>
            </div>
            {listing.amenities.length > 0 && (
              <div>
                <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Amenities</p>
                <div className="flex flex-wrap gap-1.5">
                  {listing.amenities.map((a) => (
                    <span key={a} className="text-xs bg-white border border-[#E2E8F0] text-[#64748B] px-2 py-0.5 rounded-full">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setPendingAction("approve_paid")}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold border-2 border-brand text-brand hover:bg-[#ECFDF5] transition-colors"
              >
                Approve + Pay
              </button>
              <button
                onClick={() => setPendingAction("approve_free")}
                className="flex-1 py-2.5 rounded-xl text-xs font-black rd-button-primary transition-colors"
              >
                Approve Free
              </button>
              <button
                onClick={() => setPendingAction("reject")}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold border-2 border-red-500 text-red-500 hover:bg-red-50 transition-colors"
              >
                Reject
              </button>
            </div>
          </div>
        )}
      </div>

      {pendingAction && (
        <ConfirmModal
          action={pendingAction}
          listing={listing}
          onConfirm={() => confirm(pendingAction)}
          onCancel={() => setPendingAction(null)}
        />
      )}
    </>
  );
}

export default function AdminDashboardPage() {
  const { addToast } = useToast();
  const { listings, adminApprovePaid, adminApproveFree, adminReject, resetDemoListings } = useListings();
  const { reports, resolveReportById, resetReports } = useReports();
  const { payments, resetPayments } = usePayments();
  const [actioned, setActioned] = useState<ActionRecord[]>([]);
  const [activeTab, setActiveTab] = useState<"pending" | "payments" | "reports" | "actioned">("pending");
  const [copiedPayment, setCopiedPayment] = useState("");

  const pending = listings.filter((l) => l.status === "pending");
  const live = listings.filter((l) => l.status === "live");
  const openReports = getOpenReports(reports);
  const approved = listings.filter((l) => l.status === "approved");
  const recordedRevenue = getPaidPaymentTotal(payments);
  const sortedPayments = sortPaymentsNewest(payments);
  const paidRevenue = recordedRevenue || getPaidListingRevenue(listings);
  const pendingRevenue = getPendingListingRevenue(listings);
  const conversionBase = paidRevenue + pendingRevenue;
  const paidShare = conversionBase > 0 ? Math.round((paidRevenue / conversionBase) * 100) : 0;

  const handleAction = (id: string, action: AdminAction) => {
    const now = new Date().toISOString();

    if (action === "approve_paid") adminApprovePaid(id);
    else if (action === "approve_free") adminApproveFree(id);
    else if (action === "reject") adminReject(id);

    setActioned((prev) => [{ id, action, at: now }, ...prev]);

    const messages: Record<AdminAction, string> = {
      approve_paid: "Listing approved - awaiting payment",
      approve_free: "Listing approved free ",
      reject: "Listing rejected",
    };
    addToast(messages[action], action === "reject" ? "error" : "success");
  };

  const getListingById = (id: string) => listings.find((l) => l.id === id);

  const handleResetDemo = () => {
    if (!window.confirm("Reset demo listings to the original seed data?")) return;
    resetDemoListings();
    resetReports();
    resetPayments();
    setActioned([]);
    setActiveTab("pending");
    addToast("Demo listings and reports reset", "success");
  };

  const handleResolveReport = (id: string) => {
    resolveReportById(id);
    addToast("Report marked resolved", "success");
  };

  const copyPaymentReference = (reference: string) => {
    navigator.clipboard.writeText(reference).then(() => {
      setCopiedPayment(reference);
      setTimeout(() => setCopiedPayment(""), 1800);
      addToast("Payment reference copied", "success");
    });
  };

  const stats = [
    { label: "Pending", value: pending.length, icon: Clock, color: "text-[#F59E0B]", bg: "bg-yellow-50", border: "border-yellow-100" },
    { label: "Live", value: live.length, icon: CheckCircle2, color: "text-[#10B981]", bg: "bg-green-50", border: "border-green-100" },
    { label: "Paid Revenue", value: `GHS ${paidRevenue}`, icon: null, color: "text-[#0F6E56]", bg: "bg-[#ECFDF5]", border: "border-green-100" },
    { label: "Open Reports", value: openReports.length, icon: XCircle, color: "text-[#EF4444]", bg: "bg-red-50", border: "border-red-100" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Nav />

      {/* Header */}
      <div className="relative overflow-hidden bg-[#101A18] text-white py-10 px-4 rd-grain">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-[#F2B84B] text-xs font-black tracking-[0.18em] uppercase mb-0.5">RentDirect Management</p>
            <h1 className="text-3xl font-black">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleResetDemo}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-white/20"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset Demo
            </button>
            <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">Admin</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full px-4 flex-1 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {stats.map((s) => (
            <div key={s.label} className={`rd-card rounded-[1.35rem] border ${s.border} p-4 text-center shadow-sm`}>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-[#64748B] mt-0.5 font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="rd-card rounded-[1.5rem] p-5 mb-6 overflow-hidden relative">
          <div className="absolute inset-y-0 right-0 w-32 bg-linear-to-l from-brand-light to-transparent" />
          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-[11px] font-black text-brand uppercase tracking-[0.18em]">Business Health</p>
              <h2 className="text-lg font-black text-[#0F172A] mt-1">Revenue pipeline</h2>
              <p className="text-sm text-[#64748B] mt-1">
                {approved.length} approved listing{approved.length !== 1 ? "s" : ""} awaiting landlord payment.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-2xl bg-white border border-black/10 px-4 py-3">
                <p className="text-lg font-black text-brand">{paidShare}%</p>
                <p className="text-[10px] text-[#94A3B8] font-bold uppercase">Collected</p>
              </div>
              <div className="rounded-2xl bg-white border border-black/10 px-4 py-3">
                <p className="text-lg font-black text-[#0F172A]">GHS {paidRevenue}</p>
                <p className="text-[10px] text-[#94A3B8] font-bold uppercase">Paid</p>
              </div>
              <div className="rounded-2xl bg-white border border-black/10 px-4 py-3">
                <p className="text-lg font-black text-amber-600">GHS {pendingRevenue}</p>
                <p className="text-[10px] text-[#94A3B8] font-bold uppercase">To Collect</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white/70 border border-black/5 rounded-full p-1 mb-6 w-fit shadow-sm">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
              activeTab === "pending"
                ? "bg-brand text-white shadow-sm"
                : "text-[#64748B] hover:text-[#0F172A]"
            }`}
          >
            Pending Queue ({pending.length})
          </button>
          <button
            onClick={() => setActiveTab("actioned")}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
              activeTab === "actioned"
                ? "bg-brand text-white shadow-sm"
                : "text-[#64748B] hover:text-[#0F172A]"
            }`}
          >
            Actioned ({actioned.length})
          </button>
          <button
            onClick={() => setActiveTab("payments")}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
              activeTab === "payments"
                ? "bg-brand text-white shadow-sm"
                : "text-[#64748B] hover:text-[#0F172A]"
            }`}
          >
            Payments ({payments.length})
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
              activeTab === "reports"
                ? "bg-brand text-white shadow-sm"
                : "text-[#64748B] hover:text-[#0F172A]"
            }`}
          >
            Reports ({openReports.length})
          </button>
        </div>

        {/* Pending tab */}
        {activeTab === "pending" && (
          <div className="space-y-4">
            {pending.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-7 h-7 text-green-600" />
                </div>
                <p className="text-[#64748B] font-medium">All clear! No pending listings.</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-[#64748B]">
                  <span className="font-semibold text-[#0F172A]">{pending.length}</span> listing{pending.length !== 1 ? "s" : ""} awaiting review
                </p>
                {pending.map((l) => (
                  <AdminListingCard key={l.id} listing={l} onAction={handleAction} />
                ))}
              </>
            )}
          </div>
        )}

        {/* Actioned tab */}
        {activeTab === "actioned" && (
          <div className="space-y-3">
            {actioned.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-[#94A3B8] text-sm">No actions taken yet this session.</p>
              </div>
            ) : (
              actioned.map((record) => {
                const l = getListingById(record.id);
                return (
                  <div key={record.id + record.at} className="rd-card rounded-[1.35rem] p-4 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#0F172A] truncate">{l?.title ?? record.id}</p>
                      <p className="text-xs text-[#94A3B8]">{l?.location}, {l?.region}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${ACTION_BADGE[record.action]}`}>
                        {ACTION_LABEL[record.action]}
                      </span>
                      <p className="text-xs text-[#94A3B8] mt-1">
                        {new Date(record.at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Payments tab */}
        {activeTab === "payments" && (
          <div className="space-y-3">
            {sortedPayments.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-[#94A3B8] text-sm">No recorded payments yet.</p>
              </div>
            ) : (
              sortedPayments.map((payment) => {
                const listing = getListingById(payment.listing_id);
                const provider = payment.provider ? PAYMENT_METHOD_LABELS[payment.provider] : "Mobile Money";
                return (
                  <div key={payment.id} className="rd-card rounded-[1.35rem] p-4 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-[#0F172A] truncate">
                        {listing?.title ?? payment.listing_id}
                      </p>
                      <p className="text-xs text-[#64748B] mt-0.5">
                        {listing?.landlord_name ?? payment.landlord_id} - {provider}
                      </p>
                      <p className="text-xs text-[#94A3B8] mt-0.5">
                        {payment.paid_at ? new Date(payment.paid_at).toLocaleString() : "Paid"}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-base font-black text-brand">GHS {payment.amount}</p>
                      <button
                        type="button"
                        onClick={() => copyPaymentReference(payment.reference)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#64748B] hover:text-brand mt-1"
                      >
                        <Copy className="h-3 w-3" />
                        {copiedPayment === payment.reference ? "Copied" : payment.reference}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Reports tab */}
        {activeTab === "reports" && (
          <div className="space-y-3">
            {openReports.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-7 h-7 text-green-600" />
                </div>
                <p className="text-[#64748B] font-medium">No open tenant reports.</p>
              </div>
            ) : (
              openReports.map((report) => {
                const listing = getListingById(report.listing_id);
                return (
                  <div key={report.id} className="rd-card rounded-[1.35rem] p-4 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-sm font-black text-[#0F172A]">{REPORT_REASON_LABELS[report.reason]}</p>
                        <p className="text-xs text-[#64748B] mt-0.5 truncate">
                          {listing?.title ?? report.listing_id}
                        </p>
                        <p className="text-xs text-[#94A3B8] mt-0.5">
                          Submitted {new Date(report.created_at).toLocaleString()}
                        </p>
                      </div>
                      <span className="text-[10px] font-black bg-red-50 text-red-600 border border-red-100 px-2 py-1 rounded-full shrink-0">
                        Open
                      </span>
                    </div>
                    {report.details && (
                      <p className="text-sm text-[#64748B] bg-surface border border-black/10 rounded-xl px-3 py-2">
                        {report.details}
                      </p>
                    )}
                    <div className="flex items-center gap-2">
                      {listing && (
                        <a
                          href={`/listings/${listing.id}`}
                          className="text-xs font-bold text-brand hover:underline"
                        >
                          View listing
                        </a>
                      )}
                      <button
                        onClick={() => handleResolveReport(report.id)}
                        className="ml-auto text-xs font-black rd-button-primary px-4 py-2 rounded-xl"
                      >
                        Mark Resolved
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}

