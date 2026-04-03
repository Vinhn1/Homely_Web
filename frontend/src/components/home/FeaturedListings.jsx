import React from "react";
import { ArrowRight, Star, Heart, MapPin, Maximize2 } from "lucide-react";

const listings = [
  {
    id: 1,
    title: "Căn hộ Studio hiện đại tại Quận 1",
    location: "Quận 1, Hồ Chí Minh",
    price: "8.500.000",
    area: "35m²",
    rating: "4.8",
    image: "https://picsum.photos/seed/apt1/800/600",
    status: "Còn phòng",
    isPopular: true,
  },
  {
    id: 2,
    title: "Căn hộ cao cấp tại Quận 7",
    location: "Quận 7, Hồ Chí Minh",
    price: "12.000.000",
    area: "75m²",
    rating: "4.9",
    image: "https://picsum.photos/seed/apt2/800/600",
    status: "Còn phòng",
    isPopular: true,
  },
  {
    id: 3,
    title: "Phòng trọ ấm cúng tại Bình Thạnh",
    location: "Bình Thạnh, Hồ Chí Minh",
    price: "4.500.000",
    area: "20m²",
    rating: "4.5",
    image: "https://picsum.photos/seed/apt3/800/600",
    status: "Còn phòng",
    isPopular: false,
  },
];

const FeaturedListings = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-20">
      {/* Header with Navigation */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
        <div className="space-y-4">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900">
            Tin đăng <span className="text-blue-600">Nổi bật</span>
          </h2>
          <p className="text-slate-500 font-medium text-lg">
            Những căn phòng được đánh giá cao nhất từ cộng đồng
          </p>
        </div>
        <div className="flex gap-3">
          <button className="w-12 h-12 flex items-center justify-center bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-colors shadow-sm">
            <ArrowRight className="w-5 h-5 rotate-180" />
          </button>
          <button className="w-12 h-12 flex items-center justify-center bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-colors shadow-sm">
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {listings.map((item) => (
          <div
            key={item.id}
            className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100/50"
          >
            {/* Image Section */}
            <div className="relative aspect-[1.4/1] overflow-hidden">
              <img
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                src={item.image}
              />
              
              {/* Top Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <div className="bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1.5 rounded-full shadow-sm">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600">
                    {item.status}
                  </span>
                </div>
                {item.isPopular && (
                  <div className="bg-amber-400 px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1">
                    <Star className="w-3 h-3 text-white fill-current" />
                    <span className="text-[10px] font-extrabold text-white uppercase tracking-wider">
                      Phổ biến
                    </span>
                  </div>
                )}
              </div>

              {/* Wishlist Button */}
              <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center transition-all duration-300 text-slate-600 hover:bg-white hover:text-rose-500">
                <Heart className="w-5 h-5" />
              </button>

              {/* Price Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-extrabold text-white">{item.price}</span>
                  <span className="text-xs font-bold text-slate-200">đ/tháng</span>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-5 space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors duration-300">
                  {item.title}
                </h3>
                <div className="flex items-center gap-1.5 mt-1.5 text-slate-500">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium truncate">{item.location}</span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Maximize2 className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-bold">{item.area}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Star className="w-4 h-4 text-amber-400 fill-current" />
                    <span className="text-xs font-bold">{item.rating}</span>
                  </div>
                </div>
                <button className="text-xs font-extrabold text-blue-600 uppercase tracking-widest hover:text-blue-700 transition-colors">
                  Chi tiết
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedListings;
