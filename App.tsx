
import React, { useState, useEffect } from 'react';
import { LeftSidebar } from './components/LeftSidebar';
import { MainContent } from './components/MainContent';
import type { Question, Answer, Attachment } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';

const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const App: React.FC = () => {
  const [questions, setQuestions] = useLocalStorage<Question[]>('questions', []);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isMobile && questions.length > 0 && selectedQuestionId === null) {
      // On desktop, auto-select first question if none is selected
      // setSelectedQuestionId(questions[0].id); 
    }
    if (questions.length === 0) {
      setSelectedQuestionId(null);
    }
  }, [questions, selectedQuestionId, isMobile]);

  const addQuestion = async (content: string, attachmentFile: File | null) => {
    let attachmentData: Attachment | null = null;
    if (attachmentFile) {
      const dataUrl = await fileToDataUrl(attachmentFile);
      attachmentData = { 
        name: attachmentFile.name, 
        type: attachmentFile.type, 
        size: attachmentFile.size,
        dataUrl 
      };
    }

    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      author: 'current-user', // This will be replaced by the dynamic user
      content,
      attachment: attachmentData,
      timestamp: new Date().toISOString(),
      answers: [],
    };
    const updatedQuestions = [newQuestion, ...questions];
    setQuestions(updatedQuestions);
    setSelectedQuestionId(newQuestion.id);
  };

  const addAnswer = async (questionId: string, content: string, attachmentFile: File | null, author: string) => {
    let attachmentData: Attachment | null = null;
    if (attachmentFile) {
      const dataUrl = await fileToDataUrl(attachmentFile);
      attachmentData = { 
        name: attachmentFile.name, 
        type: attachmentFile.type, 
        size: attachmentFile.size,
        dataUrl 
      };
    }

    const newAnswer: Answer = {
      id: `a-${Date.now()}`,
      author,
      content,
      attachment: attachmentData,
      timestamp: new Date().toISOString(),
    };

    setQuestions(prevQuestions =>
      prevQuestions.map(q =>
        q.id === questionId ? { ...q, answers: [...q.answers, newAnswer] } : q
      )
    );
  };

  const selectedQuestion = questions.find(q => q.id === selectedQuestionId);

  if (isMobile) {
    return (
      <div className="h-screen bg-slate-50 text-slate-800">
        {!selectedQuestionId ? (
          <LeftSidebar
            questions={questions}
            selectedQuestionId={selectedQuestionId}
            onSelectQuestion={setSelectedQuestionId}
            onAddQuestion={addQuestion}
          />
        ) : (
          <MainContent
            question={selectedQuestion}
            onAddAnswer={addAnswer}
            onBack={() => setSelectedQuestionId(null)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800">
      <div className="w-1/5 flex-shrink-0">
        <LeftSidebar
          questions={questions}
          selectedQuestionId={selectedQuestionId}
          onSelectQuestion={setSelectedQuestionId}
          onAddQuestion={addQuestion}
        />
      </div>
      <div className="w-4/5">
        <MainContent
          question={selectedQuestion}
          onAddAnswer={addAnswer}
        />
      </div>
    </div>
  );
};

export default App;
