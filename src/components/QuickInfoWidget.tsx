import { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Bot,
  User,
  Phone,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Building2,
  MapPin,
  PhoneCall,
  Clock,
  Banknote,
  GraduationCap,
  BookOpen,
  Lock,
  HelpCircle
} from 'lucide-react';
import * as Icons from 'lucide-react';
import type { SiteSettings, QuickQuestionRecord } from '@/types/cms';

interface QuickQuestion {
  id: string;
  icon: typeof Building2;
  question: string;
  answer: string;
  actionUrl?: string;
  actionText?: string;
}

const defaultQuestions: QuickQuestion[] = [
  {
    id: '1',
    icon: Building2,
    question: 'আপনারদের প্রতিষ্ঠানের নাম কী?',
    answer: 'Next Gen Tutors',
  },
  {
    id: '2',
    icon: MapPin,
    question: 'আপনারদের ঠিকানা কোথায়?',
    answer: 'Pirojpur, Chittagong, Bangladesh',
  },
  {
    id: '3',
    icon: PhoneCall,
    question: 'আপনারদের সাথে যোগাযোগের মাধ্যমগুলো কী কী?',
    answer: `আমাদের সাথে যোগাযোগের মাধ্যমসমূহ:
• WhatsApp: 01318126412
• Call: 01626881259, 01744854853
• Email: nextgentutors247@gmail.com`,
    actionUrl: 'https://wa.me/8801318126412',
    actionText: 'WhatsApp-এ যোগাযোগ করুন'
  },
  {
    id: '4',
    icon: Clock,
    question: 'টিউটর পেতে কেমন সময় লাগতে পারে?',
    answer: 'আপনার চাহিদা অনুযায়ী উপযুক্ত টিউটর খুঁজে পাওয়ার পর দ্রুত যোগাযোগ করা হবে।',
  },
  {
    id: '5',
    icon: Banknote,
    question: 'আপনারদের টিউশন ফি কত?',
    answer: 'টিউশন ফি শ্রেণি, বিষয়, পড়ানোর স্থান ও সময়ের ওপর নির্ভর করে। বিস্তারিত জানতে যোগাযোগ করুন।',
    actionUrl: 'https://wa.me/8801318126412?text=হ্যালো!%20টিউশন%20ফি%20সম্পর্কে%20জানতে%20চাই।',
    actionText: 'WhatsApp-এ ফি জানুন'
  },
  {
    id: '6',
    icon: GraduationCap,
    question: 'টিউশন করাতে চাইলে কী করতে হবে?',
    answer: 'আপনার নাম, শিক্ষাগত যোগ্যতা, অভিজ্ঞতা, বিষয় ও অবস্থান জানিয়ে CV/বিস্তারিত তথ্য পাঠান।',
    actionUrl: 'https://wa.me/8801318126412?text=হ্যালো!%20আমি%20টিউশন%20করাতে%20চাই।',
    actionText: 'CV পাঠান WhatsApp-এ'
  },
  {
    id: '7',
    icon: BookOpen,
    question: 'টিউটর খুঁজলে কী কী তথ্য দিতে হবে?',
    answer: 'আপনার শ্রেণি, বিষয়, এলাকা ও পছন্দের সময় জানাবেন।',
    actionUrl: 'https://wa.me/8801318126412?text=হ্যালো!%20আমার%20একজন%20টিউটর%20প্রয়োজন।',
    actionText: 'টিউটর রিকোয়েস্ট পাঠান'
  }
];

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  actionUrl?: string;
  actionText?: string;
  time: string;
}

export default function QuickInfoWidget({ settings, questions }: { settings?: SiteSettings | null; questions?: QuickQuestionRecord[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: settings?.custom_texts?.qi_welcome || 'আসসালামু আলাইকুম! Next Gen Tutors-এর কুইক ইনফরমেশন অ্যাসিস্ট্যান্টে আপনাকে স্বাগতম। নিচে প্রদত্ত যেকোনো প্রশ্ন নির্বাচন করে তাৎক্ষণিক উত্তর জেনে নিন:',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const activeQuestions: QuickQuestion[] = questions && questions.length > 0
    ? questions.map((q) => ({
        id: q.id,
        icon: ((Icons as Record<string, unknown>)[q.icon_name] as typeof HelpCircle) || HelpCircle,
        question: q.question,
        answer: q.answer,
        actionUrl: q.action_url,
        actionText: q.action_text,
      }))
    : defaultQuestions;

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSelectQuestion = (q: QuickQuestion) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: q.question,
      time: timeStr
    };

    const botMsg: ChatMessage = {
      id: `b-${Date.now()}`,
      sender: 'bot',
      text: q.answer,
      actionUrl: q.actionUrl,
      actionText: q.actionText,
      time: timeStr
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'bot',
        text: settings?.custom_texts?.qi_welcome || 'আসসালামু আলাইকুম! Next Gen Tutors-এর কুইক ইনফরমেশন অ্যাসিস্ট্যান্টে আপনাকে স্বাগতম। নিচে প্রদত্ত যেকোনো প্রশ্ন নির্বাচন করে তাৎক্ষণিক উত্তর জেনে নিন:',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <>
      {/* High-Visibility Floating Trigger Button (Left Aligned & Compact) */}
      <div className="fixed bottom-5 left-5 z-50 flex items-center gap-2.5">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-xl shadow-indigo-600/30 ring-4 ring-white hover:scale-105 active:scale-95 transition-all duration-300 relative group cursor-pointer"
          aria-label="Toggle Quick Information Popup"
        >
          {isOpen ? (
            <X className="w-5 h-5 text-white" />
          ) : (
            <>
              <MessageSquare className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white ring-2 ring-emerald-400/50 animate-pulse" />
            </>
          )}
        </button>
        {!isOpen && (
          <div className="hidden sm:flex bg-slate-900/90 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md border border-slate-700/80 items-center gap-1.5 animate-bounce">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{settings?.custom_texts?.qi_trigger || 'জরুরি তথ্য বা প্রশ্ন'}</span>
          </div>
        )}
      </div>

      {/* Quick Info Chat Popup (Left Aligned & Compact) */}
      {isOpen && (
        <div className="fixed bottom-20 left-4 sm:left-5 w-[88vw] sm:w-[350px] max-h-[75vh] h-[480px] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 flex flex-col overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-900 via-indigo-850 to-slate-900 text-white p-4 flex items-center justify-between shadow-md border-b border-indigo-800/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center">
                <Bot className="w-5 h-5 text-indigo-200" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base leading-tight">Next Gen কুইক ইনফো</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs text-slate-300 font-medium">অটো রিপ্লাই অ্যাসিস্ট্যান্ট</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                title="চ্যাট ক্লিয়ার করুন"
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-slate-300 hover:text-white"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-3.5">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] p-3.5 rounded-xl text-xs sm:text-sm leading-relaxed whitespace-pre-line ${msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none shadow-sm font-medium'
                      : 'bg-white text-slate-900 rounded-bl-none border border-slate-200/90 shadow-sm font-medium'
                    }`}
                >
                  <p>{msg.text}</p>

                  {msg.actionUrl && (
                    <div className="mt-3 pt-2.5 border-t border-slate-200">
                      <a
                        href={msg.actionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-sm transition-all"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>{msg.actionText || 'WhatsApp-এ মেসেজ দিন'}</span>
                      </a>
                    </div>
                  )}

                  <span className={`block text-[10px] mt-1.5 font-semibold ${msg.sender === 'user' ? 'text-indigo-200 text-right' : 'text-slate-400'}`}>
                    {msg.time}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-sm">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Question Selector */}
          <div className="p-3 bg-white border-t border-slate-200 max-h-[200px] overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                প্রশ্ন নির্বাচন করুন:
              </span>
              {messages.length > 1 && (
                <button
                  onClick={handleResetChat}
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  ক্লিয়ার করুন
                </button>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              {activeQuestions.map((q) => {
                const IconComponent = q.icon;
                return (
                  <button
                    key={q.id}
                    onClick={() => handleSelectQuestion(q)}
                    className="text-left w-full text-xs font-semibold px-3 py-2.5 rounded-lg bg-slate-50 hover:bg-indigo-50 text-slate-800 hover:text-indigo-700 border border-slate-200 hover:border-indigo-300 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <IconComponent className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>{q.question}</span>
                    </div>
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notice Bar */}
          <div className="bg-slate-100 p-2.5 text-center border-t border-slate-200 flex items-center justify-center gap-2">
            <Lock className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-[11px] font-semibold text-slate-600">
              {settings?.custom_texts?.qi_disabled || 'কাস্টম টাইপিং নিষ্ক্রিয় করা আছে। উত্তর পেতে উপরের যেকোনো প্রশ্নে ট্যাপ করুন।'}
            </span>
          </div>
        </div>
      )}
    </>
  );
}
