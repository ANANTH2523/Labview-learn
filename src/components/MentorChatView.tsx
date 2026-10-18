import React, { useState, useRef, useEffect } from 'react';
import { MENTOR_PERSONAS } from '../data/mentorPersonas';
import { answerQuestion } from '../utils/mentor-engine';
import { RichText } from './RichText';
import { MentorPersona, MentorPersonaId, ChatMessage } from '../types';
import {
  GraduationCap,
  Sparkles,
  Send,
  MessageSquare,
  Bot,
  User,
  Trash2,
  Cpu,
  Layers,
  HelpCircle,
} from 'lucide-react';

interface MentorChatViewProps {
  initialTopic?: string;
}

export const MentorChatView: React.FC<MentorChatViewProps> = ({ initialTopic = '' }) => {
  const [selectedPersonaId, setSelectedPersonaId] = useState<MentorPersonaId>('professor');
  const activePersona: MentorPersona =
    MENTOR_PERSONAS.find((p) => p.id === selectedPersonaId) || MENTOR_PERSONAS[0];

  const [inputMessage, setInputMessage] = useState<string>(initialTopic ? `Could you explain ${initialTopic}?` : '');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      personaId: 'professor',
      text: `Welcome to the LabVIEW Architecture Masterclass! I am Dr. Marcus Vance. In our discipline, we do not think in sequential lines of text; we think in graphical dataflow, hardware execution systems, and concurrent pipelines.

Whether you are starting from zero knowledge or preparing for your Certified LabVIEW Architect (CLA) exam, ask me anything about G-dataflow, race conditions, state machines, or memory allocations!`,
      timestamp: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const presetQuestions = [
    {
      text: 'Why do Local Variables cause race conditions in LabVIEW?',
      persona: 'professor',
    },
    {
      text: 'How should I structure a prompt for Nigel AI to generate a continuous DAQmx task?',
      persona: 'nigel',
    },
    {
      text: 'What is the mechanical difference between Switch When Pressed and Latch When Released?',
      persona: 'professor',
    },
    {
      text: 'How do I architect an automated VISA SCPI test bench for production without timeouts?',
      persona: 'mentor',
    },
    {
      text: 'What causes DAQmx Error -200279 buffer overwrite and how do I fix it?',
      persona: 'mentor',
    },
    {
      text: 'How do I audit Nigel AI generated VIs for unwired tunnels and memory leaks?',
      persona: 'nigel',
    },
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      personaId: selectedPersonaId,
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    // Answers come from the built-in knowledge base; the short delay keeps the typing indicator natural.
    const question = text.trim();
    await new Promise((resolve) => setTimeout(resolve, 350));
    const reply = answerQuestion(selectedPersonaId, question);

    setMessages((prev) => [
      ...prev,
      {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        personaId: selectedPersonaId,
        text: reply.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setIsLoading(false);
  };

  const clearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'assistant',
        personaId: selectedPersonaId,
        text: `Chat cleared. Ask me any question about LabVIEW architecture, automated testing, or Nigel AI prompting.`,
        timestamp: 'Just now',
      },
    ]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Mentor Personas Header Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {MENTOR_PERSONAS.map((persona) => {
          const isSelected = persona.id === selectedPersonaId;
          return (
            <button
              key={persona.id}
              onClick={() => setSelectedPersonaId(persona.id)}
              className={`text-left p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900 border-amber-500 shadow-xl shadow-amber-500/10'
                  : 'bg-slate-900/60 border-slate-800 hover:bg-slate-850'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${persona.avatarColor} flex items-center justify-center font-bold text-slate-950 text-sm shadow-md`}
                  >
                    {persona.id === 'professor' ? 'CLA' : persona.id === 'mentor' ? 'ATE' : 'AI'}
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold border border-slate-700">
                    {persona.badge}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white">{persona.name}</h3>
                <p className="text-xs text-amber-400 font-medium mt-0.5">{persona.role}</p>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {persona.specialty}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>{isSelected ? 'Active Mentor' : 'Switch to Mentor'}</span>
                {isSelected && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>}
              </div>
            </button>
          );
        })}
      </div>

      {/* Preset Inquiries Bar */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-wider">
          <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>Curated Architectural Inquiries:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {presetQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedPersonaId(q.persona as MentorPersonaId);
                handleSendMessage(q.text);
              }}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-amber-500/50 hover:bg-slate-850 transition-all cursor-pointer text-left"
            >
              {q.text}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[480px]">
        {/* Chat Header */}
        <div className="px-6 py-4 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl bg-gradient-to-br ${activePersona.avatarColor} flex items-center justify-center font-bold text-slate-950 text-xs shadow-md`}
            >
              {activePersona.id === 'professor' ? 'CLA' : activePersona.id === 'mentor' ? 'ATE' : 'AI'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">{activePersona.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                  Online
                </span>
              </div>
              <p className="text-xs text-slate-400">{activePersona.title}</p>
            </div>
          </div>

          <button
            onClick={clearChat}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            title="Clear Conversation"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-950/60">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold shadow-md ${
                    isUser
                      ? 'bg-amber-500 text-slate-950'
                      : `bg-gradient-to-br ${activePersona.avatarColor} text-slate-950`
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-none'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-md'
                  }`}
                >
                  {/* Clean text output with code/diagram support */}
                  <RichText text={msg.text} />
                  <div
                    className={`mt-2 text-[10px] ${
                      isUser ? 'text-amber-950/70 text-right' : 'text-slate-500 text-left'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 max-w-xl">
              <div
                className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold bg-gradient-to-br ${activePersona.avatarColor} text-slate-950`}
              >
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                <span>{activePersona.name} is compiling an architectural response...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center gap-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={`Ask ${activePersona.name} about LabVIEW G-dataflow, ATE test racks, or Nigel AI prompting...`}
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim() || isLoading}
            className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-amber-500/20 disabled:opacity-50"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
