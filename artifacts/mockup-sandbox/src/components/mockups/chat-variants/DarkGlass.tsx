import React from "react";
import { Send, Menu } from "lucide-react";

export function DarkGlass() {
  return (
    <div className="flex flex-col h-screen w-full relative overflow-hidden font-sans bg-[#0A0F1E]">
      {/* Background texture */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 50%, #0F1E2E 0%, #0A0F1E 100%)"
        }}
      />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-4 py-4 border-b border-[#ffffff15] bg-[#ffffff08] backdrop-blur-md shadow-lg shadow-black/20">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-[#1a2a1a] border border-[#ffffff12]">
            <span className="text-xl">🤖</span>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#4ADE80] rounded-full border-2 border-[#0A0F1E] shadow-[0_0_8px_rgba(74,222,128,0.6)]"></div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-white font-semibold text-base leading-tight">Medmate AI</h1>
            <p className="text-[#4ADE80] text-xs font-medium tracking-wide flex items-center gap-1 mt-0.5">
              ● Online
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-white/70">
          <Menu className="w-5 h-5" />
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 relative z-10 overflow-y-auto px-4 py-6 flex flex-col gap-6">
        
        {/* Message 1: User */}
        <div className="flex flex-col items-end w-full">
          <div className="max-w-[80%] px-5 py-3.5 bg-gradient-to-br from-[#22C55E] to-[#16A34A] text-white text-[15px] rounded-3xl rounded-br-sm shadow-[0_4px_16px_rgba(34,197,94,0.25)] leading-relaxed">
            I've been having headaches every afternoon for the past 3 days
          </div>
          <span className="text-[#4B5563] text-xs mt-1.5 px-1 font-medium">09:12 AM</span>
        </div>

        {/* Message 2: AI */}
        <div className="flex gap-2 w-full">
          <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#1a2a1a] border border-[#ffffff12] self-end mb-6 shadow-inner shadow-black/50">
            <span className="text-sm">🤖</span>
          </div>
          <div className="flex flex-col items-start max-w-[75%]">
            <div className="px-5 py-3.5 bg-[#1C2333] border border-[#ffffff12] text-white text-[15px] rounded-3xl rounded-bl-sm shadow-md leading-relaxed">
              Sorry to hear that. A few quick questions to help narrow this down — are the headaches on one side or both? And roughly what time of day do they usually start?
            </div>
            <span className="text-[#4B5563] text-xs mt-1.5 px-1 font-medium">09:12 AM</span>
          </div>
        </div>

        {/* Message 3: User */}
        <div className="flex flex-col items-end w-full">
          <div className="max-w-[80%] px-5 py-3.5 bg-gradient-to-br from-[#22C55E] to-[#16A34A] text-white text-[15px] rounded-3xl rounded-br-sm shadow-[0_4px_16px_rgba(34,197,94,0.25)] leading-relaxed">
            Both sides, usually around 2-3pm
          </div>
          <span className="text-[#4B5563] text-xs mt-1.5 px-1 font-medium">09:13 AM</span>
        </div>

        {/* Message 4: AI Typing Indicator */}
        <div className="flex gap-2 w-full">
          <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#1a2a1a] border border-[#ffffff12] self-end mb-6 shadow-inner shadow-black/50">
            <span className="text-sm">🤖</span>
          </div>
          <div className="flex flex-col items-start max-w-[75%]">
            <div className="px-5 py-4 bg-[#1C2333] border border-[#ffffff12] rounded-3xl rounded-bl-sm shadow-md flex items-center gap-1.5 h-[50px]">
              <div className="w-2 h-2 bg-[#4ADE80] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-[#4ADE80] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-[#4ADE80] rounded-full animate-bounce"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="relative z-10 px-4 py-4 pb-8 bg-[#0A0F1E] border-t border-[#ffffff12]">
        <div className="flex items-center gap-2 p-1.5 bg-[#131929] border border-[#ffffff15] rounded-full shadow-lg">
          <input 
            type="text" 
            placeholder="Message Medmate..." 
            className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-[#6B7280] px-4 py-2 text-[15px]"
            readOnly
          />
          <button className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gradient-to-br from-[#4ADE80] to-[#16A34A] text-[#0A0F1E] rounded-full shadow-[0_2px_10px_rgba(34,197,94,0.3)] transition-transform active:scale-95">
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
