import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import {
    Phone, Home, Calendar, Clock, Check, X, MessageSquare,
    User, ChevronDown, Loader, Package, MapPin
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

const API = 'http://localhost:5000/api/bookings';
const getToken = () => `Bearer ${localStorage.getItem('accessToken')}`;

const STATUS_TABS = [
    { key: 'all', label: 'Tất cả' },
    { key: 'pending', label: 'Chờ xử lý' },
    { key: 'confirmed', label: 'Đã xác nhận' },
    { key: 'cancelled', label: 'Đã hủy' },
];

const STATUS_CONFIG = {
    pending: { label: 'Chờ xử lý', className: 'bg-amber-100 text-amber-700' },
    confirmed: { label: 'Đã xác nhận', className: 'bg-emerald-100 text-emerald-700' },
    cancelled: { label: 'Đã hủy', className: 'bg-red-100 text-red-500' },
    completed: { label: 'Hoàn thành', className: 'bg-blue-100 text-blue-600' },
};

const BookingRequestsPage = () => {
    const [requests, setRequests] = useState([]);
    const [activeTab, setActiveTab] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);
    const [cancelModal, setCancelModal] = useState(null); // { bookingId }
    const [cancelReason, setCancelReason] = useState('');

    const fetchRequests = async () => {
        setIsLoading(true);
        try {
            const params = activeTab !== 'all' ? `?status=${activeTab}` : '';
            const res = await axios.get(`${API}/owner-requests${params}`, {
                headers: { Authorization: getToken() }
            });
            setRequests(res.data.data);
        } catch {
            toast.error('Không thể tải danh sách yêu cầu');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchRequests(); }, [activeTab]);

    const handleConfirm = async (bookingId) => {
        setProcessingId(bookingId);
        try {
            await axios.patch(`${API}/${bookingId}/confirm`, {}, {
                headers: { Authorization: getToken() }
            });
            toast.success('✅ Đã xác nhận yêu cầu thuê phòng!');
            setRequests(prev => prev.map(r => r._id === bookingId ? { ...r, status: 'confirmed' } : r));
        } catch (err) {
            toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
        } finally {
            setProcessingId(null);
        }
    };

    const handleCancel = async () => {
        if (!cancelModal) return;
        setProcessingId(cancelModal.bookingId);
        try {
            await axios.patch(`${API}/${cancelModal.bookingId}/cancel`,
                { cancelReason },
                { headers: { Authorization: getToken() } }
            );
            toast.success('Đã từ chối yêu cầu thuê phòng');
            setRequests(prev => prev.map(r => r._id === cancelModal.bookingId ? { ...r, status: 'cancelled' } : r));
            setCancelModal(null);
            setCancelReason('');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
        } finally {
            setProcessingId(null);
        }
    };

    const pendingCount = requests.filter(r => r.status === 'pending').length;

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-black text-slate-900">Yêu Cầu Thuê Phòng</h1>
                    {pendingCount > 0 && (
                        <span className="px-3 py-1 bg-orange-100 text-orange-600 text-sm font-black rounded-full animate-pulse">
                            {pendingCount} mới
                        </span>
                    )}
                </div>
                <p className="text-slate-500 mt-1">Xem xét và phản hồi các yêu cầu từ người thuê</p>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 mb-6 bg-slate-50 p-1.5 rounded-2xl w-fit">
                {STATUS_TABS.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-5 py-2 rounded-xl text-sm font-black transition-all ${activeTab === tab.key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-3">
                    <Loader className="w-8 h-8 animate-spin text-blue-500" />
                    <p className="text-slate-400 font-medium">Đang tải...</p>
                </div>
            ) : requests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center">
                        <Package className="w-10 h-10 text-slate-200" />
                    </div>
                    <h3 className="text-xl font-black text-slate-600">Chưa có yêu cầu nào</h3>
                    <p className="text-slate-400">Khi có người muốn thuê phòng của bạn, yêu cầu sẽ xuất hiện ở đây.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {requests.map(booking => (
                        <BookingCard
                            key={booking._id}
                            booking={booking}
                            onConfirm={handleConfirm}
                            onCancel={(id) => setCancelModal({ bookingId: id })}
                            processingId={processingId}
                        />
                    ))}
                </div>
            )}

            {/* Cancel Modal */}
            {cancelModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
                        <h3 className="text-xl font-black text-slate-900 mb-2">Từ chối yêu cầu</h3>
                        <p className="text-slate-500 text-sm mb-5">Hãy cho người thuê biết lý do bạn từ chối để họ có thể tìm lựa chọn phù hợp hơn.</p>
                        <textarea
                            value={cancelReason}
                            onChange={e => setCancelReason(e.target.value)}
                            placeholder="VD: Phòng đã được đặt, chủ nhà không cho ở ghép..."
                            rows={3}
                            className="w-full border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-blue-300 transition-colors"
                        />
                        <div className="flex gap-3 mt-5">
                            <button
                                onClick={() => { setCancelModal(null); setCancelReason(''); }}
                                className="flex-1 py-3 rounded-2xl border-2 border-slate-100 font-bold text-slate-500 hover:bg-slate-50 transition-all"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={handleCancel}
                                disabled={processingId === cancelModal.bookingId}
                                className="flex-1 py-3 rounded-2xl bg-red-500 text-white font-black hover:bg-red-600 transition-all disabled:opacity-50"
                            >
                                {processingId === cancelModal.bookingId ? 'Đang xử lý...' : 'Xác nhận từ chối'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const BookingCard = ({ booking, onConfirm, onCancel, processingId }) => {
    const isProcessing = processingId === booking._id;
    const statusConfig = STATUS_CONFIG[booking.status];
    const { tenant, property, moveInDate, leaseTerm, note, contactPhone, createdAt } = booking;

    return (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 hover:shadow-md transition-all duration-200">
            <div className="flex items-start gap-5">
                {/* Tenant Avatar */}
                <div className="flex-shrink-0">
                    {tenant?.avatarUrl ? (
                        <img src={tenant.avatarUrl} alt={tenant.displayName} className="w-14 h-14 rounded-2xl object-cover" />
                    ) : (
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-black text-xl">
                            {tenant?.displayName?.charAt(0) || 'U'}
                        </div>
                    )}
                </div>

                {/* Main Info */}
                <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${statusConfig?.className}`}>
                                    {statusConfig?.label}
                                </span>
                            </div>
                            <h3 className="font-black text-slate-900 text-lg">{tenant?.displayName}</h3>
                            <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                                {(contactPhone || tenant?.phone) && (
                                    <a href={`tel:${contactPhone || tenant.phone}`} className="flex items-center gap-1.5 hover:text-blue-600 transition-colors font-medium">
                                        <Phone className="w-3.5 h-3.5" />
                                        {contactPhone || tenant.phone}
                                    </a>
                                )}
                                <span className="text-slate-300">•</span>
                                <span className="text-slate-400 text-xs">
                                    {formatDistanceToNow(new Date(createdAt), { addSuffix: true, locale: vi })}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Property Info */}
                    {property && (
                        <div className="mt-3 p-3 bg-slate-50 rounded-2xl flex items-center gap-3">
                            {property.images?.[0] && (
                                <img src={property.images[0]} alt="" className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                            )}
                            <div>
                                <p className="font-bold text-slate-800 text-sm">{property.title}</p>
                                <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                                    <MapPin className="w-3 h-3" />
                                    {property.location?.address}, {property.location?.city}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Booking Details */}
                    <div className="flex items-center gap-6 mt-4 text-sm">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-300" />
                            <div>
                                <p className="text-xs text-slate-400">Ngày vào</p>
                                <p className="font-bold text-slate-700">{new Date(moveInDate).toLocaleDateString('vi-VN')}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-slate-300" />
                            <div>
                                <p className="text-xs text-slate-400">Thời gian thuê</p>
                                <p className="font-bold text-slate-700">{leaseTerm}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400">Tiền thuê</p>
                            <p className="font-black text-blue-600">{Number(booking.totalPrice).toLocaleString('vi-VN')} VNĐ/tháng</p>
                        </div>
                    </div>

                    {/* Note */}
                    {note && (
                        <div className="mt-3 flex items-start gap-2 text-sm text-slate-500">
                            <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0 text-slate-300" />
                            <p className="italic">"{note}"</p>
                        </div>
                    )}

                    {/* Actions */}
                    {booking.status === 'pending' && (
                        <div className="flex items-center gap-3 mt-5">
                            <button
                                onClick={() => onConfirm(booking._id)}
                                disabled={isProcessing}
                                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 text-white rounded-2xl font-black hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100 disabled:opacity-50"
                            >
                                {isProcessing ? <Loader className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                Xác nhận
                            </button>
                            <button
                                onClick={() => onCancel(booking._id)}
                                disabled={isProcessing}
                                className="flex items-center gap-2 px-6 py-2.5 bg-red-50 text-red-500 rounded-2xl font-black hover:bg-red-100 transition-all disabled:opacity-50"
                            >
                                <X className="w-4 h-4" /> Từ chối
                            </button>
                        </div>
                    )}

                    {booking.cancelReason && (
                        <div className="mt-3 p-3 bg-red-50 rounded-xl text-sm text-red-600">
                            <span className="font-bold">Lý do từ chối:</span> {booking.cancelReason}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingRequestsPage;
