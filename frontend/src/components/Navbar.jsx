import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Heart, Home, Menu, User, LogOut, MapPin, Globe } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-7xl bg-white/80 backdrop-blur-xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-full px-8 py-3.5 transition-all duration-500">
      <div className="w-full">
        <div className="flex items-center justify-between">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center group-hover:rotate-6 transition-transform duration-300 shadow-xl shadow-blue-100">
              <Home className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter transition-colors text-slate-900">
              Homely<span className="text-blue-600">.</span>
            </span>
          </Link>

          {/* Center Navigation - Premium Labels */}
          <div className="hidden md:flex items-center gap-2">
            {[
              { to: "/search", icon: Search, label: "Khám phá" },
              { to: "/areas", icon: MapPin, label: "Khu vực" },
              { to: "/blog", icon: Globe, label: "Blog" },
              ...(isAuthenticated ? [{ to: "/favorites", icon: Heart, label: "Yêu thích" }] : [])
            ].map((item) => (
              <Link 
                key={item.to}
                to={item.to} 
                className="px-5 py-3 rounded-[20px] text-[13px] font-black flex items-center gap-2.5 transition-all duration-300 text-slate-500 hover:bg-blue-50 hover:text-blue-600 group"
              >
                <item.icon className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" /> 
                <span className="tracking-wide uppercase text-[11px]">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                {/* Circular Avatar */}
                <Link 
                  to="/dashboard/profile"
                  className="w-11 h-11 rounded-2xl bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center overflow-hidden hover:scale-110 transition-all group"
                >
                  {user?.avatarUrl ? (
                    <img 
                      src={user.avatarUrl} 
                      alt="Avatar" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white font-black text-sm group-hover:scale-110 transition-transform">
                      {user?.displayName?.charAt(0) || user?.username?.charAt(0) || "U"}
                    </div>
                  )}
                </Link>

                {/* Logout Button */}
                <button 
                  onClick={handleLogout} 
                  className="flex items-center gap-2 px-5 py-3 rounded-[20px] text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all font-black group"
                >
                  <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  <span className="text-[11px] uppercase tracking-wider">Đăng xuất</span>
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <Link to="/signin" className="px-6 py-3 rounded-[20px] text-[13px] font-black text-slate-600 hover:bg-slate-50 transition-all uppercase tracking-wider">Đăng nhập</Link>
                <Link to="/signup" className="px-8 py-3.5 bg-blue-600 text-white rounded-[20px] text-[13px] font-black hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all hover:-translate-y-0.5 active:scale-95 uppercase tracking-wider">Đăng ký</Link>
              </div>
            )}
            <button className="md:hidden p-3 bg-slate-50 rounded-2xl text-slate-600">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
