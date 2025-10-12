import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center min-h-screen px-4" style={{ backgroundImage: 'url(/images/bg.jpg)', backgroundPosition: 'center', backgroundSize: 'cover' }}>
      <div className="w-full max-w-md bg-white/25 backdrop-blur-md border-s-2 border-2 border-purple-500 rounded-b-xl shadow-lg rounded-3xl  p-6 text-center">
        <h1 className="text-3xl font-bold text-white mb-8">Sri Manasa</h1>

        <div className="flex flex-col gap-6">
          <button
            onClick={() => navigate('/stock-entry')}
            className="transition-transform duration-300 transform hover:scale-105 bg-purple-600 text-white py-3 px-6 rounded-full shadow-md hover:bg-purple-700"
          >
            Stock Update
          </button>

          <button
            onClick={() => navigate('/cash-summary')}
            className="transition-transform duration-300 transform hover:scale-105 bg-purple-600 text-white py-3 px-6 rounded-full shadow-md hover:bg-purple-700"
          >
            Cash Counter
          </button>

          <button
            onClick={() => navigate('/initial-cash')}
            className="transition-transform duration-300 transform hover:scale-105 bg-purple-600 text-white py-3 px-6 rounded-full shadow-md hover:bg-purple-700"
          >
            Initial Cash Counter
          </button>

          <button
            onClick={() => navigate('/speech')}
            className="transition-transform duration-300 transform hover:scale-105 bg-purple-600 text-white py-3 px-6 rounded-full shadow-md hover:bg-purple-700"
          >
            Speech Change Manager
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
