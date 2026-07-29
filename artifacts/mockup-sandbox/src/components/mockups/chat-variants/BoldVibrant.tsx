import React from "react";
import { Send, Smile } from "lucide-react";

export function BoldVibrant() {
  return (
    <div className="flex flex-col h-screen w-full bg-[#F0FAF4] font-sans relative overflow-hidden">
      {/* Top 30% Gradient Header */}
      <div className="h-[30%] bg-gradient-to-br from-[#16A34A] to-[#4ADE80] rounded-b-[40px] shadow-lg flex flex-col justify-center px-6 relative z-10 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white rounded-full shadow-md flex items-center justify-center text-3xl">
            🤖
          </div>
          <div>
            <h1 className="text-white text-[22px] font-bold leading-tight">Medmate AI</h1>
            <p className="text-white/80 text-sm font-medium">Your Health Companion</p>
          </div>
        </div>
        
        {/* Live health stats row */}
        <div className="flex gap-3 mt-5">
          <div className="bg-white/25 backdrop-blur-sm rounded-full px-4 py-1.5 flex items-center gap-2 text-white text-xs font-semibold shadow-sm">
            <span>❤️</span> 72 bpm
          </div>
          <div className="bg-white/25 backdrop-blur-sm rounded-full px-4 py-1.5 flex items-center gap-2 text-white text-xs font-semibold shadow-sm">
            <span>💧</span> Hydrated
          </div>
        </div>
      </div>

      {/* Bottom 70% Chat Area */}
      <div className="flex-1 overflow-y-auto px-5 pt-6 pb-28 flex flex-col gap-5 relative z-0">
        
        {/* Message 1 (User) */}
        <div className="flex flex-col items-end">
          <div className="bg-[#16A34A] text-white px-6 py-3 rounded-full rounded-tr-sm shadow-md font-semibold text-sm max-w-[85%] border-t border-white/20" style={{ boxShadow: "inset 0 2px 4px rgba(255,255,255,0.2), 0 4px 6px -1px rgba(0,0,0,0.1)" }}>
            I've been having headaches every afternoon for the past 3 days
          </div>
          <span className="text-[#9CA3AF] text-[10px] mt-1.5 font-medium mr-2">2:00 PM</span>
        </div>

        {/* Message 2 (AI) */}
        <div className="flex flex-col items-start">
          <div className="bg-white text-[#111827] px-5 py-4 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 border-l-[4px] border-l-[#22C55E] text-sm max-w-[90%] font-medium leading-relaxed">
            Sorry to hear that. A few quick questions to help narrow this down — are the headaches on one side or both? And roughly what time of day do they usually start?
          </div>
          <span className="text-[#9CA3AF] text-[10px] mt-1.5 font-medium ml-2">2:01 PM</span>
        </div>

        {/* Message 3 (User) */}
        <div className="flex flex-col items-end">
          <div className="bg-[#16A34A] text-white px-6 py-3 rounded-full rounded-tr-sm shadow-md font-semibold text-sm max-w-[85%] border-t border-white/20" style={{ boxShadow: "inset 0 2px 4px rgba(255,255,255,0.2), 0 4px 6px -1px rgba(0,0,0,0.1)" }}>
            Both sides, usually around 2-3pm
          </div>
          <span className="text-[#9CA3AF] text-[10px] mt-1.5 font-medium mr-2">2:02 PM</span>
        </div>

        {/* Message 4 (AI Typing) */}
        <div className="flex flex-col items-start">
          <div className="bg-white px-5 py-4 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 border-l-[4px] border-l-[#22C55E] max-w-[90%] flex items-center h-[52px]">
            <div className="flex gap-1.5 items-center">
              <div className="w-2 h-2 bg-[#22C55E] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-[#22C55E] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-[#22C55E] rounded-full animate-bounce"></div>
            </div>
          </div>
        </div>

      </div>

      {/* Floating Input Bar */}
      <div className="absolute bottom-6 left-5 right-5 z-20">
        <div className="bg-white rounded-2xl shadow-xl flex items-center p-2 border border-gray-100 focus-within:border-[#22C55E] focus-within:ring-2 focus-within:ring-[#22C55E]/20 transition-all duration-300">
          <button className="p-2 text-gray-400 hover:text-[#22C55E] transition-colors rounded-xl">
            <Smile className="w-6 h-6" strokeWidth={1.5} />
          </button>
          
          <input 
            type="text" 
            placeholder="Type a message..." 
            className="flex-1 bg-transparent border-none outline-none px-2 text-sm text-gray-800 placeholder:text-gray-400 font-medium"
          />
          
          <button className="bg-[#22C55E] hover:bg-[#16A34A] text-white p-3 rounded-xl shadow-md transition-colors flex items-center justify-center">
            <Send className="w-5 h-5 ml-0.5" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}
