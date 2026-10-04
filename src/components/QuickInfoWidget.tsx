import { useState } from 'react';
import { MessageSquare, X, Bot, User, Phone, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';

interface QuickQuestion {
  id: string;
  question: string;
  answer: string;
  actionUrl?: string;
  actionText?: string;
}

const defaultQuestions: QuickQuestion[] = [
  {
    id: '1',
    question: '🏢 আপনাদের প্রতিষ্ঠানের নাম কী?',
    answer: 'Next Gen Tutors',
  },
  {
    id: '2',
    question: '📍 আপনাদের ঠিকানা কোথায়?',
    answer: 'Pirojpur, Chittagong, Bangladesh',
  },
  {
    id: '3',
    question: '📞 আপনাদের সাথে যোগাযোগের মাধ্যমগুলো কী কী?',
    answer: `আমাদের সাথে যোগাযোগের মাধ্যমসমূহ:
• WhatsApp: 01318126412
• Call: 01626881259, 01744854853
• Web: nextgen-tutors.netlify.app
• Email: nextgentutors247@gmail.com`,
    actionUrl: 'https://wa.me/8801318126412',
    actionText: 'WhatsApp-এ যোগাযোগ করুন'
  },
  {
    id: '4',
    question: '⏱️ টিউটর পেতে কেমন সময় লাগতে পারে?',
    answer: 'আপনার চাহিদা অনুযায়ী উপযুক্ত টিউটর খুঁজে পাওয়ার পর দ্রুত যোগাযোগ করা হবে।',
  },
  {
    id: '5',
    question: '💰 আপনাদের টিউশন ফি কত?',
    answer: 'টিউশন ফি শ্রেণি, বিষয়, পড়ানোর স্থান ও সময়ের ওপর নির্ভর করে। বিস্তারিত জানতে যোগাযোগ করুন। ',
    actionUrl: 'https://wa.me/8801318126412?text=হ্যালো!%20টিউশন%20ফি%20সম্পর্কে%20জানতে%20চাই।',
    actionText: 'WhatsApp-এ ফি জানুন'
  },
  {
    id: '6',
    question: '👨‍🏫 টিউশন করাতে চাইলে কী করতে হবে?',
    answer: 'আপনার নাম, শিক্ষাগত যোগ্যতা, অভিজ্ঞতা, বিষয় ও অবস্থান জানিয়ে CV/বিস্তারিত তথ্য  পাঠান।',
    actionUrl: 'https://wa.me/8801318126412?text=হ্যালো!%20আমি%20টিউশন%20করাতে%20চাই।',
    actionText: 'CV পাঠান WhatsApp-এ'
  },
  {
    id: '7',
    question: '📚 টিউটর খুঁজলে কী কী তথ্য দিতে হবে?',
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

export default function QuickInfoWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: '👋 আসসালামু আলাইকুম! Next Gen Tutors-এর কুইক ইনফরমেশন অ্যাসিস্ট্যান্টে আপনাকে স্বাগতম। নিচে প্রদত্ত যেকোনো প্রশ্ন নির্বাচন করে তাৎক্ষণিক উত্তর জেনে নিন:',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const handleSelectQuestion = (q: QuickQuestion) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Add user question message
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: q.question,
      time: timeStr
    };

    // Add bot auto-reply message
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
        text: '👋 আসসালামু আলাইকুম! Next Gen Tutors-এর কুইক ইনফরমেশন অ্যাসিস্ট্যান্টে আপনাকে স্বাগতম। নিচে প্রদত্ত যেকোনো প্রশ্ন নির্বাচন করে তাৎক্ষণিক উত্তর জেনে নিন:',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {!isOpen && (
          <div className="mb-2 bg-ink-900 text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-lg border border-ink-700 animate-bounce flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-warning-400" />
            <span>জরুরি তথ্য বা প্রশ্ন</span>
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 relative group"
          aria-label="Toggle Quick Information Popup"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <>
              <MessageSquare className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" />
            </>
          )}
        </button>
      </div>

      {/* Quick Info Chat Popup */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 w-[92vw] sm:w-[420px] max-h-[82vh] h-[600px] bg-white rounded-3xl shadow-2xl border border-ink-100 z-50 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-700 via-primary-600 to-primary-800 text-white p-4 sm:p-5 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-base leading-tight">Next Gen কুইক ইনফো</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs text-primary-100 font-medium">অটো রিপ্লাই অ্যাসিস্ট্যান্ট</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                title="চ্যাট ক্লিয়ার করুন"
                className="p-2 hover:bg-white/15 rounded-xl transition-colors text-white/80 hover:text-white"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/15 rounded-xl transition-colors text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-xl bg-primary-600 text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${msg.sender === 'user'
                      ? 'bg-primary-600 text-white rounded-br-none shadow-md font-semibold'
                      : 'bg-white text-ink-900 rounded-bl-none border border-ink-100 shadow-sm'
                    }`}
                >
                  <p>{msg.text}</p>

                  {msg.actionUrl && (
                    <div className="mt-3 pt-2.5 border-t border-ink-100">
                      <a
                        href={msg.actionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md transition-all"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>{msg.actionText || 'WhatsApp-এ মেসেজ দিন'}</span>
                      </a>
                    </div>
                  )}

                  <span className={`block text-[10px] mt-1.5 ${msg.sender === 'user' ? 'text-primary-100 text-right' : 'text-ink-400'}`}>
                    {msg.time}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-ink-700 text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-sm">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick Question Buttons Selector */}
          <div className="p-3 bg-white border-t border-ink-100 max-h-[220px] overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-ink-500 uppercase tracking-wider">
                প্রশ্ন নির্বাচন করুন:
              </span>
              {messages.length > 1 && (
                <button
                  onClick={handleResetChat}
                  className="text-xs text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  ক্লিয়ার করুন
                </button>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              {defaultQuestions.map((q) => (
                <button
                  key={q.id}
                  onClick={() => handleSelectQuestion(q)}
                  className="text-left w-full text-xs font-semibold px-3 py-2.5 rounded-xl bg-ink-50 hover:bg-primary-50 text-ink-800 hover:text-primary-700 border border-ink-100 hover:border-primary-200 transition-all flex items-center justify-between group"
                >
                  <span>{q.question}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>

          {/* Custom Message Disabled Notice Bar */}
          <div className="bg-slate-100 p-2.5 text-center border-t border-ink-100 flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-[11px] font-semibold text-ink-600">
              🔒 কাস্টম টাইপিং নিষ্ক্রিয় করা আছে। উত্তর পেতে উপরের যেকোনো প্রশ্নে ট্যাপ করুন।
            </span>
          </div>
        </div>
      )}
    </>
  );
}
