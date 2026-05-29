import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [messageType, setMessageType] = useState("");
  const [message, setMessage] = useState("");

  const timer = () => {
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 2000);
  };
  const handleLogin = (event) => {
    event.preventDefault();
    try {
      if (!email && !password) {
        setMessageType("error");
        setMessage("Please fill the form");
        return;
      }
      if (!email) {
        setMessageType("error");
        setMessage("Please enter your email");
        return;
      }
      if (!password) {
        setMessageType("error");
        setMessage("Password is required");
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
        `${import.meta.env.VITE_PUBLIC_API_URL}/user/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
          credentials: "include",
        },
      );
      const result = await response.json();
      if (!result.success) {
        setMessageType("error");
        setMessage(result.message);
        return;
      }
      setMessageType("success");
      setMessage(result.message);
      // window.location.href = "/action";
      navigate("/action");
    } catch (error) {
      console.error("Login failed:", error);
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
          Login to Your Account
        </h2>

        {/* Email Input */}
        <div className="mb-4">
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Password Input */}
        <div className="mb-6">
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
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
        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="w-full py-2 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold text-white"
        >
          Login
        </button>

        {/* Links */}
        <div className="flex justify-between mt-4 text-sm text-gray-400">
          <p>Not yet registered?</p>
          <Link
            to="/register"
            className="text-orange-500 hover:text-orange-400"
          >
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
