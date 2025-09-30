// src/components/RemainingCash.jsx
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Loader2, Search, RefreshCw, PlusCircle, Trash2 } from "lucide-react";
import { saveRemCash, getRemCash } from "../services/actualCash";
import Notification from "../Components/Notification";

// Default denominations
const defaultNotes = [500, 200, 100, 50, 20, 10].map((denom) => ({
  denomination: denom,
  count: 0,
}));
const defaultCoins = [10, 5, 2, 1].map((denom) => ({
  denomination: denom,
  count: 0,
}));

const RemainingCash = () => {
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState(defaultNotes);
  const [coins, setCoins] = useState(defaultCoins);
  const [remarks, setRemarks] = useState("");
  const [paytm, setPaytm] = useState(0);
  const [card, setCard] = useState(0);
  const [additional, setAdditional] = useState(0);
  const [openingBalance, setOpeningBalance] = useState(0);

  // calculated fields
  const [cash, setCash] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);

  const [loading, setLoading] = useState(false);

  // Companies and extra fields (match backend name paidAmount)
  const [companies, setCompanies] = useState([{ name: "", paidAmount: 0 }]);
  const [posibleOfflineAmount, setPosibleOfflineAmount] = useState(0);
  const [posibleOnlineAmount , setPosibleOnlineAmount] = useState(0)
  const [otherPayments, setOtherPayments] = useState(0);

  // merge notes/coins from backend into defaults
  const mergeWithDefaults = (saved = [], defaults = []) =>
    defaults.map((d) => {
      const found = saved.find((s) => s.denomination === d.denomination);
      return found ? { ...d, count: Number(found.count) || 0 } : d;
    });

  // map backend companies -> frontend shape
  const mapCompaniesFromBackend = (backendCompanies = []) =>
    (backendCompanies || []).map((c) => ({
      name: c.name || "",
      paidAmount: Number(c.paidAmount ?? c.paid ?? c.amount ?? 0),
    }));

  useEffect(() => {
    fetchLatest();
  }, []);

  // recalc totals live whenever city of inputs change
  useEffect(() => {
    const totalNotes = notes.reduce(
      (s, n) => s + Number(n.denomination) * (Number(n.count) || 0),
      0
    );
    const totalCoins = coins.reduce(
      (s, c) => s + Number(c.denomination) * (Number(c.count) || 0),
      0
    );
    const totalCash = totalNotes + totalCoins;
    const companyPaidTotal = companies.reduce(
      (s, c) => s + (Number(c.paidAmount) || 0),
      0
    );

    // same formula as backend: totalCash + digital + additional - openingBalance - companyPaidTotal
    const totalRemaining =
      totalCash +
      companyPaidTotal +
      (Number(paytm) || 0) +
      (Number(card) || 0) +
      (Number(additional) || 0) -
      (Number(openingBalance) || 0)


    setCash(totalCash);
    setFinalTotal(totalRemaining);
    // (difference / profit/loss derived in render)
  }, [notes, coins, paytm, card, additional, openingBalance, companies]);

  const fetchLatest = async () => {
    try {
      setLoading(true);
      const result = await getRemCash();
      // getRemCash returns either array (all entries) or { message, data } for date fetch
      if (Array.isArray(result) && result.length > 0) {
        const latest = result[0];
        populateFromBackend(latest);
      }
    } catch (err) {
      toast.error(err.message || "Failed to load latest remaining cash");
    } finally {
      setLoading(false);
    }
  };

  const populateFromBackend = (data) => {
    setDate(new Date(data.date).toISOString().split("T")[0]);
    setNotes(mergeWithDefaults(data.notes || [], defaultNotes));
    setCoins(mergeWithDefaults(data.coins || [], defaultCoins));
    setRemarks(data.remarks || "");
    setPaytm(Number(data.paytm) || 0);
    setCard(Number(data.card) || 0);
    setAdditional(Number(data.additional) || 0);
    setOpeningBalance(Number(data.openingBalance) || 0);
    setCompanies(mapCompaniesFromBackend(data.companies || []));
    setPosibleOfflineAmount(Number(data.posibleOfflineAmount) || 0);
    setPosibleOnlineAmount(Number(data.posibleOnlineAmount) || 0)
    setOtherPayments(Number(data.otherPayments) || 0);
    // cash & finalTotal will be recalculated by effect (but set for initial)
    setCash(Number(data.cash) || 0);
    setFinalTotal(Number(data.totalRemainingCash) || 0);
  };

  const handleSearch = async () => {
    if (!date) return;
    try {
      setLoading(true);
      const result = await getRemCash(date);
      if (result?.data) {
        populateFromBackend(result.data);
      } else {
        toast.info(result?.message || "No record found for this date");
        setCompanies([{ name: "", paidAmount: 0 }]);
      }
    } catch (err) {
      toast.error(err.message || "Error searching remaining cash");
    } finally {
      setLoading(false);
    }
  };

  const handleCountChange = (type, index, value) => {
    const updated = [...(type === "notes" ? notes : coins)];
    updated[index].count = parseInt(value, 10) || 0;
    type === "notes" ? setNotes(updated) : setCoins(updated);
  };

  // Companies helpers
  const addCompany = () => setCompanies([...companies, { name: "", paidAmount: 0 }]);
  const updateCompany = (index, field, value) => {
    const updated = [...companies];
    updated[index][field] = field === "paidAmount" ? (value === "" ? 0 : Number(value)) : value;
    setCompanies(updated);
  };
  const removeCompany = (index) => {
    const updated = [...companies];
    updated.splice(index, 1);
    setCompanies(updated);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        date,
        notes,
        coins,
        remarks,
        paytm: Number(paytm) || 0,
        card: Number(card) || 0,
        additional: Number(additional) || 0,
        openingBalance: Number(openingBalance) || 0,
        companies: companies.map((c) => ({
          name: c.name,
          paidAmount: Number(c.paidAmount) || 0,
        })),
        posibleOfflineAmount: Number(posibleOfflineAmount) || 0,
        posibleOnlineAmount : Number(posibleOnlineAmount) || 0 ,
        otherPayments: Number(otherPayments) || 0,
      };

      // debug: you can uncomment to see payload in console
      // console.log("PAYLOAD ->", payload);

      const res = await saveRemCash(payload);
      if (res?.success) {
        toast.success(res.message || "Saved successfully");
        // reset after success
        setNotes(defaultNotes);
        setCoins(defaultCoins);
        setRemarks("");
        setPaytm(0);
        setCard(0);
        setAdditional(0);
        setOpeningBalance(0);
        setCash(0);
        setFinalTotal(0);
        setCompanies([{ name: "", paidAmount: 0 }]);
        setPosibleOfflineAmount(0);
        setPosibleOnlineAmount(0)
        setOtherPayments(0);
      } else {
        toast.error(res?.message || "Error saving remaining cash");
      }
    } catch (err) {
      toast.error(err.message || "Error saving remaining cash");
    } finally {
      setLoading(false);
    }
  };

  // derived values for display
  const companyPaidTotal = companies.reduce((s, c) => s + (Number(c.paidAmount) || 0), 0);
  const difference = Number(posibleOfflineAmount || 0) - Number(finalTotal || 0);
  const overAllSale = Number(posibleOfflineAmount || 0) + Number(posibleOnlineAmount)
  const cashTotal = Number(cash || 0) + Number(companyPaidTotal || 0)
 
  return (
    <div className="h-screen w-full bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white flex flex-col">
      <header className="p-4 border-b border-white/20 text-center">
        <h2 className="text-2xl font-bold">Remaining Cash (Taken Home)</h2>
      </header>

      <main className="flex-1 overflow-y-auto scroll-thin-black px-6 py-4 space-y-6">
        <div className="flex gap-2">
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg bg-white/20 text-white outline-none border border-white/30 focus:ring-2 focus:ring-blue-400" />
          <button onClick={handleSearch} className="flex items-center gap-1 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white shadow">
            <Search size={18} /> Search
          </button>
          <button onClick={fetchLatest} className="flex items-center gap-1 px-4 py-2 rounded-lg bg-gray-500 hover:bg-gray-600 text-white shadow">
            <RefreshCw size={18} /> Latest
          </button>
        </div>

        {/* Notes */}
        <div>
          <h3 className="text-lg font-semibold text-indigo-200 mb-3">Notes</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {notes.map((note, idx) => (
              <div key={note.denomination} className="flex flex-col bg-white/10 rounded-lg p-3 items-center text-white">
                <span className="font-medium mb-2">₹{note.denomination}</span>
                <input type="number" value={note.count} onChange={(e) => handleCountChange("notes", idx, e.target.value)}
                  className="w-20 px-2 py-1 rounded bg-white/20 text-white outline-none border border-white/30 text-center" />
              </div>
            ))}
          </div>
        </div>

        {/* Coins */}
        <div>
          <h3 className="text-lg font-semibold text-indigo-200 mb-3">Coins</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {coins.map((coin, idx) => (
              <div key={coin.denomination} className="flex flex-col bg-white/10 rounded-lg p-3 items-center text-white">
                <span className="font-medium mb-2">₹{coin.denomination}</span>
                <input type="number" value={coin.count} onChange={(e) => handleCountChange("coins", idx, e.target.value)}
                  className="w-20 px-2 py-1 rounded bg-white/20 text-white outline-none border border-white/30 text-center" />
              </div>
            ))}
          </div>
        </div>

        {/* Companies */}
        <div>
          <h3 className="text-lg font-semibold text-indigo-200 mb-3">Companies Paid</h3>
          {companies.map((c, idx) => (
            <div key={idx} className="flex gap-3 mb-2 items-center">
              <input type="text" placeholder="Company Name" value={c.name} onChange={(e) => updateCompany(idx, "name", e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-white/20 text-white outline-none border border-white/30" />
              <input type="number" placeholder="Paid" value={c.paidAmount} onChange={(e) => updateCompany(idx, "paidAmount", e.target.value)}
                className="w-32 px-3 py-2 rounded-lg bg-white/20 text-white outline-none border border-white/30" />
              <button onClick={() => removeCompany(idx)} className="text-red-400 hover:text-red-600">
                <Trash2 size={20} />
              </button>
            </div>
          ))}
          <button onClick={addCompany} className="flex items-center gap-2 text-blue-400 hover:text-blue-600 mt-2">
            <PlusCircle size={18} /> Add Company
          </button>
        </div>

        {/* Extra Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-indigo-200 mb-1">Paytm</label>
            <input type="number" value={paytm} onChange={(e) => setPaytm(Number(e.target.value) || 0)}
              className="w-40 px-3 py-2 rounded-lg bg-white/20 text-white outline-none border border-white/30 focus:ring-2 focus:ring-blue-400 text-lg" />
          </div>
          <div>
            <label className="block text-sm text-indigo-200 mb-1">Card</label>
            <input type="number" value={card} onChange={(e) => setCard(Number(e.target.value) || 0)}
              className="w-40 px-3 py-2 rounded-lg bg-white/20 text-white outline-none border border-white/30 focus:ring-2 focus:ring-blue-400 text-lg" />
          </div>
          <div>
            <label className="block text-sm text-indigo-200 mb-1">Additional</label>
            <input type="number" value={additional} onChange={(e) => setAdditional(Number(e.target.value) || 0)}
              className="w-40 px-3 py-2 rounded-lg bg-white/20 text-white outline-none border border-white/30 focus:ring-2 focus:ring-blue-400 text-lg" />
          </div>
          <div>
            <label className="block text-sm text-indigo-200 mb-1">Opening Balance</label>
            <input type="number" value={openingBalance} onChange={(e) => setOpeningBalance(Number(e.target.value) || 0)}
              className="w-40 px-3 py-2 rounded-lg bg-white/20 text-white outline-none border border-white/30 focus:ring-2 focus:ring-blue-400 text-lg" />
          </div>
        </div>

        {/* Actual vs Final Total */}
        <div>
          <label className="block text-sm text-indigo-200 mb-1">Possible Offline Amount</label>
          <input type="number" value={posibleOfflineAmount} onChange={(e) => setPosibleOfflineAmount(Number(e.target.value) || 0)}
            className="w-60 px-3 py-2 rounded-lg bg-white/20 text-white outline-none border border-white/30" />
        </div>

        <div>
          <label className="block text-sm text-indigo-200 mb-1">Possible Online Amount</label>
          <input type="number" value={posibleOnlineAmount} onChange={(e) => setPosibleOnlineAmount(Number(e.target.value) || 0)}
            className="w-60 px-3 py-2 rounded-lg bg-white/20 text-white outline-none border border-white/30" />
        </div>

        <div>
          <label className="block text-sm text-indigo-200 mb-1">Other Payments</label>
          <input type="number" value={otherPayments} onChange={(e) => setOtherPayments(Number(e.target.value) || 0)}
            className="w-60 px-3 py-2 rounded-lg bg-white/20 text-white outline-none border border-white/30" />
        </div>

        {/* Remarks */}
        <div>
          <label className="block text-sm text-indigo-200 mb-2 font-poppins">Remarks</label>
          <textarea value={remarks} onChange={(e) => setRemarks(e.target.value)}
            className="w-full p-3 rounded bg-white/20 text-white outline-none border border-white/30 focus:ring-2 focus:ring-indigo-400"
            rows={3} />
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 border-t border-white/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="space-y-1">
          <div className="text-yellow-400 text-lg  font-mono">Cash Total: ₹{cash}</div>
          <div className="text-blue-400 text-lg  font-mono">Company Paid: ₹{companyPaidTotal}</div>
          <div className="text-red-300 text-lg  font-mono">Extra Expenditures: ₹{cashTotal}</div>

          <div className="text-green-400 text-xl  font-mono">Final Total: ₹{finalTotal}</div>
          <div className="text-green-300 text-xl  font-mono">Overall Sales: ₹{overAllSale}</div>
          <div className="text-blue-400 text-lg  font-mono">Difference: ₹{difference}</div>
          <div className={`text-xl font-bold font-mono ${difference <= 0 ? "text-green-400" : "text-red-400"}`}>
            Profit/Loss: ₹{difference}
            {finalTotal === posibleOfflineAmount
              ? "No loss 😐"
              : finalTotal < posibleOfflineAmount
                ? "Loss 😔"
                : "Profit 🎉"}
          </div>
        </div>

        <button onClick={handleSubmit} disabled={loading}
          className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 transition text-white rounded-full shadow-lg flex items-center gap-2 font-serif animate-glow">
          {loading && <Loader2 className="animate-spin" size={18} />}
          {loading ? "Saving..." : "Save Entry"}
        </button>
      </footer>

      <Notification/>
    </div>
  );
};

export default RemainingCash;
