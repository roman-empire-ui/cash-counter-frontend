import React, { useState, useEffect } from "react";
import { PlusCircle, Wallet, CalendarSearch } from "lucide-react";
import { toast } from "react-toastify";
import Notification from "../Components/Notification";
import { cashCount, getInitialCount } from "../services/cashCounter";
import { useNavigate, useLocation } from "react-router-dom";
import Lottie from "lottie-react";
import { motion } from "framer-motion";
import gears from "../assets/gears.json";

const denominations = {
  notes: [500, 200, 100, 50, 20, 10],
  coins: [5,2,1],
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
  const location = useLocation();

  useEffect(() => {
    const savedData = localStorage.getItem("cashCounterData");
    if (savedData) {
      try {
        const { notes: savedNotes, coins: savedCoins, date: savedDate } =
          JSON.parse(savedData);

        const hasSavedCounts = [...savedNotes, ...savedCoins].some(
          (item) => item.count > 0
        );

        if (hasSavedCounts) {
          setNotes(savedNotes);
          setCoins(savedCoins);
          setDate(savedDate);
          console.log("✅ Restored from localStorage:", {
            savedNotes,
            savedCoins,
            savedDate,
          });
        }
      } catch (err) {
        console.error("Failed to parse saved cashCounterData", err);
      }
    }
  }, [location.pathname]);

  useEffect(() => {
    const data = { notes, coins, date };
    localStorage.setItem("cashCounterData", JSON.stringify(data));
  }, [notes, coins, date]);

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

  const fetchDateData = async () => {
    setLoading(true);
    try {
      const data = await getInitialCount(date);
      if (data.success && data.initialCash) {
        const fetchedNotes = denominations.notes.map((d) => {
          const note = data.initialCash.notes.find((n) => n.denomination === d);
          return { denomination: d, count: note ? note.count : 0 };
        });
        const fetchedCoins = denominations.coins.map((d) => {
          const coin = data.initialCash.coins.find((c) => c.denomination === d);
          return { denomination: d, count: coin ? coin.count : 0 };
        });
        setNotes(fetchedNotes);
        setCoins(fetchedCoins);
      } else {
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
      if (res.success) {
        toast.success(res.message);
        localStorage.removeItem("cashCounterData");
        setNotes(denominations.notes.map((d) => ({ denomination: d, count: 0 })));
        setCoins(denominations.coins.map((d) => ({ denomination: d, count: 0 })));
      } else {
        toast.error(res.message || "Something went wrong");
      }
    } catch (err) {
      toast.error("Failed to save/update initial cash");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const helper = (e) => e.target.blur();

  const renderRows = (type, list) =>
    list.map((item, index) => (
      <motion.div
        key={item.denomination}
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="flex items-center justify-between bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-3 shadow-md border border-gray-700 hover:border-purple-500"
      >
        <span className="font-semibold text-purple-300 text-lg">
          ₹{item.denomination}
        </span>
        <input
          type="number"
          min="0"
          value={item.count}
          onWheel={helper}
          onChange={(e) => handleChange(type, index, e.target.value)}
          className="w-28 px-3 py-2 rounded-lg text-center text-white 
            bg-gray-950/70 backdrop-blur-sm border border-gray-600 
            focus:ring-2 focus:ring-purple-400 focus:border-purple-500 
            outline-none shadow-inner hover:shadow-purple-500/20 transition-all"
        />
        <span className="text-sm font-bold text-purple-400">
          ₹{item.denomination * item.count}
        </span>
      </motion.div>
    ));

  return (
    <div className="relative min-h-screen flex justify-center items-center px-4 bg-gradient-to-br from-gray-950 via-black to-gray-900 overflow-hidden">
      {/* Loader */}
      {loading && (
        <div className="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center backdrop-blur-md">
          <Lottie animationData={gears} loop className="w-64 h-64" />
          <p className="text-purple-300 mt-4 text-xl font-semibold animate-pulse">
            Processing...
          </p>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-3xl bg-gray-900/90 shadow-2xl rounded-3xl p-8 border border-gray-800 backdrop-blur-lg"
      >
        {/* Header */}
        <div className="flex flex-col items-center gap-5 mb-10">
          <motion.div
            initial={{ y: -10 }}
            animate={{ y: 0 }}
            className="flex items-center gap-3"
          >
            <Wallet size={32} className="text-purple-400 animate-float" />
            <h1 className="text-3xl text-white font-bold tracking-wide">
              Opening Balance
            </h1>
          </motion.div>

          <div className="flex gap-3">
            <div className="flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-2 border border-gray-700 focus-within:border-purple-500 transition">
              <CalendarSearch className="text-purple-400" size={18} />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-transparent text-purple-300 focus:outline-none"
              />
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={fetchDateData}
              className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium shadow-lg transition-all"
            >
              Search
            </motion.button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="font-semibold mb-3 text-lg text-purple-300 border-b border-purple-500/30 pb-1">
              Notes
            </h2>
            <div className="space-y-3">{renderRows("notes", notes)}</div>
          </div>
          <div>
            <h2 className="font-semibold mb-3 text-lg text-purple-300 border-b border-purple-500/30 pb-1">
              Coins
            </h2>
            <div className="space-y-3">{renderRows("coins", coins)}</div>
          </div>
        </div>

        {/* Total */}
        <motion.div
          layout
          className="sticky bottom-0 mt-10 bg-gray-800/90 border border-purple-700/40 text-white font-bold rounded-2xl px-6 py-4 flex justify-between items-center shadow-lg backdrop-blur-lg"
        >
          <span className="text-lg">Total</span>
          <motion.span
            key={total}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="text-2xl text-purple-400"
          >
            ₹{total}
          </motion.span>
        </motion.div>

        {/* Buttons */}
        <div className="mt-8 space-y-4">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 text-white font-semibold flex justify-center items-center gap-2 transition-all"
          >
            <PlusCircle size={20} />
            Save / Update opening balance
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate('/cash-summary')}
            className="w-full py-3 rounded-xl border border-purple-400 text-purple-300 hover:bg-purple-600/20 font-semibold transition-all"
          >
            View Cash Summary
          </motion.button>
        </div>

        <Notification />
      </motion.div>
    </div>
  );
};

export default CashCounter;
