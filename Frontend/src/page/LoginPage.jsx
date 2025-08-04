import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Lock } from "lucide-react";
import axios from "axios";
import { ToastContainer, toast, Bounce } from 'react-toastify';


import Input from "../components/Input";
import Button from "../components/Button";
import Checkbox from "../components/Checkbox";
import IconInput from "../components/IconInput";

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = 'Login - Todo App';
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: "147226171626-o5huu49rfq2r3kh7t0j3ht6fuap54l4g.apps.googleusercontent.com",
        callback: handleGoogleResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("googleSignInDiv"),
        { theme: "outline", size: "large" }
      );
    }
  }, []);


  const handleGoogleResponse = async (response) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/google-login", {
        credential: response.credential,
      });
      localStorage.setItem("token", res.data.token);
      toast.success('Logout Successfully! ', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      setTimeout(() => {
        navigate("/todo");
      }, 5000);
    } catch (err) {
      console.error(err);
      setError("Google login failed");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("https://python-todo-v6s1.onrender.com/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      toast.success('Login Successfully! ', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      setTimeout(() => {
        navigate("/todo");
      }, 5000);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      <div className="w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-xl md:grid md:grid-cols-2">
        {/* Left Form Section */}
        <div className="flex flex-col justify-center p-8 md:p-12">
          <h1 className="mb-6 text-4xl font-bold text-gray-800">Sign In</h1>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <IconInput
              id="email"
              placeholder="Enter Email"
              icon={User}
              value={form.email}
              onChange={handleChange}
              required
            />
            <IconInput
              id="password"
              type="password"
              placeholder="Enter Password"
              icon={Lock}
              value={form.password}
              onChange={handleChange}
              required
            />


            <Button type="submit" className="w-full hover:cursor-pointer">
              Login
            </Button>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </form>

          <div className="mt-8 text-center text-gray-600">
            <p className="mb-4 font-bold">Or, continue with</p>
            <div id="googleSignInDiv" className="flex justify-center" />
            <p className="mt-6 text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-[#F87171] hover:underline">
                SignUp
              </Link>
            </p>
          </div>
        </div>

        {/* Right Illustration Section */}
        <div className="hidden items-center justify-center bg-gray-50 p-8 md:flex">
          <img
            src="/login.png"
            alt="Login illustration"
            className="h-auto w-full max-w-md object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
