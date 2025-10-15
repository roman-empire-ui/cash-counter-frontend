import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../services/register";
import Lottie from "lottie-react";
import forgot from "../assets/forgot.json";
import { Eye, EyeOff } from "lucide-react"; // 👈 import icons

const initialData = {
  token: "",
  newPassword: "",
  confirmPassword: "",
};

const ResetPassword = () => {
  const [formData, setFormData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 👈 for new password
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // 👈 for confirm password
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      setFormData((prev) => ({ ...prev, token: tokenFromUrl }));
    }
  }, [searchParams]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      const reset = await resetPassword(formData);

      if (reset.success) {
        toast.success(reset.message || "Password has been reset");
        navigate("/login");
      } else {
        toast.error(reset.message || "Reset failed");
      }
    } catch (e) {
      console.log("error", e);
      toast.error(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-no-repeat bg-cover bg-center bg-gray-300 flex items-center justify-center p-4"
    style={{backgroundImage : 'url(/images/car.jpg)'}}
    >
      {/* ✅ Full-page Lottie overlay when loading */}
      {loading && (
        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-50">
          <Lottie animationData={forgot} loop className="w-48 h-48" />
          <p className="text-white mt-3 text-lg font-medium">
            Processing, please wait...
          </p>
        </div>
      )}

      <div className="bg-white/30 backdrop-blur-sm shadow-md rounded-lg p-8 w-full max-w-md relative z-10">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Reset Password
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label htmlFor="token" className="mb-1 font-medium text-gray-700">
              Token
            </label>
            <input
              id="token"
              type="password"
              value={formData.token}
              onChange={onChange}
              required
              className="border-b-2 rounded-full px-3 py-2 focus:outline-none focus:border-blue-400"
            />
          </div>

          {/* ✅ New Password field with eye icon */}
          <div className="flex flex-col relative">
            <label htmlFor="newPassword" className="mb-1 font-medium text-gray-700">
              New Password
            </label>
            <input
              id="newPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={formData.newPassword}
              onChange={onChange}
              required
              className="border-b-2 rounded-full px-3 py-2 pr-10 focus:outline-none focus:border-blue-400"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 cursor-pointer text-gray-600 hover:text-blue-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          {/* ✅ Confirm Password field with eye icon */}
          <div className="flex flex-col relative">
            <label htmlFor="confirmPassword" className="mb-1 font-medium text-gray-700">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChange={onChange}
              required
              className="border-b-2 rounded-full px-3 py-2 pr-10 focus:outline-none focus:border-blue-400"
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-9 cursor-pointer text-gray-600 hover:text-blue-600"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md text-white transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-500 text-center">
          Remember your password?{" "}
          <span
            className="text-blue-600 hover:underline cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Log in
          </span>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
