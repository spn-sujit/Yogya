import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";


const Login = () => {
  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {navigate,setUserToken,setUserData,axios,setIsLogin}=useAppContext();

    const handleSubmit = async()=>{
      try {
        let res;

        if(state === 'login'){
           res = await axios.post('/api/user/login',{email,password});
          const token = res.token
        }else {
         res = await axios.post("/api/user/register", {
        name,
        email,
        password,
      });
    }
   
    if(res.data.success){
      const {token,user}=res.data;
      localStorage.setItem('token',token);
      setUserData(user);
      setUserToken(token);
      setIsLogin(true);
      navigate("/");
      
    }
    else{
        toast.error(res.data.message || "Authentication failed");
    }

      } catch (error) {
         console.error("Auth error:", err);
    toast.error("Something went wrong. Please try again.");
      }
    }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-[#fffaf3] w-80 sm:w-[360px] p-8 py-10 rounded-lg shadow-xl border border-gray-300 relative">
        <button
          onClick={()=>navigate('/')}
          className="absolute top-3 right-4 text-xl font-bold text-[#3f3a2d] hover:text-red-500"
        >
          ×
        </button>

        <p className="text-2xl font-semibold text-center text-[#3f3a2d] mb-6">
          <span className="text-yellow-600">User</span>{" "}
          {state === "login" ? "Login" : "Sign Up"}
        </p>

        {state === "register" && (
          <div className="mb-4">
            <label className="block text-sm text-[#3f3a2d] mb-1">Name</label>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="Enter your name"
              className="w-full p-2 border border-gray-300 rounded outline-yellow-500"
              type="text"
              required
            />
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm text-[#3f3a2d] mb-1">Email</label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Enter your email"
            className="w-full p-2 border border-gray-300 rounded outline-yellow-500"
            type="email"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm text-[#3f3a2d] mb-1">Password</label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="Enter password"
            className="w-full p-2 border border-gray-300 rounded outline-yellow-500"
            type="password"
            required
          />
        </div>

        <p className="text-sm text-[#3f3a2d] mt-2 mb-4">
          {state === "register" ? (
            <>
              Already have an account?{" "}
              <span
                onClick={() => setState("login")}
                className="text-yellow-700 cursor-pointer underline"
              >
                Login
              </span>
            </>
          ) : (
            <>
              New user?{" "}
              <span
                onClick={() => setState("register")}
                className="text-yellow-700 cursor-pointer underline"
              >
                Sign Up
              </span>
            </>
          )}
        </p>

        <button   onClick={handleSubmit} className="bg-yellow-600 hover:bg-yellow-500 transition-all text-white w-full py-2 rounded-md">
          {state === "register" ? "Create Account" : "Login"}
        </button>
      </div>
    </div>
  );
};

export default Login;
