import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Paperclip, 
  Smile, 
  X,
  Check,
  CheckCheck,
  User,
  Image as ImageIcon,
  FileText,
  Mic
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Message {
  id: string;
  sender: 'patient' | 'doctor';
  content: string;
  timestamp: Date;
  read: boolean;
  type: 'text' | 'image' | 'file';
  fileUrl?: string;
  fileName?: string;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctorId: string;
  doctorName: string;
}

const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose, doctorId, doctorName }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [doctorOnline, setDoctorOnline] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Simulate loading previous messages
      loadPreviousMessages();
      
      // Simulate doctor typing
      const typingInterval = setInterval(() => {
        if (Math.random() > 0.9) {
          setIsTyping(true);
          setTimeout(() => setIsTyping(false), 3000);
        }
      }, 10000);

      return () => clearInterval(typingInterval);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadPreviousMessages = () => {
    // Simulate previous messages
    const demoMessages: Message[] = [
      {
        id: '1',
        sender: 'doctor',
        content: `Hello! I'm Dr. ${doctorName}. How can I help you today?`,
        timestamp: new Date(Date.now() - 3600000),
        read: true,
        type: 'text'
      },
      {
        id: '2',
        sender: 'patient',
        content: 'Hi doctor, I need to consult about my prescription.',
        timestamp: new Date(Date.now() - 3500000),
        read: true,
        type: 'text'
      },
      {
        id: '3',
        sender: 'doctor',
        content: 'Of course! Please tell me about your symptoms and current medications.',
        timestamp: new Date(Date.now() - 3400000),
        read: true,
        type: 'text'
      }
    ];
    setMessages(demoMessages);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: 'patient',
      content: newMessage,
      timestamp: new Date(),
      read: false,
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate doctor response
    setTimeout(() => {
      simulateDoctorResponse();
    }, 2000 + Math.random() * 3000);
  };

  const simulateDoctorResponse = () => {
    const responses = [
      "I understand. Let me review your case.",
      "That's a valid concern. Have you experienced this before?",
      "Based on what you've told me, I'd like to ask a few more questions.",
      "Thank you for sharing that information.",
      "Let me check your medical history.",
    ];

    const response: Message = {
      id: Date.now().toString(),
      sender: 'doctor',
      content: responses[Math.floor(Math.random() * responses.length)],
      timestamp: new Date(),
      read: true,
      type: 'text'
    };

    setMessages(prev => [...prev, response]);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: 'patient',
      content: `Sent a file: ${file.name}`,
      timestamp: new Date(),
      read: false,
      type: 'file',
      fileName: file.name,
      fileUrl: URL.createObjectURL(file)
    };

    setMessages(prev => [...prev, message]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 flex items-center justify-between rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Dr. {doctorName}</h3>
              <p className="text-blue-100 text-xs flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${doctorOnline ? 'bg-green-400' : 'bg-gray-400'}`}></span>
                {doctorOnline ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-white hover:text-gray-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'patient' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[70%] ${message.sender === 'patient' ? 'order-2' : 'order-1'}`}>
                <div className={`rounded-lg p-3 ${
                  message.sender === 'patient'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-900 border border-gray-200'
                }`}>
                  {message.type === 'file' && (
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm font-medium">{message.fileName}</span>
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                <div className="flex items-center gap-2 mt-1 px-1">
                  <span className={`text-xs ${message.sender === 'patient' ? 'text-gray-500' : 'text-gray-500'}`}>
                    {message.timestamp.toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                  {message.sender === 'patient' && (
                    message.read ? (
                      <CheckCheck className="h-3 w-3 text-blue-600" />
                    ) : (
                      <Check className="h-3 w-3 text-gray-400" />
                    )
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        <div className="p-3 border-t border-gray-200 bg-white">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setNewMessage("I need to refill my prescription")}
              className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm whitespace-nowrap hover:bg-blue-100"
            >
              Refill prescription
            </button>
            <button
              onClick={() => setNewMessage("Can I get a copy of my medical records?")}
              className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm whitespace-nowrap hover:bg-blue-100"
            >
              Medical records
            </button>
            <button
              onClick={() => setNewMessage("I have some side effects")}
              className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm whitespace-nowrap hover:bg-blue-100"
            >
              Side effects
            </button>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-200 rounded-b-lg">
          <div className="flex items-end gap-2">
            {/* File Upload */}
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              accept="image/*,.pdf,.doc,.docx"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
              title="Attach file"
            >
              <Paperclip className="h-5 w-5" />
            </button>

            {/* Message Input */}
            <div className="flex-1 relative">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                rows={1}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                style={{ minHeight: '40px', maxHeight: '120px' }}
              />
            </div>

            {/* Emoji Button */}
            <button
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
              title="Add emoji"
            >
              <Smile className="h-5 w-5" />
            </button>

            {/* Voice Message Button */}
            <button
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
              title="Voice message"
            >
              <Mic className="h-5 w-5" />
            </button>

            {/* Send Button */}
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
