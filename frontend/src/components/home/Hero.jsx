import React from "react";
import heroImage from "../../assets/hero.avif";

const Hero = () => {
    return (
    <div className="relative h-[85vh] w-full flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-white"></div>
      </div>
      <div className="relative z-10 text-center px-6 max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-2xl leading-tight">
          Tìm ngôi nhà mơ ước cùng <span className="text-white">Homely.</span>
        </h1>
        {/* ... các phần còn lại của Hero ... */}
        <button className="bg-white text-[#1d4ed8] px-10 py-5 rounded-full font-bold shadow-xl hover:scale-105 transition-all">
          Khám phá ngay
        </button>
      </div>
    </div>
  );
}

export default Hero;