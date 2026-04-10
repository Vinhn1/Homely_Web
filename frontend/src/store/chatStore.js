import { create } from 'zustand';
import axios from '../api/axios';

const API_URL = "/chat";

export const useChatStore = create((set, get) => ({
    conversations: [],
    messages: [],
    selectedConversation: null,
    isConversationsLoading: false,
    isMessagesLoading: false,

    getConversations: async () => {
        set({ isConversationsLoading: true });
        try {
            const response = await axios.get(`${API_URL}`);
            set({ conversations: response.data, isConversationsLoading: false });
        } catch (error) {
            console.error("Error fetching conversations:", error);
            set({ isConversationsLoading: false });
        }
    },

    getMessages: async (conversationId) => {
        set({ isMessagesLoading: true });
        try {
            const response = await axios.get(`${API_URL}/messages/${conversationId}`);
            set({ messages: response.data, isMessagesLoading: false });
        } catch (error) {
            console.error("Error fetching messages:", error);
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (messageData) => {
        const { selectedConversation, messages } = get();
        try {
            const response = await axios.post(`${API_URL}/send`, messageData);
            // Nếu đang ở trong đúng hội thoại đó thì thêm tin nhắn vào list
            if (selectedConversation && (selectedConversation._id === response.data.conversationId)) {
                set({ messages: [...messages, response.data] });
            }
            // Cập nhật lại list hội thoại để thấy tin nhắn mới nhất
            get().getConversations();
            return response.data;
        } catch (error) {
            console.error("Error sending message:", error);
            throw error;
        }
    },

    getOrCreateConversation: async (userId) => {
        try {
            const response = await axios.get(`${API_URL}/conversation/${userId}`);
            set({ selectedConversation: response.data });
            await get().getMessages(response.data._id);
            return response.data;
        } catch (error) {
            console.error("Error getting/creating conversation:", error);
            throw error;
        }
    },

    setSelectedConversation: (conversation) => {
        set({ selectedConversation: conversation });
        if (conversation) {
            get().getMessages(conversation._id);
        } else {
            set({ messages: [] });
        }
    },

    // Hàm handle tin nhắn real-time từ socket
    addRealTimeMessage: (message) => {
        const { selectedConversation, messages, conversations } = get();
        
        // Nếu đang mở hội thoại này thì thêm vào list tin nhắn
        if (selectedConversation && String(selectedConversation._id) === String(message.conversationId)) {
            set((state) => ({ messages: [...state.messages, message] }));
        }
        
        // Luôn cập nhật lại danh sách hội thoại để hiển thị tin nhắn mới nhất/unread
        get().getConversations();
    }
}));
