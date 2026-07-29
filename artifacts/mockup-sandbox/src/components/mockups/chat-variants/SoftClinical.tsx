import React from "react";
import { Send, Plus } from "lucide-react";

export function SoftClinical() {
  return (
    <div className="flex flex-col h-[100dvh] w-full bg-[#F7FBF8] font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-[#E5F0E8] shadow-sm z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#DCFCE7] flex items-center justify-center relative">
            <Plus className="w-5 h-5 text-[#22C55E]" strokeWidth={3} />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#22C55E] border-2 border-white rounded-full"></span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-[#111827] font-bold text-[17px] leading-tight">Medmate AI</h1>
            <span className="text-[#22C55E] text-xs font-medium">Active now</span>
          </div>
        </div>
        <div className="px-2.5 py-1 bg-[#F0FAF4] rounded-full border border-[#DCFCE7]">
          <span className="text-[#16A34A] text-xs font-semibold">AI Health</span>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-6">
        <div className="flex justify-center">
          <span className="text-xs font-medium text-[#9CA3AF] px-3 py-1 bg-[#EEF5F0] rounded-full">Today</span>
        </div>

        {/* Message 1: User */}
        <div className="flex flex-col items-end gap-1 w-full">
          <div className="bg-[#22C55E] text-white px-4 py-3 rounded-2xl rounded-br-sm max-w-[85%] shadow-sm">
            <p className="text-[15px] leading-relaxed">I've been having headaches every afternoon for the past 3 days</p>
          </div>
          <span className="text-[11px] text-[#9CA3AF] mr-1 mt-0.5">2:14 PM</span>
        </div>

        {/* Message 2: AI */}
        <div className="flex gap-2 w-full">
          <div className="w-7 h-7 rounded-full bg-[#DCFCE7] flex items-center justify-center shrink-0 mt-1">
            <Plus className="w-3.5 h-3.5 text-[#22C55E]" strokeWidth={3} />
          </div>
          <div className="flex flex-col items-start gap-1 w-full">
            <div className="bg-white text-[#111827] px-4 py-3 rounded-2xl rounded-bl-sm border border-[#E5EBE7] shadow-sm max-w-[85%]">
              <p className="text-[15px] leading-relaxed">Sorry to hear that. A few quick questions to help narrow this down — are the headaches on one side or both? And roughly what time of day do they usually start?</p>
            </div>
            <span className="text-[11px] text-[#9CA3AF] ml-1 mt-0.5">2:14 PM</span>
          </div>
        </div>

        {/* Message 3: User */}
        <div className="flex flex-col items-end gap-1 w-full">
          <div className="bg-[#22C55E] text-white px-4 py-3 rounded-2xl rounded-br-sm max-w-[85%] shadow-sm">
            <p className="text-[15px] leading-relaxed">Both sides, usually around 2-3pm</p>
          </div>
          <span className="text-[11px] text-[#9CA3AF] mr-1 mt-0.5">2:15 PM</span>
        </div>

        {/* Message 4: AI Typing */}
        <div className="flex gap-2 w-full">
          <div className="w-7 h-7 rounded-full bg-[#DCFCE7] flex items-center justify-center shrink-0 mt-1">
            <Plus className="w-3.5 h-3.5 text-[#22C55E]" strokeWidth={3} />
          </div>
          <div className="flex flex-col items-start gap-1">
            <div className="bg-white px-4 py-3.5 rounded-2xl rounded-bl-sm border border-[#E5EBE7] shadow-sm">
              <div className="flex gap-1.5 items-center justify-center">
                <span className="w-1.5 h-1.5 bg-[#9CA3AF] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-[#9CA3AF] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-[#9CA3AF] rounded-full animate-bounce"></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-[#E5EBE7] shrink-0 pb-6">
        <div className="flex items-end gap-2 bg-[#F0FAF4] p-1.5 rounded-2xl border border-[#E5EBE7]">
          <textarea 
            className="w-full bg-transparent border-none focus:outline-none resize-none px-3 py-2 text-[15px] text-[#111827] placeholder:text-[#9CA3AF] max-h-24 min-h-[44px]"
            placeholder="Message Medmate..."
            rows={1}
            defaultValue=""
          />
          <button className="w-10 h-10 shrink-0 bg-[#22C55E] rounded-xl flex items-center justify-center text-white shadow-sm hover:bg-[#16A34A] transition-colors mb-0.5 mr-0.5">
            <Send className="w-5 h-5 ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
