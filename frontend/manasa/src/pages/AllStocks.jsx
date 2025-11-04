import React, { useEffect, useState } from "react";
import { deleteStock, getStocks, updateStock } from "../services/stockEntry";
import { toast } from "react-toastify";
import { Pencil, Trash2 } from "lucide-react";
import Lottie from "lottie-react";
import loader from '../assets/loader.json'

const AllStocks = () => {
  const [allStocks, setAllStocks] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedStock, setSelectedStock] = useState(null);

  // Editing state
  const [editingDistributor, setEditingDistributor] = useState(null);
  const [editValues, setEditValues] = useState({ name: "", totalPaid: "" });
  const [isLoading , setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStocks = async () => {
      setIsLoading(true)
      const res = await getStocks();
      console.log('res' , res)
      if (res.success) {
        setAllStocks(res.data);
        setFilteredStocks(res.data);
      } else {
        toast.error(res.message || "Failed to load stocks");
      }
      setIsLoading(false)
    };

    fetchStocks();
  }, []);

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredStocks(allStocks);
    } else {
      const filtered = allStocks.filter((stock) =>
        stock.distributors.some((d) =>
          d.name.toLowerCase().includes(search.toLowerCase())
        )
      );
      setFilteredStocks(filtered);
    }
  }, [search, allStocks]);

  // Save updated distributor
  const handleSaveEdit = async (stockId, distributorId) => {
    const res = await updateStock({
      stockId,
      distributorId,
      name: editValues.name,
      totalPaid: editValues.totalPaid,
    });

    if (res.success) {
      toast.success("Distributor updated successfully");

      const updatedStocks = allStocks.map((stock) => {
        if (stock._id === stockId) {
          const updatedDistributors = stock.distributors.map((d) =>
            d._id === distributorId ? { ...d, ...editValues } : d
          );
          const updatedTotal = updatedDistributors.reduce(
            (sum, d) => sum + Number(d.totalPaid || 0),
            0
          );
          return {
            ...stock,
            distributors: updatedDistributors,
            totalStockExpenses: updatedTotal,
          };
        }
        return stock;
      });

      setAllStocks(updatedStocks);
      setFilteredStocks(updatedStocks);

      if (selectedStock?._id === stockId) {
        const updatedDistributors = selectedStock.distributors.map((d) =>
          d._id === distributorId ? { ...d, ...editValues } : d
        );
        const updatedTotal = updatedDistributors.reduce(
          (sum, d) => sum + Number(d.totalPaid || 0),
          0
        );
        setSelectedStock((prev) => ({
          ...prev,
          distributors: updatedDistributors,
          totalStockExpenses: updatedTotal,
        }));
      }

      setEditingDistributor(null);
    } else {
      toast.error(res.message || "Update failed");
    }
  };


  const hanDeleteDistributor = async (stockId, distributorId) => {
    // Ask for confirmation
    const confirmDelete = window.confirm("Are you sure you want to delete this distributor?");
    if (!confirmDelete) return;

    try {
      const res = await deleteStock({ stockId, distributorId }); // call your backend

      if (res.success) {
        toast.success(res.message || "Deleted successfully");

        // Update frontend state immediately
        const updatedStocks = allStocks
          .map((stock) => {
            if (stock._id === stockId) {
              // If only one distributor, remove the entire stock entry
              if (stock.distributors.length === 1) {
                return null;
              }

              // Otherwise, remove only the selected distributor
              const updatedDistributors = stock.distributors.filter(
                (d) => d._id !== distributorId
              );

              const updatedTotal = updatedDistributors.reduce(
                (sum, d) => sum + Number(d.totalPaid || 0),
                0
              );

              return {
                ...stock,
                distributors: updatedDistributors,
                totalStockExpenses: updatedTotal,
              };
            }
            return stock;
          })
          .filter(Boolean); // remove null (for deleted cards)

        setAllStocks(updatedStocks);
        setFilteredStocks(updatedStocks);

        // If modal is open, update or close it
        if (selectedStock?._id === stockId) {
          const stock = allStocks.find((s) => s._id === stockId);

          if (stock.distributors.length === 1) {
            // close modal if card deleted
            setSelectedStock(null);
          } else {
            const updatedDistributors = stock.distributors.filter(
              (d) => d._id !== distributorId
            );
            const updatedTotal = updatedDistributors.reduce(
              (sum, d) => sum + Number(d.totalPaid || 0),
              0
            );
            setSelectedStock((prev) => ({
              ...prev,
              distributors: updatedDistributors,
              totalStockExpenses: updatedTotal,
            }));
          }
        }
      } else {
        toast.error(res.message || "Delete failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while deleting");
    }
  }; 

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <Lottie animationData={loader} loop={true} className="w-50 h-50" />
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen font-inter bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      {/* Title */}
      <h1 className="text-4xl animate-pulse font-serif font-bold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 tracking-wide">
        Stock History
      </h1>

      {/* Search Bar */}
      <div className="max-w-lg mx-auto mb-10">
        <input
          type="text"
          placeholder="Search distributor..."
          className="w-full p-4 rounded-full bg-white/10 text-white placeholder-gray-400 
                     border border-white/20 shadow-md
                     focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Stock Cards */}
      {filteredStocks.length === 0 ? (
        <p className="text-center text-gray-400">No matching records found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filteredStocks.map((entry, i) => (
            <div
              key={i}
              onClick={() => setSelectedStock(entry)}
              className="cursor-pointer p-6 rounded-3xl
                       bg-white/10 backdrop-blur-lg
                       border border-white/20 shadow-lg
                       hover:shadow-cyan-400/40 hover:scale-[1.04]
                       transition-all duration-300 ease-in-out"
            >
              <h2 className="text-2xltext-cyan-300 mb-3">
                {entry.date?.split("T")[0]}
              </h2>
              <p className="text-gray-200 text-base">
                <span className="font-semibold">Distributors:</span>{" "}
                {entry.distributors.map((d) => d.name).join(", ")}
              </p>
              <p className="text-gray-200 text-base mt-1">
                <span className="font-semibold">Amounts:</span>{" "}
                {entry.distributors.map((d) => `₹${d.totalPaid}`).join(", ")}
              </p>
              <p className="text-green-400 mt-4 text-xl drop-shadow">
                Total: ₹{entry.totalStockExpenses}
              </p>
            </div>

          ))}
        </div>
      )}

      {/* Modal */}
      {selectedStock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Dark Overlay */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => {
              setSelectedStock(null);
              setEditingDistributor(null);
            }}
          />

          {/* Modal Content */}
          <div
            className="relative w-full max-w-2xl mx-4 
                       bg-gradient-to-br from-gray-900 to-gray-800 
                       rounded-3xl shadow-2xl border border-purple-500/40
                       p-8 animate-fadeIn"
          >
            {/* Close Button */}
            <button
              onClick={() => {
                setSelectedStock(null);
                setEditingDistributor(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white 
                         transition-colors text-2xl"
            >
              ✕
            </button>

            {/* Header */}
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-6">
              📦 Stock Details
            </h2>

            {/* Stock Info */}
            <p className="text-gray-300 mb-6 text-lg font-mono">
              <span className="font-semibold">Date:</span>{" "}
              {selectedStock.date?.split("T")[0]}
            </p>

            {/* Distributor List */}
            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 scroll-thin-black custom-scroll">
              {selectedStock.distributors.map((d) => (
                <div
                  key={d._id}
                  className="p-4 rounded-xl 
                             bg-gradient-to-r from-cyan-700/30 to-purple-500/20
                             border border-purple-400/30 shadow-lg 
                             hover:shadow-purple-400/50 hover:scale-[1]
                             transition-all font-mono"
                >
                  {editingDistributor === d._id ? (
                    <>
                      <input
                        type="text"
                        value={editValues.name}
                        onChange={(e) =>
                          setEditValues({
                            ...editValues,
                            name: e.target.value,
                          })
                        }
                        className="w-full p-3 mb-3 rounded-xl bg-gray-800 text-white focus:ring-2 focus:ring-purple-500"
                      />
                      <input
                        type="number"
                        value={editValues.totalPaid}
                        onChange={(e) =>
                          setEditValues({
                            ...editValues,
                            totalPaid: e.target.value,
                          })
                        }
                        className="w-full p-3 mb-3 rounded-xl bg-gray-800 text-white focus:ring-2 focus:ring-purple-500"
                      />
                      <div className="flex gap-3">
                        <button
                          onClick={() =>
                            handleSaveEdit(selectedStock._id, d._id)
                          }
                          className="flex-1 py-2 bg-green-600 rounded-xl hover:bg-green-700 transition font-serif"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingDistributor(null)}
                          className="flex-1 py-2 bg-gray-600 rounded-xl hover:bg-gray-700 transition font-serif"
                        >
                           Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-2xl  text-green-400">
                        {d.name}
                      </p>
                      <p className="mt-1 text-2xl text-red-400">
                        <span className="font-medium">Paid:</span> ₹{d.totalPaid}
                      </p>
                      <button
                        onClick={() => {
                          setEditingDistributor(d._id);
                          setEditValues({
                            name: d.name,
                            totalPaid: d.totalPaid,
                          });
                        }}
                        className="mt-3 px-3 py-1 bg-green-600 rounded-full hover:bg-blue-700 transition"
                      >
                        <Pencil size={20} />
                      </button>

                      <button
                        onClick={() => hanDeleteDistributor(selectedStock._id, d._id)}
                        className="mt-3 px-3 ml-4 py-1 bg-blue-600 rounded-full hover:bg-red-500"
                      >
                        <Trash2 size={20} />
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Footer */}

            
            <div className="mt-6 border-t border-purple-500/30 pt-4 text-right">
              <p className="text-2xl font-bold text-pink-400 font-mono">
                Total Expense: ₹{selectedStock.totalStockExpenses}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllStocks;
