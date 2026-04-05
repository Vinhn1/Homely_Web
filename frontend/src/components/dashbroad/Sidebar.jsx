import { useAuthStore } from "@/store/authStore"
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { 
  User, Heart, History, Star, LifeBuoy, Bell, ShieldCheck, ChevronRight
} from "lucide-react";

const Sidebar = () => {
    const { logout } = useAuthStore();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get("tab") || "personal";

    const menuItems = [
        { id: "personal", label: "Thông tin cá nhân", icon: User, path: "/dashboard/profile?tab=personal" },
        { id: "saved", label: "Nhà đã lưu", icon: Heart, path: "/dashboard/profile?tab=saved" },
        { id: "history", label: "Lịch sử thuê", icon: History, path: "/dashboard/profile?tab=history" },
        { id: "reviews", label: "Đánh giá của tôi", icon: Star, path: "/dashboard/profile?tab=reviews" },
        { id: "support", label: "Yêu cầu hỗ trợ", icon: LifeBuoy, path: "/dashboard/profile?tab=support" },
        { id: "security", label: "Bảo mật & 2FA", icon: ShieldCheck, path: "/dashboard/profile?tab=security" },
        { id: "notifications", label: "Thông báo", icon: Bell, path: "/dashboard/profile?tab=notifications" },
    ];

    return (
        <aside className="w-full flex flex-col gap-2">
            {menuItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                    <Link
                        key={item.id}
                        to={item.path}
                        className={`flex items-center justify-between px-6 py-4 rounded-full transition-all duration-500 group ${
                            isActive 
                            ? "bg-blue-600 text-white shadow-2xl shadow-blue-200 shadow-lg shadow-blue-100" 
                            : "bg-white/50 text-slate-500 hover:bg-white hover:text-blue-600 border border-transparent shadow-sm hover:border-blue-50"
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <item.icon size={18} className={isActive ? "text-white" : "text-blue-600 group-hover:scale-110 transition-transform"} />
                            <span className="font-black text-[11px] tracking-widest uppercase">{item.label}</span>
                        </div>
                        {isActive && (
                            <div className="animate-in fade-in zoom-in duration-300">
                                <ChevronRight className="w-4 h-4 text-white/50" />
                            </div>
                        )}
                    </Link>
                );
            })}
        </aside>
    )
}

export default Sidebar;