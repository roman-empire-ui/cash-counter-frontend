import React, { useEffect, useState } from "react";
import { getRemAmts } from "../services/stockEntry";
import { RefreshCw, CalendarSearch } from "lucide-react";
import { toast } from "react-toastify";
import Lottie from "lottie-react";
import loader from "../assets/loader.json";

const RemAmts = () => {
  const [remAmts, setRemAmts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [month, setMonth] = useState("");

  /* ================= FETCH ================= */
  const fetchRemAmt = async (from, to) => {
    if (!from || !to) return;

    try {
      setLoading(true);
      const res = await getRemAmts(from, to);

      if (!res?.success) {
        toast.error("Failed to fetch remaining amounts");
        return;
      }

      setRemAmts(res.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch remaining amounts");
    } finally {
      setLoading(false);
    }
  };

  /* ========== AUTO REFRESH ON DATE CHANGE ========== */
  useEffect(() => {
    fetchRemAmt(fromDate, toDate);
  }, [fromDate, toDate]);

  /* ========== INITIAL LOAD (TODAY) ========== */
  useEffect(() => {
    handleToday();
  }, []);

  /* ================= QUICK FILTERS ================= */
  const handleToday = () => {
    const today = new Date().toISOString().split("T")[0];
    setFromDate(today);
    setToDate(today);
  };

  const handleThisWeek = () => {
    const now = new Date();
    const first = new Date(now.setDate(now.getDate() - now.getDay()));
    const last = new Date();

    setFromDate(first.toISOString().split("T")[0]);
    setToDate(last.toISOString().split("T")[0]);
  };

  const handleThisMonth = () => {
    const date = new Date();
    const first = new Date(date.getFullYear(), date.getMonth(), 1);
    const last = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    setFromDate(first.toISOString().split("T")[0]);
    setToDate(last.toISOString().split("T")[0]);
  };

  /* ================= MONTH PICKER ================= */
  const handleMonthChange = (value) => {
    setMonth(value);
    if (!value) return;

    const [year, month] = value.split("-");
    const first = new Date(year, month - 1, 1);
    const last = new Date(year, month, 0);

    setFromDate(first.toISOString().split("T")[0]);
    setToDate(last.toISOString().split("T")[0]);
  };

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "—";

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 sm:p-6">
      <div className="max-w-6xl mx-auto bg-gray-900 rounded-2xl p-6 shadow-lg">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <h2 className="text-2xl sm:text-3xl font-semibold">
            Remaining Amounts Overview
          </h2>

          <button
            onClick={() => fetchRemAmt(fromDate, toDate)}
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
          >
            <RefreshCw className={loading ? "animate-spin" : ""} size={18} />
            Refresh
          </button>
        </div>

        {/* QUICK FILTER BUTTONS */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button onClick={handleToday} className="px-4 py-2 bg-green-500 rounded-lg hover:bg-gray-700">
            Today
          </button>
          <button onClick={handleThisWeek} className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-gray-700">
            This Week
          </button>
          <button onClick={handleThisMonth} className="px-4 py-2 bg-yellow-500 rounded-lg hover:bg-gray-700">
            This Month
          </button>
        </div>

        {/* DATE & MONTH PICKERS */}
        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="bg-gray-800 px-3 py-2 rounded-lg"
          />

          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="bg-gray-800 px-3 py-2 rounded-lg"
          />

          <input
            type="month"
            value={month}
            onChange={(e) => handleMonthChange(e.target.value)}
            className="bg-gray-800 px-3 py-2 rounded-lg"
          />
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="flex justify-center h-56">
            <Lottie animationData={loader} className="w-32 h-32" />
          </div>
        ) : remAmts.length === 0 ? (
          <p className="text-center text-gray-400 py-8">
            No remaining amount data found
          </p>
        ) : (
          <div className="overflow-x-auto border border-white/10 rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-4 py-3 ">Date</th>
                  <th className="px-4 py-3">Amount Have</th>
                  <th className="px-4 py-3">Remaining</th>
                  <th className="px-4 py-3">Expenses</th>
                  <th className="px-4 py-3">Paytm</th>
                  <th className="px-4 py-3">Updated</th>
                </tr>
              </thead>
              <tbody>
                {remAmts.map((amt) => (
                  <tr key={amt._id} className="border-b border-white/10 hover:bg-white/5">
                    <td className="px-4 py-3 text-center">{formatDate(amt.createdAt)}</td>
                    <td className="px-4 py-3 text-blue-400 text-center">₹{amt.amountHave || 0}</td>
                    <td className="px-4 py-3 text-green-400 text-center">₹{amt.remainingAmount || 0}</td>
                    <td className="px-4 py-3 text-yellow-400 text-center">₹{amt.totalStockExpenses || 0}</td>
                    <td className="px-4 py-3 text-purple-400 text-center">₹{amt.extraSources?.paytm || 0}</td>
                    <td className="px-4 py-3 text-gray-400 text-center">{formatDate(amt.updatedAt)}</td>
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
