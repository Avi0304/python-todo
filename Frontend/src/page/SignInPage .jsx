import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { User, Lock, Facebook, Chrome, X } from "lucide-react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast, Bounce } from 'react-toastify';

import IconInput from "../components/IconInput";
import Button from "../components/Button";
import Checkbox from "../components/Checkbox";

const SignInPage = () => {

  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = 'Sign Up - Todo App';
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("https://python-todo-v6s1.onrender.com/api/auth/register", form);
      console.log(res.data);
      localStorage.setItem("token", res.data.token);
      toast.success('Register Successfully! ', {
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
        navigate("/login");
      }, 5000);
    } catch (err) {
      console.error(err.response?.data?.message || "Login failed");
      setError(err.response?.data?.message || "Login failed");
    }
  };


  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 ">
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
          <h1 className="mb-6 text-4xl font-bold text-gray-800">Create Account</h1>
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

            <Button type="submit" className="w-full bg-[#F87171] text-white hover:cursor-pointer hover:bg-[#E55353]">
              Sign Up
            </Button>
          </form>

          {/* Social login */}
          <div className="mt-8 text-center text-gray-600">

            <p className="mt-6 text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-[#F87171] hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>

        {/* Right Illustration Section */}
        <div className="hidden items-center justify-center bg-gray-50 p-8 md:flex">
          <img
            src="/signin.png"
            alt="Login illustration"
            className="h-[480px] w-full max-w-md object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
