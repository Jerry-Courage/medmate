import React from 'react';
import { Bot, Send, Heart, Activity, Droplets, Mic, Paperclip, Home, MessageCircle, Calendar, User } from 'lucide-react';

export default function BoldGradient() {
  return (
    <div className="w-[430px] h-[900px] mx-auto overflow-hidden relative bg-white shadow-2xl flex flex-col font-sans">
      {/* Header */}
      <div 
        className="pt-14 px-6 relative shrink-0"
        style={{ background: 'linear-gradient(135deg, #4ADE80 0%, #16A34A 100%)' }}
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-white/80 text-sm font-medium mb-1">Good morning! 👋</p>
            <h1 className="text-white font-bold text-3xl tracking-tight drop-shadow-sm">Medmate AI</h1>
          </div>
          <div className="w-11 h-11 rounded-full bg-white/20 border border-white/30 flex items-center justify-center backdrop-blur-md shadow-sm">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>
        
        <div className="flex gap-3 mb-10">
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/30 shadow-sm">
            <Heart className="w-4 h-4 text-white fill-white/40" />
            <span className="text-white font-semibold text-[15px]">72 bpm</span>
          </div>
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/30 shadow-sm">
            <Activity className="w-4 h-4 text-white" />
            <span className="text-white font-semibold text-[15px]">120/80 mmHg</span>
          </div>
        </div>

        {/* Curved bottom overlap */}
        <div className="absolute -bottom-1 left-0 right-0 h-6 bg-white rounded-t-[24px]" />
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-6 pt-2 pb-6 space-y-6 bg-white">
        {/* AI Message */}
        <div className="flex gap-3 max-w-[90%]">
          <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #4ADE80 0%, #16A34A 100%)' }}>
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="bg-[#F9FAFB] border border-gray-100 text-gray-800 p-4 rounded-2xl rounded-tl-none shadow-sm text-[15px] leading-relaxed">
            <p>Hi! I'm Medmate, your AI health assistant.</p>
            <p className="mt-2">Your vitals look great today — BP 120/80, HR 72 bpm. How can I help?</p>
          </div>
        </div>

        {/* User Message */}
        <div className="flex justify-end gap-3 max-w-[90%] ml-auto">
          <div className="p-4 rounded-3xl rounded-tr-sm shadow-md text-white text-[15px] leading-relaxed" style={{ background: 'linear-gradient(135deg, #22C55E, #16A34A)' }}>
            <p>What does my blood pressure reading mean?</p>
          </div>
        </div>

        {/* AI Message */}
        <div className="flex gap-3 max-w-[90%]">
          <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #4ADE80 0%, #16A34A 100%)' }}>
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="bg-[#F9FAFB] border border-gray-100 text-gray-800 p-4 rounded-2xl rounded-tl-none shadow-sm text-[15px] leading-relaxed">
            <p>Your 120/80 is perfectly normal! The first number (systolic) is the pressure when your heart beats. Great news — keep up those healthy habits! 💚</p>
          </div>
        </div>
      </div>

      {/* Input Bar */}
      <div className="bg-white border-t border-gray-100 p-4 pb-6 shrink-0">
        <div className="flex items-center gap-3">
          <button className="p-2 text-gray-400 hover:text-[#22C55E] transition-colors rounded-full hover:bg-gray-50 shrink-0">
            <Paperclip className="w-5 h-5" />
          </button>
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-full flex items-center px-4 h-12 focus-within:border-[#22C55E] focus-within:ring-1 focus-within:ring-[#22C55E] transition-all shadow-inner">
            <input 
              type="text" 
              placeholder="Ask Medmate..." 
              className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder-gray-400 text-[15px]"
            />
            <button className="p-1.5 text-gray-400 hover:text-[#22C55E] transition-colors">
              <Mic className="w-5 h-5" />
            </button>
          </div>
          <button 
            className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-md transform transition hover:scale-105 active:scale-95"
            style={{ background: 'linear-gradient(135deg, #22C55E, #16A34A)' }}
          >
            <Send className="w-5 h-5 text-white ml-0.5" />
          </button>
        </div>
      </div>

      {/* Bottom Tab Bar */}
      <div className="bg-white border-t border-gray-100 flex items-center justify-between px-8 pb-8 pt-4 shrink-0">
        <div className="flex flex-col items-center gap-1.5 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
          <Home className="w-6 h-6" />
          <span className="text-[10px] font-semibold">Home</span>
        </div>
        <div className="flex flex-col items-center gap-1.5 cursor-pointer">
          <div className="bg-[#DCFCE7] px-5 py-1.5 rounded-full flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-[#16A34A]" fill="#22C55E" fillOpacity={0.2} />
          </div>
          <span className="text-[10px] font-semibold text-[#16A34A]">Chat</span>
        </div>
        <div className="flex flex-col items-center gap-1.5 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
          <Calendar className="w-6 h-6" />
          <span className="text-[10px] font-semibold">History</span>
        </div>
        <div className="flex flex-col items-center gap-1.5 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
          <User className="w-6 h-6" />
          <span className="text-[10px] font-semibold">Profile</span>
        </div>
      </div>
    </div>
  );
}
