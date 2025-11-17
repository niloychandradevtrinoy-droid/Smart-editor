import React, { forwardRef } from 'react';
import ContentEditable from 'react-contenteditable';

interface EditorProps {
    htmlContent: string;
    onHtmlContentChange: (html: string) => void;
    onContextMenu: (e: React.MouseEvent) => void;
}

const Editor = forwardRef<HTMLDivElement, EditorProps>(({ htmlContent, onHtmlContentChange, onContextMenu }, ref) => {
    
    const handleChange = (e: any) => {
        onHtmlContentChange(e.target.value);
    }

    return (
        <div className="flex-grow h-full p-4 sm:p-6 lg:p-8 bg-slate-900 overflow-y-auto">
            <div 
                className="max-w-4xl mx-auto bg-white text-slate-900 rounded-lg shadow-2xl p-8 sm:p-12 min-h-full"
                 onContextMenu={onContextMenu}
            >
                <ContentEditable
                    innerRef={ref}
                    html={htmlContent}
                    onChange={handleChange}
                    className="w-full h-full bg-transparent text-lg focus:outline-none font-serif leading-relaxed"
                    tagName="article"
                />
            </div>
        </div>
    );
});

export default Editor;
