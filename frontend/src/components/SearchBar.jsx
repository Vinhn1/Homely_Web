import React, { useState } from "react";
import { Search, MapPin, DollarSign, Home } from "lucide-react";

const SearchBar = ({ onSearch }) => {
  const [filters, setFilters] = useState({
    city: "",
    minPrice: "",
    maxPrice: "",
    type: "",
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  return (
    <div className="bg-white p-4 rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-wrap lg:flex-nowrap items-center gap-4 group">
      {/* 1. Địa điểm */}
      <div className="flex-1 min-w-[200px] flex items-center gap-3 px-4 py-2 border-r border-slate-100">
        <MapPin className="text-blue-500" size={20} />
        <div className="flex flex-col flex-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Địa điểm</span>
          <input 
            type="text" 
            name="city"
            placeholder="Bạn muốn ở đâu?" 
            className="text-sm font-bold text-slate-800 outline-none placeholder:text-slate-300 w-full"
            onChange={handleChange}
          />
        </div>
      </div>

      {/* 2. Loại phòng */}
      <div className="flex-1 min-w-[150px] flex items-center gap-3 px-4 py-2 border-r border-slate-100">
        <Home className="text-amber-500" size={20} />
        <div className="flex flex-col flex-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Loại hình</span>
          <select 
            name="type"
            className="text-sm font-bold text-slate-800 outline-none bg-transparent cursor-pointer"
            onChange={handleChange}
          >
            <option value="">Tất cả</option>
            <option value="Phòng trọ">Phòng trọ</option>
            <option value="Căn hộ">Căn hộ</option>
            <option value="Nhà nguyên căn">Nhà nguyên căn</option>
          </select>
        </div>
      </div>

      {/* 3. Khoảng giá */}
      <div className="flex-1 min-w-[200px] flex items-center gap-3 px-4 py-2">
        <DollarSign className="text-emerald-500" size={20} />
        <div className="flex flex-col flex-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ngân sách (Triệu)</span>
          <div className="flex items-center gap-2">
            <input 
              type="number" 
              name="minPrice"
              placeholder="Từ" 
              className="text-sm font-bold text-slate-800 outline-none w-12"
              onChange={handleChange}
            />
            <span className="text-slate-300">-</span>
            <input 
              type="number" 
              name="maxPrice"
              placeholder="Đến" 
              className="text-sm font-bold text-slate-800 outline-none w-12"
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Nút Tìm kiếm */}
      <button 
        onClick={handleSearch}
        className="w-full lg:w-auto bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-2xl transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2 group-hover:scale-105 active:scale-95"
      >
        <Search size={22} strokeWidth={3} />
        <span className="lg:hidden font-bold uppercase text-[12px]">Tìm kiếm ngay</span>
      </button>
    </div>
  );
};

export default SearchBar;
