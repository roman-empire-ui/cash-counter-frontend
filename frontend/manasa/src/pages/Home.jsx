import React from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard';

const Home = () => {
  const navigate = useNavigate();

  return <Dashboard navigate={navigate} />;
};

export default Home;
