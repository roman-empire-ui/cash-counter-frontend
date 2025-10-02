import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import StockEntry from './pages/StockEntry';
import CashCounter from './pages/CashCounter';
import Navigation from './Components/Navigation';
import Signup from './pages/Signup';
import Home from './pages/Home';
import GlobalState, { GlobalContext } from './context/globalContext';
import { useContext } from 'react';
import Login from './pages/Login';
import AllStocks from './pages/AllStocks';
import InitialCash from './pages/InitialCash';
import CashSummary from './pages/CashSummary';
import SplashScreen from './Components/Splash';
import LogoOverlay from './Components/ImageOverlay';
import { ThemeProvider } from './context/ThemeContext';
import Notification from './Components/Notification';
import ErrorPage from './pages/ErrorPage';
import ProtectedRoute from './context/AuthContext';
import ResetPassword from './pages/PasswordRst';

const AppRoutes = () => {
  const { loading } = useContext(GlobalContext);
  const location = useLocation();

  // Show navigation only on routes other than splash
  const hideNavRoutes = ['/'];
  const shouldShowNav = !hideNavRoutes.includes(location.pathname);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin h-10 w-10 border-4 border-purple-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <>
      {shouldShowNav && <Navigation />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<SplashScreen />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path='/password-reset' element ={<ResetPassword/>}/>
        

        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

    
        <Route
          path="/stock-entry"
          element={
            <ProtectedRoute>
              <StockEntry />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cash-counter"
          element={
            <ProtectedRoute>
              <CashCounter />
            </ProtectedRoute>
          }
        />
        <Route
          path="/all-stocks"
          element={
            <ProtectedRoute>
              <AllStocks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/initial-cash"
          element={
            <ProtectedRoute>
              <InitialCash />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cash-summary"
          element={
            <ProtectedRoute>
              <CashSummary />
            </ProtectedRoute>
          }
        />

        {/* Catch-all / 404 */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </>
  );
};

function App() {
  return (

    <GlobalState>
      <BrowserRouter>
        <div>
          <AppRoutes />
          <LogoOverlay />
          <Notification />
        </div>
      </BrowserRouter>
    </GlobalState>

  );
}

export default App;
