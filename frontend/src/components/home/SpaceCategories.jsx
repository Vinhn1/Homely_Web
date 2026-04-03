import React from "react";
import { Building2, Home, Maximize2, Building } from "lucide-react";

const categories = [
  {
    title: "Căn hộ",
    count: "1,240 tin đăng",
    icon: Building2,
    color: "brand", // Sẽ dùng blue nếu chưa có brand
    bgOklab: "oklab(0.623066 -0.0332245 -0.185038 / 0.1)",
    textColor: "text-blue-400",
    borderColor: "border-blue-500/20",
  },
  {
    title: "Phòng trọ",
    count: "5,620 tin đăng",
    icon: Home,
    color: "emerald",
    bgOklab: "oklab(0.696 -0.162114 0.0511765 / 0.1)",
    textColor: "text-emerald-400",
    borderColor: "border-emerald-500/20",
  },
  {
    title: "Studio",
    count: "840 tin đăng",
    icon: Maximize2,
    color: "purple",
    bgOklab: "oklab(0.627 0.147802 -0.219953 / 0.1)",
    textColor: "text-purple-400",
    borderColor: "border-purple-500/20",
  },
  {
    title: "Nhà nguyên căn",
    count: "420 tin đăng",
    icon: Building,
    color: "amber",
    bgOklab: "oklab(0.769 0.0640531 0.176752 / 0.1)",
    textColor: "text-amber-400",
    borderColor: "border-amber-500/20",
  },
];

const SpaceCategories = () => {
  return (
    <section className="bg-slate-950 py-32 overflow-hidden relative">
      {/* Glow Effects Background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px]"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white">
            Bạn đang tìm kiếm <span className="text-blue-400">không gian</span> nào?
          </h2>
          <p className="text-slate-400 font-medium text-lg leading-relaxed">
            Dù bạn là sinh viên, người đi làm hay gia đình trẻ, chúng tôi đều có những lựa chọn tối ưu nhất dành cho bạn.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, index) => (
            <div
              key={index}
              style={{ backgroundColor: cat.bgOklab }}
              className={`p-10 rounded-[2.5rem] border ${cat.borderColor} ${cat.textColor} transition-all duration-500 group cursor-pointer hover:scale-[1.02] hover:bg-opacity-20`}
            >
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                <cat.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-extrabold text-white mb-2">
                {cat.title}
              </h3>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
                {cat.count}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpaceCategories;
