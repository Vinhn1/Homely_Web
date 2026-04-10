import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Search, Calendar, User, ArrowRight, Share2, Bookmark, Sparkles, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const categories = [
  "Tất cả", 
  "Mẹo Thuê Nhà", 
  "Hướng Dẫn Thành Phố", 
  "Pháp Lý", 
  "Thiết Kế Nội Thất", 
  "Tin Tức Thị Trường"
];

const blogPosts = [
  {
    id: 1,
    title: "10 Mẹo Tìm Căn Hộ Hoàn Hảo Tại TP.HCM",
    excerpt: "Tìm kiếm thị trường cho thuê tại TP.HCM có thể đầy thách thức. Dưới đây là những mẹo hàng đầu giúp bạn tìm được ngôi nhà mơ ước...",
    category: "Mẹo Thuê Nhà",
    author: "Đội ngũ Homely",
    date: "20 Th3, 2024",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
    readTime: "5 phút đọc",
    url: "https://www.google.com/search?q=mẹo+thuê+căn+hộ+hồ+chí+minh"
  },
  {
    id: 2,
    title: "Hiểu Rõ Hợp Đồng Thuê Nhà Tại Việt Nam",
    excerpt: "Trước khi bạn đặt bút ký, hãy đảm bảo bạn hiểu rõ các điều khoản và điều kiện chính trong thỏa thuận thuê nhà của mình...",
    category: "Pháp Lý",
    author: "Chuyên gia Pháp lý",
    date: "18 Th3, 2024",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800",
    readTime: "8 phút đọc",
    url: "https://www.google.com/search?q=hợp+đồng+thuê+nhà+việt+nam+quy+định"
  },
  {
    id: 3,
    title: "Top 5 Quận Đáng Sống Cho Người Nước Ngoài Năm 2024",
    excerpt: "Từ những con phố nhộn nhịp của Quận 1 đến những vùng ngoại ô yên tĩnh của Quận 7, hãy khám phá những nơi tốt nhất để sống...",
    category: "Hướng Dẫn Thành Phố",
    author: "Người Du Hành",
    date: "15 Th3, 2024",
    image: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&q=80&w=800",
    readTime: "6 phút đọc",
    url: "https://www.google.com/search?q=top+districts+to+live+in+saigon+for+expats"
  },
  {
    id: 4,
    title: "Thiết Kế Căn Hộ Nhỏ: Tối Ưu Không Gian Sống",
    excerpt: "Không gian nhỏ không có nghĩa là phải hy sinh sở thích. Học cách biến căn hộ studio của bạn thành một thiên đường đầy phong cách...",
    category: "Thiết Kế Nội Thất",
    author: "Kiến trúc sư Minh",
    date: "10 Th3, 2024",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800",
    readTime: "4 phút đọc",
    url: "https://www.google.com/search?q=thiết+kế+căn+hộ+nhỏ+thông+minh"
  },
  {
    id: 5,
    title: "Phân Tích Thị Trường Cho Thuê Quý 1/2024",
    excerpt: "Giá thuê nhà đang thay đổi như thế nào? Cùng xem qua các số liệu thống kê mới nhất về tình hình bất động sản cho thuê tại các thành phố lớn...",
    category: "Tin Tức Thị Trường",
    author: "Nhà phân tích BĐS",
    date: "05 Th3, 2024",
    image: "https://images.unsplash.com/photo-1460472178825-e5240623abe5?auto=format&fit=crop&q=80&w=800",
    readTime: "10 phút đọc",
    url: "https://www.google.com/search?q=thị+trường+bất+động+sản+cho+thuê+2024"
  },
  {
    id: 6,
    title: "Cách Deal Giá Thuê Nhà Hiệu Quả",
    excerpt: "Đừng vội vàng chấp nhận mức giá đầu tiên. Những bí kíp thương thảo này sẽ giúp bạn tiết kiệm hàng triệu đồng mỗi tháng...",
    category: "Mẹo Thuê Nhà",
    author: "Đội ngũ Homely",
    date: "01 Th3, 2024",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800",
    readTime: "5 phút đọc",
    url: "https://www.google.com/search?q=cách+thương+lượng+giá+thuê+nhà"
  }
];

const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = blogPosts.filter(post => 
    (selectedCategory === "Tất cả" || post.category === selectedCategory) &&
    (post.title.toLowerCase().includes(searchQuery.toLowerCase()) || post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-slate-950 text-white overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
           <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/30 rounded-full blur-[150px] animate-pulse" />
           <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="bg-blue-600/10 border border-blue-500/20 p-3 rounded-2xl backdrop-blur-xl mb-4">
              <Sparkles className="text-blue-400" size={32} />
            </div>
            <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter mb-4 leading-none">
              BLOG <span className="text-blue-500">HOMELY</span>
            </h1>
            <p className="text-xl text-slate-400 font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
              Cẩm nang tối ưu để thuê nhà, sinh sống và phát triển tại tổ ấm mới của bạn.
            </p>

            {/* Search Bar */}
            <div className="w-full max-w-2xl relative">
              <input 
                type="text" 
                placeholder="Tìm kiếm bài viết..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-800 focus:border-blue-500/50 p-5 pl-14 rounded-3xl outline-none text-lg font-medium transition-all backdrop-blur-xl shadow-2xl"
              />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={24} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Categories Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
          <div className="bg-white/80 p-2 rounded-[24px] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-wrap justify-center backdrop-blur-sm">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all ${
                  selectedCategory === category 
                    ? "bg-slate-950 text-white shadow-lg shadow-slate-950/20 scale-105" 
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence mode="popLayout">
            {filteredPosts.map((post, index) => (
              <motion.article
                layout
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-blue-200/30 transition-all group flex flex-col h-full"
              >
                {/* Image Section */}
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm">
                      {post.category}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4 translate-y-12 group-hover:translate-y-0 transition-transform opacity-0 group-hover:opacity-100">
                    <button className="p-3 bg-blue-600 text-white rounded-2xl shadow-xl">
                       <Bookmark size={18} />
                    </button>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 text-slate-400 text-xs font-bold mb-4 uppercase tracking-widest">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-blue-500" />
                      {post.date}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User size={14} className="text-blue-500" />
                      {post.author}
                    </div>
                  </div>

                  <h3 className="text-2xl font-black italic tracking-tight text-slate-900 mb-4 group-hover:text-blue-600 transition-colors leading-tight">
                    {post.title}
                  </h3>

                  <p className="text-slate-500 font-medium line-clamp-3 mb-8 leading-relaxed">
                    {post.excerpt}
                  </p>

                  <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-50">
                    <a 
                      href={post.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 font-black text-sm flex items-center gap-2 hover:gap-3 transition-all cursor-pointer"
                    >
                      ĐỌC THÊM <ArrowRight size={18} strokeWidth={3} />
                    </a>
                    <span className="text-slate-300 text-[10px] font-bold uppercase tracking-tighter">
                      {post.readTime}
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="py-20 text-center">
            <h3 className="text-2xl font-bold text-slate-800">Không tìm thấy bài viết nào</h3>
            <p className="text-slate-500 mt-2">Hãy thử thay đổi từ khóa hoặc chủ đề tìm kiếm.</p>
          </div>
        )}

        {/* Newsletter Section */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-32 relative bg-blue-600 rounded-[40px] p-10 md:p-16 overflow-hidden shadow-2xl shadow-blue-500/30"
        >
           <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white opacity-10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
           
           <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
              <div className="max-w-xl text-center lg:text-left">
                 <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter text-white mb-6 leading-none">
                    CẬP NHẬT TIN TỨC TỪ HOMELY
                 </h2>
                 <p className="text-blue-100 text-lg font-medium opacity-80">
                    Nhận những mẹo thuê nhà mới nhất và tin tức thị trường gửi trực tiếp đến hộp thư của bạn.
                 </p>
              </div>

              <div className="w-full max-w-md bg-white p-2 rounded-[24px] flex items-center shadow-2xl">
                 <div className="pl-4 text-slate-400">
                    <Mail size={20} />
                 </div>
                 <input 
                    type="email" 
                    placeholder="Nhập email của bạn..." 
                    className="flex-grow p-4 outline-none font-bold text-slate-800 placeholder:text-slate-300"
                 />
                 <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-95 whitespace-nowrap">
                    Đăng ký ngay
                 </button>
              </div>
           </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPage;
