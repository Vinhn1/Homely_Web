import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { ShieldX } from 'lucide-react';

// Guard: Chỉ cho phép user có role === 'owner' truy cập
const OwnerRoute = ({ children }) => {
    const { user, isAuthenticated } = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to="/signin" replace />;
    }

    if (user?.role !== 'owner') {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
                <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center">
                    <ShieldX className="w-10 h-10 text-red-400" />
                </div>
                <h2 className="text-2xl font-black text-slate-800">Không có quyền truy cập</h2>
                <p className="text-slate-500 max-w-sm">
                    Trang này chỉ dành cho <strong>Chủ nhà</strong>.
                    {user?.ownerRequestStatus === 'pending'
                        ? ' Yêu cầu của bạn đang chờ admin phê duyệt.'
                        : ' Hãy đăng ký trở thành chủ nhà để sử dụng tính năng này.'}
                </p>
                {!user?.ownerRequestStatus && (
                    <a
                        href="/dashboard/profile"
                        className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all"
                    >
                        Đăng ký trở thành chủ nhà
                    </a>
                )}
            </div>
        );
    }

    return children;
};

export default OwnerRoute;
