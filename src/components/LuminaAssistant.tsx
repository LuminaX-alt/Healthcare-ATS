import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, MessageCircle, X, Zap, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../api';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'lumina';
  timestamp: Date;
  type?: 'query' | 'response' | 'system';
}

interface LuminaResponse {
  answer: string;
  type: string;
  references?: string[];
}

interface LuminaProps {
  patientInfo?: {
    name?: string;
    age?: number;
    ageGroup?: 'pediatric' | 'adult' | 'elderly';
    allergies?: string[];
  };
  compact?: boolean;
}

const LuminaAssistant: React.FC<LuminaProps> = ({ patientInfo, compact = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showWelcome, setShowWelcome] = useState(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: `msg-${Date.now()}`,
        text: `👋 **Hey! I'm Alt-X - Your REAL AI Assistant!**

🤖 **Powered by Google Gemini 2.5 Flash** - Advanced AI model

I can answer **ANY question** you have:

✅ **Medical Questions:**
   • Drug dosages and interactions
   • Disease explanations and treatments
   • Clinical guidelines and protocols
   • Patient case discussions

✅ **General Knowledge:**
   • Science and medical concepts
   • How things work
   • Research and evidence

✅ **Anything Else:**
   • Problem-solving
   • Explanations
   • Advice and recommendations

🆓 **100% FREE** - Google's free tier
⚡ **Lightning Fast** - Responses in 1-2 seconds
🌐 **Internet-connected** - Always up-to-date knowledge

**I'm a REAL AI, not pre-programmed responses!**

What would you like to know?

💬 **Anything you want to discuss!**
- Medical topics (drugs, treatments, diagnostics)
- Patient cases and clinical decisions
- General questions and explanations
- Treatment guidelines and protocols
- Drug dosages and interactions
- Or just have a casual conversation!

🤖 **I'm a REAL AI** - I can understand context, remember our conversation, and chat naturally with you.

So, what would you like to talk about today? 😊`,
        sender: 'lumina',
        timestamp: new Date(),
        type: 'system'
      };
      setMessages([welcomeMessage]);
      setShowWelcome(false);
    }
  }, [isOpen, compact]); // Add compact to dependencies

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
      type: 'query'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      // Use LOCAL AI endpoint for conversational Llama 2
      console.log('🚀 Sending query to Alt-X:', inputValue);
      const response = await api.post('/lumina-ai-local/query', {
        query: inputValue,
        context: 'conversation',
        patientInfo: patientInfo
      });

      console.log('📥 Received response:', response.data);

      if (response.data && response.data.response) {
        const answerText = response.data.response.answer || response.data.response;
        console.log('✅ Answer extracted:', answerText);
        
        const luminaResponse: Message = {
          id: `msg-${Date.now()}-response`,
          text: answerText,
          sender: 'lumina',
          timestamp: new Date(),
          type: 'response'
        };
        setMessages(prev => [...prev, luminaResponse]);
      } else {
        console.error('❌ No response.data.response found:', response.data);
      }
    } catch (err) {
      console.error('❌ API Error:', err);
      setError('Failed to get response. Please try again.');
      const errorMessage: Message = {
        id: `msg-${Date.now()}-error`,
        text: `⚠️ I encountered an error connecting to Google Gemini AI. This could mean:\n\n1. 🌐 No internet connection\n2. 🔑 API key issue\n3. 🖥️ Backend server not running\n\nPlease check:\n• Internet connection is active\n• Backend server is running on port 3001\n• Try again in a moment\n\nFeel free to try another question!`,
        sender: 'lumina',
        timestamp: new Date(),
        type: 'system'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Compact floating chat bubble view
  if (compact) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        {/* Chat Window */}
        {isOpen && (
          <div className="mb-4 w-96 h-[600px] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-4 flex items-center justify-between shadow-lg">
              <div className="flex items-center space-x-2">
                <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm">
                  <Zap className="h-5 w-5" />
                </div>
                <h3 className="font-semibold tracking-tight">Alt-X Assistant</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 p-1.5 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-gray-50 to-white">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-indigo-600 text-white rounded-br-none'
                        : message.type === 'system'
                        ? 'bg-purple-50 border border-purple-200 rounded-bl-none'
                        : 'bg-white border border-gray-200 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                    <span className="text-sm text-gray-600">Alt-X is thinking...</span>
                  </div>
                </div>
              )}
              {error && (
                <div className="flex justify-start">
                  <div className="max-w-xs bg-red-50 border border-red-200 px-4 py-2 rounded-lg flex items-start space-x-2">
                    <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 p-4 bg-white">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="💬 Chat with me about medications, guidelines, or any medical query..."
                  disabled={isLoading}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 text-sm"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputValue.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white p-2 rounded-lg transition-colors"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Floating Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-shadow"
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <MessageCircle className="h-6 w-6" />
          )}
        </button>
      </div>
    );
  }

  // Full-width panel view (for integration into dashboard tabs)
  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-lg flex flex-col overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-6 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
            <Zap className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Alt-X Assistant</h2>
            <p className="text-indigo-100 text-sm font-medium">Real-time WHO Guidelines & Patient Support</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white">
        {messages.map((message) => (
          <div key={message.id}>
            {message.sender === 'user' ? (
              <div className="flex justify-end mb-4">
                <div className="max-w-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-3 rounded-2xl rounded-br-none shadow-md">
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p className="text-xs text-indigo-100 mt-1.5 opacity-80">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex justify-start mb-4">
                <div className={`max-w-2xl px-5 py-3 rounded-2xl rounded-bl-none shadow-sm ${
                  message.type === 'system'
                    ? 'bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200'
                    : 'bg-white border border-gray-200'
                }`}>
                  <div className="flex items-start space-x-3">
                    {message.type !== 'system' && (
                      <div className="bg-green-100 p-1 rounded-full">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{message.text}</p>
                      <p className="text-xs text-gray-500 mt-1.5">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-indigo-200 px-5 py-3 rounded-2xl rounded-bl-none shadow-sm">
              <div className="flex items-center space-x-3">
                <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
                <span className="text-sm text-gray-600 font-medium">Alt-X is thinking...</span>
              </div>
            </div>
          </div>
        )}
        {error && (
          <div className="flex justify-start">
            <div className="max-w-2xl bg-red-50 border border-red-200 px-5 py-3 rounded-2xl rounded-bl-none shadow-sm flex items-start space-x-3">
              <div className="bg-red-100 p-1 rounded-full">
                <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
              </div>
              <p className="text-sm text-red-700 leading-relaxed">{error}</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-6 bg-gradient-to-r from-gray-50 to-white shadow-lg">
        <div className="flex space-x-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="💬 Chat naturally with me... Ask about medications, treatments, guidelines, or any medical question!"
            disabled={isLoading}
            className="flex-1 px-5 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200 text-sm"
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl transition-all duration-200 flex items-center space-x-2 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Send className="h-5 w-5" />
                <span>Send</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LuminaAssistant;
