// Socket Manager — quản lý real-time connections
// Map userId (string) → Set of socketIds để hỗ trợ nhiều tab/thiết bị
const userSocketMap = new Map();

let _io = null;

export const initSocket = (io) => {
    _io = io;

    io.on('connection', (socket) => {
        const userId = socket.handshake.auth?.userId;

        if (userId) {
            // Thêm socketId vào Set của user
            if (!userSocketMap.has(userId)) {
                userSocketMap.set(userId, new Set());
            }
            userSocketMap.get(userId).add(socket.id);
            console.log(`✅ Socket connected: user=${userId}, socketId=${socket.id}`);
        }

        socket.on('disconnect', () => {
            if (userId && userSocketMap.has(userId)) {
                userSocketMap.get(userId).delete(socket.id);
                if (userSocketMap.get(userId).size === 0) {
                    userSocketMap.delete(userId);
                }
                console.log(`❌ Socket disconnected: user=${userId}, socketId=${socket.id}`);
            }
        });
    });
};

// Gửi thông báo đến một user cụ thể (tất cả tabs/devices)
export const emitNotification = (recipientId, notification) => {
    if (!_io) return;
    
    const socketIds = userSocketMap.get(recipientId.toString());
    if (socketIds && socketIds.size > 0) {
        socketIds.forEach(socketId => {
            _io.to(socketId).emit('new_notification', notification);
        });
        console.log(`📢 Notification emitted to user=${recipientId}`);
    }
};

// Gửi tin nhắn real-time
export const emitMessage = (recipientId, message) => {
    if (!_io) return;
    
    const socketIds = userSocketMap.get(recipientId.toString());
    if (socketIds && socketIds.size > 0) {
        socketIds.forEach(socketId => {
            _io.to(socketId).emit('receive_message', message);
        });
        console.log(`💬 Message emitted to user=${recipientId}`);
    }
};

export const getOnlineUsers = () => Array.from(userSocketMap.keys());
