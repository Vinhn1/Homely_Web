import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router-dom"; // Cần thiết cho các thẻ <Link>
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  Globe, 
  ShieldCheck, 
  Home,
} from "lucide-react"; // Import toàn bộ Icons

// Import các Component UI từ Shadcn
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";



const SignInPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  // Lấy hàm signin và biến isloading từ Zustand 
  const {signIn, isLoading} = useAuthStore();
  // 1. Thêm 'errors' và 'isLoading' để không bị báo lỗi "not defined"
  const { register, handleSubmit, formState: { errors } } = useForm();

  // 2. Định nghĩa hàm onSubmit
  const onSubmit = async (data) => {
    //   console.log("Dữ liệu đăng nhập:", data);
    try{
      await signIn({
        username: data.email,
        password: data.password
      });
    
      toast.success("Đăng nhập thành công! Chào mừng bạn quay lại.");
      navigate(from, { replace: true });

    }catch(error){
      
      toast.error(error.response?.data?.message || "Email hoặc mật khẩu không đúng!");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fafc] p-4 font-sans text-foreground">
      {/* Container chính: Bo góc cực lớn và bóng đổ sâu */}
      <div className="w-full max-w-[1000px] min-h-[600px] bg-white rounded-[40px] shadow-2xl flex overflow-hidden border border-border">
        
        {/* --- CỘT TRÁI: MÀU XANH --- */}
        <div className="hidden md:flex w-1/2 bg-[#1d4ed8] p-12 flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-blue-400 rounded-full blur-[100px] opacity-20"></div>
          
          <div className="relative z-10">
             <Link to="/" className="w-24 h-24 bg-white/20 rounded-[100px] flex items-center justify-center mb-6 mx-auto hover:bg-white/30 transition-all duration-300 group">
                <Home className="text-white w-12 h-12 group-hover:scale-110 transition-transform duration-300" />
              </Link>
            <h1 className="text-4xl font-bold mb-4 leading-tight text-center">Chào mừng bạn đến với Homely</h1>
            <p className="text-blue-100 text-lg mb-6">Tìm kiếm ngôi nhà mơ ước của bạn chỉ trong vài phút.</p>
            
            <div className="space-y-2">
              <p className="text-sm font-semibold text-blue-200 uppercase tracking-wider">Lợi ích thành viên</p>
              {["Tiếp cận 10,000+ tin đăng", "Hỗ trợ pháp lý miễn phí", "Ưu đãi đặc quyền"].map((item, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-md p-4 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-white/20 transition-all">
                  <span className="font-medium">{item}</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3 text-white-700 text-sm mt-6 ">
            <ShieldCheck className="w-5 h-5" />
            <span>Bảo mật thông tin tuyệt đối</span>
          </div>
        </div>

        {/* --- CỘT PHẢI: FORM --- */}
        <div className="w-full md:w-1/2 p-12 flex flex-col justify-center bg-white text-foreground">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-bold mb-2">Đăng nhập</h2>
            <p className="text-muted-foreground">Chào mừng bạn quay trở lại!</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
                <Input 
                    {...register("email")} 
                    className="pl-12 h-12 bg-[#f1f5f9] border border-transparent rounded-2xl focus-visible:ring-0 focus-visible:border-black transition-all" 
                    placeholder="Email của bạn" 
                    />
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
               <Input 
                    type="password" 
                    {...register("password")} 
                    className="pl-12 h-12 bg-[#f1f5f9] border border-transparent rounded-2xl focus-visible:ring-0 focus-visible:border-black transition-all" 
                    placeholder="Mật khẩu" 
                    />
              </div>
              <div className="flex justify-end">
                <Link to="#" className="text-primary font-semibold text-sm hover:underline">Quên mật khẩu?</Link>
              </div>
            </div>
            <Button type="submit" disabled={isLoading} className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl text-lg font-bold shadow-lg flex items-center justify-center gap-2 group">
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
              {!isLoading &&  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border"></span></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-4 text-muted-foreground font-medium">Hoặc</span></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-12 rounded-2xl border-border flex gap-2">
              <Globe className="w-5 h-5 text-red-500" /> Google
            </Button>
            <Button variant="outline" className="h-12 rounded-2xl border-border flex gap-2">
              <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </Button>
          </div>
          <p className="mt-10 text-center text-muted-foreground text-sm">
            Chưa có tài khoản? <Link to="/signup" className="text-primary font-bold hover:underline">Đăng ký ngay</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
