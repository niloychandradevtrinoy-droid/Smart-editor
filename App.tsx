import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AiAction } from './types';
import { processTextWithAi } from './services/geminiService';
import Ribbon from './components/Sidebar';
import Editor from './components/Dashboard';
import ContextMenu from './components/ContextMenu';

const Spinner: React.FC = () => (
    <div className="flex justify-center items-center h-full">
        <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    </div>
);

const SuggestionsPanel: React.FC<{
  aiResult: string;
  isLoading: boolean;
  activeAction: AiAction | null;
  onClose: () => void;
}> = ({ aiResult, isLoading, activeAction, onClose }) => (
    <aside className="w-full md:w-1/3 lg:w-1/4 h-full bg-slate-800 border-l border-slate-700 flex flex-col p-4 shadow-2xl animate-slideIn a">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">{isLoading ? 'Processing...' : activeAction}</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-white">&times;</button>
        </div>
        <div className="flex-grow bg-slate-900 rounded-lg p-3 overflow-y-auto">
            {isLoading && <Spinner />}
            {!isLoading && aiResult && (
                 <pre className="whitespace-pre-wrap text-slate-200 font-sans">{aiResult}</pre>
            )}
        </div>
    </aside>
);

const App: React.FC = () => {
  const [noteHtml, setNoteHtml] = useState<string>('<h2>Welcome to Gemini Docs!</h2><p>This is your intelligent document editor. <b>Start writing</b> your report, email draft, or <i>creative story</i> here. When you\'re ready, use the AI tools in the ribbon above to enhance your text. You can summarize complex topics, improve your writing, translate to different languages, and much more.</p><p><u>Right-click on selected text</u> to use AI actions on a specific portion of your document.</p>');
  const [aiResult, setAiResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeAction, setActiveAction] = useState<AiAction | null>(null);
  const [language, setLanguage] = useState<string>('French');
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; visible: boolean; selectedText: string; }>({ x: 0, y: 0, visible: false, selectedText: '' });

  const editorRef = useRef<HTMLDivElement>(null);

  // Load from local storage on initial render
  useEffect(() => {
    const savedNote = localStorage.getItem('gemini-docs-content');
    if (savedNote) {
      setNoteHtml(savedNote);
    }
  }, []);

  // Close context menu on any click
  useEffect(() => {
    const handleClick = () => setContextMenu(prev => ({ ...prev, visible: false }));
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const handleAiAction = async (action: AiAction, text?: string) => {
    const textToProcess = text || editorRef.current?.innerText || '';
    if (textToProcess.trim().length < 10) {
        setAiResult("Please select at least 10 characters to use the AI features.");
        return;
    }
    setActiveAction(action);
    setIsLoading(true);
    setAiResult(''); // Clear previous results
    const result = await processTextWithAi(action, textToProcess, { language });
    setAiResult(result);
    setIsLoading(false);
  };

  const closeSuggestionPanel = () => {
      setActiveAction(null);
      setAiResult('');
  }

  const handleFormat = (command: string) => {
    document.execCommand(command, false);
    editorRef.current?.focus();
  };

  const handleSave = useCallback(() => {
    localStorage.setItem('gemini-docs-content', noteHtml);
    // Simple feedback, could be a toast notification
    alert('Document Saved!');
  }, [noteHtml]);

  const handleDownload = (format: 'txt' | 'html') => {
    const content = format === 'txt' ? editorRef.current?.innerText || '' : noteHtml;
    const blob = new Blob([content], { type: format === 'txt' ? 'text/plain' : 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `document.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  const handleContextMenu = (e: React.MouseEvent) => {
      const selectedText = window.getSelection()?.toString() || '';
      if (selectedText.trim()) {
          e.preventDefault();
          setContextMenu({ x: e.clientX, y: e.clientY, visible: true, selectedText });
      }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900 font-sans">
      <Ribbon 
        onAction={handleAiAction} 
        activeAction={activeAction} 
        isLoading={isLoading}
        language={language}
        setLanguage={setLanguage}
        onFormat={handleFormat}
        onSave={handleSave}
        onDownload={handleDownload}
      />
      <main className="flex-1 flex overflow-hidden">
        <Editor 
          ref={editorRef}
          htmlContent={noteHtml}
          onHtmlContentChange={setNoteHtml}
          onContextMenu={handleContextMenu}
        />
        {(isLoading || aiResult) && (
            <SuggestionsPanel 
                aiResult={aiResult}
                isLoading={isLoading}
                activeAction={activeAction}
                onClose={closeSuggestionPanel}
            />
        )}
      </main>
      {contextMenu.visible && (
        <ContextMenu 
            x={contextMenu.x}
            y={contextMenu.y}
            onAction={(action) => handleAiAction(action, contextMenu.selectedText)}
        />
      )}
    </div>
  );
};

export default App;
