import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/notifications';

const getToken = () => localStorage.getItem('accessToken');
const authHeaders = () => ({ Authorization: `Bearer ${getToken()}` });

export const useNotificationStore = create((set, get) => ({
    notifications: [],
    unreadCount: 0,
    isLoading: false,

    // Lấy danh sách thông báo từ server
    fetchNotifications: async () => {
        set({ isLoading: true });
        try {
            const res = await axios.get(API_URL, { headers: authHeaders() });
            set({
                notifications: res.data.data,
                unreadCount: res.data.unreadCount,
                isLoading: false
            });
        } catch {
            set({ isLoading: false });
        }
    },

    // Thêm thông báo mới (từ socket event)
    addNotification: (notification) => {
        set(state => ({
            notifications: [notification, ...state.notifications],
            unreadCount: state.unreadCount + 1
        }));
    },

    // Đánh dấu đã đọc
    markAsRead: async (id) => {
        try {
            await axios.patch(`${API_URL}/${id}/read`, {}, { headers: authHeaders() });
            set(state => ({
                notifications: state.notifications.map(n =>
                    n._id === id ? { ...n, isRead: true } : n
                ),
                unreadCount: Math.max(0, state.unreadCount - 1)
            }));
        } catch (error) {
            console.error('Lỗi markAsRead:', error);
        }
    },

    // Đánh dấu tất cả đã đọc
    markAllAsRead: async () => {
        try {
            await axios.patch(`${API_URL}/read-all`, {}, { headers: authHeaders() });
            set(state => ({
                notifications: state.notifications.map(n => ({ ...n, isRead: true })),
                unreadCount: 0
            }));
        } catch (error) {
            console.error('Lỗi markAllAsRead:', error);
        }
    },

    // Xóa thông báo
    deleteNotification: async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`, { headers: authHeaders() });
            set(state => ({
                notifications: state.notifications.filter(n => n._id !== id),
                unreadCount: state.notifications.find(n => n._id === id && !n.isRead)
                    ? state.unreadCount - 1
                    : state.unreadCount
            }));
        } catch (error) {
            console.error('Lỗi deleteNotification:', error);
        }
    },

    // Reset store khi logout
    reset: () => set({ notifications: [], unreadCount: 0 })
}));
