'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Sparkles,
  Map,
  Utensils,
  Camera,
  Minimize2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

// Định nghĩa kiểu dữ liệu tin nhắn
type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

// Các Option gợi ý
const SUGGESTIONS = [
  { 
    label: "Lên lịch trình 2 ngày 1 đêm", 
    prompt: "Lên giúp tôi lịch trình du lịch Hà Tĩnh 2 ngày 1 đêm cho 2 người, ngân sách 3 triệu." 
  },
  { 
    label: "Tìm quán ăn đặc sản", 
    prompt: "Tìm giúp tôi các quán ăn đặc sản ngon, giá bình dân ở thành phố Hà Tĩnh." 
  },
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Ref để cuộn xuống cuối
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Tự động cuộn xuống cuối khi có tin nhắn mới hoặc đang load
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, isOpen]);

  // Hàm gửi tin nhắn
  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Gọi API Backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/chat`, { // Đảm bảo đúng route API của bạn
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content }),
      });

      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      const aiContent = data.itinerary || data.message || "Xin lỗi, tôi không hiểu yêu cầu.";

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiContent
      };
      setMessages(prev => [...prev, botMsg]);

    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: "Hệ thống đang bận, vui lòng thử lại sau."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  return (
    <div className="fixed bottom-3 right-10 z-[9999] flex flex-col items-end gap-4 font-sans">
      {/* 1. NÚT MỞ CHAT (Khi đóng) */}
      {!isOpen && (
        <Button 
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-xl transition-all duration-300 hover:scale-110 p-0 flex items-center justify-center"
        >
          <MessageCircle className="h-7 w-7 text-white" />
          {/* Dot thông báo */}
          <span className="absolute top-0 right-0 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        </Button>
      )}

      {/* 2. CỬA SỔ CHAT (Khi mở) */}
      {/* Sử dụng CSS transform để tạo hiệu ứng mở mượt mà */}
      <div 
        className={cn(
          "w-[360px] md:w-[400px] h-[550px] max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right",
          isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-0 opacity-0 translate-y-10 pointer-events-none absolute"
        )}
      >
        
        {/* --- HEADER --- */}
        <div className="bg-blue-600 p-4 flex items-center justify-between shrink-0 text-white shadow-md z-10">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-1.5 rounded-full backdrop-blur-sm">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Trợ lý du lịch</h3>
              <div className="flex items-center gap-1.5 opacity-90">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-[10px]">Đang hoạt động</span>
              </div>
            </div>
          </div>
          <div className="flex gap-1">
            <Button 
              size="icon" variant="ghost" 
              className="h-8 w-8 text-white hover:bg-white/20 rounded-full"
              onClick={() => setIsOpen(false)}
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
            <Button 
              size="icon" variant="ghost" 
              className="h-8 w-8 text-white hover:bg-white/20 rounded-full"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* --- BODY (SCROLLABLE AREA) --- */}
        <div className="flex-1 overflow-y-auto bg-slate-50 p-4 scroll-smooth">
          <div className="flex flex-col gap-4 min-h-full">
            
            {/* Tin nhắn chào mừng */}
            <div className="flex gap-3">
              <Avatar className="h-8 w-8 border bg-blue-100 shrink-0">
                <AvatarFallback className="bg-blue-600 text-white"><Bot size={14} /></AvatarFallback>
              </Avatar>
              <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm text-sm text-gray-700 max-w-[85%]">
                Chào bạn! Mình là AI hỗ trợ du lịch Hà Tĩnh. Bạn cần mình giúp gì không?
              </div>
            </div>

            {/* Danh sách tin nhắn */}
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={cn(
                  "flex gap-2 w-full",
                  msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                )}
              >
                <Avatar className="h-8 w-8 border shrink-0">
                  <AvatarFallback className={msg.role === 'user' ? "bg-slate-800 text-white" : "bg-blue-600 text-white"}>
                    {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                  </AvatarFallback>
                </Avatar>
                
                <div className={cn(
                  "p-3 rounded-2xl text-sm max-w-[85%] shadow-sm overflow-hidden",
                  msg.role === 'user' 
                    ? "bg-blue-600 text-white rounded-tr-none" 
                    : "bg-white text-gray-700 border border-gray-100 rounded-tl-none"
                )}>
                  {msg.role === 'assistant' ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none break-words">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                  ) : (
                      msg.content
                  )}
                </div>
              </div>
            ))}

            {/* Loading Animation */}
            {isLoading && (
              <div className="flex gap-3">
                <Avatar className="h-8 w-8 border shrink-0">
                  <AvatarFallback className="bg-blue-600 text-white"><Bot size={14} /></AvatarFallback>
                </Avatar>
                <div className="bg-white p-3 rounded-2xl rounded-tl-none border shadow-sm w-12 flex items-center justify-center">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                  </div>
                </div>
              </div>
            )}

            {/* Gợi ý (Chỉ hiện khi chưa có tin nhắn) */}
            {messages.length === 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-xs font-semibold text-gray-400 uppercase ml-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Gợi ý nhanh
                </p>
                <div className="grid gap-2">
                  {SUGGESTIONS.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleSendMessage(item.prompt)}
                      className="text-left text-xs p-2.5 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-xl transition-colors text-gray-600 hover:text-blue-700 font-medium"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Element vô hình để scroll xuống */}
            <div ref={messagesEndRef} className="h-1" />
          </div>
        </div>

        {/* --- FOOTER (INPUT) --- */}
        <div className="p-3 bg-white border-t border-gray-100 shrink-0">
          <div className="relative flex items-center">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập tin nhắn..."
              className="pr-10 py-5 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus-visible:ring-blue-500 transition-all text-sm"
              disabled={isLoading}
            />
            <Button 
              size="icon" 
              className={cn(
                "absolute right-1.5 h-8 w-8 rounded-lg transition-all",
                inputValue.trim() ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-200 text-gray-400 hover:bg-gray-300"
              )}
              onClick={() => handleSendMessage(inputValue)}
              disabled={!inputValue.trim() || isLoading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-[10px] text-center text-gray-400 mt-2">
            AI có thể mắc lỗi. Hãy kiểm tra thông tin quan trọng.
          </div>
        </div>

      </div>
    </div>
  );
}