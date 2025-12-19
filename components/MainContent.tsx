
import React, { useState, useRef, useEffect } from 'react';
import type { Question, Answer } from '../types';
import { SendIcon, PaperclipIcon, GeminiIcon } from './Icons';
import { getAnswerSuggestion } from '../services/geminiService';

interface MainContentProps {
  question: Question | undefined;
  onAddAnswer: (questionId: string, content: string, attachment: File | null, author: string) => Promise<void>;
  onBack?: () => void;
}

export const MainContent: React.FC<MainContentProps> = ({ question, onAddAnswer, onBack }) => {
  const [newAnswer, setNewAnswer] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [question?.answers]);
  
  useEffect(() => {
    // Reset input when question changes
    setNewAnswer('');
    setAttachment(null);
    if(fileInputRef.current) fileInputRef.current.value = '';
  }, [question?.id]);

  const AttachmentDisplay: React.FC<{ attachment: Question['attachment'] }> = ({ attachment }) => {
    if (!attachment) return null;

    // Case 1: Attachment from localStorage (no dataUrl)
    if (!attachment.dataUrl) {
        return (
            <div className="mt-2 inline-flex items-center bg-slate-200 text-slate-700 text-sm font-medium px-2.5 py-1 rounded-full">
                <PaperclipIcon className="w-4 h-4 mr-1.5" />
                {attachment.name}
            </div>
        );
    }
    
    const { type, dataUrl, name } = attachment;

    // Case 2: Previews for supported types
    if (type.startsWith('image/')) {
        return <img src={dataUrl} alt={name} className="mt-2 w-36 h-48 rounded-lg cursor-pointer object-cover transition hover:opacity-80" onClick={() => setZoomedImage(dataUrl)} aria-label={`Xem ảnh: ${name}`}/>;
    }

    if (type.startsWith('video/')) {
        return <video controls src={dataUrl} className="mt-2 w-full max-w-xs rounded-lg shadow-sm" aria-label={`Xem video: ${name}`}/>;
    }
    
    if (type.startsWith('audio/')) {
        return <audio controls src={dataUrl} className="mt-2 w-full max-w-xs" aria-label={`Nghe âm thanh: ${name}`}/>;
    }
    
    if (type === 'application/pdf') {
       return (
         <div className="mt-2 p-2 border rounded-lg bg-slate-100 max-w-xs shadow-sm">
            <a href={dataUrl} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline inline-flex items-center font-semibold mb-2 truncate">
                 <PaperclipIcon className="w-5 h-5 mr-1.5 shrink-0" />
                 <span className="truncate">{name}</span>
            </a>
            <div className="border rounded-md overflow-hidden bg-white">
                <iframe src={dataUrl} title={name} className="w-full h-48" />
            </div>
         </div>
       );
    }

    // Case 3: Fallback for other file types (with download link)
    return (
        <a 
            href={dataUrl} 
            download={name}
            className="mt-2 inline-flex items-center bg-slate-200 text-slate-700 text-sm font-medium px-2.5 py-1 rounded-full hover:bg-slate-300 transition"
            title={`Tải xuống ${name}`}
        >
            <PaperclipIcon className="w-4 h-4 mr-1.5" />
            {name}
        </a>
    );
};


  if (!question) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-white">
        <p className="text-slate-500">Chọn một câu hỏi để xem chi tiết.</p>
      </div>
    );
  }

  const handleAddAnswer = async () => {
    if (newAnswer.trim() || attachment) {
      await onAddAnswer(question.id, newAnswer, attachment, 'You'); // Author hardcoded for now
      setNewAnswer('');
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

  const handleGeminiAnswer = async () => {
    setIsGenerating(true);
    try {
      const suggestion = await getAnswerSuggestion(question.content);
      if (suggestion && suggestion !== "Không thể tạo câu trả lời. Vui lòng thử lại.") {
        await onAddAnswer(question.id, suggestion, null, 'Gemini AI');
      } else {
        console.error("Gemini failed to provide a valid answer.");
      }
    } catch (error) {
      console.error("Error getting answer from Gemini:", error);
    } finally {
      setIsGenerating(false);
    }
  };


  return (
    <div className="w-full flex flex-col h-screen bg-white">
       {zoomedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setZoomedImage(null)}
          role="dialog"
          aria-modal="true"
        >
          <img 
            src={zoomedImage} 
            alt="Phóng to tệp đính kèm" 
            className="max-w-full max-h-full object-contain rounded-lg" 
            onClick={(e) => e.stopPropagation()}
          />
           <button
             onClick={() => setZoomedImage(null)}
             className="absolute top-4 right-4 text-white text-4xl font-bold hover:text-slate-300 transition"
             aria-label="Đóng"
           >&times;</button>
        </div>
      )}

      {onBack && (
        <div className="p-4 border-b border-slate-200 flex items-center shrink-0">
            <button onClick={onBack} className="mr-4 text-slate-500 hover:text-sky-500 transition-colors" aria-label="Quay lại">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
            </button>
            <h2 className="text-lg font-semibold text-slate-700 truncate">
                Chi tiết câu hỏi
            </h2>
        </div>
      )}

      <div className="flex-grow p-6 overflow-y-auto">
        {/* Question */}
        <div className="mb-6">
          <div className="p-4 bg-sky-50 border border-sky-200 rounded-lg shadow-sm">
            <p className="text-slate-800 whitespace-pre-wrap">{question.content}</p>
            <AttachmentDisplay attachment={question.attachment} />
            <p className="text-right text-xs text-slate-400 mt-2">{new Date(question.timestamp).toLocaleString()}</p>
          </div>
        </div>

        {/* Answers */}
        <div className="space-y-4">
          {question.answers.map((answer: Answer) => {
            const isAI = answer.author === 'Gemini AI';
            return (
              <div key={answer.id} className={`flex ${isAI ? 'justify-start' : 'justify-end'}`}>
                <div className="w-auto max-w-xl">
                  <div className={`p-4 border rounded-lg shadow-sm ${isAI ? 'bg-slate-100 border-slate-200' : 'bg-emerald-50 border-emerald-200'}`}>
                    {isAI && (
                      <div className="flex items-center gap-2 mb-2">
                        <GeminiIcon className="w-5 h-5 text-slate-600" />
                        <p className="text-sm font-semibold text-slate-700">Gemini AI</p>
                      </div>
                    )}
                    <p className="text-slate-800 whitespace-pre-wrap">{answer.content}</p>
                    <AttachmentDisplay attachment={answer.attachment} />
                    <p className="text-right text-xs text-slate-400 mt-2">{new Date(answer.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div ref={endOfMessagesRef} />
      </div>

      {/* Answer Input */}
      <div className="p-4 bg-slate-50 border-t border-slate-200">
        <div className="relative">
          <textarea
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            placeholder="Nhập câu trả lời của bạn..."
            className="w-full p-3 pr-28 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition resize-none disabled:bg-slate-200"
            rows={3}
            disabled={isGenerating}
            onKeyDown={async (e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                await handleAddAnswer();
              }
            }}
          />
          <div className="absolute top-1/2 right-3 transform -translate-y-1/2 flex items-center space-x-2">
            <button
                onClick={handleGeminiAnswer}
                className="text-slate-500 hover:text-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isGenerating}
                title="Trả lời bằng Gemini AI"
            >
              {isGenerating ? 
                <div className="w-6 h-6 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div> :
                <GeminiIcon className="w-6 h-6" />
              }
            </button>
            <button onClick={() => fileInputRef.current?.click()} className="text-slate-500 hover:text-emerald-500 transition-colors">
              <PaperclipIcon className="w-6 h-6" />
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            <button onClick={handleAddAnswer} className="text-slate-500 hover:text-emerald-500 transition-colors">
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
    </div>
  );
};
