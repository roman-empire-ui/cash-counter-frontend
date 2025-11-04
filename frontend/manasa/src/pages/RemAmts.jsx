import React, { useEffect, useState } from "react";
import { getRemAmts } from "../services/stockEntry";
import { RefreshCw } from "lucide-react";
import { toast } from "react-toastify";
import Lottie from "lottie-react";
import loader from "../assets/loader.json"; // optional animation

const RemAmts = () => {
  const [remAmts, setRemAmts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRemAmt = async () => {
    try {
      setLoading(true);
      const res = await getRemAmts();
      const data = res?.data || [];
      setRemAmts(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch remaining amounts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRemAmt();
  }, []);

  // Format date (YYYY-MM-DD)
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 sm:p-6">
      <div className="max-w-6xl mx-auto bg-gray-900 rounded-2xl p-6 shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-wide">
            Remaining Amounts Overview
          </h2>
          <button
            onClick={fetchRemAmt}
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center items-center h-56">
            <Lottie animationData={loader} className="w-32 h-32" />
          </div>
        ) : remAmts.length === 0 ? (
          <p className="text-center text-gray-400 py-8">
            No remaining amount data found.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-white/10">
            <table className="w-full text-sm sm:text-base">
              <thead className="bg-gray-800 text-gray-200 uppercase text-xs sm:text-sm">
                <tr>
                  <th className="px-4 py-3 text-left border-b border-white/10">Date</th>
                  <th className="px-4 py-3 text-left border-b border-white/10">Amount Have</th>
                  <th className="px-4 py-3 text-left border-b border-white/10">Remaining Cash</th>
                  <th className="px-4 py-3 text-left border-b border-white/10">Total Stock Expenses</th>
                  <th className="px-4 py-3 text-left border-b border-white/10">Paytm</th>
                  <th className="px-4 py-3 text-left border-b border-white/10">Company</th>
                  <th className="px-4 py-3 text-left border-b border-white/10">Updated</th>
                </tr>
              </thead>

              <tbody>
                {remAmts.map((amt) => (
                  <tr
                    key={amt._id}
                    className="border-b border-white/10 hover:bg-white/5 transition"
                  >
                    <td className="px-4 py-3">{formatDate(amt.createdAt)}</td>
                    <td className="px-4 py-3 text-blue-400 font-medium">
                      ₹{amt.amountHave?.toLocaleString("en-IN") || 0}
                    </td>
                    <td className="px-4 py-3 text-green-400 font-medium">
                      ₹{amt.remainingAmount?.toLocaleString("en-IN") || 0}
                    </td>
                    <td className="px-4 py-3 text-yellow-400 font-medium">
                      ₹{amt.totalStockExpenses?.toLocaleString("en-IN") || 0}
                    </td>
                    <td className="px-4 py-3 text-purple-400">
                      ₹{amt.extraSources?.paytm?.toLocaleString("en-IN") || 0}
                    </td>
                    <td className="px-4 py-3 text-gray-300">
                      {amt.extraSources?.company?.length
                        ? amt.extraSources.company
                          .map((c) => `${c.name || "N/A"} (₹${c.amount?.toLocaleString("en-IN") || 0})`)
                          .join(", ")
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {formatDate(amt.updatedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RemAmts;
