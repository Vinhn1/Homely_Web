import User from "../models/User.js";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { emitMessage } from "../utils/socketManager.js";

// Lấy danh sách hội thoại của người dùng hiện tại
export const getConversations = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const conversations = await Conversation.find({
            participants: { $in: [userId] }
        })
        .populate({
            path: 'participants',
            select: 'displayName avatarUrl role'
        })
        .populate('lastMessage')
        .sort({ updatedAt: -1 });

        // Lọc bớt thông tin người dùng hiện tại trong participants
        const formattedConversations = conversations.map(conv => {
            const otherUser = conv.participants.find(p => p._id.toString() !== userId);
            return {
                ...conv._doc,
                otherUser
            };
        });

        res.status(200).json(formattedConversations);
    } catch (error) {
        console.error("Error in getConversations:", error);
        res.status(500).json({ message: "Lỗi khi lấy danh sách hội thoại" });
    }
};

// Lấy tin nhắn trong một hội thoại
export const getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const messages = await Message.find({ conversationId })
            .sort({ createdAt: 1 });

        // Đánh dấu tin nhắn là đã đọc (ngoại trừ tin nhắn của chính mình)
        await Message.updateMany(
            { conversationId, sender: { $ne: req.user.id }, isRead: false },
            { $set: { isRead: true } }
        );

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error in getMessages:", error);
        res.status(500).json({ message: "Lỗi khi lấy tin nhắn" });
    }
};

// Gửi tin nhắn
export const sendMessage = async (req, res) => {
    try {
        const { text, image, receiverId } = req.body;
        const senderId = req.user.id;

        // Tìm hoặc tạo hội thoại
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            });
        }

        const newMessage = new Message({
            conversationId: conversation._id,
            sender: senderId,
            text,
            image
        });

        await newMessage.save();

        // Cập nhật tin nhắn cuối cùng trong hội thoại
        conversation.lastMessage = newMessage._id;
        await conversation.save();

        // Gửi qua socket cho người nhận (đảm bảo là plain object với string IDs)
        const messageToSend = {
            ...newMessage.toObject(),
            _id: newMessage._id.toString(),
            conversationId: newMessage.conversationId.toString(),
            sender: newMessage.sender.toString()
        };
        
        emitMessage(receiverId, messageToSend);

        res.status(201).json(messageToSend);
    } catch (error) {
        console.error("Error in sendMessage:", error);
        res.status(500).json({ message: "Lỗi khi gửi tin nhắn" });
    }
};

// Tìm hoặc tạo hội thoại khi người dùng nhấn nút "Chat" từ trang chi tiết phòng
export const getOrCreateConversation = async (req, res) => {
    try {
        const { userId } = req.params; // ID của chủ phòng
        const currentUserId = req.user.id;

        if (userId === currentUserId) {
            return res.status(400).json({ message: "Bạn không thể chat với chính mình" });
        }

        let conversation = await Conversation.findOne({
            participants: { $all: [currentUserId, userId] }
        }).populate({
            path: 'participants',
            select: 'displayName avatarUrl role'
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [currentUserId, userId]
            });
            conversation = await conversation.populate({
                path: 'participants',
                select: 'displayName avatarUrl role'
            });
        }

        const otherUser = conversation.participants.find(p => p._id.toString() !== currentUserId);

        res.status(200).json({
            ...conversation._doc,
            otherUser
        });
    } catch (error) {
        console.error("Error in getOrCreateConversation:", error);
        res.status(500).json({ message: "Lỗi khi khởi tạo hội thoại" });
    }
};
