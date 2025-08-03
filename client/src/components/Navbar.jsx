import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { logo, profile } from "../assets/assests";
import { useAppContext } from "../context/AppContext";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { navigate, isLogin, setIsLogin ,setUserData,setUserToken} = useAppContext();
  const handleLogout=()=>{
    localStorage.removeItem('token');
    setIsLogin(false);
    setUserToken(null);
  setUserData(null);
  navigate("/");
  }
  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-200 bg-[#fffaf3] relative transition-all">
      <NavLink to="/">
        <img className="h-15 rounded-full bg-amber-300" src={logo} alt="logo" />
      </NavLink>

      <div className="hidden sm:flex items-center gap-8 text-[#3f3a2d] font-medium">
        <NavLink to="/" className="hover:text-[#6c5f46] transition">
          Dashboard
        </NavLink>
        <NavLink to="/my-sessions" className="hover:text-[#6c5f46] transition">
          My Sessions
        </NavLink>
        <NavLink to="/publish" className="hover:text-[#6c5f46] transition">
          Session Editor
        </NavLink>
        <div className="relative">
          {isLogin ? (
            <div className="group relative inline-block">
              {/* Profile Image */}
              <img
                className="h-9 w-9 rounded-full cursor-pointer"
                src={profile}
                alt="profileIcon"
              />

              {/* Dropdown (Draft Link) */}
              <div className="absolute right-0 mt-2 w-40 bg-amber-100 text-black rounded-md shadow-lg opacity-0 group-hover:opacity-100 group-hover:translate-y-1 transform transition-all duration-200 pointer-events-auto z-50">
                <NavLink
                  to="/draft"
                  className="block px-4 py-2 hover:bg-amber-200 rounded-md transition-colors duration-200"
                >
                  Draft
                </NavLink>
                 <button
        onClick={handleLogout}
        className="block w-full text-left px-4 py-2 hover:bg-amber-200 rounded-md transition-colors duration-200"
      >
        Logout
      </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-2 bg-amber-300 hover:bg-amber-400 text-black hover:text-gray-700 rounded-full transition-colors duration-200"
            >
              Login
            </button>
          )}
        </div>
      </div>

      <button
        onClick={() => setOpen(!open)}
        className="sm:hidden text-3xl text-[#3f3a2d]"
        aria-label="Toggle Menu"
      >
        ☰
      </button>

      <div
        className={`${
          open ? "flex" : "hidden"
        } absolute top-[70px] left-0 w-full bg-[#fffaf3] shadow-md py-4 flex-col items-start gap-3 px-6 text-sm sm:hidden text-[#3f3a2d]`}
      >
        <NavLink to="/" className="block w-full" onClick={() => setOpen(false)}>
          Dashboard
        </NavLink>
        <NavLink
          to="/my-sessions"
          className="block w-full"
          onClick={() => setOpen(false)}
        >
          My Sessions
        </NavLink>
        <NavLink
          to="/publish"
          className="block w-full"
          onClick={() => setOpen(false)}
        >
          Session Editor
        </NavLink>
       {isLogin ? (
  <>
    <div className="flex items-center gap-3 mt-2">
      <img
        className="h-9 w-9 rounded-full"
        src={profile}
        alt="profileIcon"
      />
      <span className="text-[#3f3a2d] font-medium">My Profile</span>
    </div>
    <NavLink
      to="/draft"
      className="block w-full mt-2"
      onClick={() => setOpen(false)}
    >
      Draft
    </NavLink>
    <button
      onClick={() => {
        handleLogout();
        setOpen(false);
      }}
      className="block w-full text-left px-0 py-2 text-red-600 hover:text-red-700"
    >
      Logout
    </button>
  </>
) : (
  <button
    onClick={() => {
      navigate("/login");
      setOpen(false);
    }}
    className="px-6 py-2 bg-yellow-300 hover:bg-yellow-400 text-black hover:text-gray-700 rounded-full transition-colors duration-200"
  >
    Login
  </button>
)}

      </div>
    </nav>
  );
};

export default Navbar;
