import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login', { replace: true });
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-black text-white px-4">
      <div className="bg-gray-900/80 p-8 rounded-3xl shadow-xl flex flex-col items-center space-y-6 max-w-md text-center">
        <h1 className="text-6xl font-extrabold text-red-500 animate-pulse">404</h1>
        <h2 className="text-2xl font-bold text-gray-300">Unauthorized Access</h2>
        <img
          src="/images/emoji.jpg"
          alt="error emoji"
          className="w-64 h-64 rounded-full border-4 border-red-500 object-cover shadow-lg"
        />
        <p className="text-gray-400 text-lg">
          You are not supposed to be here 
        </p>
        <p className="text-gray-500 italic">
          Redirecting to login in 3 seconds...
        </p>
        <div className="w-16 h-1 bg-red-500 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

export default ErrorPage;
