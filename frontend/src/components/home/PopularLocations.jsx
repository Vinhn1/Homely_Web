import React from "react";
import { ArrowRight } from "lucide-react";


const PopularLocations = () => {
    const locations = [
        {
            id: 1,
            name: "Quận 1",
            listings: "1,240 tin đăng",
            image: "https://picsum.photos/seed/q1/600/800",
        },
        {
            id: 2,
            name: "Quận 7",
            listings: "850 tin đăng",
            image: "https://picsum.photos/seed/q7/600/800",
        },
        {
            id: 3,
            name: "Bình Thạnh",
            listings: "920 tin đăng",
            image: "https://picsum.photos/seed/bt/600/800",
        },
        {
            id: 4,
            name: "Quận 2",
            listings: "640 tin đăng",
            image: "https://picsum.photos/seed/q2/600/800",
        },
    ];

   return (
    <section className="max-w-7xl mx-auto px-4 py-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
        <div className="space-y-4">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900">
            Khu vực <span className="text-blue-600">Phổ biến</span>
          </h2>
          <p className="text-slate-500 font-medium text-lg">
            Những địa điểm được tìm kiếm nhiều nhất trong tuần qua
          </p>
        </div>
        <button className="group flex items-center gap-2 text-blue-600 font-extrabold text-sm uppercase tracking-widest hover:text-blue-700 transition-colors">
          <span>Xem tất cả</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {locations.map((loc) => (
          <div
            key={loc.id}
            className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
          >
            <img
              alt={loc.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              src={loc.image}
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-90 group-hover:opacity-100 transition-opacity"></div>
            
            {/* Content */}
            <div className="absolute bottom-8 left-8">
              <h3 className="text-2xl font-extrabold text-white mb-1">
                {loc.name}
              </h3>
              <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                {loc.listings}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default PopularLocations;