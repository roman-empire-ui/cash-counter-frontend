// src/Components/MonthlyPaymentSummary.jsx
import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { getRemCash } from "../services/actualCash";
import { motion, AnimatePresence } from "framer-motion";

const MonthlyPaymentSummary = () => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    cash: 0,
    card: 0,
    paytm: 0,
    posibleOnlineAmount: 0,
    total: 0,
  });
  const [dailyData, setDailyData] = useState(null);
  const [allData, setAllData] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getRemCash();
        const data = Array.isArray(response) ? response : response?.data || [];
        setAllData(data);
      } catch (error) {
        console.error("Error fetching payment summary:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedDate && allData.length > 0) {
      calculateSummary(allData, selectedDate);
    }
  }, [selectedDate, allData]);

  const calculateSummary = (data, selected) => {
    let filtered = [];

    if (selected.length === 7) {
      const [year, month] = selected.split("-").map(Number);
      filtered = data.filter((item) => {
        const d = new Date(item.date);
        return d.getUTCFullYear() === year && d.getUTCMonth() + 1 === month;
      });
      setDailyData(null); // clear daily data if monthly view
    } else if (selected.length === 10) {
      const entryDate = new Date(selected);
      entryDate.setUTCHours(0, 0, 0, 0);
      filtered = data.filter(
        (item) => new Date(item.date).toISOString().split("T")[0] === selected
      );
      setDailyData(filtered[0] || null);
    }

    const totals = filtered.reduce(
      (acc, item) => {
        acc.cash += Number(item.cash || 0);
        acc.card += Number(item.card || 0);
        acc.paytm += Number(item.paytm || 0);
        acc.posibleOnlineAmount += Number(item.posibleOnlineAmount || 0);
        return acc;
      },
      { cash: 0, card: 0, paytm: 0, posibleOnlineAmount: 0 }
    );

    totals.total =
      totals.cash + totals.card + totals.paytm + totals.posibleOnlineAmount;
    setSummary(totals);
  };

  const getPercentage = (value) =>
    summary.total > 0 ? ((value / summary.total) * 100).toFixed(1) : 0;

  const formatAmount = (value) => {
    const num = Number(value);
    if (isNaN(num)) return "0";
    return num.toLocaleString("en-IN");
  };

  if (loading)
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="animate-spin text-purple-400" size={30} />
      </div>
    );

  return (
    <motion.div
      className="bg-gradient-to-br from-gray-900/70 to-gray-800/70 border border-purple-500/30 rounded-2xl shadow-lg p-5 text-white backdrop-blur-md hover:shadow-purple-500/20 transition-all"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-xl font-bold text-center text-purple-300 mb-4">
        Payment Summary
      </h2>

      {/* 🔹 Smart Calendar Selector */}
      <div className="flex justify-center mb-4 gap-2">
        <input
          type="date"
          className="bg-gray-900/70 border border-purple-400/40 text-white rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={selectedDate.length === 10 ? selectedDate : ""}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        <input
          type="month"
          className="bg-gray-900/70 border border-purple-400/40 text-white rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={selectedDate.length === 7 ? selectedDate : ""}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedDate}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          className="space-y-3 text-sm"
        >
          {["cash", "card", "paytm", "posibleOnlineAmount"].map((key, idx) => (
            <div key={key}>
              <div className="flex justify-between mb-1">
                <span>
                  {key === "cash"
                    ? "💵 Cash"
                    : key === "card"
                    ? "💳 Card"
                    : key === "paytm"
                    ? "📱 Paytm"
                    : "🌐 Online"}
                </span>
                <span>
                  ₹{formatAmount(summary[key])} ({getPercentage(summary[key])}%)
                </span>
              </div>
              <div className="w-full bg-gray-700/50 rounded-full h-2">
                <motion.div
                  className={`h-2 rounded-full ${
                    idx === 0
                      ? "bg-green-400"
                      : idx === 1
                      ? "bg-blue-400"
                      : idx === 2
                      ? "bg-pink-400"
                      : "bg-amber-400"
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${getPercentage(summary[key])}%` }}
                  transition={{ duration: 0.6 }}
                />
              </div>
            </div>
          ))}

          <div className="border-t border-purple-500/20 my-3"></div>

          <div className="flex justify-between font-semibold text-green-500 text-base">
            <span>Total:</span>
            <motion.span
              key={summary.total}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              ₹{formatAmount(summary.total)}
            </motion.span>
          </div>

          {/* 🔹 Show extra details only for Daily View */}
          {dailyData && (
            <motion.div
              className="mt-4 p-3 bg-gray-800/70 rounded-xl border border-purple-500/20"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h3 className="text-purple-300 font-semibold text-sm mb-2">
                Daily Details
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <p> Opening Balance: ₹{formatAmount(dailyData.openingBalance || 0)}</p>
                <p> Total Remaining: ₹{formatAmount(dailyData.totalRemainingCash || 0)}</p>
                <p> Difference: ₹{formatAmount(dailyData.difference || 0)}</p>
                <p>Net Profit/Loss: ₹{formatAmount(dailyData.netProfitLoss || 0)}</p>
                <p> Created At: {new Date(dailyData.createdAt).toLocaleString()}</p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default MonthlyPaymentSummary;
