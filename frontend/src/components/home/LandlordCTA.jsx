import React from "react";
import { ShieldCheck, Sparkles, Zap, Users } from "lucide-react";

const features = [
  {
    title: "Xác thực 100%",
    desc: "Tin đăng được kiểm duyệt kỹ lưỡng.",
    icon: ShieldCheck,
    iconColor: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  {
    title: "Hỗ trợ AI",
    desc: "Tìm phòng theo phong cách sống.",
    icon: Sparkles,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Thanh toán",
    desc: "Giao dịch an toàn, minh bạch.",
    icon: Zap,
    iconColor: "text-amber-600",
    bgColor: "bg-amber-50",
  },
  {
    title: "Cộng đồng",
    desc: "Đánh giá thực từ người thuê.",
    icon: Users,
    iconColor: "text-purple-600",
    bgColor: "bg-purple-50",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-24">
      <div className="bg-white rounded-[4rem] p-12 md:p-24 shadow-2xl shadow-slate-200/50 border border-slate-100 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center overflow-hidden relative">
        {/* Decorative Circle */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

        {/* Left Content */}
        <div className="space-y-12 relative z-10">
          <div className="space-y-6">
            <h2 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-[1.1]">
              Tại sao chọn <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Homely?
              </span>
            </h2>
            <p className="text-slate-500 text-lg font-medium leading-relaxed">
              Chúng tôi tái định nghĩa trải nghiệm thuê nhà bằng công nghệ và sự tận tâm.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {features.map((feat, index) => (
              <div key={index} className="space-y-4">
                <div className={`w-12 h-12 ${feat.iconColor} ${feat.bgColor} rounded-2xl flex items-center justify-center`}>
                  <feat.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900">{feat.title}</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Image with Badge */}
        <div className="relative">
          <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl rotate-3">
            <img
              alt="Modern Living"
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1000"
            />
          </div>
          {/* Floating Badge */}
          <div className="absolute -bottom-10 -left-10 bg-blue-600 p-8 rounded-3xl shadow-2xl text-white space-y-2 -rotate-3">
            <div className="text-4xl font-extrabold">10k+</div>
            <div className="text-[10px] font-black uppercase tracking-widest opacity-80">
              Phòng trọ đã xác thực
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
