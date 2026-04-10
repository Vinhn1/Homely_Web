import React, { useEffect, useState, useCallback } from 'react';
import axios from '@/api/axios';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
    Users, Search, Check, X, Ban, Unlock, Loader,
    ChevronLeft, ChevronRight, Package, ShieldCheck
} from 'lucide-react';

const API_BASE = '/admin';

const FILTER_TABS = [
    { key: 'all', label: 'Tất cả' },
    { key: 'pending', label: 'Chờ duyệt CN' },
    { key: 'banned', label: 'Bị khóa' },
];

const ROLE_BADGE = {
    user: 'bg-slate-700 text-slate-300',
    owner: 'bg-violet-500/20 text-violet-300 border border-violet-500/30',
    admin: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
};
const ROLE_LABEL = { user: 'Người dùng', owner: 'Chủ nhà', admin: 'Admin' };

const AdminUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
    const [processingId, setProcessingId] = useState(null);
    const [rejectModal, setRejectModal] = useState(null);
    const [rejectReason, setRejectReason] = useState('');
    const [banModal, setBanModal] = useState(null);
    const [banReason, setBanReason] = useState('');

    const fetchUsers = useCallback(async (page = 1) => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams({ page, limit: 15 });
            if (activeTab !== 'all') params.set('status', activeTab);
            if (search) params.set('search', search);

            const res = await axios.get(`${API_BASE}/users?${params}`);
            setUsers(res.data.data);
            setPagination(res.data.pagination);
        } catch {
            toast.error('Không thể tải danh sách người dùng');
        } finally {
            setIsLoading(false);
        }
    }, [activeTab, search]);

    useEffect(() => { fetchUsers(1); }, [fetchUsers]);

    const handleApprove = async (userId) => {
        setProcessingId(`approve-${userId}`);
        try {
            await axios.patch(`${API_BASE}/users/${userId}/approve-owner`, {});
            toast.success('✅ Đã duyệt yêu cầu Chủ nhà!');
            fetchUsers(pagination.page);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async () => {
        if (!rejectModal) return;
        setProcessingId(`reject-${rejectModal}`);
        try {
            await axios.patch(`${API_BASE}/users/${rejectModal}/reject-owner`, { reason: rejectReason });
            toast.success('Đã từ chối yêu cầu.');
            setRejectModal(null);
            setRejectReason('');
            fetchUsers(pagination.page);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
        } finally {
            setProcessingId(null);
        }
    };

    const handleBan = async () => {
        if (!banModal) return;
        const { id, unban } = banModal;
        setProcessingId(`ban-${id}`);
        try {
            await axios.patch(`${API_BASE}/users/${id}/ban`, { reason: banReason, unban });
            toast.success(unban ? 'Đã mở khóa tài khoản.' : '🔒 Đã khóa tài khoản.');
            setBanModal(null);
            setBanReason('');
            fetchUsers(pagination.page);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3">
                        <Users className="w-7 h-7 text-violet-400" /> Quản lý Người dùng
                    </h1>
                    <p className="text-slate-500 mt-1 text-sm">{pagination.total} người dùng trong hệ thống</p>
                </div>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-[240px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        value={searchInput}
                        onChange={e => setSearchInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && setSearch(searchInput)}
                        placeholder="Tìm theo tên, email..."
                        className="w-full pl-11 pr-4 py-3 bg-slate-800/60 border border-white/10 rounded-xl text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-violet-500/50 transition-colors"
                    />
                </div>
                <div className="flex items-center gap-1 bg-slate-800/60 border border-white/10 p-1 rounded-xl">
                    {FILTER_TABS.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${activeTab === tab.key ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-slate-800/50 border border-white/5 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left text-[10px] font-black text-slate-500 uppercase tracking-widest px-6 py-4">Người dùng</th>
                                <th className="text-left text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 py-4 hidden md:table-cell">Role</th>
                                <th className="text-left text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 py-4 hidden lg:table-cell">Tham gia</th>
                                <th className="text-left text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 py-4 hidden lg:table-cell">Trạng thái CN</th>
                                <th className="text-right text-[10px] font-black text-slate-500 uppercase tracking-widest px-6 py-4">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {isLoading ? (
                                <tr><td colSpan={5}>
                                    <div className="flex items-center justify-center py-16">
                                        <Loader className="w-6 h-6 animate-spin text-violet-400" />
                                    </div>
                                </td></tr>
                            ) : users.length === 0 ? (
                                <tr><td colSpan={5}>
                                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                                        <Package className="w-10 h-10 text-slate-700" />
                                        <p className="text-slate-500 text-sm">Không tìm thấy người dùng nào</p>
                                    </div>
                                </td></tr>
                            ) : users.map(user => (
                                <tr key={user._id} className={`hover:bg-white/2 transition-all ${user.isBanned ? 'opacity-60' : ''}`}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {user.avatarUrl ? (
                                                <img src={user.avatarUrl} className="w-9 h-9 rounded-xl object-cover shrink-0" alt="" />
                                            ) : (
                                                <div className="w-9 h-9 bg-violet-600/70 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0">
                                                    {user.displayName?.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-white font-bold text-sm truncate">{user.displayName}</p>
                                                    {user.isBanned && (
                                                        <span className="text-[9px] font-black bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-md border border-red-500/20 shrink-0">KHÓA</span>
                                                    )}
                                                </div>
                                                <p className="text-slate-500 text-xs truncate">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 hidden md:table-cell">
                                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg ${ROLE_BADGE[user.role] || 'bg-slate-700 text-slate-400'}`}>
                                            {ROLE_LABEL[user.role] || user.role}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 hidden lg:table-cell">
                                        <p className="text-slate-400 text-xs">
                                            {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true, locale: vi })}
                                        </p>
                                    </td>
                                    <td className="px-4 py-4 hidden lg:table-cell">
                                        {user.ownerRequestStatus === 'pending' ? (
                                            <span className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">Chờ duyệt</span>
                                        ) : user.ownerRequestStatus === 'approved' ? (
                                            <span className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Đã duyệt</span>
                                        ) : user.ownerRequestStatus === 'rejected' ? (
                                            <span className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">Từ chối</span>
                                        ) : (
                                            <span className="text-slate-600 text-xs">—</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            {user.ownerRequestStatus === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleApprove(user._id)}
                                                        disabled={!!processingId}
                                                        className="w-8 h-8 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg flex items-center justify-center hover:bg-emerald-500/20 transition-all disabled:opacity-50"
                                                        title="Duyệt chủ nhà"
                                                    >
                                                        {processingId === `approve-${user._id}` ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                                                    </button>
                                                    <button
                                                        onClick={() => setRejectModal(user._id)}
                                                        disabled={!!processingId}
                                                        className="w-8 h-8 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg flex items-center justify-center hover:bg-red-500/20 transition-all disabled:opacity-50"
                                                        title="Từ chối"
                                                    >
                                                        <X className="w-3.5 h-3.5" />
                                                    </button>
                                                </>
                                            )}
                                            {user.isBanned ? (
                                                <button
                                                    onClick={() => setBanModal({ id: user._id, unban: true, name: user.displayName })}
                                                    className="w-8 h-8 bg-slate-700 text-slate-300 rounded-lg flex items-center justify-center hover:bg-emerald-500/20 hover:text-emerald-400 transition-all"
                                                    title="Mở khóa"
                                                >
                                                    <Unlock className="w-3.5 h-3.5" />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => setBanModal({ id: user._id, unban: false, name: user.displayName })}
                                                    className="w-8 h-8 bg-slate-700 text-slate-400 rounded-lg flex items-center justify-center hover:bg-red-500/20 hover:text-red-400 transition-all"
                                                    title="Khóa tài khoản"
                                                >
                                                    <Ban className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-white/5">
                        <p className="text-slate-500 text-xs">
                            Trang {pagination.page} / {pagination.totalPages} — {pagination.total} người dùng
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => fetchUsers(pagination.page - 1)}
                                disabled={pagination.page <= 1}
                                className="w-8 h-8 bg-slate-700 text-slate-300 rounded-lg flex items-center justify-center hover:bg-slate-600 disabled:opacity-30 transition-all"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => fetchUsers(pagination.page + 1)}
                                disabled={pagination.page >= pagination.totalPages}
                                className="w-8 h-8 bg-slate-700 text-slate-300 rounded-lg flex items-center justify-center hover:bg-slate-600 disabled:opacity-30 transition-all"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Reject Modal */}
            {rejectModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-800 border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl">
                        <h3 className="text-white font-black text-xl mb-2">Từ chối yêu cầu</h3>
                        <p className="text-slate-400 text-sm mb-5">Nhập lý do từ chối để thông báo cho người dùng.</p>
                        <textarea
                            value={rejectReason}
                            onChange={e => setRejectReason(e.target.value)}
                            placeholder="VD: Thông tin chưa đầy đủ, hồ sơ không hợp lệ..."
                            rows={3}
                            className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-600 resize-none focus:outline-none focus:border-violet-500/50"
                        />
                        <div className="flex gap-3 mt-5">
                            <button onClick={() => setRejectModal(null)} className="flex-1 py-3 rounded-xl border border-white/10 text-slate-400 font-bold hover:bg-white/5 transition-all text-sm">Hủy</button>
                            <button onClick={handleReject} disabled={!!processingId} className="flex-1 py-3 rounded-xl bg-red-500 text-white font-black hover:bg-red-600 transition-all text-sm disabled:opacity-50">
                                {processingId?.startsWith('reject') ? 'Đang xử lý...' : 'Xác nhận từ chối'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Ban Modal */}
            {banModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-800 border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl">
                        <h3 className="text-white font-black text-xl mb-2">{banModal.unban ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}</h3>
                        <p className="text-slate-400 text-sm mb-5">
                            {banModal.unban
                                ? `Bạn chắc chắn muốn mở khóa tài khoản của "${banModal.name}"?`
                                : `Nhập lý do khóa tài khoản "${banModal.name}".`}
                        </p>
                        {!banModal.unban && (
                            <textarea
                                value={banReason}
                                onChange={e => setBanReason(e.target.value)}
                                placeholder="VD: Vi phạm điều khoản, lừa đảo người thuê..."
                                rows={3}
                                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-600 resize-none focus:outline-none focus:border-violet-500/50 mb-5"
                            />
                        )}
                        <div className="flex gap-3">
                            <button onClick={() => setBanModal(null)} className="flex-1 py-3 rounded-xl border border-white/10 text-slate-400 font-bold hover:bg-white/5 transition-all text-sm">Hủy</button>
                            <button onClick={handleBan} disabled={!!processingId} className={`flex-1 py-3 rounded-xl text-white font-black transition-all text-sm disabled:opacity-50 ${banModal.unban ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-red-500 hover:bg-red-600'}`}>
                                {processingId?.startsWith('ban') ? 'Đang xử lý...' : banModal.unban ? 'Mở khóa' : 'Khóa tài khoản'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsersPage;
