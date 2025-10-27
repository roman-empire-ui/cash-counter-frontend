import React from "react";
import { useNavigate } from "react-router-dom";
import MonthlyProfitLoss from "../Components/Monthlypl";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex justify-center items-center bg-gray-950 px-3 py-6"
      style={{
        backgroundImage: "url(/images/bg.jpg)",
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="w-full max-w-2xl bg-gray-900/70 backdrop-blur-md border border-purple-600/40 rounded-2xl shadow-lg p-6 text-white">
        {/* Header */}
        <h1 className="text-3xl font-bold text-center text-purple-400 mb-6">
          Sri Manasa Dashboard
        </h1>

        {/* Buttons Section */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <button
            onClick={() => navigate("/stock-entry")}
            className="bg-purple-600 hover:bg-purple-700 transition-all duration-300 py-2.5 rounded-lg font-medium shadow-md hover:scale-[1.03]"
          >
            Stock Update
          </button>

          <button
            onClick={() => navigate("/cash-summary")}
            className="bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 py-2.5 rounded-lg font-medium shadow-md hover:scale-[1.03]"
          >
            Cash Counter
          </button>

          <button
            onClick={() => navigate("/initial-cash")}
            className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 py-2.5 rounded-lg font-medium shadow-md hover:scale-[1.03]"
          >
            Initial Cash
          </button>

          <button
            onClick={() => navigate("/speech")}
            className="bg-pink-600 hover:bg-pink-700 transition-all duration-300 py-2.5 rounded-lg font-medium shadow-md hover:scale-[1.03]"
          >
            Speech Manager
          </button>
        </div>

        {/* Monthly Profit/Loss Section */}
        <div className="mt-4">
          <h2 className="text-lg font-semibold text-purple-300 mb-3 text-center">
            Monthly Profit / Loss
          </h2>
          <MonthlyProfitLoss />
        </div>

        {/* Footer */}
        <div className="text-center text-gray-400 mt-6 text-xs">
          © {new Date().getFullYear()} Sri Manasa Supermarket
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
