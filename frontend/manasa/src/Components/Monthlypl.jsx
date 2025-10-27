// src/components/MonthlyProfitLoss.jsx
import React, { useEffect, useState } from "react";
import { Loader2, Search } from "lucide-react";
import { toast } from "react-toastify";
import { getMonthlypl } from "../services/actualCash";

const MonthlyProfitLoss = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const fetchMonthlyPL = async (m = month, y = year) => {
    try {
      setLoading(true);
      const res = await getMonthlypl(m, y);
      if (res?.success) {
        setData(res);
      } else {
        setData(null);
        toast.error(res?.message || "No data found for this month");
      }
    } catch (error) {
      toast.error(error.message || "Error fetching monthly summary");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonthlyPL();
  }, []);

  

  const handleSearch = () => {
    if (!month || !year) {
      toast.error("Please select both month and year");
      return;
    }
    fetchMonthlyPL(month, year);
  };

  const formatAmount = (amount) =>
    amount?.toLocaleString("en-IN", { minimumFractionDigits: 2 });

  const monthName = new Date(year, month - 1).toLocaleString("default", {
    month: "long",
  });

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-lg p-6 text-white max-w-lg mx-auto">
      <h2 className="text-xl font-semibold text-gray-300 text-center mb-6">
        Monthly Profit & Loss Summary
      </h2>

      {/* 🔍 Search Controls */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          className="bg-gray-800 border border-gray-700 rounded-lg p-2 text-white"
        >
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>

        <input
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="bg-gray-800 border border-gray-700 rounded-lg p-2 text-white w-24"
        />

        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg flex items-center gap-1"
        >
          <Search size={16} /> Search
        </button>
      </div>

      {/* 💡 Loading State */}
      {loading ? (
        <div className="flex items-center justify-center h-32 text-gray-400">
          <Loader2 className="animate-spin mr-2" /> Loading monthly summary...
        </div>
      ) : !data ? (
        <div className="text-center text-gray-400 py-6">
          No data available for {monthName} {year}.
        </div>
      ) : (
        <div>
          <h3 className="text-lg font-semibold text-gray-300 text-center mb-4">
            {monthName} {year}
          </h3>

          <div className="flex flex-col space-y-3">
            <div className="flex justify-between">
              <span>Total Profit:</span>
              <span className="text-green-400 font-semibold">
                +₹{formatAmount(data.totalProfit)}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Total Loss:</span>
              <span className="text-red-400 font-semibold">
                -₹{formatAmount(data.totalLoss)}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Total Entries/M:</span>
              <span className="text-yellow-400 font-semibold">
                {data.entriesCount}
              </span>
            </div>

            <hr className="border-gray-700 my-2" />

            <div className="flex justify-between text-lg">
              <span>Net Result:</span>
              <span
                className={`font-bold ${
                  data.netTotal >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {data.netTotal >= 0 ? "+" : "-"}₹
                {formatAmount(Math.abs(data.netTotal))}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlyProfitLoss;
