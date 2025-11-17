import React from 'react';
import { AiAction } from '../types';

// Icons
const SummarizeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h16" /></svg>;
const ImproveIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const TranslateIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m4 13-4-4M19 17v-2a4 4 0 00-4-4H9m7 14l4-4-4-4M19 5a2 2 0 110 4h-2" /></svg>;
const IdeaIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;
const ActionItemIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const SaveIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>;
const DownloadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>;


interface RibbonProps {
  onAction: (action: AiAction) => void;
  activeAction: AiAction | null;
  isLoading: boolean;
  language: string;
  setLanguage: (lang: string) => void;
  onFormat: (command: string) => void;
  onSave: () => void;
  onDownload: (format: 'txt' | 'html') => void;
}

const ActionButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  isActive?: boolean;
  disabled: boolean;
}> = ({ icon, label, onClick, isActive = false, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex flex-col items-center justify-center p-2 rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed w-28 h-20 text-center ${
      isActive
        ? 'bg-blue-600 text-white shadow-lg'
        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
    }`}
    aria-label={label}
  >
    {icon}
    <span className="mt-1 text-xs">{label}</span>
  </button>
);

const FormatButton: React.FC<{
  label: string;
  onClick: () => void;
  disabled: boolean;
}> = ({ label, onClick, disabled }) => (
    <button onClick={onClick} disabled={disabled} className="px-3 py-1 text-sm font-bold text-slate-300 hover:bg-slate-700 rounded-md disabled:opacity-50">
        {label}
    </button>
);


const Ribbon: React.FC<RibbonProps> = ({ onAction, activeAction, isLoading, language, setLanguage, onFormat, onSave, onDownload }) => {
  const actions = [
    { action: AiAction.Summarize, label: 'Summarize', icon: <SummarizeIcon /> },
    { action: AiAction.Improve, label: 'Improve Writing', icon: <ImproveIcon /> },
    { action: AiAction.CheckSpelling, label: 'Check Spelling', icon: <CheckIcon /> },
    { action: AiAction.GenerateIdeas, label: 'Generate Ideas', icon: <IdeaIcon /> },
    { action: AiAction.FindActionItems, label: 'Find Actions', icon: <ActionItemIcon /> },
  ];

  return (
    <header className="bg-slate-800 p-2 shadow-lg border-b border-slate-700 flex flex-wrap items-center space-x-4">
       <div className="flex items-center text-white pl-4 pr-6">
           <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
           <h1 className="text-xl font-bold ml-2">Gemini Docs</h1>
       </div>
       <div className="h-16 border-l border-slate-600"></div>

        <div className="flex items-center space-x-1 p-1 bg-slate-900/50 rounded-lg">
            <FormatButton onClick={() => onFormat('bold')} disabled={isLoading} label="B" />
            <FormatButton onClick={() => onFormat('italic')} disabled={isLoading} label="I" />
            <FormatButton onClick={() => onFormat('underline')} disabled={isLoading} label="U" />
        </div>
        <div className="flex items-center space-x-1">
            <button onClick={onSave} disabled={isLoading} className="p-2 text-slate-300 hover:bg-slate-700 rounded-md disabled:opacity-50"><SaveIcon /></button>
            <div className="relative group">
                <button disabled={isLoading} className="p-2 text-slate-300 hover:bg-slate-700 rounded-md disabled:opacity-50"><DownloadIcon /></button>
                <div className="absolute top-full mt-2 -right-4 w-32 bg-slate-700 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                    <a onClick={() => onDownload('html')} className="block px-4 py-2 text-sm text-white hover:bg-slate-600 cursor-pointer">as HTML</a>
                    <a onClick={() => onDownload('txt')} className="block px-4 py-2 text-sm text-white hover:bg-slate-600 cursor-pointer">as TXT</a>
                </div>
            </div>
        </div>

       <div className="h-16 border-l border-slate-600"></div>

       <nav className="flex items-center space-x-2">
          {actions.map((item) => (
              <ActionButton
                key={item.action}
                icon={item.icon}
                label={item.label}
                onClick={() => onAction(item.action)}
                isActive={activeAction === item.action}
                disabled={isLoading}
              />
          ))}
          <div className="h-16 border-l border-slate-600"></div>
          <div className="flex flex-col items-center p-2 w-40">
                <ActionButton
                    icon={<TranslateIcon/>}
                    label="Translate"
                    onClick={() => onAction(AiAction.Translate)}
                    isActive={activeAction === AiAction.Translate}
                    disabled={isLoading}
                />
                <select 
                    value={language} 
                    onChange={e => setLanguage(e.target.value)}
                    disabled={isLoading}
                    className="bg-slate-700 text-white text-xs rounded p-1 mt-1 w-28 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                    <option>French</option>
                    <option>Spanish</option>
                    <option>German</option>
                    <option>Japanese</option>
                    <option>Chinese</option>
                </select>
          </div>
       </nav>
    </header>
  );
};

export default Ribbon;