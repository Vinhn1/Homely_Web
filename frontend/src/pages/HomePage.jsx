import React from "react";
import Navbar from "../components/Navbar";

const HomePage = () => {
  return (
    <div className="min-h-[200vh] bg-[#f8fafc]">
      <Navbar />
      
      {/* 1. Hero Section (Để Navbar có thể "nổi" lên trên) */}
      <div className="relative h-[85vh] w-full flex items-center justify-center overflow-hidden">
        {/* Background Image Placeholder */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6191da1128?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
          }}
        >
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-white"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-2xl leading-tight">
            Tìm ngôi nhà mơ ước cùng <span className="text-white drop-shadow-[0_4px_16px_rgba(29,78,216,0.5)]">Homely.</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-10 drop-shadow-md font-medium">
            Hơn 10,000+ lựa chọn phòng trọ và căn hộ cao cấp đang chờ đón bạn.
          </p>
          
          {/* Nút Khám phá */}
          <button className="bg-white text-[#1d4ed8] px-10 py-5 rounded-full text-lg font-bold shadow-xl hover:scale-105 transition-all hover:bg-blue-50">
            Khám phá ngay
          </button>
        </div>
      </div>

      {/* 2. Content Placeholder để thử hiệu ứng cuộn */}
      <div className="max-w-7xl mx-auto py-20 px-6">
        <h2 className="text-3xl font-bold mb-12">Gợi ý dành cho bạn</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white h-96 rounded-[40px] shadow-sm border border-border overflow-hidden group cursor-pointer hover:shadow-xl transition-all">
              <div className="h-2/3 bg-muted group-hover:scale-105 transition-transform duration-500"></div>
              <div className="p-6">
                <div className="h-4 w-1/3 bg-muted rounded mb-2"></div>
                <div className="h-6 w-2/3 bg-muted rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;