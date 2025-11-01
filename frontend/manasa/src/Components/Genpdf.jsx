import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

const GeneratePDFButton = ({ data, fileName = "RemainingCashReport" }) => {
  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Remaining Cash Report", 14, 20);
    doc.setFontSize(12);
    doc.text(`Date: ${data.date || "N/A"}`, 14, 30);

    const tableData = data.denominations?.map((d) => [
      d.type,
      d.value,
      d.count,
      d.total,
    ]);

    doc.autoTable({
      head: [["Type", "Value", "Count", "Total"]],
      body: tableData || [],
      startY: 40,
    });

    doc.text(`Grand Total: ₹${data.grandTotal || 0}`, 14, doc.lastAutoTable.finalY + 10);

    doc.save(`${fileName}.pdf`);
  };

  if (!data || !data.denominations) return null;

  return (
    <button
      onClick={generatePDF}
      className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
    >
      Download PDF
    </button>
  );
};

export default GeneratePDFButton;
