import React, { useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { resetPasswordRequest } from "../services/register";
import Lottie from 'lottie-react'
import forgot from '../assets/forgot.json'

const ResetPasswordModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await resetPasswordRequest({ email });
      console.log("resetPasswordRequest response:", res);

      if (res.success) {
        toast.success("Reset link has been sent to your email!");
        setEmail("");
        onClose();
        window.open("https://mail.google.com/mail/", "_blank"); 
      } else {
        toast.error(res.message || "Failed to send reset link");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-50">
          <Lottie animationData={forgot} loop className="w-52 h-52" />
          <p className="text-white mt-3 text-lg font-medium">
            Sending reset link...
          </p>
        </div>
      )}

      {/* Modal Box */}
      <div className="relative bg-white/30 backdrop-blur-md shadow-md rounded-lg p-8 w-full max-w-md">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-700 hover:text-blue-600"
        >
          <X size={20} />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Forgot Password
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="border-b-2 rounded-full px-3 py-2 focus:outline-none focus:border-blue-400"
            />
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
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordModal;
