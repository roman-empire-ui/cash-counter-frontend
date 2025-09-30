import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { getInitialCount } from '../services/cashCounter';

const InitialCash = () => {
  const navigate = useNavigate();
  const [initial, setInitial] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCash = async () => {
      setLoading(true);
      const initialCash = await getInitialCount();
      console.log('frontend',  initialCash)
      if (initialCash?.success) setInitial(initialCash?.initialCash);
      setLoading(false);
    };
    fetchCash();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-800 p-6">
      <div className="w-full max-w-3xl bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-6 text-center font-serif">
          {`Opening Balance for Today (${initial?.date?.split('T')[0] || '—'})`}
        </h2>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="animate-spin text-white" size={28} />
          </div>
        ) : initial ? (
          <div className="grid grid-cols-2 gap-6">
            {/* Notes */}
            <div className="bg-white/10 p-4 rounded-xl shadow-md">
              <h3 className="font-semibold text-lg text-white mb-3 font-serif">Notes</h3>
              {initial.notes.map((note) => (
                <div
                  key={note.denomination}
                  className="flex justify-between text-sm text-white border-b border-white/20 py-1 font-mono"
                >
                  <span>₹{note.denomination} × {note.count}</span>
                  <span>= ₹{note.total}</span>
                </div>
              ))}
            </div>

            {/* Coins */}
            <div className="bg-white/10 p-4 rounded-xl shadow-md">
              <h3 className="font-semibold text-lg text-white mb-3 font-serif">Coins</h3>
              {initial.coins.map((coin) => (
                <div
                  key={coin.denomination}
                  className="flex justify-between text-sm text-white border-b border-white/20 py-1 font-mono"
                >
                  <span>₹{coin.denomination} × {coin.count}</span>
                  <span>= ₹{coin.total}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-300 mt-6 font-serif">
            No initial cash found for today.
          </div>
        )}

        {/* Total */}
        {initial && (
          <div className="text-center font-bold text-green-400 text-lg mt-6 font-mono">
            Total: ₹{initial.totalInitialCash}
          </div>
        )}

        {/* Back button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => navigate('/cash-counter')}
            className="px-5 py-2 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition duration-200 font-serif"
          >
            Back to Cash Counter
          </button>
        </div>
      </div>
    </div>
  );
};

export default InitialCash;
