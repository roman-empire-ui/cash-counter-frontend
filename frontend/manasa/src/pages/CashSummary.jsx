import React from 'react';
import InitialCash from './InitialCash';
import RemainingCash from './RemCash';
import Notification from '../Components/Notification';

const CashSummary = () => {
  return (
    <div className="min-h-screen bg-black text-white px-4 py-8 bg-cover bg-no-repeat bg-center"
    style={{backgroundImage : 'url(/images/neon2.jpg)'}}
    >
      <h1 className="text-3xl font-bold text-center mb-8 animate-float">Daily Cash Summary</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
        <div className="bg-purple-500/30 rounded-xl p-6 shadow-md">
          <InitialCash />
        </div>

        <div className="bg-white/10 rounded-xl p-6 shadow-md">
          <RemainingCash />
        </div>
        
      </div>
      
      <Notification/>
    </div>
  );
};

export default CashSummary;
