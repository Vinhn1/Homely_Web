import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, CheckCheck, Trash2, Home, Star, ShieldCheck, Calendar } from 'lucide-react';
import { useNotificationStore } from '@/store/notificationStore';
import { formatDistanceToNow, isToday, isYesterday } from 'date-fns';
import { vi } from 'date-fns/locale';

const TYPE_CONFIG = {
    new_booking: { icon: Home, color: 'text-blue-500', bg: 'bg-blue-50', label: 'Đặt phòng mới' },
    booking_confirmed: { icon: Check, color: 'text-emerald-500', bg: 'bg-emerald-50', label: 'Xác nhận' },
    booking_cancelled: { icon: Trash2, color: 'text-red-500', bg: 'bg-red-50', label: 'Hủy' },
    new_review: { icon: Star, color: 'text-amber-500', bg: 'bg-amber-50', label: 'Đánh giá' },
    owner_approved: { icon: ShieldCheck, color: 'text-purple-500', bg: 'bg-purple-50', label: 'Duyệt chủ nhà' },
    owner_rejected: { icon: ShieldCheck, color: 'text-red-500', bg: 'bg-red-50', label: 'Từ chối' },
};

const getDateGroup = (dateStr) => {
    const date = new Date(dateStr);
    if (isToday(date)) return 'Hôm nay';
    if (isYesterday(date)) return 'Hôm qua';
    return date.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' });
};

const NotificationsPage = () => {
    const navigate = useNavigate();
    const { notifications, unreadCount, fetchNotifications, markAsRead, markAllAsRead, deleteNotification, isLoading } = useNotificationStore();

    useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

    // Group by date
    const grouped = notifications.reduce((acc, notif) => {
        const group = getDateGroup(notif.createdAt);
        if (!acc[group]) acc[group] = [];
        acc[group].push(notif);
        return acc;
    }, {});

    const handleClick = (notif) => {
        if (!notif.isRead) markAsRead(notif._id);
        if (notif.relatedBooking) navigate('/dashboard/booking-requests');
        else if (notif.relatedProperty) navigate(`/property/${notif.relatedProperty}`);
    };

    return (
        <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900">Thông Báo</h1>
                    <p className="text-slate-500 mt-1">{unreadCount > 0 ? `${unreadCount} chưa đọc` : 'Tất cả đã đọc'}</p>
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={markAllAsRead}
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-600 rounded-2xl font-bold text-sm hover:bg-blue-100 transition-all"
                    >
                        <CheckCheck className="w-4 h-4" /> Đọc tất cả
                    </button>
                )}
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="py-24 text-center text-slate-400">Đang tải thông báo...</div>
            ) : Object.keys(grouped).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center">
                        <Bell className="w-10 h-10 text-slate-200" />
                    </div>
                    <h3 className="text-xl font-black text-slate-600">Chưa có thông báo</h3>
                    <p className="text-slate-400">Các thông báo về đặt phòng và tin đăng sẽ xuất hiện ở đây.</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {Object.entries(grouped).map(([group, items]) => (
                        <div key={group}>
                            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">{group}</h2>
                            <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden divide-y divide-slate-50">
                                {items.map((notif) => {
                                    const config = TYPE_CONFIG[notif.type] || TYPE_CONFIG.new_booking;
                                    const Icon = config.icon;
                                    return (
                                        <div
                                            key={notif._id}
                                            className={`flex items-start gap-4 p-5 hover:bg-slate-50 cursor-pointer transition-colors group ${!notif.isRead ? 'bg-blue-50/30' : ''}`}
                                            onClick={() => handleClick(notif)}
                                        >
                                            {/* Icon */}
                                            <div className={`flex-shrink-0 w-10 h-10 rounded-2xl ${config.bg} flex items-center justify-center mt-0.5`}>
                                                <Icon className={`w-5 h-5 ${config.color}`} />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm leading-snug ${notif.isRead ? 'text-slate-600' : 'text-slate-900 font-bold'}`}>
                                                    {notif.title}
                                                </p>
                                                <p className="text-sm text-slate-400 mt-0.5 leading-relaxed">{notif.message}</p>
                                                <p className="text-xs text-slate-300 mt-1.5 font-medium">
                                                    {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: vi })}
                                                </p>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                {!notif.isRead && (
                                                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
                                                )}
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); deleteNotification(notif._id); }}
                                                    className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-300 hover:text-red-400 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NotificationsPage;
