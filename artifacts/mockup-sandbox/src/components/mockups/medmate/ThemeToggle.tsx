import { useState } from 'react';
import { Bot, Send, Heart, Activity, MessageCircle, LayoutDashboard, User, Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  return (
    <div
      className="w-[430px] h-[960px] mx-auto overflow-hidden relative flex flex-col font-['Inter']"
      style={{ background: dark ? '#0D1117' : '#FFFFFF' }}
    >
      {/* ── Toggle pill ── */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50">
        <button
          onClick={() => setDark(d => !d)}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 shadow-lg"
          style={{
            background: dark ? 'rgba(255,255,255,0.10)' : '#F3F4F6',
            border: dark ? '1px solid rgba(255,255,255,0.18)' : '1px solid #E5E7EB',
            color: dark ? '#FFFFFF' : '#111827',
            backdropFilter: dark ? 'blur(12px)' : undefined,
          }}
        >
          {dark ? <Moon size={13} className="text-[#22C55E]" /> : <Sun size={13} className="text-[#22C55E]" />}
          <span>{dark ? 'Dark Glass' : 'Soft Minimal'}</span>
          {/* slider knob */}
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300"
            style={{ background: '#22C55E' }}
          >
            {dark
              ? <Moon size={10} className="text-white" />
              : <Sun size={10} className="text-white" />}
          </div>
        </button>
      </div>

      {/* ══════════════════════════════════════
          HEADER
      ══════════════════════════════════════ */}
      {dark ? (
        /* Dark Glass header */
        <header
          className="pt-16 pb-4 px-6 border-l-4 border-l-[#22C55E] z-10 shrink-0"
          style={{ background: 'rgba(13,17,23,0.92)', backdropFilter: 'blur(20px)' }}
        >
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-white text-xl font-bold tracking-tight">Medmate AI</h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-[#22C55E]" style={{ boxShadow: '0 0 8px #22C55E' }} />
                <span className="text-[#22C55E] text-xs font-medium tracking-wide">Online</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#161B22] border border-white/10 flex items-center justify-center relative">
              <Bot size={20} className="text-[#22C55E]" />
              <div className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-[#22C55E] border-2 border-[#161B22]" />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#22C55E]/30" style={{ background: 'rgba(34,197,94,0.12)' }}>
              <Heart size={13} className="text-[#22C55E]" />
              <span className="text-white text-xs font-medium">HR 72 bpm</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#22C55E]/30" style={{ background: 'rgba(34,197,94,0.12)' }}>
              <Activity size={13} className="text-[#22C55E]" />
              <span className="text-white text-xs font-medium">BP 120/80</span>
            </div>
          </div>
        </header>
      ) : (
        /* Soft Minimal header */
        <div className="bg-white border-b border-[#E5E7EB] px-5 py-4 pt-16 flex justify-between items-center z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#DCFCE7] flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5 text-[#16A34A]" />
            </div>
            <div>
              <h1 className="font-semibold text-[#111827] text-[15px] leading-tight">Medmate AI</h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
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
              <Heart className="w-3.5 h-3.5 text-[#6B7280]" />
              <span className="text-[11px] font-semibold text-[#6B7280]">120/80</span>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          CHAT AREA
      ══════════════════════════════════════ */}
      <div
        className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5"
        style={{ background: dark ? '#0D1117' : '#F9FAFB' }}
      >
        {/* Date divider */}
        <div className="flex justify-center">
          <span
            className="px-3 py-1 rounded-full text-[10px] font-medium tracking-wider uppercase"
            style={{
              background: dark ? 'rgba(255,255,255,0.05)' : '#EFEFEF',
              border: dark ? '1px solid rgba(255,255,255,0.08)' : 'none',
              color: dark ? 'rgba(255,255,255,0.4)' : '#9CA3AF',
            }}
          >
            Today
          </span>
        </div>

        {/* AI bubble 1 */}
        <div className="flex gap-3 max-w-[84%]">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
            style={{
              background: dark ? '#22C55E' : '#DCFCE7',
              boxShadow: dark ? '0 0 14px rgba(34,197,94,0.35)' : undefined,
            }}
          >
            <Bot size={15} style={{ color: dark ? '#0D1117' : '#16A34A' }} />
          </div>
          <div>
            <div
              className="rounded-2xl rounded-tl-sm px-4 py-3"
              style={{
                background: dark ? 'rgba(255,255,255,0.06)' : '#FFFFFF',
                border: dark ? '1px solid rgba(255,255,255,0.10)' : '1px solid #F3F4F6',
                backdropFilter: dark ? 'blur(10px)' : undefined,
                boxShadow: dark ? undefined : '0 1px 4px rgba(0,0,0,0.05)',
              }}
            >
              <p className="text-[14px] leading-relaxed" style={{ color: dark ? '#FFFFFF' : '#1F2937' }}>
                Hi! I'm Medmate, your AI health assistant. Your vitals look great today — BP 120/80, HR 72 bpm. How can I help?
              </p>
              <span className="text-[10px] mt-2 block" style={{ color: dark ? 'rgba(255,255,255,0.35)' : '#9CA3AF' }}>
                10:42 AM
              </span>
            </div>
          </div>
        </div>

        {/* User bubble */}
        <div className="flex justify-end max-w-[84%] ml-auto">
          <div
            className="rounded-2xl rounded-tr-sm px-4 py-3 bg-[#22C55E]"
            style={{ boxShadow: dark ? '0 4px 20px rgba(34,197,94,0.25)' : '0 2px 8px rgba(34,197,94,0.15)' }}
          >
            <p className="text-white text-[14px] leading-relaxed">
              What does my blood pressure reading mean?
            </p>
            <span className="text-white/70 text-[10px] mt-2 block text-right">10:45 AM</span>
          </div>
        </div>

        {/* AI bubble 2 */}
        <div className="flex gap-3 max-w-[84%]">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
            style={{
              background: dark ? '#22C55E' : '#DCFCE7',
              boxShadow: dark ? '0 0 14px rgba(34,197,94,0.35)' : undefined,
            }}
          >
            <Bot size={15} style={{ color: dark ? '#0D1117' : '#16A34A' }} />
          </div>
          <div>
            <div
              className="rounded-2xl rounded-tl-sm px-4 py-3"
              style={{
                background: dark ? 'rgba(255,255,255,0.06)' : '#FFFFFF',
                border: dark ? '1px solid rgba(255,255,255,0.10)' : '1px solid #F3F4F6',
                backdropFilter: dark ? 'blur(10px)' : undefined,
                boxShadow: dark ? undefined : '0 1px 4px rgba(0,0,0,0.05)',
              }}
            >
              <p className="text-[14px] leading-relaxed" style={{ color: dark ? '#FFFFFF' : '#1F2937' }}>
                Your 120/80 is perfectly normal! The first number (systolic) is the pressure when your heart beats. Great news — keep up those healthy habits! 💚
              </p>
              <span className="text-[10px] mt-2 block" style={{ color: dark ? 'rgba(255,255,255,0.35)' : '#9CA3AF' }}>
                10:46 AM
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          INPUT BAR
      ══════════════════════════════════════ */}
      {dark ? (
        <div className="p-4 border-t shrink-0" style={{ background: '#161B22', borderColor: 'rgba(255,255,255,0.05)' }}>
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Ask me anything..."
                className="w-full rounded-full py-3.5 pl-5 pr-12 text-[14px] focus:outline-none"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  color: '#FFFFFF',
                }}
              />
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#22C55E] flex items-center justify-center"
                style={{ boxShadow: '0 0 10px rgba(34,197,94,0.3)' }}
              >
                <Send size={13} className="text-[#0D1117] ml-0.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white border-t border-gray-100 p-4 pb-5 flex gap-3 items-center z-10 shrink-0">
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-100 shrink-0 text-[#22C55E]">
            <Heart className="w-5 h-5" />
          </button>
          <div className="flex-1 bg-[#F9FAFB] rounded-full border border-gray-200 px-4 py-3 flex items-center">
            <input
              type="text"
              placeholder="Ask about your health..."
              className="bg-transparent w-full outline-none text-[14px] text-[#111827] placeholder-gray-400"
            />
          </div>
          <button className="w-11 h-11 rounded-full bg-[#22C55E] flex items-center justify-center shrink-0">
            <Send className="w-4 h-4 text-white ml-0.5" />
          </button>
        </div>
      )}

      {/* ══════════════════════════════════════
          TAB BAR
      ══════════════════════════════════════ */}
      {dark ? (
        <div className="pb-8 pt-3 px-8 flex justify-between items-center shrink-0 border-t" style={{ background: '#161B22', borderColor: 'rgba(255,255,255,0.05)' }}>
          <button className="flex flex-col items-center gap-1.5">
            <MessageCircle size={22} className="text-[#22C55E]" strokeWidth={2.5} />
            <span className="text-[10px] font-semibold text-[#22C55E]">Chat</span>
          </button>
          <button className="flex flex-col items-center gap-1.5 opacity-40">
            <LayoutDashboard size={22} className="text-white" strokeWidth={2} />
            <span className="text-[10px] font-medium text-white">Dashboard</span>
          </button>
          <button className="flex flex-col items-center gap-1.5 opacity-40">
            <User size={22} className="text-white" strokeWidth={2} />
            <span className="text-[10px] font-medium text-white">Profile</span>
          </button>
        </div>
      ) : (
        <div className="bg-white border-t border-gray-100 pb-8 pt-4 px-8 flex justify-between items-center z-10 shrink-0">
          <button className="flex flex-col items-center gap-1.5 relative w-16">
            <div className="absolute -top-4 w-1 h-1 rounded-full bg-[#22C55E]" />
            <MessageCircle className="w-5 h-5 text-[#22C55E]" />
            <span className="text-[11px] font-medium text-[#22C55E]">Chat</span>
          </button>
          <button className="flex flex-col items-center gap-1.5 w-16">
            <LayoutDashboard className="w-5 h-5 text-[#6B7280]" />
            <span className="text-[11px] font-medium text-[#6B7280]">Dashboard</span>
          </button>
          <button className="flex flex-col items-center gap-1.5 w-16">
            <User className="w-5 h-5 text-[#6B7280]" />
            <span className="text-[11px] font-medium text-[#6B7280]">Profile</span>
          </button>
        </div>
      )}
    </div>
  );
}
