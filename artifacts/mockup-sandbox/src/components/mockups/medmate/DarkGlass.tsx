import React from 'react';
import { Bot, Send, MessageCircle, LayoutDashboard, User, Activity, Heart } from 'lucide-react';

export default function DarkGlass() {
  return (
    <div className="w-[430px] h-[900px] mx-auto overflow-hidden relative font-['Inter'] bg-[#0D1117] flex flex-col shadow-2xl">
      {/* Header */}
      <header 
        className="pt-14 pb-4 px-6 border-l-4 border-l-[#22C55E] z-10 sticky top-0"
        style={{ 
          background: 'rgba(13, 17, 23, 0.85)',
          backdropFilter: 'blur(20px)' 
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-white text-xl font-bold tracking-tight">Medmate AI</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] shadow-[0_0_8px_#22C55E]"></span>
              <span className="text-[#22C55E] text-xs font-medium tracking-wide">Online</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#161B22] border border-white/10 flex items-center justify-center relative shadow-inner">
            <Bot size={20} className="text-[#22C55E]" />
            <div className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-[#22C55E] border-2 border-[#161B22]"></div>
          </div>
        </div>
        
        {/* Vitals Pills */}
        <div className="flex gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#22C55E]/30" style={{ background: 'rgba(34,197,94,0.12)' }}>
            <Heart size={14} className="text-[#22C55E]" />
            <span className="text-white text-xs font-medium">HR 72 bpm</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#22C55E]/30" style={{ background: 'rgba(34,197,94,0.12)' }}>
            <Activity size={14} className="text-[#22C55E]" />
            <span className="text-white text-xs font-medium">BP 120/80</span>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6">
        {/* Date Divider */}
        <div className="flex justify-center">
          <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-white/50 text-[10px] font-medium tracking-wider uppercase">Today</span>
        </div>

        {/* AI Message 1 */}
        <div className="flex gap-3 max-w-[85%]">
          <div className="w-8 h-8 rounded-full bg-[#22C55E] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(34,197,94,0.4)]">
            <Bot size={16} className="text-[#0D1117]" />
          </div>
          <div 
            className="rounded-2xl rounded-tl-sm px-4 py-3"
            style={{ 
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.10)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <p className="text-white text-[15px] leading-relaxed">
              Hi! I'm Medmate, your AI health assistant. Your vitals look great today — BP 120/80, HR 72 bpm. How can I help?
            </p>
            <span className="text-white/40 text-[10px] mt-2 block">10:42 AM</span>
          </div>
        </div>

        {/* User Message */}
        <div className="flex justify-end max-w-[85%] ml-auto">
          <div className="rounded-2xl rounded-tr-sm px-4 py-3 bg-[#22C55E] shadow-[0_4px_20px_rgba(34,197,94,0.2)]">
            <p className="text-white text-[15px] leading-relaxed">
              What does my blood pressure reading mean?
            </p>
            <span className="text-white/70 text-[10px] mt-2 block text-right">10:45 AM</span>
          </div>
        </div>

        {/* AI Message 2 */}
        <div className="flex gap-3 max-w-[85%]">
          <div className="w-8 h-8 rounded-full bg-[#22C55E] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(34,197,94,0.4)]">
            <Bot size={16} className="text-[#0D1117]" />
          </div>
          <div 
            className="rounded-2xl rounded-tl-sm px-4 py-3"
            style={{ 
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.10)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <p className="text-white text-[15px] leading-relaxed">
              Your 120/80 is perfectly normal! The first number (systolic) is the pressure when your heart beats. Great news — keep up those healthy habits! 💚
            </p>
            <span className="text-white/40 text-[10px] mt-2 block">10:46 AM</span>
          </div>
        </div>
      </div>

      {/* Input Bar */}
      <div className="p-4 bg-[#161B22] border-t border-white/5 relative z-10">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <input 
              type="text" 
              placeholder="Ask me anything..." 
              className="w-full bg-white/5 border border-white/10 rounded-full py-3.5 pl-5 pr-12 text-white placeholder-white/40 focus:outline-none focus:border-[#22C55E]/50 transition-colors text-[15px]"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#22C55E] flex items-center justify-center shadow-[0_0_10px_rgba(34,197,94,0.3)] transition-transform hover:scale-105 active:scale-95">
              <Send size={14} className="text-[#0D1117] ml-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Tab Bar */}
      <div className="bg-[#161B22] border-t border-white/5 pb-8 pt-3 px-8 flex justify-between items-center relative z-10">
        <button className="flex flex-col items-center gap-1.5">
          <MessageCircle size={22} className="text-[#22C55E]" strokeWidth={2.5} />
          <span className="text-[#22C55E] text-[10px] font-semibold">Chat</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 opacity-50 transition-opacity hover:opacity-80">
          <LayoutDashboard size={22} className="text-white" strokeWidth={2} />
          <span className="text-white text-[10px] font-medium">Dashboard</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 opacity-50 transition-opacity hover:opacity-80">
          <User size={22} className="text-white" strokeWidth={2} />
          <span className="text-white text-[10px] font-medium">Profile</span>
        </button>
      </div>
    </div>
  );
}
