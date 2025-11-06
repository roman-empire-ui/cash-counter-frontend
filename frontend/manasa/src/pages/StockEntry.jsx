import React, { useEffect, useState, useRef } from 'react';
import {
  getStocks,
  stockEntry,
  deleteStock,
  updateStock,
  calRem,
  getRemAmt,
} from '../services/stockEntry';
import { toast } from 'react-toastify';
import Notification from '../Components/Notification';
import { Trash2, PlusCircle, FilePlus2, Pencil, Menu } from 'lucide-react';
import { createDistributor, searchDistributor } from '../services/distributor';
import MenuIcon from '../Components/MenuIcon';



const StockEntry = () => {
  const [date, setDate] = useState('');
  const [distributors, setDistributors] = useState([{ name: '', totalPaid: '' }]);
  const [suggestions, setSuggestions] = useState([])
  const [activeIndex, setActiveIndex] = useState(null)
  const [total, setTotal] = useState(0);
  const [stockList, setStockList] = useState([]);
  const [amountHave, setAmountHave] = useState('');
  const [remainingAmount, setRemainingAmount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paytm, setPaytm] = useState('')
  const [companies, setCompanies] = useState([{ name: '', amount: '' }])
  const [isSaved , setIsSaved] = useState(false)
  const summaryRef = useRef(null);


  useEffect(() => {

    fetchStocks();
  }, []);





  // On blur → auto-create if new distributor
  const handleBlur = async (index) => {
    const name = distributors[index].name.trim();
    if (!name) return;

    try {
      const res = await createDistributor(name);

      // ✅ Only show toast if it's a new one
      if (res.success && res.isNew) {
        toast.success("New distributor added!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error creating distributor");
    }

    setTimeout(() => {
      setSuggestions([]);
      setActiveIndex(null);
    }, 200);
  };

  const handleMouseDown = async (e, index) => {
    if (e.key === "Enter") {
      e.preventDefault(); // prevent form submit

      if (suggestions.length > 0) {
        // ✅ select first suggestion
        selectSuggestion(index, suggestions[0]);
      } else {
        // ✅ treat as new distributor if not empty
        await handleBlur(index);
      }
    }
  };

  // Handle typing in distributor input
  const handleDistributorChange = async (index, field, value) => {
    const updated = [...distributors];
    updated[index][field] = value;
    setDistributors(updated);

    if (field === "name" && value.trim() !== "") {
      const res = await searchDistributor(value);
      if (res.success) {
        setSuggestions(res.data);
        setActiveIndex(index);
      }
    } else {
      setSuggestions([]);
      setActiveIndex(null);
    }
  };


  const selectSuggestion = (index, suggestion) => {
    const updated = [...distributors];
    updated[index].name = suggestion;
    setDistributors(updated);
    setSuggestions([]);
    setActiveIndex(null);
  };

  const fetchStocks = async () => {
    setLoading(true);
    const res = await getStocks();
    if (res.success) {
      const todayEntry = res.data[0];
      if (todayEntry) {
        // Ensure distributors exist
        todayEntry.distributors = todayEntry.distributors || [];

        // Calculate total per day
        const dayTotal = todayEntry.distributors.reduce(
          (sum, d) => sum + Number(d.totalPaid || 0),
          0
        );
        todayEntry.totalStockExpenses = dayTotal;

        setStockList([todayEntry]);
        setTotal(dayTotal);

        const rem = await getRemAmt(todayEntry._id);
        if (rem.success && rem.data) {
          setRemainingAmount(rem.data.remainingAmount);
          setAmountHave(rem.data.amountHave);
        }
      } else {
        setStockList([]);
        setTotal(0);
      }
    } else {
      toast.error(res.message || 'Failed to load stock data');
    }
    setLoading(false);
  };




  const addDistributor = () => {
    setDistributors([...distributors, { name: '', totalPaid: '' }]);
  };

  const removeDistributor = (index) => {
    const updated = [...distributors];
    updated.splice(index, 1);
    setDistributors(updated);
    calculateTotalExpense(updated);
  };

  const calculateTotalExpense = (list) => {
    const total = list.reduce((sum, d) => sum + (Number(d.totalPaid) || 0), 0);
    setTotal(total);
  };

  const submitStockEntry = async () => {
    const valid = distributors.filter(d => d.name.trim() && d.totalPaid !== '');
    if (valid.length === 0) {
      toast.error('Add at least one valid supplier.');
      return;
    }

    const response = await stockEntry({ date, distributors: valid });
    if (response.success) {
      toast.success(response.message);
      await fetchStocks();
      setDate('');
      setDistributors([{ name: '', totalPaid: '' }]);
      setTotal(0);
      setTimeout(() => {
        summaryRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } else {
      toast.error(response.message || 'Error adding stock entry');
    }
  };




  const totalCompanies = companies.reduce((sum, c) => sum + Number(c.amount || 0), 0)
  const finalTotal = Number(remainingAmount || 0) + Number(paytm || 0) + totalCompanies



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-4 sm:p-6 md:p-8 font-serif">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-green-400 font-serif animate-bounce">
            Daily Stock Payments
          </h1>
          <span className="text-sm text-gray-400">
            Track suppliers & expenses with ease
          </span>
        </header>

        {/* Stock Form */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl shadow-lg p-4 sm:p-6 space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full mt-1 p-3 rounded-md bg-black/30 border border-gray-700 text-white font-mono text-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Total Expense
              </label>
              <input
                readOnly
                value={`₹${total}`}
                className="w-full mt-1 p-3 rounded-md bg-black/30 border border-gray-700 text-yellow-400 font-bold font-mono text-xl"
              />
            </div>
          </div>

          {distributors.map((d, i) => (
            <div
              key={i}
              className="relative grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
            >
              {/* Distributor Name Input */}
              <div className="col-span-5 relative">
                <input
                  type="text"
                  placeholder={`Supplier ${i + 1}`}
                  value={d.name}
                  onChange={(e) => handleDistributorChange(i, "name", e.target.value)}
                  onBlur={() => handleBlur(i)}   // ✅ ensures new distributor auto-saves
                  onMouseDown={(e) => handleMouseDown(i, e)}
                  className="w-full p-3 rounded-md bg-black/30 border border-gray-700 text-white"
                />

                {/* ✅ Suggestions Dropdown */}
                {activeIndex === i && suggestions.length > 0 && (
                  <ul className="absolute bg-gray-800 border border-gray-700 rounded-md mt-1 w-full z-10 max-h-40 overflow-y-auto">
                    {suggestions.map((s, idx) => (
                      <li
                        key={idx}
                        className="p-2 cursor-pointer hover:bg-gray-600"
                        onMouseDown={() => selectSuggestion(i, s)} // ✅ fills input when clicked
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Distributor Amount Input */}
              <input
                type="number"
                placeholder="Amount ₹"
                value={d.totalPaid}
                onChange={(e) => handleDistributorChange(i, "totalPaid", e.target.value)}
                className="col-span-5 p-3 rounded-md bg-black/30 border border-gray-700 text-white"
              />

              {/* Remove Distributor Button */}
              <button
                onClick={() => removeDistributor(i)}
                className="w-10 h-10 bg-gray-600 hover:bg-red-600 text-white rounded-full flex items-center justify-center"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}


          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <button
              onClick={addDistributor}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-full text-white cursor-pointer"
            >
              <PlusCircle className="w-5 h-5" />
              Add Supplier
            </button>
            <button
              onClick={submitStockEntry}
              className="flex items-center gap-2 px-6 py-3 bg-purple-700 hover:bg-purple-800 rounded-full text-white text-lg cursor-pointer"
            >
              <FilePlus2 className="w-6 h-6" />
              Submit Entry
            </button>
          </div>
        </div>

        {/* Stock Summary */}
        <div ref={summaryRef} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6">
          <h2 className="text-xl font-bold text-emerald-400 mb-4 animate-bounce">
            Stock Summary
          </h2>

          {loading ? (
            <div className="animate-pulse space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-700 rounded-md" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto font-inter">
              <table className="w-full text-sm md:text-base border-collapse text-white">
                <thead>
                  <tr className="bg-purple-800">
                    <th className="p-3 border border-gray-600">Date</th>
                    <th className="p-3 border border-gray-600">Suppliers</th>
                    <th className="p-3 border border-gray-600 text-right">
                      Amount (₹)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stockList.map((entry, index) => (
                    <React.Fragment key={index}>
                      {entry.distributors.map((d, i) => (
                        <tr
                          key={i}
                          className="odd:bg-white/5 even:bg-white/10 border-b border-gray-600"
                        >
                          {/* Show date only for first distributor row */}
                          {i === 0 ? (
                            <td
                              rowSpan={entry.distributors.length + 1}
                              className="p-3 border border-gray-600 align-top  text-xl text-center font-medium font-mono"
                            >
                              {entry.date?.split("T")[0]}
                            </td>
                          ) : null}

                          {/* Supplier Name */}
                          <td className="p-3 border-t border-b border-l border-gray-600">
                            <div className="flex justify-between items-center group">
                              <span>{d.name}</span>
                              <div className="hidden group-hover:flex gap-2">
                                <button
                                  onClick={async () => {
                                    const newName = prompt(
                                      "Edit name:",
                                      d.name
                                    );
                                    const newAmount = prompt(
                                      "Edit amount:",
                                      d.totalPaid
                                    );
                                    if (newName && newAmount !== null) {
                                      const res = await updateStock({
                                        stockId: entry._id,
                                        distributorId: d._id,
                                        name: newName,
                                        totalPaid: Number(newAmount),
                                      });
                                      if (res?.success) {
                                        toast.success("Updated!");
                                        const updatedList = stockList.map((s) =>
                                          s._id === entry._id
                                            ? res.stockEntry
                                            : s
                                        );
                                        setStockList(updatedList);
                                      } else toast.error("Update failed");
                                    }
                                  }}
                                  className="bg-blue-600 hover:bg-blue-800 w-9 h-9 rounded-full flex items-center justify-center"
                                >
                                  <Pencil className="w-6 h-6" />
                                </button>
                                <button
                                  onClick={async () => {
                                    if (confirm("Are you sure to delete?")) {
                                      const res = await deleteStock({
                                        stockId: entry._id,
                                        distributorId: d._id,
                                      });
                                      if (res?.success) {
                                        toast.success("Deleted!");
                                        const updatedList = [...stockList];
                                        updatedList[index] = res.stockEntry;
                                        setStockList(updatedList);
                                      } else {
                                        toast.error("Delete failed");
                                      }
                                    }
                                  }}
                                  className="bg-red-600 hover:bg-red-800 w-9 h-9 rounded-full flex items-center justify-center"
                                >
                                  <Trash2 className="w-6 h-6" />
                                </button>
                              </div>
                            </div>
                          </td>

                          {/* Amount */}
                          <td className="p-3 border-t border-b border-r text-xl border-gray-600 text-right font-mono">
                            ₹{d.totalPaid}
                          </td>
                        </tr>
                      ))}

                      {/* Total row per day */}
                      <tr className="bg-black/30">
                        <td className="p-3 border-t border-l border-b border-gray-600 font-semibold text-yellow-300">
                          Total
                        </td>
                        <td className="p-3 border-t border-r border-b border-gray-600 text-right font-semibold text-yellow-300 font-mono">
                          ₹{entry.totalStockExpenses}
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Remaining Amount */}
          {/* Daily Balance Section */}
          {/* Daily Balance Section */}
          {stockList.length > 0 && (
            <div className="bg-white/10 mt-6 rounded-xl p-6 space-y-6">
              <MenuIcon />
              <h3 className="text-lg font-bold text-cyan-400 animate-bounce">
                💰 Daily Balance & Sources
              </h3>

              {/* Extra Sources */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-purple-400">
                  ➕ Add Extra Sources
                </h3>

                {/* Paytm */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    type="number"
                    placeholder="Paytm ₹"
                    value={paytm}
                    onChange={(e) => setPaytm(e.target.value)}
                    className="p-3 rounded-md bg-black/30 border border-gray-700 text-white font-mono"
                  />
                </div>

                {/* Companies */}
                {companies.map((c, i) => (
                  <div key={i} className="grid grid-cols-12 gap-3 items-center">
                    <input
                      type="text"
                      placeholder="Company Name"
                      value={c.name}
                      onChange={(e) => {
                        const updated = [...companies];
                        updated[i].name = e.target.value;
                        setCompanies(updated);
                        setIsSaved(false)
                      }}
                      className="col-span-6 p-3 rounded-md bg-black/30 border border-gray-700 text-white"
                    />
                    <input
                      type="number"
                      placeholder="Amount ₹"
                      value={c.amount}
                      onChange={(e) => {
                        const updated = [...companies];
                        updated[i].amount = e.target.value;
                        setCompanies(updated);
                      }}
                      className="col-span-5 p-3 rounded-md bg-black/30 border border-gray-700 text-white font-mono"
                    />
                    <button
                      onClick={() => {
                        const updated = [...companies];
                        updated.splice(i, 1);
                        setCompanies(updated);
                        setIsSaved(false)
                      }}
                      className="w-8 h-8 bg-gray-600 hover:bg-red-600 rounded-full text-white flex items-center justify-center"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => setCompanies([...companies, { name: "", amount: "" }])}
                  className="px-4 py-2 bg-green-600 rounded-full text-white"
                >
                  + Add Company
                </button>
              </div>

              {/* Remaining Amount */}
              <div className="space-y-4">
                <h3 className="text-lg text-emerald-400 animate-bounce">
                  Remaining Amount
                </h3>

                <div className="grid sm:grid-cols-3 gap-4">
                  <input
                    type="number"
                    placeholder="Cash you have"
                    value={amountHave}
                    onChange={(e) => setAmountHave(e.target.value)}
                    className="p-3 rounded-md bg-black/30 border border-gray-700 text-2xl text-white font-mono"
                  />
                  <input
                    readOnly
                    value={`₹${stockList[0]?.totalStockExpenses || 0}`}
                    className="p-3 rounded-md bg-black/30 border text-2xl border-gray-700 text-yellow-400 font-mono"
                  />
                </div>

                {remainingAmount !== null && (
                  <div className="text-green-400 text-2xl font-mono">
                    Remaining: ₹{remainingAmount}
                  </div>
                )}
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                disabled={isSaved}
                  onClick={async () => {
                    const stockEntryData = stockList[0];
                    if (!stockEntryData) return toast.error("No stock entry found!");

                    const amount = Number(amountHave);
                    if (isNaN(amount)) return toast.error("Enter valid cash amount");

                    const expense = stockEntryData.totalStockExpenses || 0;
                    const rem = amount - expense;
                    setRemainingAmount(rem);

                    const payload = {
                      date: stockEntryData.date,
                      amountHave: amount,
                      stockEntryId: stockEntryData._id,
                      extraSources: {
                        paytm: Number(paytm) || 0,
                        company: companies.map(c => ({
                          name: c.name,
                          amount: Number(c.amount) || 0,
                        })),
                      },
                    };

                    const res = await calRem(payload);
                    if (res.success) {
                      toast.success( res.message || "Daily balance saved successfully!");
                      setIsSaved(true)
                    } else {
                      toast.error(res.message || "Failed to save daily balance");
                    }
                  }}
                  className={`px-6 py-3 rounded-full text-lg flex items-center gap-2 transition-all duration-200 ${
                    isSaved
                      ? "bg-blue-600 opacity-50 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}                >
                  💾 Save Daily Balance
                </button>
              </div>

              {/* Final Total */}
              <hr className="border-gray-600 my-4" />
              <div className="text-2xl text-yellow-300 font-mono">
                Final Total: ₹{finalTotal}
              </div>
            </div>
          )}


        </div>

        <Notification />
      </div>
    </div>
  );
};

export default StockEntry;
