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
    posibleOnlineAmount : 0,
    total: 0,
  });
  const [allData, setAllData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`; // yyyy-mm
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getRemCash();
        console.log(response)
        const data = Array.isArray(response)
          ? response
          : response?.data || [];
        setAllData(data);
        calculateMonthlySummary(data, selectedMonth);
      } catch (error) {
        console.error("Error fetching payment summary:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (allData.length > 0) calculateMonthlySummary(allData, selectedMonth);
  }, [selectedMonth]);

  const calculateMonthlySummary = (data, selected) => {
    const [year, month] = selected.split("-").map(Number);
    const filtered = data.filter((item) => {
      const d = new Date(item.date);
      return d.getUTCFullYear() === year && d.getUTCMonth() + 1 === month;
    });

    const totals = filtered.reduce(
      (acc, item) => {
        acc.cash += Number(item.cash || 0);
        acc.card += Number(item.card || 0);
        acc.paytm += Number(item.paytm || 0);
        acc.posibleOnlineAmount += Number(item.posibleOnlineAmount ||0)
        return acc;
      },
      { cash: 0, card: 0, paytm: 0 , posibleOnlineAmount : 0 }
    );

    totals.total = totals.cash + totals.card + totals.paytm + totals.posibleOnlineAmount;
    setSummary(totals);
  };

  const getPercentage = (value) =>
    summary.total > 0 ? ((value / summary.total) * 100).toFixed(1) : 0;

  if (loading)
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="animate-spin text-purple-400" size={30} />
      </div>
    );


    const formatAmount = (value) => {
        const num = Number(value);
        if (isNaN(num)) return "0";
        return num.toLocaleString("en-IN"); // Indian comma style
      };
      

  return (
    <motion.div
      className="bg-gradient-to-br from-gray-900/70 to-gray-800/70 border border-purple-500/30 rounded-2xl shadow-lg p-5 text-white backdrop-blur-md hover:shadow-purple-500/20 transition-all"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-xl font-bold text-center text-purple-300 mb-4">
        Monthly Payment Summary
      </h2>

      {/* 🔹 Month Selector */}
      <div className="flex justify-center mb-4">
        <input
          type="month"
          className="bg-gray-900/70 border border-purple-400/40 text-white rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        />
      </div>

      {/* 🔹 Summary Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedMonth}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          className="space-y-3 text-sm"
        >
          {/* CASH */}
          <div>
            <div className="flex justify-between mb-1">
              <span>💵 Cash</span>
              <span>₹{formatAmount(summary.cash)} ({getPercentage(summary.cash)}%)</span>
            </div>
            <div className="w-full bg-gray-700/50 rounded-full h-2">
              <motion.div
                className="bg-green-400 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${getPercentage(summary.cash)}%` }}
                transition={{ duration: 0.6 }}
              />
            </div>
          </div>

          {/* CARD */}
          <div>
            <div className="flex justify-between mb-1">
              <span>💳 Card</span>
              <span>₹{formatAmount(summary.card)} ({getPercentage(summary.card)}%)</span>
            </div>
            <div className="w-full bg-gray-700/50 rounded-full h-2">
              <motion.div
                className="bg-blue-400 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${getPercentage(summary.card)}%` }}
                transition={{ duration: 0.6 }}
              />
            </div>
          </div>

          {/* PAYTM */}
          <div>
            <div className="flex justify-between mb-1">
              <span>📱 Paytm</span>
              <span>₹{formatAmount(summary.paytm)} ({getPercentage(summary.paytm)}%)</span>
            </div>
            <div className="w-full bg-gray-700/50 rounded-full h-2">
              <motion.div
                className="bg-pink-400 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${getPercentage(summary.paytm)}%` }}
                transition={{ duration: 0.6 }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span>Posible Online Payments</span>
              <span>₹{formatAmount(summary.posibleOnlineAmount)} ({getPercentage(summary.posibleOnlineAmount)}%)</span>
            </div>
            <div className="w-full bg-gray-700/50 rounded-full h-2">
              <motion.div
                className="bg-amber-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${getPercentage(summary.posibleOnlineAmount)}%` }}
                transition={{ duration: 0.6 }}
              />
            </div>
          </div>

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
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default MonthlyPaymentSummary;
