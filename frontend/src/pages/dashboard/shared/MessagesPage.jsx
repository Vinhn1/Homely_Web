import React, { useEffect, useState, useRef } from 'react';
import { useChatStore } from '@/store/chatStore';
import { useAuthStore } from '@/store/authStore';
import { 
    Search, 
    MessageCircle, 
    MoreVertical, 
    Send, 
    Image as ImageIcon, 
    Smile, 
    Phone, 
    Video,
    ChevronLeft,
    User
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const MessagesPage = () => {
    const { 
        conversations, 
        selectedConversation, 
        messages, 
        getConversations, 
        setSelectedConversation, 
        sendMessage,
        isConversationsLoading,
        isMessagesLoading
    } = useChatStore();
    const { user } = useAuthStore();
    const [inputText, setInputText] = useState("");
    const [showMobileList, setShowMobileList] = useState(true);
    const messagesEndRef = useRef(null);
    const scrollContainerRef = useRef(null);

    const scrollToBottom = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({
                top: scrollContainerRef.current.scrollHeight,
                behavior: "smooth"
            });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        getConversations();
    }, [getConversations]);

    const handleSelectConversation = (conv) => {
        setSelectedConversation(conv);
        setShowMobileList(false);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputText.trim() || !selectedConversation) return;

        try {
            await sendMessage({
                text: inputText,
                receiverId: selectedConversation.otherUser._id
            });
            setInputText("");
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    const formatMessageTime = (date) => {
        return format(new Date(date), 'HH:mm', { locale: vi });
    };

    return (
        <div className="flex h-[calc(100vh-140px)] bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-200">
            {/* Sidebar - Chat List */}
            <div className={`w-full md:w-80 lg:w-96 border-r border-slate-200 flex flex-col ${!showMobileList ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Tin nhắn</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input 
                            type="text" 
                            placeholder="Tìm kiếm cuộc hội thoại..." 
                            className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {isConversationsLoading ? (
                        <div className="flex justify-center p-8">
                            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : conversations.length === 0 ? (
                        <div className="text-center p-8 text-slate-500">
                            <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-20" />
                            <p>Chưa có cuộc hội thoại nào</p>
                        </div>
                    ) : (
                        conversations.map((conv) => (
                            <div 
                                key={conv._id}
                                onClick={() => handleSelectConversation(conv)}
                                className={`p-4 flex items-center gap-3 cursor-pointer transition-colors hover:bg-slate-50 ${selectedConversation?._id === conv._id ? 'bg-primary/5 border-l-4 border-primary' : ''}`}
                            >
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200">
                                        {conv.otherUser?.avatarUrl ? (
                                            <img src={conv.otherUser.avatarUrl} alt={conv.otherUser.displayName} className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-full h-full p-2 text-slate-400" />
                                        )}
                                    </div>
                                    {/* Online indicator would go here */}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-semibold text-slate-800 truncate">{conv.otherUser?.displayName}</h3>
                                        {conv.lastMessage && (
                                            <span className="text-[10px] text-slate-400">
                                                {format(new Date(conv.updatedAt), 'HH:mm')}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-500 truncate">
                                        {conv.lastMessage?.sender === user.id ? 'Bạn: ' : ''}
                                        {conv.lastMessage?.text || (conv.lastMessage?.image ? 'Đã gửi một ảnh' : 'Bắt đầu trò chuyện')}
                                    </p>
                                </div>
                                {!conv.lastMessage?.isRead && conv.lastMessage?.sender !== user.id && (
                                    <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className={`flex-1 flex flex-col bg-slate-50 ${showMobileList ? 'hidden md:flex' : 'flex'}`}>
                {selectedConversation ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={() => setShowMobileList(true)}
                                    className="md:hidden p-2 hover:bg-slate-100 rounded-full"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200">
                                    {selectedConversation.otherUser?.avatarUrl ? (
                                        <img src={selectedConversation.otherUser.avatarUrl} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-full h-full p-2 text-slate-400" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">{selectedConversation.otherUser?.displayName}</h3>
                                    <p className="text-xs text-green-500 font-medium">Đang hoạt động</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                                    <Phone className="w-5 h-5" />
                                </button>
                                <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                                    <Video className="w-5 h-5" />
                                </button>
                                <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                                    <MoreVertical className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div 
                            ref={scrollContainerRef}
                            className="flex-1 overflow-y-auto p-4 space-y-4"
                        >
                            {isMessagesLoading ? (
                                <div className="flex justify-center p-8">
                                    <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : (
                                messages.map((msg, index) => {
                                    const isMe = msg.sender === user.id;
                                    return (
                                        <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[75%] md:max-w-[60%] rounded-2xl px-4 py-2 shadow-sm ${
                                                isMe 
                                                ? 'bg-primary text-white rounded-tr-none' 
                                                : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                                            }`}>
                                                <p className="text-sm md:text-base leading-relaxed">{msg.text}</p>
                                                <div className={`text-[10px] mt-1 ${isMe ? 'text-primary-foreground/70 text-right' : 'text-slate-400'}`}>
                                                    {formatMessageTime(msg.createdAt)}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-slate-200">
                            <form onSubmit={handleSendMessage} className="flex items-center gap-2 bg-slate-100 rounded-2xl p-2">
                                <button type="button" className="p-2 text-slate-400 hover:text-primary transition-colors">
                                    <ImageIcon className="w-5 h-5" />
                                </button>
                                <button type="button" className="p-2 text-slate-400 hover:text-primary transition-colors">
                                    <Smile className="w-5 h-5" />
                                </button>
                                <input 
                                    type="text" 
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    placeholder="Aa..." 
                                    className="flex-1 bg-transparent border-none focus:outline-none text-slate-700 py-2 px-1"
                                />
                                <button 
                                    type="submit" 
                                    disabled={!inputText.trim()}
                                    className={`p-2 rounded-xl transition-all ${
                                        inputText.trim() 
                                        ? 'bg-primary text-white shadow-md shadow-primary/20 hover:scale-105 active:scale-95' 
                                        : 'text-slate-300'
                                    }`}
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 space-y-4">
                        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center">
                            <MessageCircle className="w-12 h-12 opacity-20" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-lg font-bold text-slate-800">Bắt đầu trò chuyện</h3>
                            <p className="text-sm max-w-xs">Chọn một cuộc hội thoại từ danh sách bên trái hoặc nhắn tin cho chủ nhà từ trang phòng trọ.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessagesPage;
