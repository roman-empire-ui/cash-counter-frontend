import React, { useContext } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Home, Package2, CreditCard, PackageCheckIcon, DoorOpen } from 'lucide-react'
import { GlobalContext } from '../context/globalContext'


const Navigation = () => {
  const { logout, isAuthUser, user } = useContext(GlobalContext)
  const location = useLocation()
  const navigate = useNavigate()
  const isActive = (path) => location.pathname === path

  const navOptions = [
    { icon: Home, label: 'Home', path: '/home' },
    { path: '/stock-entry', icon: Package2, label: 'Stock Entry' },
    { path: '/cash-summary', icon: CreditCard, label: 'Cash Counter' },
    { path: '/all-Stocks', icon: PackageCheckIcon, label: 'All Stocks' }
  ]

  const hanLogOut = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-gradient-to-br from-purple-600 to-purple-800 
                dark:from-gray-900 dark:to-black 
                bg-opacity-90 py-2 text-white shadow-sm w-full sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
          {/* Logo - center on mobile, left on desktop */}
          <div className="flex justify-center sm:justify-start mb-2 sm:mb-0">
            <h1
              className="text-xl font-bold text-white cursor-pointer flex items-center space-x-2"
              onClick={() => navigate("/")}
            >
              <img
                src="/images/logo.jpg"
                alt="Logo"
                className="w-[180px] rounded-full object-cover"
              />
              <span className="hidden sm:inline text-center">
                {" "}
                {user ? <div className='font-serif'> welcome {user.name} </div> : "Welcome to Cash Counter"}{" "}
              </span>
            </h1>
          </div>

          

          {/* Nav Links - hidden on small screens */}
          <div className="hidden sm:flex sm:space-x-8">
            {navOptions.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative inline-flex items-center px-3 py-1 text-sm font-medium font-serif transition duration-300 group
               ${isActive(item.path) ? "text-blue-300" : "text-white hover:text-blue-300"}`}
              >
                <item.icon className="w-5 h-5 mr-2" />
                {item.label}

                {/* Shiny underline */}
                <span className="shiny-underline"></span>
              </Link>

            ))}


            {isAuthUser && (
              <button
                title="Logout"
                onClick={hanLogOut}
                className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium text-white hover:text-blue-300 transition duration-300"
              >
                <DoorOpen className="w-5 h-5 mr-2" />
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation
