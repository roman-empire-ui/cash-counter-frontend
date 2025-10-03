import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../services/register";

const initialData = {
  token: "",
  newPassword: "",
  confirmPassword: "",
};

const ResetPassword = () => {
  const [formData, setFormData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // get query params

  // Get token from URL and set it in state
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
    <div className="min-h-screen w-full bg-no-repeat bg-cover bg-center bg-gray-300 flex items-center justify-center p-4">
      <div className="bg-white/30 backdrop-blur-md shadow-md rounded-lg p-8 w-full max-w-md">
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
              type="text"
              value={formData.token}
              onChange={onChange}
              required
              className="border-b-2 rounded-full px-3 py-2 focus:outline-none focus:border-blue-400"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="newPassword" className="mb-1 font-medium text-gray-700">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              placeholder="Enter new password"
              value={formData.newPassword}
              onChange={onChange}
              required
              className="border-b-2 rounded-full px-3 py-2 focus:outline-none focus:border-blue-400"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="confirmPassword" className="mb-1 font-medium text-gray-700">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChange={onChange}
              required
              className="border-b-2 rounded-full px-3 py-2 focus:outline-none focus:border-blue-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md text-white transition ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
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
