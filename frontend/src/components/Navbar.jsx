import React from "react";
import { Link } from "react-router-dom";
import { Search, Heart, Home, Menu } from "lucide-react";
import { Button } from "./ui/button";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="backdrop-blur-xl rounded-[2rem] px-6 py-3 flex items-center justify-between transition-all duration-500 border bg-white/40 border-transparent shadow-none">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-[#1d4ed8] rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-blue-200">
              <Home className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tighter transition-colors text-slate-900">
              Homely<span className="text-[#1d4ed8]">.</span>
            </span>
          </Link>

          {/* Center Navigation (Desktop) */}
          <div className="hidden md:flex items-center gap-1">
            <Link 
              to="/search" 
              className="px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all duration-300 text-slate-700 hover:bg-white/50"
            >
              <Search className="w-4 h-4" />
              Khám phá
            </Link>
            <Link 
              to="/favorites" 
              className="px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all duration-300 text-slate-700 hover:bg-white/50"
            >
              <Heart className="w-4 h-4" />
              Yêu thích
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <Link 
                to="/signin" 
                className="px-6 py-2.5 rounded-xl text-sm font-bold transition-all text-slate-700 hover:bg-white/50"
              >
                Đăng nhập
              </Link>
              <Link 
                to="/signup" 
                className="px-6 py-2.5 bg-[#1d4ed8] text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all hover:scale-105"
              >
                Đăng ký
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 text-slate-600">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
