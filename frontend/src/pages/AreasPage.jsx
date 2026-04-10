import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, MapPin, Building2, Home as HomeIcon, 
  Users, CreditCard, ChevronRight, TrendingUp, 
  Star, Zap, ShieldCheck, ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const areasData = [
  {
    id: "hcm-q1",
    name: "Quận 1",
    listings: "1,240",
    description: "Trung tâm tài chính, biểu tượng của sự hiện đại và xa hoa tại Sài Gòn.",
    apartments: "450",
    rooms: "790",
    featured: true,
    tag: "Hot Area",
    image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: "hcm-q7",
    name: "Quận 7",
    listings: "920",
    description: "Không gian sống chuẩn quốc tế với các khu đô thị sinh thái cao cấp.",
    apartments: "540",
    rooms: "380",
    featured: true,
    tag: "Premium",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: "hcm-bt",
    name: "Bình Thạnh",
    listings: "1,150",
    description: "Nơi giao thoa giữa nhịp sống cũ và mới, cửa ngõ phía Đông thành phố.",
    apartments: "420",
    rooms: "730",
    featured: true,
    tag: "High Demand",
    image: "https://images.unsplash.com/photo-1623075253334-03264627ef7d?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: "hcm-td",
    name: "Thủ Đức",
    listings: "1,580",
    description: "Thành phố trong thành phố - trung tâm giáo dục và công nghệ mới.",
    apartments: "480",
    rooms: "1,100",
    image: "https://images.unsplash.com/photo-1596422846543-75c6fc1850ec?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "hcm-gv",
    name: "Gò Vấp",
    listings: "740",
    description: "Địa điểm lý tưởng cho các gia đình trẻ với chi phí sinh hoạt hợp lý.",
    apartments: "250",
    rooms: "490",
    image: "https://images.unsplash.com/photo-1590674154474-0f3df9648934?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "hcm-q2",
    name: "Quận 2",
    listings: "880",
    description: "Khu vực ven sông thơ mộng, tập trung cộng đồng cư dân quốc tế.",
    apartments: "610",
    rooms: "270",
    image: "https://images.unsplash.com/photo-1518005020251-582c7884474a?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "hcm-q3",
    name: "Quận 3",
    listings: "520",
    description: "Yên tĩnh với những con đường rợp bóng cây và biệt thự cổ điển.",
    apartments: "180",
    rooms: "340",
    image: "https://images.unsplash.com/photo-1563245339-dfc20aac6507?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "hcm-q10",
    name: "Quận 10",
    listings: "670",
    description: "Thiên đường mua sắm và ẩm thực, nhộn nhịp suốt ngày đêm.",
    apartments: "240",
    rooms: "430",
    image: "https://images.unsplash.com/photo-1570160234645-832c3556f33d?auto=format&fit=crop&q=80&w=800",
  }
];

const BackgroundBlobs = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <motion.div 
      animate={{ 
        x: [0, 100, 0], 
        y: [0, -50, 0], 
        scale: [1, 1.2, 1] 
      }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]"
    />
    <motion.div 
      animate={{ 
        x: [0, -80, 0], 
        y: [0, 60, 0], 
        scale: [1, 1.1, 1] 
      }}
      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px]"
    />
  </div>
);

const AreasPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const featuredAreas = areasData.filter(a => a.featured);
  const remainingAreas = areasData.filter(a => !a.featured && a.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSearchClick = () => {
    if (searchTerm) navigate(`/search?district=${searchTerm}`);
  };

  const handleAreaClick = (areaName) => {
    navigate(`/search?district=${areaName}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col selection:bg-blue-600/30">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="relative pt-40 pb-24 px-6">
        <BackgroundBlobs />
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8 animate-pulse">
              <TrendingUp size={14} />
              Trải nghiệm tìm nhà đột phá
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.9] italic">
              Vị trí lý tưởng<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-400">
                Tầm nhìn tương lai.
              </span>
            </h1>
            
            <p className="text-slate-400 text-lg md:text-xl font-bold max-w-2xl mx-auto mb-16 tracking-tight leading-relaxed">
              Khám phá các khu vực phát triển nhất Việt Nam. Hệ thống giúp bạn phân tích 
              chi tiết từng quận huyện để đưa ra lựa chọn đầu tư và an cư thông minh nhất.
            </p>

            {/* Smart Search Bar */}
            <div className="max-w-3xl mx-auto relative group">
              <div className="absolute inset-0 bg-blue-600 opacity-20 blur-3xl group-focus-within:opacity-40 transition-opacity"></div>
              <div className="relative flex items-center bg-white/5 border border-white/10 rounded-[2rem] p-2 backdrop-blur-3xl group-focus-within:border-blue-500/50 transition-all">
                <div className="flex-1 flex items-center px-6">
                  <Search className="text-slate-500 mr-4" size={24} />
                  <input 
                    type="text" 
                    placeholder="Tìm theo quận, huyện..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearchClick()}
                    className="w-full bg-transparent text-white font-bold text-xl py-4 focus:outline-none placeholder:text-slate-600"
                  />
                </div>
                <button 
                  onClick={handleSearchClick}
                  className="px-10 py-5 bg-blue-600 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all active:scale-95 shadow-xl shadow-blue-900/20"
                >
                  Bắt đầu khám phá
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. FEATURED AREAS SECTION */}
      <section className="bg-[#080b13] py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-px w-12 bg-blue-600"></div>
                <span className="text-blue-500 text-[10px] font-black uppercase tracking-[0.3em]">Top Destinations</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter capitalize">Khu vực nổi bật</h2>
            </div>
            <p className="text-slate-500 font-bold max-w-sm">Những quận được săn đón nhất với tỷ lệ tin đăng mới và lượt xem cao nhất trong tuần qua.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {featuredAreas.map((area, index) => (
                <motion.div
                  key={area.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleAreaClick(area.name)}
                  className="group relative h-[600px] rounded-[4rem] overflow-hidden cursor-pointer shadow-2xl border border-white/5"
                >
                  <img src={area.image} alt={area.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent"></div>
                  
                  <div className="absolute top-10 left-10">
                    <span className="px-6 py-2 bg-blue-600/90 backdrop-blur-md rounded-full text-white text-[10px] font-black uppercase tracking-widest shadow-xl">
                      {area.tag}
                    </span>
                  </div>

                  <div className="absolute bottom-12 left-10 right-10 space-y-6">
                    <div className="space-y-2">
                       <div className="flex items-center gap-2 text-blue-400">
                        <Zap size={16} className="fill-current" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{area.listings} listings today</span>
                      </div>
                      <h3 className="text-5xl font-black text-white italic tracking-tighter">{area.name}</h3>
                    </div>
                    
                    <p className="text-slate-300 font-bold leading-relaxed opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                      {area.description}
                    </p>

                    <div className="flex items-center gap-6 pt-4">
                      <div className="flex -space-x-3 overflow-hidden">
                        {[1,2,3].map(i => (
                          <img key={i} className="inline-block h-10 w-10 rounded-full ring-4 ring-slate-900" src={`https://i.pravatar.cc/100?img=${i+10}`} alt="" />
                        ))}
                      </div>
                      <span className="text-white font-bold text-xs">+2.4k đang tìm kiếm</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 3. ALL AREAS GRID */}
      <section className="bg-slate-50 py-32 px-6 rounded-t-[5rem] -mt-20 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-6 mb-20">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 italic tracking-tighter">Mở rộng tìm kiếm</h2>
            <div className="flex items-center justify-center gap-4">
              <div className="px-5 py-2 bg-white rounded-full border border-slate-200 text-slate-500 text-[10px] font-black uppercase tracking-widest shadow-sm">
                Tất cả 24 Quận/Huyện
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {remainingAreas.map((area, index) => (
              <motion.div
                key={area.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleAreaClick(area.name)}
                className="group bg-white rounded-[3rem] p-3 shadow-md border border-slate-50 hover:shadow-2xl hover:shadow-blue-100 transition-all duration-500 cursor-pointer"
              >
                <div className="relative h-44 rounded-[2.2rem] overflow-hidden mb-6">
                  <img src={area.image} alt={area.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                  <div className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-xl text-white opacity-0 group-hover:opacity-100 transition-all">
                    <ArrowRight size={18} />
                  </div>
                </div>

                <div className="px-4 pb-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-2xl font-black text-slate-900 italic tracking-tight">{area.name}</h4>
                    <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-md uppercase tracking-wider">{area.listings}</span>
                  </div>
                  
                  <div className="flex items-center gap-4 pt-4 border-t border-slate-50">
                    <div className="flex-1 space-y-1">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.1em]">Căn hộ</p>
                      <p className="text-sm font-black text-slate-700">{area.apartments}</p>
                    </div>
                    <div className="w-px h-6 bg-slate-100"></div>
                    <div className="flex-1 space-y-1 text-right">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.1em]">Phòng trọ</p>
                      <p className="text-sm font-black text-slate-700">{area.rooms}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 4. TRUST BANNER */}
        <div className="max-w-7xl mx-auto mt-40">
          <div className="bg-slate-900 rounded-[4rem] p-12 md:p-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[80px]"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
              <div className="flex-1 space-y-4">
                <h3 className="text-4xl font-black text-white italic tracking-tighter leading-tight">Sẵn sàng tìm kiếm ngôi nhà mơ ước?</h3>
                <p className="text-slate-400 font-bold">Hàng nghìn tin đăng được xác thực mỗi ngày đang chờ đợi bạn tại các khu vực đẹp nhất.</p>
              </div>
              <div className="flex flex-wrap justify-center gap-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-white">
                    <ShieldCheck className="text-emerald-500" size={24} />
                    <span className="text-2xl font-black italic tracking-tighter">100%</span>
                  </div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Xác thực tin</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-white">
                    <Star className="text-amber-400 fill-current" size={24} />
                    <span className="text-2xl font-black italic tracking-tighter">4.9/5</span>
                  </div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Đánh giá app</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AreasPage;
