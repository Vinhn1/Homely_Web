import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, CheckCheck, Trash2, Home, Calendar, Star, ShieldCheck } from 'lucide-react';
import { useNotificationStore } from '@/store/notificationStore';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

const NOTIFICATION_ICONS = {
    new_booking: { icon: Home, color: 'text-blue-500', bg: 'bg-blue-50' },
    booking_confirmed: { icon: Check, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    booking_cancelled: { icon: Trash2, color: 'text-red-500', bg: 'bg-red-50' },
    new_review: { icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
    owner_approved: { icon: ShieldCheck, color: 'text-purple-500', bg: 'bg-purple-50' },
    owner_rejected: { icon: ShieldCheck, color: 'text-red-500', bg: 'bg-red-50' },
};

const NotificationBell = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const { notifications, unreadCount, fetchNotifications, markAsRead, markAllAsRead, isLoading } = useNotificationStore();

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    // Đóng dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNotificationClick = (notif) => {
        if (!notif.isRead) markAsRead(notif._id);
        setIsOpen(false);
        if (notif.relatedBooking) {
            navigate('/dashboard/booking-requests');
        } else if (notif.relatedProperty) {
            navigate(`/property/${notif.relatedProperty}`);
        }
    };

    const recentNotifications = notifications.slice(0, 8);

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative w-11 h-11 rounded-2xl bg-slate-50 hover:bg-blue-50 flex items-center justify-center transition-all duration-200 hover:scale-105"
                aria-label="Thông báo"
            >
                <Bell className={`w-5 h-5 ${unreadCount > 0 ? 'text-blue-600 animate-[wiggle_1s_ease-in-out_infinite]' : 'text-slate-500'}`} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-white animate-bounce">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <div className="absolute right-0 top-14 w-96 bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
                        <div>
                            <h3 className="text-sm font-black text-slate-900">Thông Báo</h3>
                            {unreadCount > 0 && (
                                <p className="text-xs text-slate-400">{unreadCount} chưa đọc</p>
                            )}
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-bold px-3 py-1.5 rounded-full hover:bg-blue-50 transition-all"
                            >
                                <CheckCheck className="w-3.5 h-3.5" />
                                Đọc tất cả
                            </button>
                        )}
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-80 overflow-y-auto">
                        {isLoading ? (
                            <div className="py-10 text-center text-slate-400 text-sm">Đang tải...</div>
                        ) : recentNotifications.length === 0 ? (
                            <div className="py-12 text-center">
                                <Bell className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                                <p className="text-sm text-slate-400 font-medium">Không có thông báo nào</p>
                            </div>
                        ) : (
                            recentNotifications.map((notif) => {
                                const typeConfig = NOTIFICATION_ICONS[notif.type] || NOTIFICATION_ICONS.new_booking;
                                const IconComponent = typeConfig.icon;
                                return (
                                    <button
                                        key={notif._id}
                                        onClick={() => handleNotificationClick(notif)}
                                        className={`w-full flex items-start gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors text-left group ${!notif.isRead ? 'bg-blue-50/40' : ''}`}
                                    >
                                        {/* Icon */}
                                        <div className={`flex-shrink-0 w-9 h-9 rounded-xl ${typeConfig.bg} flex items-center justify-center mt-0.5`}>
                                            <IconComponent className={`w-4 h-4 ${typeConfig.color}`} />
                                        </div>
                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm leading-snug ${notif.isRead ? 'text-slate-600' : 'text-slate-900 font-semibold'}`}>
                                                {notif.title}
                                            </p>
                                            <p className="text-xs text-slate-400 truncate mt-0.5">{notif.message}</p>
                                            <p className="text-[10px] text-slate-300 mt-1 font-medium">
                                                {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: vi })}
                                            </p>
                                        </div>
                                        {/* Unread dot */}
                                        {!notif.isRead && (
                                            <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2" />
                                        )}
                                    </button>
                                );
                            })
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-5 py-3 border-t border-slate-50">
                        <button
                            onClick={() => { navigate('/dashboard/notifications'); setIsOpen(false); }}
                            className="w-full text-center text-xs font-black text-blue-600 hover:text-blue-700 py-1.5 rounded-full hover:bg-blue-50 transition-all"
                        >
                            Xem tất cả thông báo →
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
