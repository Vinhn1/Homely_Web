import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import {
    LayoutDashboard, Users, Home, Flag, LogOut,
    Shield, ChevronRight, Bell
} from 'lucide-react';

const adminNav = [
    { to: '/admin', label: 'Tổng quan', icon: LayoutDashboard, end: true },
    { to: '/admin/users', label: 'Người dùng', icon: Users },
    { to: '/admin/listings', label: 'Tin đăng', icon: Home },
    { to: '/admin/reports', label: 'Báo cáo', icon: Flag },
];

const AdminLayout = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/signin');
    };

    return (
        <div className="min-h-screen flex bg-slate-950 font-geist">
            {/* Sidebar */}
            <aside className="w-64 shrink-0 flex flex-col bg-slate-900 border-r border-white/5">
                {/* Logo */}
                <Link to="/" className="px-6 py-6 border-b border-white/5 flex items-center gap-3 hover:bg-white/5 transition-colors group">
                    <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-purple-700 rounded-xl flex items-center justify-center shadow-lg shadow-purple-900/50 group-hover:scale-110 transition-transform">
                        <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="text-white font-black text-sm leading-none">Homely</p>
                        <p className="text-purple-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">Admin Panel</p>
                    </div>
                </Link>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 space-y-1">
                    {adminNav.map(({ to, label, icon: Icon, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            className={({ isActive }) =>
                                `flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all group ${
                                    isActive
                                        ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/50'
                                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                }`
                            }
                        >
                            <div className="flex items-center gap-3">
                                <Icon className="w-4 h-4" />
                                {label}
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-50 transition-opacity" />
                        </NavLink>
                    ))}
                </nav>

                {/* User Info */}
                <div className="px-3 py-4 border-t border-white/5 space-y-1">
                    <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl mb-2">
                        <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center text-white font-black text-sm shrink-0">
                            {user?.displayName?.charAt(0).toUpperCase() || 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-white text-xs font-black truncate">{user?.displayName}</p>
                            <p className="text-slate-500 text-[10px] font-medium truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
                    >
                        <LogOut className="w-4 h-4" />
                        Đăng xuất
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
                {/* Top Bar */}
                <header className="h-16 bg-slate-900/50 border-b border-white/5 flex items-center justify-between px-8 shrink-0 backdrop-blur-md">
                    <div className="text-slate-400 text-sm font-medium">
                        Xin chào, <span className="text-white font-bold">{user?.displayName}</span> 👋
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-[10px] font-black text-purple-400 uppercase tracking-widest bg-purple-500/10 border border-purple-500/20 px-3 py-1.5 rounded-full">
                            Quản trị viên
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
