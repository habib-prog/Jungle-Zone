"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Activity, Download, Search, Mail, Monitor, Smartphone, MapPin } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const AllActivity = () => {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [retentionDays, setRetentionDays] = useState(30);

  const [emailInput, setEmailInput] = useState("");
  const [emailSearch, setEmailSearch] = useState("");
  const [actionInput, setActionInput] = useState("all");
  const [actionSearch, setActionSearch] = useState("all");

  const limit = 20;

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        if (emailSearch) params.append("email", emailSearch);
        if (actionSearch !== "all") params.append("action", actionSearch);

        const res = await fetch(`/api/admin/activity?${params.toString()}`, {
          cache: "no-store",
        });
        const data = await res.json();
        setLogs(data.logs || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setRetentionDays(data.retentionDays || 30);
      } catch (error) {
        toast.error(error.message || "Failed to fetch activity logs");
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [page, emailSearch, actionSearch]);

  const handleSearch = () => {
    setEmailSearch(emailInput);
    setActionSearch(actionInput);
    setPage(1);
  };

  const handleClearFilters = () => {
    setEmailInput("");
    setEmailSearch("");
    setActionInput("all");
    setActionSearch("all");
    setPage(1);
  };

  const formatDateTime = (value) => {
    if (!value) return "—";
    return new Date(value).toLocaleString();
  };

  const downloadPdf = async () => {
    try {
      const params = new URLSearchParams();
      if (emailSearch) params.append("email", emailSearch);
      if (actionSearch !== "all") params.append("action", actionSearch);
      params.append("limit", "1000");
      params.append("page", "1");

      const res = await fetch(`/api/admin/activity?${params.toString()}`, {
        cache: "no-store",
      });
      const data = await res.json();
      const rows = data.logs || [];

      const BRAND = [98, 157, 47]; // #629d2f
      const BRAND_LIGHT = [238, 246, 230];

      const getLogo = async () => {
        try {
          const imgRes = await fetch("/img/logo.png");
          const blob = await imgRes.blob();
          return await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = () => resolve(null);
            reader.readAsDataURL(blob);
          });
        } catch {
          return null;
        }
      };

      const doc = new jsPDF();
      const title = "Login / Logout Activity Report";
      const generatedAt = new Date().toLocaleString().replace(",", "");
      const retention = data.retentionDays || 30;
      const logo = await getLogo();

      const drawHeader = () => {
        const pageWidth = doc.internal.pageSize.getWidth();
        // Branded header band
        doc.setFillColor(...BRAND);
        doc.rect(0, 0, pageWidth, 30, "F");

        // Logo chip
        if (logo) {
          doc.setFillColor(255, 255, 255);
          doc.roundedRect(12, 6, 18, 18, 2, 2, "F");
          doc.addImage(logo, "PNG", 14, 8, 14, 14);
          doc.setTextColor(255, 255, 255);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(15);
          doc.text(title, 35, 15);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(8.5);
          doc.text(`Generated: ${generatedAt}`, 35, 23);
        } else {
          doc.setTextColor(255, 255, 255);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(15);
          doc.text(title, 14, 15);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(8.5);
          doc.text(`Generated: ${generatedAt}`, 14, 23);
        }

        // Right-aligned meta
        doc.setFontSize(8.5);
        doc.setTextColor(255, 255, 255);
        doc.text(`Auto-deleted after ${retention} days`, pageWidth - 14, 15, {
          align: "right",
        });
        doc.text(
          `Total records: ${rows.length}`,
          pageWidth - 14,
          23,
          { align: "right" },
        );
      };

      const drawFooter = (pageNumber) => {
        const pageHeight = doc.internal.pageSize.getHeight();
        const pageWidth = doc.internal.pageSize.getWidth();
        doc.setDrawColor(...BRAND);
        doc.setLineWidth(0.5);
        doc.line(14, pageHeight - 14, pageWidth - 14, pageHeight - 14);
        doc.setFontSize(8);
        doc.setTextColor(...BRAND);
        doc.setFont("helvetica", "bold");
        doc.text("JungleZone — Activity Report", 14, pageHeight - 9);
        doc.setTextColor(150, 150, 150);
        doc.setFont("helvetica", "normal");
        doc.text(`Page ${pageNumber}`, pageWidth - 14, pageHeight - 9, {
          align: "right",
        });
      };

      autoTable(doc, {
        startY: 40,
        head: [["Date/Time", "User", "Role", "Action", "Device", "Region"]],
        body: rows.map((r) => [
          r.createdAt ? formatDateTime(r.createdAt) : "",
          `${r.name || ""}\n${r.email || ""}`,
          r.role || "",
          r.action,
          r.device || "",
          r.region || "",
        ]),
        styles: {
          fontSize: 8,
          cellPadding: 2.5,
          lineColor: [225, 225, 225],
          lineWidth: 0.1,
          textColor: [40, 40, 40],
        },
        headStyles: {
          fillColor: BRAND,
          textColor: 255,
          fontStyle: "bold",
        },
        alternateRowStyles: { fillColor: BRAND_LIGHT },
        columnStyles: {
          1: { cellWidth: 42, textColor: [40, 40, 40], fontStyle: "bold" },
          4: {
            halign: "left",
            cellPadding: { top: 2.5, right: 2.5, bottom: 2.5, left: 10 },
          },
        },
        didParseCell: (cell) => {
          if (cell.section === "body" && cell.column.index === 1) {
            // Style the email line (second line) as muted
            cell.cell.styles.fontStyle = "bold";
          }
          if (cell.section === "body" && cell.column.index === 3) {
            if (cell.cell.raw === "login") {
              cell.cell.styles.textColor = [31, 120, 31];
              cell.cell.styles.fontStyle = "bold";
            } else if (cell.cell.raw === "logout") {
              cell.cell.styles.textColor = [190, 40, 40];
              cell.cell.styles.fontStyle = "bold";
            }
          }
        },
        didDrawCell: (cell) => {
          if (cell.section === "body" && cell.column.index === 4) {
            const isMobileDev = /iOS|Android/i.test(cell.cell.raw || "");
            const x = cell.cell.x + 3;
            const yc = cell.cell.y + cell.cell.height / 2;
            doc.setDrawColor(150, 150, 150);
            doc.setLineWidth(0.3);
            if (isMobileDev) {
              doc.roundedRect(x, yc - 3, 4, 6, 0.8, 0.8);
            } else {
              const top = yc - 1.9;
              doc.rect(x, top, 5, 3);
              doc.line(x + 2.5, top + 3, x + 2.5, top + 3.8);
              doc.line(x + 1, top + 3.8, x + 4, top + 3.8);
            }
          }
        },
        didDrawPage: (data) => {
          drawHeader();
          drawFooter(data.pageNumber);
        },
        margin: { top: 40, bottom: 18 },
      });

      doc.save(`activity-report-${new Date().toISOString().slice(0, 10)}.pdf`);
      toast.success("PDF downloaded");
    } catch (error) {
      toast.error(error.message || "Failed to download PDF");
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brandColor/10 text-brandColor flex items-center justify-center">
            <Activity size={20} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Login / Logout Activity
            </h2>
            <p className="text-xs text-gray-500">
              Records are automatically deleted after {retentionDays} days.
            </p>
          </div>
        </div>
        <button
          onClick={downloadPdf}
          className="inline-flex items-center gap-2 px-4 py-2 bg-brandColor text-white text-sm font-medium rounded-lg hover:bg-brandColor/90 transition cursor-pointer"
        >
          <Download size={16} /> Download PDF
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 px-6 py-4 bg-gray-50/60 border-b border-gray-100">
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Mail
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by email..."
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandColor/40 focus:border-brandColor"
          />
        </div>
        <select
          value={actionInput}
          onChange={(e) => setActionInput(e.target.value)}
          className="px-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brandColor/40 focus:border-brandColor"
        >
          <option value="all">All Actions</option>
          <option value="login">Login</option>
          <option value="logout">Logout</option>
        </select>
        <button
          onClick={handleSearch}
          className="inline-flex items-center gap-2 px-4 py-2 bg-brandColor text-white text-sm font-medium rounded-lg hover:bg-brandColor/90 transition cursor-pointer"
        >
          <Search size={16} /> Search
        </button>
        <button
          onClick={handleClearFilters}
          className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition cursor-pointer"
        >
          Clear
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-gray-400 text-sm">
            <span className="w-4 h-4 border-2 border-brandColor border-t-transparent rounded-full animate-spin" />
            Loading activity...
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Activity size={32} className="mb-2 opacity-40" />
            <p className="text-sm">No activity records found.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-brandColor text-white text-left">
                <th className="px-6 py-3 font-semibold whitespace-nowrap">
                  Date / Time
                </th>
                <th className="px-6 py-3 font-semibold">User</th>
                <th className="px-6 py-3 font-semibold">Role</th>
                <th className="px-6 py-3 font-semibold">Action</th>
                <th className="px-6 py-3 font-semibold">Device</th>
                <th className="px-6 py-3 font-semibold">Region</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.map((log) => {
                const isLogin = log.action === "login";
                const initials = (
                  log.name ||
                  log.email ||
                  "?"
                )
                  .charAt(0)
                  .toUpperCase();
                return (
                  <tr
                    key={log._id}
                    className="hover:bg-gray-50/70 transition-colors"
                  >
                    <td className="px-6 py-3 text-gray-600 whitespace-nowrap">
                      {formatDateTime(log.createdAt)}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 shrink-0 rounded-full bg-brandColor/10 text-brandColor flex items-center justify-center text-xs font-semibold uppercase">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-800 truncate">
                            {log.name || "—"}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {log.email || "—"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <span className="inline-block px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium capitalize">
                        {log.role || "—"}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          isLogin
                            ? "bg-green-50 text-green-700 ring-1 ring-green-200"
                            : "bg-red-50 text-red-700 ring-1 ring-red-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isLogin ? "bg-green-500" : "bg-red-500"
                          }`}
                        />
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-600">
                      <span className="inline-flex items-center gap-1.5">
                        {/iOS|Android/i.test(log.device || "") ? (
                          <Smartphone size={15} className="text-gray-400" />
                        ) : (
                          <Monitor size={15} className="text-gray-400" />
                        )}
                        {log.device || "—"}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-600">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin size={15} className="text-gray-400" />
                        {log.region || "—"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-end items-center gap-3 px-6 py-4 border-t border-gray-100">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition cursor-pointer"
        >
          Previous
        </button>
        <span className="text-sm text-gray-600">
          Page <span className="font-semibold text-gray-800">{page}</span> of{" "}
          {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllActivity;
