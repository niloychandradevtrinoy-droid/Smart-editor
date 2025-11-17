
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, Sector } from 'recharts';
import { DiskUsageData } from '../types';

const MOCK_DISK_DATA: DiskUsageData[] = [
    { name: 'Apps & Games', value: 250, fill: '#06b6d4' },
    { name: 'Documents', value: 80, fill: '#3b82f6' },
    { name: 'Photos & Videos', value: 150, fill: '#8b5cf6' },
    { name: 'System Files', value: 120, fill: '#ec4899' },
    { name: 'Temporary Files', value: 45, fill: '#f97316' },
    { name: 'Free Space', value: 355, fill: '#475569' },
];

const totalDisk = MOCK_DISK_DATA.reduce((acc, item) => acc + item.value, 0);

const DiskAnalyzer: React.FC = () => {
    const [progress, setProgress] = useState(0);
    const [data, setData] = useState<DiskUsageData[]>([]);
    const [isCleaning, setIsCleaning] = useState(false);
    const [isCleaned, setIsCleaned] = useState(false);
    const [cleanedAmount, setCleanedAmount] = useState(0);
    
    const isScanComplete = progress >= 100;

    useEffect(() => {
        setData(MOCK_DISK_DATA.map(d => ({ ...d, value: 0 }))); // Start with zero values
        const interval = setInterval(() => {
            setProgress(prev => {
                const newProgress = prev + 2;
                if (newProgress >= 100) {
                    clearInterval(interval);
                    setData(MOCK_DISK_DATA); // Set final data
                    return 100;
                }
                
                // Dynamically update data based on progress
                setData(MOCK_DISK_DATA.map(d => ({
                    ...d,
                    value: parseFloat((d.value * (newProgress / 100)).toFixed(2))
                })));

                return newProgress;
            });
        }, 50);

        return () => clearInterval(interval);
    }, []);

    const handleClean = () => {
        setIsCleaning(true);
        const tempFiles = data.find(d => d.name === 'Temporary Files');
        if (!tempFiles) return;

        const amountToClean = tempFiles.value;
        setCleanedAmount(amountToClean);
        
        setTimeout(() => {
            setData(prevData => {
                const freeSpace = prevData.find(d => d.name === 'Free Space');
                const newData = prevData.filter(d => d.name !== 'Temporary Files');
                if (freeSpace) {
                    freeSpace.value += amountToClean;
                }
                return newData;
            });
            setIsCleaning(false);
            setIsCleaned(true);
        }, 2000);
    };
    
    const totalUsed = data.filter(d => d.name !== 'Free Space').reduce((acc, item) => acc + item.value, 0);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Disk Analyzer</h1>
            
            <div className="bg-slate-800 p-8 rounded-lg">
                {!isScanComplete ? (
                    <div>
                        <h3 className="text-xl font-semibold text-center mb-4">Analyzing Disk...</h3>
                        <div className="w-full bg-slate-700 rounded-full h-4">
                            <div className="bg-cyan-500 h-4 rounded-full transition-all duration-150" style={{ width: `${progress}%` }}></div>
                        </div>
                        <p className="text-center mt-4 text-slate-400">{progress}% Complete</p>
                    </div>
                ) : (
                    <div className="animate-fadeIn">
                        <h2 className="text-2xl font-bold mb-2">Analysis Complete</h2>
                    </div>
                )}

                <p className="text-slate-400 mb-6">Total Disk Size: <span className="font-bold text-white">{totalDisk} GB</span> | Used: <span className="font-bold text-white">{totalUsed.toFixed(1)} GB</span></p>

                <div style={{ width: '100%', height: 400 }}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={80}
                                outerRadius={120}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                                nameKey="name"
                                labelLine={false}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} className="transition-all" />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '0.5rem' }}
                                formatter={(value: number) => [`${value.toFixed(1)} GB`, 'Size']}
                            />
                            <Legend wrapperStyle={{ color: 'white', paddingTop: '20px' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                
                {isScanComplete && (
                    <div className="mt-6 text-center">
                        {isCleaned ? (
                            <div className="text-green-400 font-semibold text-lg p-3 rounded-md bg-green-500/10">
                                Successfully freed up {cleanedAmount.toFixed(1)} GB of space!
                            </div>
                        ) : (
                             <button 
                                onClick={handleClean}
                                disabled={isCleaning}
                                className="bg-green-500 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-green-400 transition-all duration-300 transform hover:scale-105 disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center w-full sm:w-auto mx-auto"
                             >
                                {isCleaning ? (
                                     <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Cleaning...
                                    </>
                                ) : (
                                    'Clean Temporary Files'
                                )}
                             </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default DiskAnalyzer;
