import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';
import { useChatStore } from '@/store/chatStore';
import { toast } from 'sonner';

const SOCKET_URL = 'http://localhost:5000';

export const useSocket = () => {
    const { user, isAuthenticated } = useAuthStore();
    const { addNotification } = useNotificationStore();
    const { addRealTimeMessage } = useChatStore();
    const socketRef = useRef(null);

    useEffect(() => {
        // Chỉ kết nối khi đã đăng nhập
        if (!isAuthenticated || !user?.id) return;

        // Tạo kết nối Socket.IO với userId trong auth header
        socketRef.current = io(SOCKET_URL, {
            auth: { userId: user.id },
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });

        const socket = socketRef.current;

        socket.on('connect', () => {
            console.log('🔌 Socket.IO connected:', socket.id);
        });

        // Lắng nghe thông báo mới
        socket.on('new_notification', (notification) => {
            addNotification(notification);
            // Hiện toast popup
            toast(notification.title, {
                description: notification.message,
                duration: 5000,
                icon: '🔔'
            });
        });

        // Lắng nghe tin nhắn mới
        socket.on('receive_message', (message) => {
            console.log('💬 Socket.IO message received:', message);
            addRealTimeMessage(message);
            // Có thể hiện toast nếu không đang ở trang chat
            if (window.location.pathname !== '/dashboard/messages' && window.location.pathname !== '/dashboard/chat') {
                toast("Tin nhắn mới", {
                    description: message.text || "Đã gửi một hình ảnh",
                    duration: 3000,
                    icon: '💬'
                });
            }
        });

        socket.on('disconnect', () => {
            console.log('🔌 Socket.IO disconnected');
        });

        socket.on('connect_error', (err) => {
            console.error('Socket connection error:', err.message);
        });

        // Cleanup khi logout hoặc unmount
        return () => {
            socket.disconnect();
        };
    }, [isAuthenticated, user?.id, addNotification, addRealTimeMessage]);

    return socketRef.current;
};
