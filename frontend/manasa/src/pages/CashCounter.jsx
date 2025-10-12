import React, { useState } from "react";
import { Loader2, PlusCircle, Wallet } from "lucide-react";
import { toast } from "react-toastify";
import Notification from "../Components/Notification";
import { cashCount, getInitialCount } from "../services/cashCounter";
import { useNavigate } from "react-router-dom";
import Lottie from 'lottie-react'
import gears from '../assets/gears.json'

const denominations = {
  notes: [500, 200, 100, 50, 20, 10],
  coins: [1, 2, 5, 10],
};

const CashCounter = () => {
  const [notes, setNotes] = useState(
    denominations.notes.map((d) => ({ denomination: d, count: 0 }))
  );
  const [coins, setCoins] = useState(
    denominations.coins.map((d) => ({ denomination: d, count: 0 }))
  );
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const navigate = useNavigate();

  const handleChange = (type, index, value) => {
    const updater = type === "notes" ? setNotes : setCoins;
    const list = type === "notes" ? [...notes] : [...coins];
    list[index].count = Number(value);
    updater(list);
  };

  const total = [...notes, ...coins].reduce(
    (sum, item) => sum + item.denomination * item.count,
    0
  );

  // Fetch data for selected date
  const fetchDateData = async () => {
    setLoading(true);
    try {
      const data = await getInitialCount(date);
      if (data.success && data.initialCash) {
        // Populate notes
        const fetchedNotes = denominations.notes.map((d) => {
          const note = data.initialCash.notes.find((n) => n.denomination === d);
          return { denomination: d, count: note ? note.count : 0 };
        });
        setNotes(fetchedNotes);

        // Populate coins
        const fetchedCoins = denominations.coins.map((d) => {
          const coin = data.initialCash.coins.find((c) => c.denomination === d);
          return { denomination: d, count: coin ? coin.count : 0 };
        });
        setCoins(fetchedCoins);
      } else {
        // reset counts if no data
        setNotes(denominations.notes.map((d) => ({ denomination: d, count: 0 })));
        setCoins(denominations.coins.map((d) => ({ denomination: d, count: 0 })));
        toast.info(data.message || "No data found for this date");
      }
    } catch (err) {
      toast.error("Failed to fetch data for the date");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await cashCount(date, notes, coins);
      if (res.success) toast.success(res.message);
      else toast.error(res.message || "Something went wrong");
    } catch (err) {
      toast.error("Failed to save/update initial cash");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const helper = (e) => e.target.blur()

  const renderRows = (type, list) =>
    list.map((item, index) => (
      <div
        key={item.denomination}
        className="flex items-center justify-between bg-gray-800 rounded-lg p-3"
      >
        <span className="font-medium text-gray-200">{item.denomination}₹</span>
        <input
          type="number"
          min="0"
          value={item.count}
          onWheel={helper}
          onChange={(e) => handleChange(type, index, e.target.value)}
          className="w-24 px-3 py-2 rounded-md text-center bg-gray-900 text-white border border-gray-600 focus:ring-2 focus:ring-purple-400 focus:outline-none"
        />
        <span className="text-sm font-semibold text-purple-400">
          {item.denomination * item.count}₹
        </span>
      </div>
    ));

  return (
    <div className="relative min-h-screen flex justify-center items-center px-4 bg-black overflow-hidden">
    {/* 🟣 FULL PAGE LOTTIE LOADER */}
    {loading && (
      <div className="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center backdrop-blur-sm">
        <Lottie animationData={gears} loop className="w-64 h-64" />
        <p className="text-purple-300 mt-4 text-xl font-semibold animate-pulse">
          Saving your data...
        </p>
      </div>
    )}

    <div className="w-full max-w-3xl bg-gray-900 shadow-xl rounded-2xl p-8 relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col items-center gap-4 mb-8">
        <div className="flex items-center gap-2">
          <Wallet size={28} className="text-purple-400 animate-float" />
          <h1 className="text-3xl text-white animate-pulse">
            Opening Balance
          </h1>
        </div>

        {/* Date Selector */}
        <div className="flex gap-3">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-4 py-2 rounded-md border border-purple-400 text-purple-300 bg-gray-800 focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
          <button
            onClick={fetchDateData}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md"
          >
            Search
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="font-semibold mb-3 text-lg text-purple-300">Notes</h2>
          <div className="space-y-3">{renderRows("notes", notes)}</div>
        </div>
        <div>
          <h2 className="font-semibold mb-3 text-lg text-purple-300">Coins</h2>
          <div className="space-y-3">{renderRows("coins", coins)}</div>
        </div>
      </div>

      {/* Sticky Total Bar */}
      <div className="sticky bottom-0 mt-10 bg-gray-800 text-white font-bold rounded-xl shadow-lg px-6 py-4 flex justify-between items-center">
        <span className="text-lg">Total</span>
        <span className="text-2xl">₹{total}</span>
      </div>

      {/* Buttons */}
      <div className="mt-8 space-y-4">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold flex justify-center items-center gap-2 transition-all hover:shadow-lg"
        >
          <PlusCircle size={20} />
          Save / Update Initial Cash
        </button>

        <button
          onClick={() => navigate("/cash-summary")}
          className="w-full py-3 rounded-xl border border-purple-400 text-purple-300 hover:bg-purple-600/20 font-semibold transition-all"
        >
          View Cash Summary
        </button>
      </div>

      <Notification />
    </div>
  </div>
  );
};

export default CashCounter;
