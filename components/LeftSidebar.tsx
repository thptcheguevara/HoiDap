
import React, { useState, useRef, useMemo } from 'react';
import type { Question } from '../types';
import { SendIcon, PaperclipIcon, RefreshIcon, ChatBubbleIcon, UserIcon } from './Icons';
import { StatsBarChart } from './StatsBarChart';

interface LeftSidebarProps {
  questions: Question[];
  selectedQuestionId: string | null;
  onSelectQuestion: (id: string) => void;
  onAddQuestion: (content: string, attachment: File | null) => Promise<void>;
}

const generateRandomUser = () => `User${Math.floor(100 + Math.random() * 900)}`;

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  questions,
  selectedQuestionId,
  onSelectQuestion,
  onAddQuestion,
}) => {
  const [newQuestion, setNewQuestion] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [username, setUsername] = useState(generateRandomUser);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddQuestion = async () => {
    if (newQuestion.trim() || attachment) {
      await onAddQuestion(newQuestion, attachment);
      setNewQuestion('');
      setAttachment(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0]);
    }
  };

  const chartData = useMemo(() => {
    const total = questions.length;
    if (total === 0) {
      return [
        { name: 'Đã trả lời', value: 0, percentage: '0%' },
        { name: 'Chưa trả lời', value: 0, percentage: '0%' },
      ];
    }
    const answered = questions.filter(q => q.answers.length > 0).length;
    const unanswered = total - answered;
    
    const answeredPercentage = `${Math.round((answered / total) * 100)}%`;
    const unansweredPercentage = `${Math.round((unanswered / total) * 100)}%`;

    return [
      { name: 'Đã trả lời', value: answered, percentage: answeredPercentage },
      { name: 'Chưa trả lời', value: unanswered, percentage: unansweredPercentage },
    ];
  }, [questions]);


  return (
    <div className="w-full bg-slate-100 border-r border-slate-200 flex flex-col h-full">
      <div className="p-4 border-b border-slate-200">
        <h1 className="text-3xl font-bold text-red-600 text-center select-none"
            style={{ textShadow: '1px 1px 0px #facc15, 2px 2px 0px #f59e0b' }}>
          HỎI ĐÁP CHEGUEVARA
        </h1>
      </div>

      <div className="p-4 flex items-center justify-between bg-white/50 border-b border-slate-200">
        <div className="flex items-center gap-2">
            <UserIcon className="w-6 h-6 text-slate-500"/>
            <span className="font-semibold text-slate-600">{username}</span>
        </div>
        <button onClick={() => setUsername(generateRandomUser())} className="text-slate-500 hover:text-sky-500 transition-colors">
          <RefreshIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 border-b border-slate-200">
        <div className="relative">
          <textarea
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Đặt câu hỏi của bạn..."
            className="w-full p-2 pr-20 border-2 border-sky-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition resize-none"
            rows={3}
            onKeyDown={async (e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                await handleAddQuestion();
              }
            }}
          />
          <div className="absolute top-1/2 right-2 transform -translate-y-1/2 flex items-center space-x-2">
            <button onClick={() => fileInputRef.current?.click()} className="text-slate-500 hover:text-sky-500 transition-colors">
              <PaperclipIcon className="w-6 h-6" />
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            <button onClick={handleAddQuestion} className="bg-sky-500 text-white p-1.5 rounded-lg hover:bg-sky-600 transition-colors">
              <SendIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
        {attachment && (
          <div className="mt-2 text-xs text-slate-500 truncate">
            Đính kèm: {attachment.name}
          </div>
        )}
      </div>

      <div className="flex-grow overflow-y-auto">
        {questions.map(q => (
          <div
            key={q.id}
            onClick={() => onSelectQuestion(q.id)}
            className={`p-3 border-b border-slate-200 cursor-pointer transition-colors ${selectedQuestionId === q.id ? 'bg-sky-100' : 'hover:bg-slate-200/50'}`}
          >
            <p className={`text-sm break-words ${q.answers.length === 0 ? 'font-bold text-slate-700' : 'text-slate-600'}`}>
              {q.content}
            </p>
            <div className="flex justify-end items-center mt-2 text-xs text-slate-400">
              <ChatBubbleIcon className="w-4 h-4 mr-1"/>
              <span>{q.answers.length}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-2 border-t border-slate-200 mt-auto">
        <h3 className="text-sm font-semibold text-center text-slate-600 mb-1">Thống kê</h3>
        <StatsBarChart data={chartData} />
      </div>
    </div>
  );
};
