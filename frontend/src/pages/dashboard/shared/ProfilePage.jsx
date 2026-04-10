import { useRef, useState, useEffect } from "react";
import { useAuthStore } from "../../../store/authStore";
import { 
  Camera, MapPin, Mail, Phone, User, 
  CheckCircle2, Settings, LogOut, ShieldCheck
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Sidebar from "@/components/dashbroad/Sidebar";
import BookingHistoryTab from "../tabs/BookingHistoryTab";
import { toast } from "sonner";

const ProfilePage = () => {
  const { user, logout, updateProfile } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "personal";

  const fileInputRef = useRef(null);
  
  // Khởi tạo state cho form
  const [formData, setFormData] = useState({
    displayName: user?.displayName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    location: user?.bio || ""
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(user?.avatarUrl || "");

  // ĐỒNG BỘ DỮ LIỆU: Cập nhật form khi user từ store thay đổi (ví dụ sau khi reload trang)
  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || "",
        email: user.email || "",
        phone: user.phone || "",
        location: user.bio || ""
      });
      setImagePreview(user.avatarUrl || "");
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if(file){
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    // Gửi đúng trường 'displayName' thay vì 'name' để khớp Backend
    data.append("displayName", formData.displayName);
    data.append("phone", formData.phone);
    data.append("bio", formData.location);

    if(selectedImage){
      data.append("avatar", selectedImage);
    }

    try{
      await updateProfile(data);
      toast.success("Cập nhật thành công!");
    }catch(error){
      console.error(error);
      toast.error("Có lỗi xảy ra khi cập nhật!");
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
 
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "personal":
        return (
          <div className="bg-white rounded-[48px] p-8 lg:p-10 shadow-[0_32px_120px_-20px_rgba(0,0,0,0.06)] border border-slate-50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50/50 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            
            <div className="relative z-10 space-y-10">
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Thông tin cá nhân</h2>
                <p className="text-slate-400 font-bold text-base">Cập nhật thông tin để mọi người dễ dàng kết nối với bạn</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Họ và tên</label>
                  <input 
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleChange}
                    placeholder="Nhập họ và tên..."
                    className="w-full px-6 py-4 bg-slate-50/50 border-2 border-transparent rounded-[20px] focus:bg-white focus:border-blue-100 focus:ring-[8px] focus:ring-blue-50/30 transition-all outline-none font-bold text-slate-800 text-base placeholder:text-slate-300 shadow-inner"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Địa chỉ Email</label>
                  <input 
                    name="email"
                    value={formData.email}
                    readOnly
                    className="w-full px-6 py-4 bg-slate-200/30 border-2 border-transparent rounded-[20px] cursor-not-allowed text-slate-400 font-bold text-base shadow-inner"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Số điện thoại</label>
                  <input 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Nhập số điện thoại..."
                    className="w-full px-6 py-4 bg-slate-50/50 border-2 border-transparent rounded-[20px] focus:bg-white focus:border-blue-100 focus:ring-[8px] focus:ring-blue-50/30 transition-all outline-none font-bold text-slate-800 text-base placeholder:text-slate-300 shadow-inner"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Vị trí</label>
                  <input 
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Nhập vị trí..."
                    className="w-full px-6 py-4 bg-slate-50/50 border-2 border-transparent rounded-[20px] focus:bg-white focus:border-blue-100 focus:ring-[8px] focus:ring-blue-50/30 transition-all outline-none font-bold text-slate-800 text-base placeholder:text-slate-300 shadow-inner"
                  />
                </div>
              </div>

              <div className="pt-6">
                <button onClick={handleSubmit} className="px-12 py-5 bg-blue-600 text-white rounded-full font-black text-base shadow-2xl shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 transition-all transform hover:-translate-y-1.5 active:scale-95 tracking-wide">
                  Lưu thay đổi hồ sơ
                </button>
              </div>
            </div>
          </div>
        );
      case "history":
        return <BookingHistoryTab />;
      default:
        return (
          <div className="bg-white rounded-[4rem] p-24 flex flex-col items-center justify-center text-center shadow-sm">
              <div className="w-32 h-32 bg-blue-50 rounded-[40px] flex items-center justify-center text-blue-600 mb-10 shadow-inner">
                <Settings size={56} className="animate-spin-slow" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter italic">Đang hoàn thiện tính năng</h3>
              <p className="text-slate-400 font-bold text-lg max-w-sm text-center">Phần này đang được tối ưu hóa giao diện. Vui lòng quay lại sau!</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-10">
      {/* 1. PROFILE HERO SECTION */}
      <section className="bg-white/40 backdrop-blur-md rounded-[48px] p-6 lg:p-8 border border-white/40 shadow-sm relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl"></div>
        
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="relative group">
            <div className="w-36 h-36 rounded-[3rem] overflow-hidden shadow-xl border-4 border-white group-hover:scale-105 transition-transform duration-700">
              <img 
                alt="Profile" 
                className="w-full h-full object-cover" 
                src={imagePreview || `https://ui-avatars.com/api/?name=${user?.displayName || "User"}&background=random`} 
              />
            </div>

            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageChange} 
              className="hidden" 
              accept="image/*" 
            />

            <button onClick={() => {fileInputRef.current.click()}} className="absolute -bottom-1 -right-1 p-3.5 bg-blue-600 text-white rounded-[1.5rem] shadow-xl hover:bg-blue-700 transition-all hover:scale-110 active:scale-95 border-4 border-white">
              <Camera className="w-5 h-5" />
            </button>
          </div>

          <div className="text-center md:text-left space-y-4 flex-1">
            <div className="space-y-1">
              <div className="flex items-center justify-center md:justify-start gap-4">
                <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic">
                  {user?.displayName || "Người dùng"}
                </h1>
                <div className="bg-blue-600 p-1 rounded-full shadow-lg shadow-blue-200">
                  <CheckCircle2 className="w-4 h-4 text-white fill-current" />
                </div>
              </div>
              <p className="text-slate-400 font-bold text-base tracking-tight">{user?.email}</p>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              {user?.role === "admin" ? (
                <span className="px-5 py-2 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                  Quản trị viên
                </span>
              ) : (
                <span className="px-5 py-2 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-100">
                  {user?.role === "owner" ? "Chủ trọ" : "Người thuê"}
                </span>
              )}
              <span className="px-5 py-2 bg-white text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm">
                Đã xác minh tài khoản
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 min-w-[200px]">
            {user?.role === "admin" ? (
              <button 
                onClick={() => navigate("/admin")}
                className="w-full py-4 bg-emerald-600 text-white rounded-full font-black text-xs hover:bg-emerald-700 transition-all shadow-lg hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                Vào trang Quản trị
              </button>
            ) : (
              <button className="w-full py-4 bg-white border-2 border-blue-600 text-blue-600 rounded-full font-black text-xs hover:bg-blue-50 transition-all shadow-sm hover:shadow-lg hover:-translate-y-1 active:scale-95">
                Trở thành Chủ trọ
              </button>
            )}
            <div className="flex gap-3">
              <button className="flex-1 py-4 bg-white border border-slate-200 rounded-full text-slate-400 hover:text-blue-600 hover:border-blue-600 transition-all shadow-sm flex items-center justify-center">
                <Settings className="w-5 h-5" />
              </button>
              <button 
                onClick={handleLogout}
                className="flex-1 py-4 bg-rose-50 text-rose-500 rounded-full hover:bg-rose-100 transition-all shadow-sm shadow-rose-100 flex items-center justify-center group"
              >
                <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="w-full lg:w-72 sticky top-32">
          <Sidebar />
        </div>

        <div className="flex-1 w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
          {renderTabContent()}
        </div>
      </div>

      {/* Floating Sparkle Button */}
      <div className="fixed bottom-10 right-10 z-50">
        <button className="w-16 h-16 bg-blue-600 rounded-[24px] shadow-2xl shadow-blue-200 flex items-center justify-center text-white hover:bg-blue-700 hover:scale-110 active:scale-95 transition-all group">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:rotate-12 transition-transform duration-500">
            <path d="M12 3L14.5 9L21 11.5L14.5 14L12 21L9.5 14L3 11.5L9.5 9L12 3Z" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="19" cy="19" r="2" fill="white"/>
            <circle cx="5" cy="5" r="1.5" fill="white"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
