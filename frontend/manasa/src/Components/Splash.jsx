import React, { useEffect, useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../context/globalContext';

const SplashScreen = () => {
  const navigate = useNavigate();
  const { isAuthUser, isRegistered } = useContext(GlobalContext);
  const [visible, setVisible] = useState(true);


  useEffect(() => {

    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        if (isAuthUser) {
          navigate('/home');
        } else {
          navigate(isRegistered ? '/login' : '/signup');
        }
      }, 3000); // delay navigation after fade-out
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate, isAuthUser, isRegistered]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-purple-900 to-black text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >

          <motion.div
            className="text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <motion.h1
              className="text-5xl sm:text-6xl font-extrabold text-white mb-4 drop-shadow-lg"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
              style={{
                textShadow: '0 0 10px rgba(255, 255, 255, 0.7)',
              }}
            >
              Sri Manasa Super Market
            </motion.h1>

            <motion.p
              className="text-xl sm:text-2xl text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              Powered by your daily routine.
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;