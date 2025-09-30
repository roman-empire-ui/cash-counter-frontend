// src/components/Loader.jsx
import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="animate-spin w-10 h-10 text-purple-500" />
        <p className="text-sm text-gray-300">Loading...</p>
      </div>
    </div>
  );
};

export default Loader;
