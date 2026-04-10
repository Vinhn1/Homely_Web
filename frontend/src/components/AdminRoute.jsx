import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { ShieldX } from 'lucide-react';

// Guard: Chỉ cho phép user có role === 'admin' truy cập
const AdminRoute = ({ children }) => {
    const { user, isAuthenticated } = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to="/signin" replace />;
    }

    if (user?.role !== 'admin') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-5 text-center px-4 bg-slate-950">
                <div className="w-24 h-24 bg-red-500/10 rounded-3xl flex items-center justify-center border border-red-500/20">
                    <ShieldX className="w-12 h-12 text-red-400" />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-white mb-2">Không có quyền truy cập</h2>
                    <p className="text-slate-400 max-w-sm">
                        Khu vực này chỉ dành cho <strong className="text-white">Quản trị viên</strong> hệ thống.
                    </p>
                </div>
                <a
                    href="/"
                    className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-2xl font-bold hover:bg-white/20 transition-all"
                >
                    Về trang chủ
                </a>
            </div>
        );
    }

    return children;
};

export default AdminRoute;
