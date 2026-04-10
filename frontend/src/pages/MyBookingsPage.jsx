import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, MapPin, Clock, ChevronRight, 
  AlertCircle, CheckCircle2, XCircle, Loader2,
  ArrowLeft, Building2, Trash2
} from "lucide-react";
import { useBookingStore } from "@/store/bookingStore";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";

const MyBookingsPage = () => {
  const { myBookings, fetchMyBookings, cancelBooking, isLoading } = useBookingStore();

  useEffect(() => {
    fetchMyBookings();
  }, [fetchMyBookings]);

  const handleCancel = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn hủy yêu cầu đặt phòng này?")) {
      const result = await cancelBooking(id);
      if (result.success) {
        toast.success("Đã hủy yêu cầu đặt phòng");
      } else {
        toast.error(result.message);
      }
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'pending':
        return { 
          label: "Đang chờ duyệt", 
          icon: Clock, 
          color: "text-amber-600 bg-amber-50 border-amber-100",
          dot: "bg-amber-500"
        };
      case 'confirmed':
        return { 
          label: "Đã xác nhận", 
          icon: CheckCircle2, 
          color: "text-emerald-600 bg-emerald-50 border-emerald-100",
          dot: "bg-emerald-500"
        };
      case 'cancelled':
        return { 
          label: "Đã hủy", 
          icon: XCircle, 
          color: "text-slate-500 bg-slate-50 border-slate-100",
          dot: "bg-slate-400"
        };
      case 'rejected':
        return { 
          label: "Bị từ chối", 
          icon: AlertCircle, 
          color: "text-red-600 bg-red-50 border-red-100",
          dot: "bg-red-500"
        };
      default:
        return { 
          label: status, 
          icon: AlertCircle, 
          color: "text-slate-600 bg-slate-50 border-slate-100",
          dot: "bg-slate-400"
        };
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen font-geist">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:gap-3 transition-all mb-2">
              <ArrowLeft size={16} /> Quay lại trang chủ
            </Link>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Căn hộ của tôi</h1>
            <p className="text-slate-500 font-medium">Theo dõi và quản lý các yêu cầu đặt phòng của bạn</p>
          </div>
          
          <div className="flex gap-4 p-1 bg-white border border-slate-100 rounded-2xl shadow-sm">
            <button className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-100 transition-all">Đã đặt</button>
            <button className="px-6 py-2.5 text-slate-500 hover:text-slate-900 rounded-xl text-sm font-bold transition-all">Yêu thích</button>
          </div>
        </div>

        {isLoading && myBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 font-bold animate-pulse uppercase tracking-widest text-xs">Đang tải danh sách...</p>
          </div>
        ) : myBookings.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24 bg-white rounded-[40px] border border-dashed border-slate-200 shadow-sm"
          >
            <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
              <Building2 size={40} />
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-2">Chưa có căn hộ nào</h3>
            <p className="text-slate-400 mb-8 max-w-xs mx-auto font-medium">Bạn chưa thực hiện yêu cầu thuê căn hộ nào. Hãy khám phá và tìm nơi ở ưng ý nhất!</p>
            <Link 
              to="/search" 
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 hover:-translate-y-1"
            >
              Tìm kiếm ngay
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {myBookings.map((booking) => {
                const status = getStatusConfig(booking.status);
                const StatusIcon = status.icon;
                
                return (
                  <motion.div
                    key={booking._id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group bg-white p-5 md:p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-500 flex flex-col md:flex-row gap-6 items-center"
                  >
                    {/* Thumbnail */}
                    <div className="w-full md:w-48 h-40 rounded-2xl overflow-hidden shrink-0 relative">
                      <img 
                        src={booking.property?.images?.[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=2070"} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        alt="property" 
                      />
                      <div className={`absolute top-3 left-3 px-3 py-1.5 rounded-xl border flex items-center gap-1.5 backdrop-blur-md font-black text-[10px] uppercase tracking-wider ${status.color}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${status.dot} animate-pulse`}></div>
                        <StatusIcon size={12} />
                        {status.label}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="text-xl font-black text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                          {booking.property?.title || "Căn hộ Homely"}
                        </h3>
                        <div className="flex items-center gap-1.5 text-slate-400 text-sm font-medium">
                          <MapPin size={14} className="text-blue-500" />
                          {booking.property?.location?.address}, {booking.property?.location?.city}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8">
                        <div className="space-y-1">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Ngày dọn vào</span>
                          <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
                            <Calendar size={14} className="text-blue-500" />
                            {new Date(booking.moveInDate).toLocaleDateString('vi-VN')}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Thời hạn thuê</span>
                          <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
                            <Clock size={14} className="text-blue-500" />
                            {booking.leaseTerm}
                          </div>
                        </div>
                        <div className="space-y-1 hidden lg:block">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Tổng giá trị</span>
                          <div className="text-blue-600 font-black text-sm">
                            {booking.totalPrice?.toLocaleString('vi-VN')} đ
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto">
                      <Link 
                        to={`/property/${booking.property?._id}`}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-slate-50 text-slate-600 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-slate-100 transition-all"
                      >
                        Chi tiết <ChevronRight size={16} />
                      </Link>
                      
                      {booking.status === 'pending' && (
                        <button 
                          onClick={() => handleCancel(booking._id)}
                          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-red-50 text-red-600 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-red-100 transition-all border border-red-100"
                        >
                          <Trash2 size={16} /> Hủy đơn
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MyBookingsPage;
