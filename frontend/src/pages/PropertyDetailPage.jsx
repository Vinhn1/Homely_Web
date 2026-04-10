import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, Star, Maximize, Shield, Clock, Users, 
  Wifi, Wind, ArrowUpCircle, Utensils, Box, Info as InfoIcon,
  ChevronLeft, ChevronRight, Calendar, MessageSquare, 
  CheckCircle2, Share2, Heart, ShieldCheck, Send, Loader2, Flag, X
} from "lucide-react";
import { usePropertyStore } from "@/store/propertyStore";
import { useAuthStore } from "@/store/authStore";
import { useBookingStore } from "@/store/bookingStore";
import { useChatStore } from "@/store/chatStore";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import axios from "@/api/axios";

const PropertyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchPropertyById, selectedProperty, isLoading, error, addReview, favorites, toggleFavorite } = usePropertyStore();
  const { user, isAuthenticated } = useAuthStore();
  const { createBooking, isLoading: isBookingLoading } = useBookingStore();
  const { getOrCreateConversation } = useChatStore();
  
  const [activeImage, setActiveImage] = useState(0);
  
  // Booking Form State
  const [moveInDate, setMoveInDate] = useState("");
  const [leaseTerm, setLeaseTerm] = useState("6 Tháng");
  const [note, setNote] = useState("");
  
  // Review Form State
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Report Modal State
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  const REPORT_REASONS = [
    'Thông tin sai lệch',
    'Ảnh giả mạo / không đúng thực tế',
    'Giá cả gian lận',
    'Nội dung không phù hợp',
    'Lừa đảo / scam',
    'Vi phạm quy định cộng đồng',
    'Khác'
  ];

  // Logic tự động lướt ảnh
  const nextImage = useCallback(() => {
    if (selectedProperty?.images?.length > 0) {
      setActiveImage((prev) => (prev + 1) % selectedProperty.images.length);
    }
  }, [selectedProperty?.images?.length]);

  const prevImage = useCallback(() => {
    if (selectedProperty?.images?.length > 0) {
      setActiveImage((prev) => (prev - 1 + selectedProperty.images.length) % selectedProperty.images.length);
    }
  }, [selectedProperty?.images?.length]);

  useEffect(() => {
    fetchPropertyById(id);
    window.scrollTo(0, 0);
  }, [id, fetchPropertyById]);

  // Auto-play interval
  useEffect(() => {
    const timer = setInterval(() => {
      nextImage();
    }, 4500);
    return () => clearInterval(timer);
  }, [nextImage]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return toast.error("Vui lòng nhập nhận xét");

    setIsSubmittingReview(true);
    const result = await addReview(id, { rating: reviewRating, comment: reviewComment });
    setIsSubmittingReview(false);

    if (result.success) {
      toast.success("Cảm ơn đánh giá của bạn!");
      setReviewComment("");
      setReviewRating(5);
      setShowReviewForm(false);
    } else {
      toast.error(result.message);
    }
  };

  const handleReportSubmit = async () => {
    if (!isAuthenticated) return toast.error('Vui lòng đăng nhập để báo cáo');
    if (!reportReason) return toast.error('Vui lòng chọn lý do báo cáo');

    setIsSubmittingReport(true);
    try {
      await axios.post('/reports', {
        targetType: 'property',
        targetId: id,
        reason: reportReason,
        description: reportDescription
      });
      toast.success('✅ Báo cáo đã được gửi!');
      setShowReportModal(false);
      setReportReason('');
      setReportDescription('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi gửi báo cáo');
    } finally {
      setIsSubmittingReport(false);
    }
  };

  const handleBookingSubmit = async () => {
    if (!isAuthenticated) return toast.error("Vui lòng đăng nhập để đặt phòng");
    if (!moveInDate) return toast.error("Vui lòng chọn ngày dọn vào");

    const result = await createBooking({
      propertyId: id,
      moveInDate,
      leaseTerm,
      note: "Người dùng đặt từ trang chi tiết"
    });

    if (result.success) {
      toast.success("Đặt phòng thành công! Đang chuyển hướng...");
      setTimeout(() => {
        navigate("/my-bookings");
      }, 1500);
    } else {
      toast.error(result.message);
    }
  };

  const handleChatWithOwner = async () => {
    if (!isAuthenticated) return toast.error("Vui lòng đăng nhập để nhắn tin");
    if (!selectedProperty?.owner) return toast.error("Thông tin chủ nhà không khả dụng");
    if (user?.id === selectedProperty.owner._id) return toast.error("Bạn không thể nhắn tin với chính mình");

    try {
      await getOrCreateConversation(selectedProperty.owner._id);
      navigate("/dashboard/messages");
    } catch (error) {
      toast.error("Không thể khởi tạo cuộc trò chuyện");
    }
  };

  if (isLoading && !selectedProperty) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium animate-pulse">Đang tải thông tin căn hộ...</p>
        </div>
      </div>
    );
  }

  if (error || !selectedProperty) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center p-8 bg-white rounded-3xl shadow-xl max-w-md">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <InfoIcon size={40} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Không tìm thấy căn hộ</h2>
          <p className="text-slate-500 mb-8">{error || "Căn hộ này có thể đã bị gỡ hoặc không tồn tại."}</p>
          <Link to="/search" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all">
            <ChevronLeft size={20} /> Quay lại tìm kiếm
          </Link>
        </div>
      </div>
    );
  }

  const property = selectedProperty;
  const reviews = property.reviews || [];

  const displayAmenities = property.amenities?.length > 0 ? property.amenities : ["Wifi", "Điều hòa", "Thang máy", "Nhà bếp", "An ninh", "Tủ lạnh"];
  
  const getAmenityIcon = (name) => {
    const icons = {
      "Wifi": Wifi,
      "Điều hòa": Wind,
      "Thang máy": ArrowUpCircle,
      "Nhà bếp": Utensils,
      "An ninh": ShieldCheck,
      "Tủ lạnh": Box
    };
    return icons[name] || Box;
  };

  return (
    <div className="bg-slate-50 min-h-screen font-geist">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        {/* 1. Breadcrumbs & Actions */}
        <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
          <nav className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <Link to="/" className="hover:text-blue-600 transition-colors">Trang chủ</Link>
            <ChevronRight size={14} />
            <Link to="/search" className="hover:text-blue-600 transition-colors">Khám phá</Link>
            <ChevronRight size={14} />
            <span className="text-slate-900 truncate max-w-[200px] md:max-w-none">{property.title}</span>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={async () => {
                const url = window.location.href;
                if (navigator.share) {
                  try {
                    await navigator.share({ title: property.title, url });
                  } catch {}
                } else {
                  await navigator.clipboard.writeText(url);
                  toast.success('Đã sao chép link vào clipboard!');
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 text-sm font-bold hover:bg-slate-50 transition-all shadow-sm"
            >
              <Share2 size={18} /> Chia sẻ
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleFavorite(property._id);
                toast.success(favorites.includes(property._id) ? 'Đã bỏ khỏi danh sách yêu thích' : 'Đã thêm vào yêu thích ❤️');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm border ${
                favorites.includes(property._id)
                  ? 'bg-red-50 border-red-200 text-red-500'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Heart size={18} fill={favorites.includes(property._id) ? 'currentColor' : 'none'} /> Lưu lại
            </button>
            {isAuthenticated && user?._id !== property.owner?._id && (
              <button
                onClick={() => setShowReportModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-100 rounded-xl text-red-500 text-sm font-bold hover:bg-red-100 transition-all shadow-sm"
              >
                <Flag size={16} /> Báo cáo
              </button>
            )}
          </div>
        </div>

        {/* 2. Hybrid Image Gallery Grid (1 Big Carousel + 4 Thumbnails) */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12 h-[400px] md:h-[550px]">
          
          {/* Big Carousel Section */}
          <div className="md:col-span-3 rounded-[32px] overflow-hidden relative group shadow-lg border border-slate-100 bg-slate-200">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImage}
                src={property.images?.[activeImage]}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 w-full h-full object-cover"
                alt={`${property.title} - ${activeImage}`}
              />
            </AnimatePresence>

            {/* Carousel Buttons */}
            <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <button 
                onClick={prevImage}
                className="w-10 h-10 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-white/40 transition-all pointer-events-auto shadow-xl"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={nextImage}
                className="w-10 h-10 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-white/40 transition-all pointer-events-auto shadow-xl"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Large Progress Indicators */}
            <div className="absolute bottom-6 left-6 flex gap-1.5 pt-2">
              {property.images?.map((_, idx) => (
                <div 
                  key={idx}
                  className={`h-1 rounded-full transition-all duration-300 ${activeImage === idx ? 'w-8 bg-blue-500' : 'w-2 bg-white/50'}`}
                />
              ))}
            </div>
            
            {/* Counter */}
            <div className="absolute bottom-6 right-6 px-3 py-1 bg-black/20 backdrop-blur-md rounded-lg text-white text-[10px] font-black tracking-widest border border-white/10 uppercase">
              {activeImage + 1} / {property.images?.length || 1}
            </div>
          </div>

          {/* Right Thumbnails Section */}
          <div className="hidden md:flex flex-col gap-3 h-full">
            {property.images?.slice(1, 5).map((img, idx) => (
              <div 
                key={idx} 
                onClick={() => setActiveImage(idx + 1)}
                className={`flex-1 rounded-[24px] overflow-hidden cursor-pointer relative group transition-all duration-300 ${activeImage === idx + 1 ? 'ring-2 ring-blue-500 ring-offset-2' : 'hover:scale-[1.02]'}`}
              >
                <img src={img} className="w-full h-full object-cover group-hover:brightness-95 transition-all" alt={`thumbnail-${idx}`} />
                {idx === 3 && property.images.length > 5 && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-black text-xs uppercase tracking-tighter">
                    +{property.images.length - 5} ảnh
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 3. Main Content & Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Header Info */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <span className="bg-blue-100 text-blue-600 text-[11px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider">{property.property || "Căn hộ"}</span>
                {property.isVerified && (
                  <span className="bg-emerald-100 text-emerald-600 text-[11px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 size={12} /> Đã xác thực
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
                {property.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-slate-500">
                <div className="flex items-center gap-1.5">
                  <MapPin size={18} className="text-blue-500" />
                  <span className="font-medium">{property.location?.address}, {property.location?.city}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star size={18} className="text-amber-400 fill-current" />
                  <span className="font-bold text-slate-900">{property.rating || "5.0"}</span>
                  <span className="text-sm">({property.reviewCount || 0} đánh giá)</span>
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: Maximize, label: "Diện tích", value: `${property.area} m²` },
                { icon: Shield, label: "An ninh", value: property.security || "24/7" },
                { icon: Clock, label: "Thuê tối thiểu", value: property.minLease || "6 Tháng" },
                { icon: Users, label: "Sức chứa", value: `${property.capacity || 2} Người` }
              ].map((stat, idx) => (
                <div key={idx} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col items-center text-center gap-2 hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-1">
                    <stat.icon size={20} />
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{stat.label}</span>
                  <span className="text-sm font-black text-slate-900">{stat.value}</span>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h2 className="text-xl font-black text-slate-900">Về căn hộ này</h2>
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed font-medium">
                {property.description}
              </div>
            </div>

            {/* Amenities Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-black text-slate-900">Tiện ích đi kèm</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {displayAmenities.map((amenity, idx) => {
                  const amenityName = typeof amenity === 'object' ? amenity.name : amenity;
                  const Icon = getAmenityIcon(amenityName);
                  return (
                    <div key={idx} className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-blue-200 transition-all">
                      <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                        <Icon size={16} />
                      </div>
                      <span className="text-sm font-bold text-slate-700">{amenityName}</span>
                      <CheckCircle2 size={14} className="ml-auto text-blue-500" />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="space-y-8 pt-8 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Đánh giá khách hàng</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <Star size={16} className="text-amber-400 fill-current" />
                    <span className="text-sm font-bold text-slate-900">{property.rating || "5.0"}</span>
                    <span className="text-xs text-slate-400">({reviews.length} đánh giá)</span>
                  </div>
                </div>
                
                {isAuthenticated ? (
                  <button 
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="flex items-center gap-2 text-blue-600 font-black text-sm hover:text-blue-700 transition-colors py-2 px-4 bg-blue-50 rounded-xl"
                  >
                    <MessageSquare size={16} />
                    {showReviewForm ? "Hủy bỏ" : "Viết đánh giá"}
                  </button>
                ) : (
                  <Link to="/signin" className="text-blue-600 font-black text-sm hover:underline">Đăng nhập để đánh giá</Link>
                )}
              </div>

              {/* Review Input Form */}
              <AnimatePresence>
                {showReviewForm && (
                  <motion.div 
                    initial={{ opacity: 0, y: -20, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -20, height: 0 }}
                    className="overflow-hidden"
                  >
                    <form 
                      onSubmit={handleReviewSubmit}
                      className="bg-white border-2 border-blue-50 p-6 rounded-[32px] space-y-6 mb-8"
                    >
                      <div className="space-y-3">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Bạn đánh giá thế nào?</label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewRating(star)}
                              className="focus:outline-none transition-transform active:scale-90"
                            >
                              <Star 
                                size={32} 
                                className={`${star <= reviewRating ? "text-amber-400 fill-current" : "text-slate-200"}`} 
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Nhận xét của bạn</label>
                        <textarea 
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          placeholder="Chia sẻ trải nghiệm của bạn về căn hộ này..."
                          rows={4}
                          className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-medium text-slate-700 focus:ring-2 ring-blue-500/20 placeholder:text-slate-300 resize-none"
                        ></textarea>
                      </div>

                      <button 
                        type="submit" 
                        disabled={isSubmittingReview}
                        className="flex items-center justify-center gap-2 w-fit px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all disabled:bg-slate-300 shadow-lg shadow-blue-100"
                      >
                        {isSubmittingReview ? (
                          <>
                            <Loader2 size={18} className="animate-spin" /> Đang gửi...
                          </>
                        ) : (
                          <>
                            <Send size={18} /> Gửi đánh giá ngay
                          </>
                        )}
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="space-y-8">
                {reviews.length > 0 ? (
                  reviews.map((review, idx) => (
                    <motion.div 
                      key={review._id || idx} 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center gap-3">
                        {review.user?.avatarUrl ? (
                           <img src={review.user.avatarUrl} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" alt="avatar" />
                        ) : (
                          <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-black">
                            {review.user?.displayName?.charAt(0).toUpperCase() || "U"}
                          </div>
                        )}
                        <div>
                          <div className="font-black text-slate-900">{review.user?.displayName || "Người dùng ẩn danh"}</div>
                          <div className="text-[11px] text-slate-400 font-bold">
                            {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                          </div>
                        </div>
                        <div className="ml-auto flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map(s => (
                            <Star key={s} size={14} className={s <= review.rating ? "text-amber-400 fill-current" : "text-slate-200"} />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-600 font-medium text-sm leading-relaxed pl-15">
                        {review.comment}
                      </p>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-white rounded-[32px] border border-dashed border-slate-200">
                    <p className="text-slate-400 font-medium">Chưa có đánh giá nào cho căn hộ này. Hãy là người đầu tiên!</p>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Sticky Sidebar */}
          <aside className="sticky top-32 space-y-6">
            <div className="bg-white p-8 rounded-[40px] shadow-2xl shadow-blue-900/5 border border-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[80px] -mr-16 -mt-16 rounded-full"></div>
              
              <div className="relative space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-3xl font-black text-blue-600">
                      {property.price?.toLocaleString('vi-VN')}
                    </span>
                    <span className="text-slate-400 text-sm font-bold ml-1">đ/tháng</span>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100">
                    <Star size={14} className="text-amber-400 fill-current" />
                    <span className="text-[13px] font-black text-amber-700">{property.rating || "5.0"}</span>
                  </div>
                </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Ngày dọn vào</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                          type="date" 
                          value={moveInDate}
                          onChange={(e) => setMoveInDate(e.target.value)}
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 ring-blue-500/10 placeholder:text-slate-300" 
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Thời hạn thuê</label>
                      <div className="relative">
                        <select 
                          value={leaseTerm}
                          onChange={(e) => setLeaseTerm(e.target.value)}
                          className="w-full px-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 ring-blue-500/10 appearance-none"
                        >
                          <option>6 Tháng</option>
                          <option>12 Tháng</option>
                          <option>Dài hạn</option>
                        </select>
                        <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4">
                    <button 
                      onClick={handleBookingSubmit}
                      disabled={isBookingLoading}
                      className="w-full py-5 bg-blue-600 text-white rounded-[24px] font-black shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all active:scale-95 text-sm uppercase tracking-widest flex items-center justify-center gap-2"
                    >
                      {isBookingLoading ? (
                        <>
                          <Loader2 size={18} className="animate-spin" /> Đang xử lý...
                        </>
                      ) : (
                        "Thuê ngay"
                      )}
                    </button>
                    <button 
                      onClick={handleChatWithOwner}
                      className="w-full py-5 bg-white text-slate-600 border border-slate-200 rounded-[24px] font-black hover:bg-slate-50 transition-all flex items-center justify-center gap-3 text-sm uppercase tracking-widest shadow-sm"
                    >
                      <MessageSquare size={18} className="text-blue-500" />
                      Nhắn tin với chủ nhà
                    </button>
                  </div>

                <p className="text-center text-[11px] text-slate-400 font-medium px-4">
                  Bạn sẽ chưa bị tính phí. Chúng tôi sẽ nhắc mình trước khi thanh toán.
                </p>
              </div>
            </div>

            {/* Host Profile Card */}
            <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-white text-lg border-2 border-white shadow-lg shrink-0">
                {property.owner?.displayName?.charAt(0).toUpperCase() || "AL"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-black text-slate-900 truncate">Đăng bởi {property.owner?.displayName || "Alex"}</div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold uppercase tracking-tight">
                  <ShieldCheck size={12} /> Chủ nhà đã xác thực
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-50 rounded-2xl flex items-center justify-center">
                  <Flag className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Báo cáo vi phạm</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Giúp chúng tôi giữ cho Homely an toàn</p>
                </div>
              </div>
              <button onClick={() => setShowReportModal(false)} className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-all">
                <X size={16} />
              </button>
            </div>

            {/* Reason Selection */}
            <div className="space-y-2 mb-5">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Chọn lý do *</label>
              <div className="grid grid-cols-1 gap-2">
                {REPORT_REASONS.map(reason => (
                  <button
                    key={reason}
                    onClick={() => setReportReason(reason)}
                    className={`text-left px-4 py-3 rounded-xl border-2 text-sm font-bold transition-all ${
                      reportReason === reason
                        ? 'border-red-400 bg-red-50 text-red-600'
                        : 'border-slate-100 text-slate-600 hover:border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {reason}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2 mb-6">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Mô tả thêm (tùy chọn)</label>
              <textarea
                value={reportDescription}
                onChange={e => setReportDescription(e.target.value)}
                placeholder="Cung cấp thêm chi tiết để chúng tôi xem xét nhanh hơn..."
                rows={3}
                className="w-full border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-red-200 transition-colors"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setShowReportModal(false); setReportReason(''); setReportDescription(''); }}
                className="flex-1 py-3 rounded-2xl border-2 border-slate-100 font-bold text-slate-500 hover:bg-slate-50 transition-all text-sm"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleReportSubmit}
                disabled={!reportReason || isSubmittingReport}
                className="flex-1 py-3 rounded-2xl bg-red-500 text-white font-black hover:bg-red-600 transition-all text-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmittingReport ? <><Loader2 size={16} className="animate-spin" /> Đang gửi...</> : <><Flag size={16} /> Gửi báo cáo</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetailPage;
