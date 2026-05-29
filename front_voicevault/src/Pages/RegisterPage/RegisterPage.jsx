import React, { useState } from "react";
import { Link } from "react-router-dom";
const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const timer = () => {
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };
  const handleFormSubmit = (event) => {
    event.preventDefault();
    try {
      if (!formData.email && !formData.password && !formData.name) {
        setMessageType("error");
        setMessage("Please fill the form");
        return;
      }
      if (!formData.name) {
        setMessageType("error");
        setMessage("Please enter your full name");
        return;
      }
      if (!formData.email) {
        setMessageType("error");
        setMessage("Please enter your email");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setMessageType("error");
        setMessage("Password should be same.");
        return;
      }
      handleApiCall();
    } catch (error) {
      console.log(error);
    } finally {
      timer();
    }
  };
  const handleApiCall = async () => {
    try {
      setMessageType("");
      setMessage("Please wait...");
      const response = await fetch(
        `${import.meta.env.VITE_PUBLIC_API_URL}/user/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
          credentials: "include",
        },
      );
      const result = await response.json();
      console.log(result);
      if (!result.success) {
        setMessageType("error");
        setMessage(result.message);
        return;
      }
      if (result.success) {
        setMessageType("success");
        setMessage(result.message);
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        window.location.href = "/action";
      }
    } catch (error) {
      console.error("Register failed:", error);
      setMessageType("error");
      setMessage("Some went wrong. Please try again!");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-r from-blue-900 via-black to-orange-900 text-white">
      <div className="bg-gray-900/80 p-10 rounded-xl shadow-lg w-96 border border-gray-700">
        {/* Logo */}
        <div className="flex items-center justify-center mb-6">
          <img
            src="/icon.png"
            alt="VoiceVault Logo"
            className="w-12 h-12 mr-2"
          />
          <h1 className="text-3xl font-bold">
            <span className="text-blue-400">Voice</span>
            <span className="text-orange-500">Vault</span>
          </h1>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-200 mb-6 text-center">
          Create Your Account
        </h2>
        <form action="" onSubmit={handleFormSubmit}>
          {/* Full Name */}
          <div className="mb-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          {message && (
            <p
              style={{
                textAlign: "center",
                fontSize: "14px",
                fontWeight: "500",
                maxWidth: "300px",
                padding: "5px 0px",
              }}
              className={
                messageType === "success" ? "text-green-500" : "text-red-500"
              }
            >
              {message}
            </p>
          )}
          {/* Sign Up Button */}
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-white"
          >
            Sign Up
          </button>
        </form>
        {/* Links */}
        <div className="mt-4 text-sm text-gray-400 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-orange-500 hover:text-orange-400">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
