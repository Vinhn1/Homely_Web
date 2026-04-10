import React, { useEffect, useState, useCallback } from 'react';
import axios from '@/api/axios';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
    Home, Search, ShieldCheck, Eye, EyeOff, Trash2,
    Loader, ChevronLeft, ChevronRight, Package, MapPin, X
} from 'lucide-react';

const API_BASE = '/admin';

const FILTER_TABS = [
    { key: 'all', label: 'Tất cả' },
    { key: 'active', label: 'Đang hoạt động' },
    { key: 'hidden', label: 'Đã ẩn' },
    { key: 'expired', label: 'Hết hạn' },
];

const STATUS_CONFIG = {
    active: { label: 'Hoạt động', cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    hidden: { label: 'Đã ẩn', cls: 'bg-slate-700 text-slate-400 border-slate-600' },
    expired: { label: 'Hết hạn', cls: 'bg-red-500/10 text-red-400 border-red-500/20' },
};

const AdminListingsPage = () => {
    const [listings, setListings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
    const [processingId, setProcessingId] = useState(null);
    const [deleteModal, setDeleteModal] = useState(null);

    const fetchListings = useCallback(async (page = 1) => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams({ page, limit: 15 });
            if (activeTab !== 'all') params.set('listingStatus', activeTab);
            if (search) params.set('search', search);

            const res = await axios.get(`${API_BASE}/listings?${params}`);
            setListings(res.data.data);
            setPagination(res.data.pagination);
        } catch {
            toast.error('Không thể tải danh sách tin đăng');
        } finally {
            setIsLoading(false);
        }
    }, [activeTab, search]);

    useEffect(() => { fetchListings(1); }, [fetchListings]);

    const handleVerify = async (id, currentVerified) => {
        setProcessingId(`verify-${id}`);
        try {
            const endpoint = currentVerified ? 'unverify' : 'verify';
            await axios.patch(`${API_BASE}/listings/${id}/${endpoint}`, {});
            toast.success(currentVerified ? 'Đã bỏ xác thực.' : '✅ Đã xác thực tin đăng!');
            setListings(prev => prev.map(l => l._id === id ? { ...l, isVerified: !currentVerified } : l));
        } catch (err) {
            toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
        } finally {
            setProcessingId(null);
        }
    };

    const handleToggleHide = async (id) => {
        setProcessingId(`hide-${id}`);
        try {
            await axios.patch(`${API_BASE}/listings/${id}/toggle-hide`, {});
            const listing = listings.find(l => l._id === id);
            const newStatus = listing?.listingStatus === 'hidden' ? 'active' : 'hidden';
            toast.success(newStatus === 'hidden' ? '👁 Đã ẩn tin đăng.' : '✅ Đã khôi phục tin đăng.');
            setListings(prev => prev.map(l => l._id === id ? { ...l, listingStatus: newStatus } : l));
        } catch (err) {
            toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
        } finally {
            setProcessingId(null);
        }
    };

    const handleDelete = async () => {
        if (!deleteModal) return;
        setProcessingId(`delete-${deleteModal}`);
        try {
            await axios.delete(`${API_BASE}/listings/${deleteModal}`);
            toast.success('🗑 Đã xóa tin đăng.');
            setDeleteModal(null);
            fetchListings(pagination.page);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-white flex items-center gap-3">
                    <Home className="w-7 h-7 text-violet-400" /> Quản lý Tin đăng
                </h1>
                <p className="text-slate-500 mt-1 text-sm">{pagination.total} tin đăng trong hệ thống</p>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-[240px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        value={searchInput}
                        onChange={e => setSearchInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && setSearch(searchInput)}
                        placeholder="Tìm theo tiêu đề, địa chỉ..."
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
                                <th className="text-left text-[10px] font-black text-slate-500 uppercase tracking-widest px-6 py-4">Tin đăng</th>
                                <th className="text-left text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 py-4 hidden md:table-cell">Chủ nhà</th>
                                <th className="text-left text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 py-4 hidden lg:table-cell">Giá</th>
                                <th className="text-left text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 py-4 hidden lg:table-cell">Trạng thái</th>
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
                            ) : listings.length === 0 ? (
                                <tr><td colSpan={5}>
                                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                                        <Package className="w-10 h-10 text-slate-700" />
                                        <p className="text-slate-500 text-sm">Không tìm thấy tin đăng nào</p>
                                    </div>
                                </td></tr>
                            ) : listings.map(listing => {
                                const statusConf = STATUS_CONFIG[listing.listingStatus] || STATUS_CONFIG.active;
                                const isProcessing = (id) => processingId === id;
                                return (
                                    <tr key={listing._id} className={`hover:bg-white/2 transition-all ${listing.listingStatus === 'hidden' ? 'opacity-60' : ''}`}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {listing.images?.[0] ? (
                                                    <img src={listing.images[0]} className="w-12 h-12 rounded-xl object-cover shrink-0" alt="" />
                                                ) : (
                                                    <div className="w-12 h-12 bg-slate-700 rounded-xl flex items-center justify-center shrink-0">
                                                        <Home className="w-5 h-5 text-slate-500" />
                                                    </div>
                                                )}
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2 mb-0.5">
                                                        <p className="text-white font-bold text-sm truncate max-w-[180px]">{listing.title}</p>
                                                        {listing.isVerified && (
                                                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-slate-500 text-xs">
                                                        <MapPin className="w-3 h-3" />
                                                        <span className="truncate max-w-[160px]">{listing.location?.city}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 hidden md:table-cell">
                                            <div className="flex items-center gap-2">
                                                {listing.owner?.avatarUrl ? (
                                                    <img src={listing.owner.avatarUrl} className="w-7 h-7 rounded-lg object-cover" alt="" />
                                                ) : (
                                                    <div className="w-7 h-7 bg-violet-600/60 rounded-lg flex items-center justify-center text-white text-xs font-black">
                                                        {listing.owner?.displayName?.charAt(0)}
                                                    </div>
                                                )}
                                                <span className="text-slate-300 text-xs font-medium truncate max-w-[100px]">{listing.owner?.displayName}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 hidden lg:table-cell">
                                            <p className="text-violet-300 font-black text-sm">{listing.price?.toLocaleString('vi-VN')}đ</p>
                                        </td>
                                        <td className="px-4 py-4 hidden lg:table-cell">
                                            <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border ${statusConf.cls}`}>
                                                {statusConf.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                {/* Verify toggle */}
                                                <button
                                                    onClick={() => handleVerify(listing._id, listing.isVerified)}
                                                    disabled={!!processingId}
                                                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-50 ${listing.isVerified ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' : 'bg-slate-700 text-slate-400 hover:bg-emerald-500/10 hover:text-emerald-400'}`}
                                                    title={listing.isVerified ? 'Bỏ xác thực' : 'Xác thực tin đăng'}
                                                >
                                                    {isProcessing(`verify-${listing._id}`) ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                                                </button>
                                                {/* Hide toggle */}
                                                <button
                                                    onClick={() => handleToggleHide(listing._id)}
                                                    disabled={!!processingId}
                                                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-50 ${listing.listingStatus === 'hidden' ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30' : 'bg-slate-700 text-slate-400 hover:bg-amber-500/10 hover:text-amber-400'}`}
                                                    title={listing.listingStatus === 'hidden' ? 'Khôi phục' : 'Ẩn tin đăng'}
                                                >
                                                    {isProcessing(`hide-${listing._id}`) ? <Loader className="w-3.5 h-3.5 animate-spin" /> : listing.listingStatus === 'hidden' ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                                </button>
                                                {/* Delete */}
                                                <button
                                                    onClick={() => setDeleteModal(listing._id)}
                                                    disabled={!!processingId}
                                                    className="w-8 h-8 bg-slate-700 text-slate-400 rounded-lg flex items-center justify-center hover:bg-red-500/10 hover:text-red-400 transition-all disabled:opacity-50"
                                                    title="Xóa tin đăng"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-white/5">
                        <p className="text-slate-500 text-xs">Trang {pagination.page} / {pagination.totalPages} — {pagination.total} tin</p>
                        <div className="flex gap-2">
                            <button onClick={() => fetchListings(pagination.page - 1)} disabled={pagination.page <= 1} className="w-8 h-8 bg-slate-700 text-slate-300 rounded-lg flex items-center justify-center hover:bg-slate-600 disabled:opacity-30 transition-all">
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button onClick={() => fetchListings(pagination.page + 1)} disabled={pagination.page >= pagination.totalPages} className="w-8 h-8 bg-slate-700 text-slate-300 rounded-lg flex items-center justify-center hover:bg-slate-600 disabled:opacity-30 transition-all">
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Confirm Modal */}
            {deleteModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-800 border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl">
                        <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center mb-5 border border-red-500/20">
                            <Trash2 className="w-7 h-7 text-red-400" />
                        </div>
                        <h3 className="text-white font-black text-xl mb-2">Xóa tin đăng</h3>
                        <p className="text-slate-400 text-sm mb-6">Hành động này không thể hoàn tác. Tin đăng sẽ bị xóa vĩnh viễn khỏi hệ thống.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteModal(null)} className="flex-1 py-3 rounded-xl border border-white/10 text-slate-400 font-bold hover:bg-white/5 transition-all text-sm">Hủy bỏ</button>
                            <button onClick={handleDelete} disabled={!!processingId} className="flex-1 py-3 rounded-xl bg-red-500 text-white font-black hover:bg-red-600 transition-all text-sm disabled:opacity-50">
                                {processingId ? 'Đang xóa...' : 'Xác nhận xóa'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminListingsPage;
