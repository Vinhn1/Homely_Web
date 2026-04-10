import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, MapPin, Clock, ChevronRight, 
  CheckCircle2, XCircle, Loader2,
  Building2, Trash2, AlertCircle
} from "lucide-react";
import { useBookingStore } from "@/store/bookingStore";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const BookingHistoryTab = () => {
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

  if (isLoading && myBookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="text-slate-400 font-bold animate-pulse uppercase tracking-widest text-[10px]">Đang tải lịch sử...</p>
      </div>
    );
  }

  if (myBookings.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16 bg-white/50 rounded-[40px] border border-dashed border-slate-200"
      >
        <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
          <Building2 size={32} />
        </div>
        <h3 className="text-lg font-black text-slate-800 mb-2 whitespace-nowrap">Chưa có căn hộ nào</h3>
        <p className="text-slate-400 mb-8 max-w-xs mx-auto font-medium text-xs">Bạn chưa thực hiện yêu cầu thuê căn hộ nào.</p>
        <Link 
          to="/search" 
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
        >
          Khám phá ngay
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Lịch sử thuê phòng</h2>
        <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
            {myBookings.length} Yêu cầu
        </span>
      </div>

      <div className="space-y-4">
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
                className="group bg-white p-4 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-500 flex flex-col sm:flex-row gap-5 items-center"
              >
                {/* Thumbnail */}
                <div className="w-full sm:w-32 h-24 rounded-2xl overflow-hidden shrink-0 relative">
                  <img 
                    src={booking.property?.images?.[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=2070"} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    alt="property" 
                  />
                  <div className={`absolute top-2 left-2 px-2 py-1 rounded-lg border flex items-center gap-1 backdrop-blur-md font-black text-[8px] uppercase tracking-wider ${status.color}`}>
                    <StatusIcon size={10} />
                    {status.label}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-3 min-w-0 text-center sm:text-left">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                      {booking.property?.title || "Căn hộ Homely"}
                    </h3>
                    <div className="flex items-center justify-center sm:justify-start gap-1 text-slate-400 text-[10px] font-bold">
                      <MapPin size={10} className="text-blue-500" />
                      <span className="truncate">{booking.property?.location?.city}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center sm:justify-start gap-4">
                    <div className="flex items-center gap-1.5 text-slate-700 font-bold text-[10px]">
                        <Calendar size={12} className="text-blue-500" />
                        {new Date(booking.moveInDate).toLocaleDateString('vi-VN')}
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-700 font-bold text-[10px]">
                        <Clock size={12} className="text-blue-500" />
                        {booking.leaseTerm}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
                  <Link 
                    to={`/property/${booking.property?._id}`}
                    className="flex-1 p-3 bg-slate-50 text-slate-400 rounded-2xl hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center"
                  >
                    <ChevronRight size={18} />
                  </Link>
                  
                  {booking.status === 'pending' && (
                    <button 
                      onClick={() => handleCancel(booking._id)}
                      className="flex-1 p-3 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-100 transition-all border border-rose-100 flex items-center justify-center"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BookingHistoryTab;
