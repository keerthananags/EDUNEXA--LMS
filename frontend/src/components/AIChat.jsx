import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Bot, User } from 'lucide-react';
import { aiAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function AIChat({ courseTitle, courseContent }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I am your AI tutor. Ask me anything about your learning!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // Check if user is logged in
      const token = localStorage.getItem('token');
      if (!token) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: 'Please login to use the AI chat feature.' 
        }]);
        setIsLoading(false);
        return;
      }

      // Test if backend is reachable first
      const API_BASE_URL = import.meta.env.VITE_API_URL;

      // Safety check
      if (!API_BASE_URL) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: 'API URL not configured. Please check your environment settings.' 
        }]);
        setIsLoading(false);
        return;
      }

      try {
        const healthCheck = await fetch(`${API_BASE_URL.replace('/api', '')}/`, { 
          method: 'GET',
          signal: AbortSignal.timeout(3000)
        });
        if (!healthCheck.ok) {
          throw new Error('Backend not responding');
        }
      } catch (connError) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: 'Cannot connect to server. Please make sure the backend is running on port 5000.' 
        }]);
        setIsLoading(false);
        return;
      }

      const res = await aiAPI.chat({
        message: userMessage,
        courseContext: courseTitle ? {
          title: courseTitle,
          description: courseContent || ''
        } : null
      });

      setMessages(prev => [...prev, { role: 'assistant', content: res.response }]);
    } catch (err) {
      console.error('Chat error:', err);
      let errorMessage = 'Sorry, I am having trouble responding right now. Please try again!';
      
      if (err.message?.includes('401') || err.message?.includes('403')) {
        errorMessage = 'Please login to use the AI chat feature.';
      } else if (err.message?.includes('404')) {
        errorMessage = 'AI service not available. Please try again later.';
      } else if (err.message?.includes('500')) {
        errorMessage = 'AI service error. Please check if Gemini API key is configured correctly.';
      } else if (err.name === 'TypeError' || err.message?.includes('fetch')) {
        errorMessage = 'Cannot connect to server. Please make sure the backend is running on port 5000.';
      }
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: errorMessage 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickActions = [
    { icon: Sparkles, label: 'Generate Quiz', action: () => setInput('Generate a quiz for me') },
    { icon: Bot, label: 'Explain Topic', action: () => setInput('Can you explain the main concepts?') },
    { icon: MessageCircle, label: 'Practice Questions', action: () => setInput('Give me practice questions') }
  ];

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-[#5764f1] to-[#c081ff] rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-all z-50 group"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-[#091328] rounded-2xl shadow-2xl border border-white/10 flex flex-col z-50 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#5764f1] to-[#c081ff] p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white">AI Tutor</h3>
                <p className="text-xs text-white/80">Always here to help</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 bg-gradient-to-r from-[#5764f1] to-[#c081ff] rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-[#5764f1] to-[#c081ff] text-white rounded-br-none'
                      : 'bg-[#192540] text-[#dee5ff] rounded-bl-none'
                  }`}
                >
                  {msg.content}
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 bg-[#253550] rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-[#dee5ff]" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-[#5764f1] to-[#c081ff] rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white animate-pulse" />
                </div>
                <div className="bg-[#192540] p-3 rounded-2xl rounded-bl-none">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-[#dee5ff] rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-[#dee5ff] rounded-full animate-bounce delay-100"></span>
                    <span className="w-2 h-2 bg-[#dee5ff] rounded-full animate-bounce delay-200"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="px-4 py-2 border-t border-white/10">
            <div className="flex gap-2 overflow-x-auto">
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={action.action}
                  className="flex items-center gap-1 px-3 py-1.5 bg-[#192540] hover:bg-[#253550] rounded-full text-xs text-[#dee5ff] transition whitespace-nowrap"
                >
                  <action.icon className="w-3 h-3" />
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/10">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-2 bg-[#192540] border border-white/10 rounded-xl text-[#dee5ff] placeholder-slate-500 focus:outline-none focus:border-[#5764f1]"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="p-2 bg-gradient-to-r from-[#5764f1] to-[#c081ff] rounded-xl text-white hover:shadow-lg transition disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
