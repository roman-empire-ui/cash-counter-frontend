import React from "react";
import { useNavigate } from "react-router-dom";

import MonthlyProfitLoss from "../Components/Monthlypl";
import MonthlyPaymentSummary from "./DashSummary";
import MenuIcon from "../Components/MenuIcon";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex justify-center items-center px-3 py-6 relative overflow-hidden">
      
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url(/images/bg.jpg)",
        }}
      ></div>

      {/* 🔥 Neon Animated Grid */}
      <div className="cyber-grid"></div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-5xl bg-gray-900/70 backdrop-blur-md border border-purple-500/40 rounded-lg shadow-2xl p-6 text-white">
        <MenuIcon />

        <h1 className="text-3xl font-bold text-center text-purple-400 mb-6 neon-text">
          Sri Manasa Dashboard
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <button
            onClick={() => navigate("/stock-entry")}
            className="cyber-btn"
          >
            Stock Update
          </button>

          <button
            onClick={() => navigate("/cash-summary")}
            className="cyber-btn"
          >
            Cash Counter
          </button>

          <button
            onClick={() => navigate("/initial-cash")}
            className="cyber-btn"
          >
            Initial Cash
          </button>

          <button
            onClick={() => navigate("/speech")}
            className="cyber-btn"
          >
            Speech Manager
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800/60 border border-purple-500/30 rounded-xl p-4 shadow-md">
            <h2 className="text-lg font-semibold text-center text-purple-300 mb-3">
              Monthly Profit / Loss
            </h2>
            <MonthlyProfitLoss />
          </div>

          <MonthlyPaymentSummary />
        </div>

        <div className="text-center text-gray-400 mt-6 text-xs">
          © {new Date().getFullYear()} Sri Manasa Supermarket
        </div>
      </div>
    </div>
  );
};

export default Dashboard;