import React, { useContext, useState, useEffect } from 'react';
import { loginOptions } from '../utils/signup';
import { login } from '../services/register';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../context/globalContext';
import { Eye, EyeOff } from 'lucide-react';
import ResetPasswordModal from '../Components/TokenReq';

const initialData = {
  email: '',
  password: ''
};

const Login = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { setIsAuthUser, setUser } = useContext(GlobalContext);
  const [isModalOpen , setIsModalOpen] = useState(false)

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser?.email) {
      setUserData(prev => ({ ...prev, email: storedUser.email }));
    }
  }, []);

  const onChange = (e) => {
    setUserData({ ...userData, [e.target.id]: e.target.value });
  };

  const hanSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await login(userData);

      if (data.success) {
        toast.success(data.message || "Logged in successfully...!");

        const fullUser = {
          ...data.user,
          token: data.token,
        };

        setUser(fullUser);
        setIsAuthUser(true);
        localStorage.setItem('user', JSON.stringify(fullUser));

        setUserData(initialData);
        navigate('/home', { replace: true });
      } else {
        toast.error(data.message || 'Something went wrong');
        setUserData(initialData);
      }
    } catch (err) {
      console.error(err);
      toast.error('Internal server error');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div
      className="min-h-screen w-full bg-no-repeat bg-cover bg-center bg-gray-300 flex items-center justify-center p-4"
      style={{
        backgroundImage: 'url(/images/bg.jpg)',
        backgroundPosition: 'center',
        backgroundSize: 'cover'
      }}
    >
      <div className="bg-white/30 backdrop-blur-md shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Login
        </h2>

        <form className="space-y-5" onSubmit={hanSubmit}>
          {loginOptions.map((field, index) => (
            <div key={index} className="flex flex-col relative">
              <label htmlFor={field.id} className="mb-1 font-medium text-gray-700">
                {field.label}
              </label>

              {field.id === "password" ? (
                <div className="relative">
                  <input
                    id={field.id}
                    type={showPassword ? "text" : "password"}
                    placeholder={field.placeholder}
                    value={userData[field.id]}
                    className="border-b-2 rounded-full px-3 py-2 w-full focus:outline-none  focus:border-cyan-300 pr-10"
                    onChange={onChange}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-2 text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              ) : (
                <input
                  id={field.id}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={userData[field.id]}
                  className="border-b-2 rounded-full px-3 py-2 w-full focus:outline-none  focus:border-cyan-300 pr-10"
                  onChange={onChange}
                />
              )}

              {field.id === "password" && (
                <p
                  className="mt-3 text-sm text-blue-600 hover:underline cursor-pointer text-right"
                  onClick={() => setIsModalOpen(true)}
                >
                  Forgot Password?
                </p>
              )}

            </div>

          ))}

          <button
            type="submit"
            className={`w-full py-2 rounded-md text-white transition ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-500 text-center">
          Don't have an account?{' '}
          <span
            className="text-blue-600 hover:underline cursor-pointer"
            onClick={() => navigate('/signup')}
          >
            Sign up
          </span>
        </p>
      </div>
      <ResetPasswordModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
    </div>
  );
};

export default Login;
