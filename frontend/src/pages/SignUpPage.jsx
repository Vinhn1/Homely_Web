import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Home, 
  ShieldCheck,
  Globe,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { toast } from "sonner";


const SignUpPage = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [role, setRole] = useState("tenant"); // tenant hoặc host
  const [isLoading, setIsLoading] = useState(false);
 

  const onSubmit = async (data) => {
    // console.log("Dữ liệu đăng ký:", { ...data, role });
    setIsLoading(true);
    // Ánh xạ vai trò từ frontend sang backend
    const mappedRole = role === "host" ? "owner" : "user";

    try{
      // Gọi API bằng axios.post(d/c api, dữ liệu gửi đi)
      const response = await axios.post("http://localhost:5000/api/auth/signUp", {
        username: data.email, // Lấy email làm username
        email: data.email,
        password: data.password,
        displayName: data.name, // Map "name" của From sang "displayName" của backend
        role: mappedRole // truyền vai trò được ánh xạ 
      });

      // Xử lý khi thành công 
      console.log("Đăng ký thành công: ", response.data);
      toast.success("Đăng ký thành công!");

      // Điều hướng về trang đăng nhập 
      setTimeout(() => {
        navigate("/signin");
      }, 2000); // Chờ 2s để người dùng đọc thông báo 

    }catch(error){
      // Xử lý khi có lỗi 
      console.error("Lỗi đăng ký: ", error.response?.data?.message || error.message);

      toast.error(error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!");
    }finally{
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fafc] p-4 font-sans text-foreground">
      <div className="w-full max-w-[1000px] min-h-[600px] bg-white rounded-[40px] shadow-2xl flex overflow-hidden border border-border">
        
        {/* --- CỘT TRÁI (GIỮ NGUYÊN GIAO DIỆN) --- */}
        <div className="hidden md:flex w-1/2 bg-[#1d4ed8] p-12 flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-blue-400 rounded-full blur-[100px] opacity-20"></div>
          <div className="relative z-10 text-center">
            <Link to="/" className="w-24 h-24 bg-white/20 rounded-[100px] flex items-center justify-center mb-6 mx-auto hover:bg-white/30 transition-all duration-300 group">
              <Home className="text-white w-12 h-12 group-hover:scale-110 transition-transform duration-300" />
            </Link>
            <h1 className="text-4xl font-bold mb-4 leading-tight">Chào mừng bạn đến với Homely</h1>
            <p className="text-blue-100 text-lg mb-6">Tìm kiếm ngôi nhà mơ ước của bạn chỉ trong vài phút.</p>
          </div>
          <div className="flex items-center justify-center gap-3 text-white/70 text-sm mt-6 w-full">
            <ShieldCheck className="w-5 h-5" />
            <span>Bảo mật thông tin tuyệt đối</span>
          </div>
        </div>

        {/* --- CỘT PHẢI: FORM ĐĂNG KÝ --- */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center bg-white">
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-3xl font-bold mb-2">Tạo tài khoản</h2>
            <p className="text-muted-foreground">Bắt đầu hành trình tìm kiếm nhà của bạn.</p>
          </div>

          {/* BỘ CHỌN VAI TRÒ (Tenant / Host) */}
          <div className="flex p-1 bg-muted/50 rounded-2xl mb-8">
            <button 
              onClick={() => setRole("tenant")}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${role === "tenant" ? "bg-white shadow-sm text-primary" : "text-muted-foreground"}`}
            >
              Người thuê
            </button>
            <button 
              onClick={() => setRole("host")}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${role === "host" ? "bg-white shadow-sm text-primary" : "text-muted-foreground"}`}
            >
              Chủ trọ
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Họ và tên */}
            <div className="relative">
              <User className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
              <Input 
                {...register("name")} 
                className="pl-12 h-12 bg-[#f1f5f9] border border-transparent rounded-2xl focus-visible:ring-0 focus-visible:border-black transition-all" 
                placeholder="Họ và tên" 
              />
            </div>
            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
              <Input 
                {...register("email")} 
                className="pl-12 h-12 bg-[#f1f5f9] border border-transparent rounded-2xl focus-visible:ring-0 focus-visible:border-black transition-all" 
                placeholder="Email của bạn" 
              />
            </div>
            {/* Mật khẩu */}
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
              <Input 
                type="password" 
                {...register("password")} 
                className="pl-12 h-12 bg-[#f1f5f9] border border-transparent rounded-2xl focus-visible:ring-0 focus-visible:border-black transition-all" 
                placeholder="Mật khẩu" 
              />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full h-12 bg-[#1d4ed8] hover:bg-blue-700 text-white rounded-2xl text-lg font-bold shadow-lg flex items-center justify-center gap-2 group">
              {isLoading ? "Đang xử lý..." : "Đăng ký"}
              {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </Button>
          </form>

          <div className="relative my-6 text-center text-xs uppercase text-muted-foreground">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border"></span></div>
            <span className="relative bg-white px-4">HOẶC</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-12 rounded-2xl border-border flex gap-2">
              <Globe className="w-5 h-5 text-red-500" />
              Google
            </Button>
            <Button variant="outline" className="h-12 rounded-2xl border-border flex gap-2">
              <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </Button>
          </div>

          <p className="mt-8 text-center text-muted-foreground text-sm">
            Đã có tài khoản? <Link to="/signin" className="text-primary font-bold hover:underline">Đăng nhập</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
