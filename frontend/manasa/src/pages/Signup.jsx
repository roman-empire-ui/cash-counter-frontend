import React, { useContext, useEffect, useState } from 'react'
import { signupOptions } from '../utils/signup';
import { signup } from '../services/register';
import { toast } from 'react-toastify';
import Notification from '../Components/Notification';
import { GlobalContext } from '../context/globalContext';
import { useNavigate } from 'react-router-dom'


const initialData = {
  name: '',
  email: '',
  password: ''
}

const Signup = () => {

  const [userData, setUserData] = useState(initialData)

  const { isAuthUser, isRegistered, setIsRegistered } = useContext(GlobalContext)
  const navigate = useNavigate()

  const onChange = (e) => {
    setUserData({ ...userData, [e.target.id]: e.target.value })
  }

  const hanSubmit = async (e) => {
    e.preventDefault()
    const data = await signup(userData)
    if (data.success) {
      toast.success(data.message, {
        position: 'top-right'
      })
      setIsRegistered(true)
      setUserData(initialData)
      navigate('/login')
    } else {
      toast.error(data.message, {
        position: 'top-right'
      })
      setUserData(initialData)
    }

  }

  useEffect(() => {
    if (isAuthUser || isRegistered) {
      navigate('/login')
    }
  },[isAuthUser , isRegistered , navigate])


  return (
    <div className="min-h-screen w-full bg-no-repeat bg-cover bg-center bg-gray-300 flex items-center justify-center p-4" style={{ backgroundImage: 'url(/images/bg.jpg)', backgroundPosition: 'center', backgroundSize: 'cover' }}>
      <div className="bg-white/30 backdrop-blur-md shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Create an Account
        </h2>

        <form className="space-y-5">
          {signupOptions.map((field, index) => (
            <div key={index} className="flex flex-col">
              <label htmlFor={field.id} className="mb-1 font-medium text-gray-700">
                {field.label}
              </label>
              <input
                id={field.id}
                type={field.type}
                placeholder={field.placeholder}
                className="border rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                onChange={onChange}
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            onClick={hanSubmit}
          >
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-500 text-center">
          Already have an account? <span className="text-blue-600 hover:underline cursor-pointer" onClick={()=> navigate('/login')}>Log in</span>
        </p>
      </div>
      <Notification />
    </div>
  );
};

export default Signup
