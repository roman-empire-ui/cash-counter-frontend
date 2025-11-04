import React from "react";
import { useNavigate } from "react-router-dom";
import MonthlyProfitLoss from "../Components/Monthlypl";
import MonthlyPaymentSummary from "./DashSummary";
import MenuIcon from "../Components/MenuIcon";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex justify-center items-center bg-gray-950 px-3 py-6 relative"
      style={{
        backgroundImage: "url(/images/bg.jpg)",
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* ✅ Menu icon (now clearly visible) */}
      
      <div className="w-full max-w-5xl bg-gray-900/70 backdrop-blur-md border border-purple-600/40 rounded-lg shadow-lg p-6 text-white">
        {/* Header */}
       <MenuIcon/>

        <h1 className="text-3xl font-bold text-center text-purple-400 mb-6">
          Sri Manasa Dashboard
        </h1>

        {/* Buttons Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <button
            onClick={() => navigate("/stock-entry")}
            className="bg-purple-600 hover:bg-purple-700 transition-all duration-300 py-2.5 rounded-full font-medium shadow-md hover:scale-[1.03]"
          >
            Stock Update
          </button>

          <button
            onClick={() => navigate("/cash-summary")}
            className="bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 py-2.5 rounded-full font-medium shadow-md hover:scale-[1.03]"
          >
            Cash Counter
          </button>

          <button
            onClick={() => navigate("/initial-cash")}
            className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 py-2.5 rounded-full font-medium shadow-md hover:scale-[1.03]"
          >
            Initial Cash
          </button>

          <button
            onClick={() => navigate("/speech")}
            className="bg-pink-600 hover:bg-pink-700 transition-all duration-300 py-2.5 rounded-full font-medium shadow-md hover:scale-[1.03]"
          >
            Speech Manager
          </button>
        </div>

        {/* Monthly Overview Section */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Side: Monthly Profit / Loss */}
          <div className="bg-gray-800/60 border border-purple-500/30 rounded-xl p-4 shadow-md">
            <h2 className="text-lg font-semibold text-center text-purple-300 mb-3">
              Monthly Profit / Loss
            </h2>
            <MonthlyProfitLoss />
          </div>

          {/* Right Side: Monthly Payment Summary */}
          <MonthlyPaymentSummary />
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
