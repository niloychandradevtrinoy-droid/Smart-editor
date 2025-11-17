import React from 'react';
import { AiAction } from '../types';

interface ContextMenuProps {
    x: number;
    y: number;
    onAction: (action: AiAction) => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, onAction }) => {
    const actions = [
        AiAction.Improve,
        AiAction.Summarize,
        AiAction.Translate,
        AiAction.CheckSpelling,
        AiAction.FindActionItems
    ];

    const menuStyle: React.CSSProperties = {
        top: y,
        left: x,
        position: 'absolute',
    };
    
    return (
        <div style={menuStyle} className="bg-slate-800 border border-slate-700 rounded-md shadow-2xl z-50 animate-fadeIn w-56">
            <ul className="p-1">
                {actions.map(action => (
                    <li key={action}>
                        <button 
                            onClick={() => onAction(action)}
                            className="w-full text-left px-3 py-2 text-sm text-slate-200 hover:bg-blue-600 rounded-md transition-colors"
                        >
                            {action}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ContextMenu;
