import React from "react";
import { FileDown } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function PdfCreator({ data }) {
  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Report Summary", 14, 20);

    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleString()}`, 14, 30);

   // Group data by date
const grouped = {};

data?.forEach((entry) => {
  const dateKey = entry.date?.split("T")[0] || "Unknown Date";
  if (!grouped[dateKey]) grouped[dateKey] = [];

  entry.distributors?.forEach((dist) => {
    grouped[dateKey].push({
      inv: dist.inv || "-",
      name: dist.name || "-",
      totalPaid: dist.totalPaid || 0,
    });
  });
});

let startY = 40;

// Loop through each date group
Object.keys(grouped).forEach((date) => {
  // Date Header
  doc.setFontSize(14);
  doc.text(`Date: ${date}`, 14, startY);
  startY += 6;

  // Convert group into table rows
  const rows = grouped[date].map((item, idx) => [
    idx + 1,
    date,
    item.inv,
    item.name,
    item.totalPaid,
  ]);

  autoTable(doc, {
    startY,
    head: [["S.No", "Date", "Invoice", "Name", "Amount"]],
    body: rows,
    margin: { left: 14, right: 14 },
    styles: { halign: "center" },
    headStyles: {
      fillColor: [0, 122, 255],
      textColor: 255,
      fontSize: 12,
    },
    alternateRowStyles: { fillColor: [240, 240, 240] },
  });

  startY = doc.lastAutoTable.finalY + 10; // spacing between date tables
});


    doc.save(`report-${Date.now()}.pdf`);
  };

  return (
    <div className="flex justify-center p-4">
      <button
        onClick={generatePDF}
        className="mt-5 relative  bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-full px-6 py-3 shadow-lg overflow-hidden group animate-pulse"
      >
        <span className="flex items-center gap-2 z-10">
          <FileDown size={18} /> Download PDF
        </span>
        <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-600 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-700 animate-spin-slow"></span>
      </button>
    </div>
  );
}
