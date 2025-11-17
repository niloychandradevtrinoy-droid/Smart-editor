
import React, { useState } from 'react';
import { StartupProgram } from '../types';

const MOCK_STARTUP_PROGRAMS: StartupProgram[] = [
  { id: '1', name: 'Mega Cloud Storage', publisher: 'Mega Corp', impact: 'High', enabled: true },
  { id: '2', name: 'Quick Launcher', publisher: 'Speedy Apps', impact: 'Medium', enabled: true },
  { id: '3', name: 'System Updater', publisher: 'OS Provider', impact: 'Low', enabled: true },
  { id: '4', name: 'Photo Editor Helper', publisher: 'Creative Suite', impact: 'Medium', enabled: false },
  { id: '5', name: 'Game Client', publisher: 'Gaming Inc.', impact: 'High', enabled: true },
  { id: '6', name: 'VPN Service', publisher: 'SecureNet', impact: 'Low', enabled: false },
];

const impactColor = {
    High: 'text-red-400',
    Medium: 'text-yellow-400',
    Low: 'text-green-400'
}

const StartupControl: React.FC = () => {
    const [programs, setPrograms] = useState<StartupProgram[]>(MOCK_STARTUP_PROGRAMS);

    const toggleProgram = (id: string) => {
        setPrograms(programs.map(p => p.id === id ? {...p, enabled: !p.enabled } : p));
    }

    const enabledCount = programs.filter(p => p.enabled).length;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-2">Startup Program Control</h1>
            <p className="text-slate-400 mb-6">{enabledCount} of {programs.length} programs are enabled to run at startup.</p>

            <div className="bg-slate-800 rounded-lg shadow-lg">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b border-slate-700">
                            <tr>
                                <th className="p-4">Program</th>
                                <th className="p-4 hidden md:table-cell">Publisher</th>
                                <th className="p-4 hidden sm:table-cell">Impact</th>
                                <th className="p-4 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {programs.map(program => (
                                <tr key={program.id} className="border-b border-slate-700 last:border-b-0">
                                    <td className="p-4 font-semibold">{program.name}</td>
                                    <td className="p-4 text-slate-400 hidden md:table-cell">{program.publisher}</td>
                                    <td className={`p-4 font-bold hidden sm:table-cell ${impactColor[program.impact]}`}>{program.impact}</td>
                                    <td className="p-4 text-center">
                                        <label htmlFor={`toggle-${program.id}`} className="flex items-center justify-center cursor-pointer">
                                            <div className="relative">
                                                <input type="checkbox" id={`toggle-${program.id}`} className="sr-only" checked={program.enabled} onChange={() => toggleProgram(program.id)} />
                                                <div className={`block w-14 h-8 rounded-full ${program.enabled ? 'bg-cyan-500' : 'bg-slate-600'}`}></div>
                                                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${program.enabled ? 'transform translate-x-6' : ''}`}></div>
                                            </div>
                                        </label>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StartupControl;
