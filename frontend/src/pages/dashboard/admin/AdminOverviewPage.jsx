import React, { useEffect, useState } from 'react';
import axios from '@/api/axios';
import { Link } from 'react-router-dom';
import {
    Users, Home, BookOpen, Flag, TrendingUp, ShieldCheck,
    Clock, ArrowRight, Check, X, Loader, Ban
} from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

const StatCard = ({ icon: Icon, label, value, color, sub }) => (
    <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6 flex items-start gap-4 hover:bg-slate-800 transition-all group">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
            <Icon className="w-6 h-6" />
        </div>
        <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-0.5">{label}</p>
            <p className="text-3xl font-black text-white">{value ?? '—'}</p>
            {sub && <p className="text-slate-500 text-xs mt-1">{sub}</p>}
        </div>
    </div>
);

const AdminOverviewPage = () => {
    const [stats, setStats] = useState(null);
    const [pendingUsers, setPendingUsers] = useState([]);
    const [isLoadingStats, setIsLoadingStats] = useState(true);
    const [isLoadingUsers, setIsLoadingUsers] = useState(true);
    const [processingId, setProcessingId] = useState(null);

    const fetchStats = async () => {
        try {
            const res = await axios.get('/admin/stats');
            setStats(res.data.data);
        } catch {
            toast.error('Không thể tải thống kê');
        } finally {
            setIsLoadingStats(false);
        }
    };

    const fetchPendingUsers = async () => {
        try {
            const res = await axios.get('/admin/users?status=pending&limit=5');
            setPendingUsers(res.data.data);
        } catch {
            // silent
        } finally {
            setIsLoadingUsers(false);
        }
    };

    useEffect(() => {
        fetchStats();
        fetchPendingUsers();
    }, []);

    const handleApprove = async (userId) => {
        setProcessingId(userId);
        try {
            await axios.patch(`/admin/users/${userId}/approve-owner`, {});
            toast.success('✅ Đã duyệt yêu cầu Chủ nhà!');
            setPendingUsers(prev => prev.filter(u => u._id !== userId));
            setStats(prev => prev ? { ...prev, pendingOwnerRequests: prev.pendingOwnerRequests - 1, totalOwners: prev.totalOwners + 1 } : prev);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (userId) => {
        setProcessingId(`reject-${userId}`);
        try {
            await axios.patch(`/admin/users/${userId}/reject-owner`, { reason: 'Thông tin chưa đủ điều kiện.' });
            toast.success('Đã từ chối yêu cầu.');
            setPendingUsers(prev => prev.filter(u => u._id !== userId));
            setStats(prev => prev ? { ...prev, pendingOwnerRequests: prev.pendingOwnerRequests - 1 } : prev);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
        } finally {
            setProcessingId(null);
        }
    };

    const statItems = stats ? [
        { icon: Users, label: 'Tổng người dùng', value: stats.totalUsers, color: 'bg-blue-500/10 text-blue-400', sub: `${stats.bannedUsers} bị khóa` },
        { icon: Home, label: 'Chủ nhà', value: stats.totalOwners, color: 'bg-violet-500/10 text-violet-400', sub: `${stats.pendingOwnerRequests} đang chờ duyệt` },
        { icon: BookOpen, label: 'Tin đăng', value: stats.totalProperties, color: 'bg-emerald-500/10 text-emerald-400', sub: `${stats.activeListings} đang hoạt động` },
        { icon: Flag, label: 'Báo cáo chờ', value: stats.pendingReports, color: 'bg-red-500/10 text-red-400', sub: `${stats.totalBookings} tổng đặt phòng` },
    ] : [];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-white">Tổng quan hệ thống</h1>
                <p className="text-slate-500 mt-1 text-sm">Theo dõi và quản lý toàn bộ nền tảng Homely</p>
            </div>

            {/* Stat Cards */}
            {isLoadingStats ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {[1,2,3,4].map(i => (
                        <div key={i} className="bg-slate-800/50 border border-white/5 rounded-2xl p-6 h-28 animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {statItems.map((s, i) => <StatCard key={i} {...s} />)}
                </div>
            )}

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { to: '/admin/users', label: 'Quản lý người dùng', desc: 'Duyệt chủ nhà, khóa tài khoản', icon: Users, color: 'from-blue-600 to-blue-700' },
                    { to: '/admin/listings', label: 'Kiểm duyệt tin đăng', desc: 'Verify, ẩn, xóa bài đăng', icon: Home, color: 'from-violet-600 to-purple-700' },
                    { to: '/admin/reports', label: 'Xử lý báo cáo', desc: 'Xem & giải quyết vi phạm', icon: Flag, color: 'from-rose-600 to-red-700' },
                ].map(({ to, label, desc, icon: Icon, color }) => (
                    <Link key={to} to={to} className="group bg-slate-800/50 border border-white/5 rounded-2xl p-6 hover:bg-slate-800 transition-all flex items-center gap-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center shrink-0 shadow-lg`}>
                            <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <p className="text-white font-black text-sm">{label}</p>
                            <p className="text-slate-500 text-xs mt-0.5">{desc}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </Link>
                ))}
            </div>

            {/* Pending Owner Requests */}
            <div className="bg-slate-800/50 border border-white/5 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center">
                            <Clock className="w-4 h-4 text-amber-400" />
                        </div>
                        <h2 className="text-white font-black text-sm">Yêu cầu trở thành Chủ nhà</h2>
                        {stats?.pendingOwnerRequests > 0 && (
                            <span className="bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">
                                {stats.pendingOwnerRequests}
                            </span>
                        )}
                    </div>
                    <Link to="/admin/users?status=pending" className="text-violet-400 text-xs font-bold hover:text-violet-300 transition-colors flex items-center gap-1">
                        Xem tất cả <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>

                {isLoadingUsers ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader className="w-6 h-6 animate-spin text-slate-500" />
                    </div>
                ) : pendingUsers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-3">
                        <ShieldCheck className="w-10 h-10 text-emerald-500/30" />
                        <p className="text-slate-500 text-sm font-medium">Không có yêu cầu nào đang chờ</p>
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {pendingUsers.map(user => {
                            const isApproving = processingId === user._id;
                            const isRejecting = processingId === `reject-${user._id}`;
                            return (
                                <div key={user._id} className="flex items-center gap-4 px-6 py-4 hover:bg-white/2 transition-all">
                                    <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0">
                                        {user.displayName?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white font-bold text-sm truncate">{user.displayName}</p>
                                        <p className="text-slate-500 text-xs truncate">{user.email}</p>
                                    </div>
                                    <p className="text-slate-600 text-xs shrink-0 hidden md:block">
                                        {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true, locale: vi })}
                                    </p>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <button
                                            onClick={() => handleApprove(user._id)}
                                            disabled={isApproving || isRejecting}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-black hover:bg-emerald-500/20 transition-all disabled:opacity-50"
                                        >
                                            {isApproving ? <Loader className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                                            Duyệt
                                        </button>
                                        <button
                                            onClick={() => handleReject(user._id)}
                                            disabled={isApproving || isRejecting}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs font-black hover:bg-red-500/20 transition-all disabled:opacity-50"
                                        >
                                            {isRejecting ? <Loader className="w-3 h-3 animate-spin" /> : <X className="w-3 h-3" />}
                                            Từ chối
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminOverviewPage;
