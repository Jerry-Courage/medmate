import React from 'react';
import { Bot, Send, Heart, Activity, Droplets, MessageCircle, LayoutDashboard, User } from 'lucide-react';

export default function SoftMinimal() {
  return (
    <div className="w-[430px] h-[900px] mx-auto overflow-hidden relative flex flex-col font-['Inter'] bg-white shadow-2xl ring-1 ring-gray-200 sm:rounded-[40px]">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E7EB] px-5 py-4 pt-12 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#DCFCE7] flex items-center justify-center shrink-0">
            <Bot className="w-5 h-5 text-[#16A34A]" />
          </div>
          <div>
            <h1 className="font-semibold text-[#111827] text-[15px] leading-tight tracking-tight">Medmate AI</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]"></span>
              <span className="text-[11px] text-[#22C55E] font-medium tracking-wide uppercase">Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-2 py-1.5 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-[#6B7280]" />
            <span className="text-[11px] font-semibold text-[#6B7280]">72 bpm</span>
          </div>
          <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-2 py-1.5 flex items-center gap-1.5">
            <Droplets className="w-3.5 h-3.5 text-[#6B7280]" />
            <span className="text-[11px] font-semibold text-[#6B7280]">120/80</span>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-[#F9FAFB] p-5 overflow-y-auto flex flex-col gap-6">
        {/* AI Message 1 */}
        <div className="flex gap-2.5 w-full">
          <div className="w-7 h-7 rounded-full bg-[#DCFCE7] flex items-center justify-center shrink-0 mt-0.5">
            <Bot className="w-4 h-4 text-[#16A34A]" />
          </div>
          <div className="flex flex-col gap-1 max-w-[78%]">
            <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-tl-sm px-4 py-3.5 text-[14px] text-gray-800 leading-relaxed">
              Hi! I'm Medmate, your AI health assistant. Your vitals look great today — BP 120/80, HR 72 bpm. How can I help?
            </div>
            <span className="text-[11px] font-medium text-[#6B7280] ml-1">09:41 AM</span>
          </div>
        </div>

        {/* User Message */}
        <div className="flex gap-2.5 w-full justify-end mt-2">
          <div className="flex flex-col gap-1 max-w-[78%] items-end">
            <div className="bg-[#22C55E] text-white shadow-sm rounded-2xl rounded-tr-sm px-4 py-3.5 text-[14px] leading-relaxed">
              What does my blood pressure reading mean?
            </div>
            <span className="text-[11px] font-medium text-[#6B7280] mr-1">09:42 AM</span>
          </div>
        </div>

        {/* AI Message 2 */}
        <div className="flex gap-2.5 w-full mt-2">
          <div className="w-7 h-7 rounded-full bg-[#DCFCE7] flex items-center justify-center shrink-0 mt-0.5">
            <Bot className="w-4 h-4 text-[#16A34A]" />
          </div>
          <div className="flex flex-col gap-1 max-w-[78%]">
            <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-tl-sm px-4 py-3.5 text-[14px] text-gray-800 leading-relaxed">
              Your 120/80 is perfectly normal! The first number (systolic) is the pressure when your heart beats. Great news — keep up those healthy habits! 💚
            </div>
            <span className="text-[11px] font-medium text-[#6B7280] ml-1">09:42 AM</span>
          </div>
        </div>
      </div>

      {/* Input Bar */}
      <div className="bg-white border-t border-gray-100 p-4 pb-6 flex gap-3 items-center z-10 shadow-[0_-4px_24px_rgba(0,0,0,0.02)]">
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white hover:bg-gray-50 border border-gray-100 shrink-0 text-[#22C55E] transition-colors">
          <Heart className="w-5 h-5" />
        </button>
        <div className="flex-1 bg-[#F9FAFB] rounded-full border border-gray-200 px-4 py-3 flex items-center transition-colors focus-within:bg-white focus-within:border-green-400 focus-within:ring-2 focus-within:ring-green-100">
          <input
            type="text"
            placeholder="Ask about your health..."
            className="bg-transparent w-full outline-none text-[14px] text-[#111827] placeholder-gray-400"
          />
        </div>
        <button className="w-11 h-11 rounded-full bg-[#22C55E] hover:bg-[#16A34A] transition-colors flex items-center justify-center shrink-0 shadow-sm">
          <Send className="w-4 h-4 text-white ml-0.5" />
        </button>
      </div>

      {/* Tab Bar */}
      <div className="bg-white border-t border-gray-100 pb-8 pt-4 px-8 flex justify-between items-center z-10">
        <button className="flex flex-col items-center gap-1.5 relative w-16">
          <div className="absolute -top-4 w-1 h-1 rounded-full bg-[#22C55E]"></div>
          <MessageCircle className="w-5 h-5 text-[#22C55E]" />
          <span className="text-[11px] font-medium text-[#22C55E]">Chat</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 w-16 group">
          <LayoutDashboard className="w-5 h-5 text-[#6B7280] group-hover:text-gray-900 transition-colors" />
          <span className="text-[11px] font-medium text-[#6B7280] group-hover:text-gray-900 transition-colors">Dashboard</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 w-16 group">
          <User className="w-5 h-5 text-[#6B7280] group-hover:text-gray-900 transition-colors" />
          <span className="text-[11px] font-medium text-[#6B7280] group-hover:text-gray-900 transition-colors">Profile</span>
        </button>
      </div>
    </div>
  );
}
