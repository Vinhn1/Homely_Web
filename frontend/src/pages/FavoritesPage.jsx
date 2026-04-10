import React, { useEffect } from "react";
import { usePropertyStore } from "../store/propertyStore";
import PropertyCard from "../components/PropertyCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Heart, Home, ArrowRight, Loader } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const FavoritesPage = () => {
  const { properties, fetchProperties, favorites, isLoading } = usePropertyStore();

  useEffect(() => {
    // Fetch properties if not already loaded
    if (properties.length === 0) {
      fetchProperties();
    }
  }, [fetchProperties, properties.length]);

  const favoriteProperties = properties.filter((p) => favorites.includes(p._id));

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 pb-20 px-6 max-w-7xl mx-auto w-full">
        {/* Header Section */}
        <div className="mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-red-100 rounded-xl text-red-500">
                  <Heart size={24} fill="currentColor" />
                </div>
                <span className="text-sm font-bold text-red-500 uppercase tracking-widest">Bộ sưu tập</span>
              </div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                Yêu thích của bạn
              </h1>
            </div>
            
            <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Đã lưu</p>
                <p className="text-xl font-black text-slate-900 leading-none">{favoriteProperties.length}</p>
              </div>
              <div className="h-8 w-[1px] bg-slate-100"></div>
              <div className="text-right text-slate-400">
                <Home size={20} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Content Area */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader className="w-10 h-10 animate-spin text-blue-600 mb-4" />
            <p className="text-slate-500 font-medium">Đang tải danh sách yêu thích...</p>
          </div>
        ) : favoriteProperties.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {favoriteProperties.map((property, index) => (
                <motion.div
                  key={property._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                  transition={{ delay: index * 0.05 }}
                >
                  <PropertyCard property={property} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-3xl border border-slate-100 p-12 text-center max-w-2xl mx-auto shadow-sm"
          >
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
              <Heart size={48} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-3">Danh sách trống</h2>
            <p className="text-slate-500 font-medium mb-8 leading-relaxed">
              Bạn chưa lưu bất động sản nào vào danh mục yêu thích. 
              Hãy khám phá các căn hộ tuyệt vời trên Homely và lưu lại nhé!
            </p>
            <Link 
              to="/search" 
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-blue-700 transition-all hover:shadow-xl hover:shadow-blue-200 active:scale-95"
            >
              KHÁM PHÁ NGAY <ArrowRight size={20} />
            </Link>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default FavoritesPage;
