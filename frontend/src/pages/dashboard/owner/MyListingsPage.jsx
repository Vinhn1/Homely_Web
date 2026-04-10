import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import {
    Plus, Eye, Edit3, Trash2, ToggleLeft, ToggleRight,
    Home, MapPin, Clock, TrendingUp, Loader, Package, RefreshCw
} from 'lucide-react';

const API_URL = 'http://localhost:5000/api/properties';
const getToken = () => `Bearer ${localStorage.getItem('accessToken')}`;

const STATUS_TABS = [
    { key: 'all', label: 'Tất cả' },
    { key: 'active', label: 'Đang hiển thị' },
    { key: 'hidden', label: 'Đã ẩn' },
    { key: 'expired', label: 'Hết hạn' },
];

const STATUS_BADGE = {
    active: { label: 'Đang hiển thị', className: 'bg-emerald-100 text-emerald-700' },
    hidden: { label: 'Đã ẩn', className: 'bg-slate-100 text-slate-500' },
    expired: { label: 'Hết hạn', className: 'bg-amber-100 text-amber-700' },
};

const MyListingsPage = () => {
    const navigate = useNavigate();
    const [listings, setListings] = useState([]);
    const [activeTab, setActiveTab] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const [togglingId, setTogglingId] = useState(null);

    const fetchListings = async () => {
        setIsLoading(true);
        try {
            const params = activeTab !== 'all' ? `?listingStatus=${activeTab}` : '';
            const res = await axios.get(`${API_URL}/my-listings${params}`, {
                headers: { Authorization: getToken() }
            });
            setListings(res.data.data);
        } catch {
            toast.error('Không thể tải danh sách tin đăng');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchListings(); }, [activeTab]);

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc muốn xóa tin đăng này không?')) return;
        setDeletingId(id);
        try {
            await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: getToken() } });
            toast.success('Đã xóa tin đăng!');
            setListings(prev => prev.filter(l => l._id !== id));
        } catch {
            toast.error('Không thể xóa tin đăng');
        } finally {
            setDeletingId(null);
        }
    };

    const handleToggleStatus = async (listing) => {
        const newStatus = listing.listingStatus === 'active' ? 'hidden' : 'active';
        setTogglingId(listing._id);
        try {
            await axios.patch(`${API_URL}/${listing._id}/status`,
                { listingStatus: newStatus },
                { headers: { Authorization: getToken() } }
            );
            toast.success(newStatus === 'active' ? 'Tin đăng đã được hiển thị trở lại!' : 'Tin đăng đã được ẩn!');
            setListings(prev => prev.map(l => l._id === listing._id ? { ...l, listingStatus: newStatus } : l));
        } catch {
            toast.error('Có lỗi xảy ra');
        } finally {
            setTogglingId(null);
        }
    };

    return (
        <div>
            {/* Page Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900">Tin Đăng Của Tôi</h1>
                    <p className="text-slate-500 mt-1">Quản lý tất cả bất động sản cho thuê của bạn</p>
                </div>
                <Link
                    to="/dashboard/post-property"
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5 active:scale-95"
                >
                    <Plus className="w-5 h-5" /> Đăng Tin Mới
                </Link>
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-2 mb-6 bg-slate-50 p-1.5 rounded-2xl w-fit">
                {STATUS_TABS.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-5 py-2 rounded-xl text-sm font-black transition-all ${activeTab === tab.key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        {tab.label}
                        {tab.key !== 'all' && (
                            <span className="ml-1.5 text-xs text-slate-300">
                                ({listings.filter(l => tab.key === 'all' || l.listingStatus === tab.key).length})
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-3">
                    <Loader className="w-8 h-8 animate-spin text-blue-500" />
                    <p className="text-slate-400 font-medium">Đang tải tin đăng...</p>
                </div>
            ) : listings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                    <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center">
                        <Package className="w-10 h-10 text-blue-300" />
                    </div>
                    <h3 className="text-xl font-black text-slate-700">Chưa có tin đăng nào</h3>
                    <p className="text-slate-400 max-w-sm">Bắt đầu đăng tin cho thuê để tìm người thuê phòng phù hợp</p>
                    <Link to="/dashboard/post-property" className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all">
                        <Plus className="w-4 h-4" /> Đăng tin đầu tiên
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {listings.map(listing => (
                        <ListingCard
                            key={listing._id}
                            listing={listing}
                            onDelete={handleDelete}
                            onToggleStatus={handleToggleStatus}
                            onEdit={(id) => navigate(`/dashboard/edit-property/${id}`)}
                            deletingId={deletingId}
                            togglingId={togglingId}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const ListingCard = ({ listing, onDelete, onToggleStatus, onEdit, deletingId, togglingId }) => {
    const badge = STATUS_BADGE[listing.listingStatus] || STATUS_BADGE.active;
    const coverImg = listing.images?.[0];
    const isDeleting = deletingId === listing._id;
    const isToggling = togglingId === listing._id;

    return (
        <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-md transition-all duration-200">
            <div className="flex gap-0">
                {/* Image */}
                <div className="w-48 h-40 flex-shrink-0 bg-slate-100">
                    {coverImg ? (
                        <img src={coverImg} alt={listing.title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Home className="w-10 h-10 text-slate-200" />
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 p-5 flex flex-col justify-between">
                    <div>
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${badge.className}`}>
                                        {badge.label}
                                    </span>
                                    <span className="text-xs text-slate-300 font-medium bg-slate-50 px-2 py-0.5 rounded-full">
                                        {listing.propertyType}
                                    </span>
                                </div>
                                <h3 className="font-black text-slate-900 text-lg leading-snug">{listing.title}</h3>
                                <div className="flex items-center gap-1 text-slate-400 text-sm mt-1">
                                    <MapPin className="w-3.5 h-3.5" />
                                    <span>{listing.location?.address}, {listing.location?.city}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-black text-blue-600">
                                    {Number(listing.price).toLocaleString('vi-VN')}
                                </p>
                                <p className="text-xs text-slate-400 font-medium">VNĐ/tháng</p>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-5 mt-3 text-sm">
                            <div className="flex items-center gap-1.5 text-slate-500">
                                <Eye className="w-4 h-4 text-slate-300" />
                                <span className="font-bold">{listing.viewCount || 0}</span>
                                <span className="text-slate-400">lượt xem</span>
                            </div>
                            {listing.pendingBookings > 0 && (
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                                    <span className="font-black text-orange-600">{listing.pendingBookings} yêu cầu mới</span>
                                </div>
                            )}
                            <div className="flex items-center gap-1 text-slate-400 text-xs">
                                <Clock className="w-3 h-3" />
                                Hết hạn: {new Date(listing.expiresAt).toLocaleDateString('vi-VN')}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-4">
                        <button
                            onClick={() => onEdit(listing._id)}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-600 text-slate-500 font-bold text-sm transition-all"
                        >
                            <Edit3 className="w-4 h-4" /> Sửa
                        </button>

                        <button
                            onClick={() => onToggleStatus(listing)}
                            disabled={isToggling}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 font-bold text-sm transition-all disabled:opacity-50"
                        >
                            {isToggling ? <Loader className="w-4 h-4 animate-spin" /> :
                                listing.listingStatus === 'active' ? <ToggleRight className="w-4 h-4 text-emerald-500" /> : <ToggleLeft className="w-4 h-4" />}
                            {listing.listingStatus === 'active' ? 'Ẩn tin' : 'Hiện tin'}
                        </button>

                        <button
                            onClick={() => onDelete(listing._id)}
                            disabled={isDeleting}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-50 hover:bg-red-50 hover:text-red-500 text-slate-500 font-bold text-sm transition-all disabled:opacity-50 ml-auto"
                        >
                            {isDeleting ? <Loader className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                            Xóa
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyListingsPage;
