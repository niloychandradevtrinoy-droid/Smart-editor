import React, { useState, useEffect, useCallback } from 'react';
import { JunkFile } from '../types';
import { getOptimizationTips } from '../services/geminiService';
import { AIIcon } from './icons/AIIcon';

const MOCK_JUNK_FILES: JunkFile[] = [
  { id: '1', name: 'Windows Update Cache', category: 'System', size: 1200 },
  { id: '2', name: 'Chrome Cache', category: 'Browser', size: 450 },
  { id: '3', name: 'System Temporary Files', category: 'System', size: 850 },
  { id: '4', name: 'Recycle Bin', category: 'System', size: 320 },
  { id: '5', name: 'Application Logs', category: 'Apps', size: 250 },
  { id: '6', name: 'Thumbnail Cache', category: 'System', size: 180 },
  { id: '7', name: 'Memory Dumps', category: 'System', size: 550 },
];

const MOCK_SCAN_PATHS = [
    'C:\\Windows\\Temp\\...',
    'C:\\Users\\User\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Cache\\...',
    'C:\\Users\\User\\AppData\\Local\\Temp\\...',
    'C:\\$Recycle.Bin\\...',
    'C:\\ProgramData\\SomeApp\\logs\\...',
    'C:\\Windows\\Prefetch\\...',
    'C:\\Users\\User\\AppData\\Local\\Microsoft\\Windows\\Explorer\\...',
];


const JunkClean: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentScanPath, setCurrentScanPath] = useState('');
  const [scanComplete, setScanComplete] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);
  const [cleanProgress, setCleanProgress] = useState(0);
  const [isCleaned, setIsCleaned] = useState(false);
  const [foundFiles, setFoundFiles] = useState<JunkFile[]>([]);
  const [aiTips, setAiTips] = useState('');
  const [isLoadingTips, setIsLoadingTips] = useState(false);

  const totalJunkSize = MOCK_JUNK_FILES.reduce((acc, file) => acc + file.size, 0);

  const handleScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setScanComplete(false);
    setIsCleaned(false);
    setFoundFiles([]);

    let pathIndex = 0;
    const scanPathInterval = setInterval(() => {
        setCurrentScanPath(MOCK_SCAN_PATHS[pathIndex]);
        pathIndex = (pathIndex + 1) % MOCK_SCAN_PATHS.length;
    }, 300);

    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          clearInterval(scanPathInterval);
          setCurrentScanPath('');
          setIsScanning(false);
          setScanComplete(true);
          setFoundFiles(MOCK_JUNK_FILES);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  const fetchAiTips = useCallback(async () => {
    setIsLoadingTips(true);
    const findings = `Found ${(totalJunkSize / 1024).toFixed(2)} GB of junk files, including system cache, browser history, and temporary files.`;
    const tips = await getOptimizationTips(findings);
    setAiTips(tips);
    setIsLoadingTips(false);
  }, [totalJunkSize]);


  const handleClean = () => {
    setIsCleaning(true);
    setCleanProgress(0);

    const interval = setInterval(() => {
        setCleanProgress(prev => {
            if(prev >= 100) {
                clearInterval(interval);
                setIsCleaning(false);
                setIsCleaned(true);
                setFoundFiles([]);
                fetchAiTips();
                return 100;
            }
            return prev + 3;
        })
    }, 70);
  };
  
  return (
    <div>
        <h1 className="text-3xl font-bold mb-4">Junk File Clean</h1>
        
        {(!isScanning && !scanComplete) && (
            <div className="text-center p-8 bg-slate-800 rounded-lg">
                <p className="text-slate-300 mb-6">Scan your system to find and remove junk files to free up disk space.</p>
                <button onClick={handleScan} className="bg-cyan-500 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-cyan-400 transition-colors">
                    Scan Now
                </button>
            </div>
        )}

        {(isScanning || isCleaning) && (
            <div className="bg-slate-800 p-8 rounded-lg">
                <h3 className="text-xl font-semibold text-center mb-4">{isScanning ? 'Scanning for Junk Files...' : 'Cleaning System...'}</h3>
                <div className="w-full bg-slate-700 rounded-full h-4">
                    <div className="bg-cyan-500 h-4 rounded-full transition-all duration-150" style={{ width: `${isScanning ? scanProgress : cleanProgress}%` }}></div>
                </div>
                <p className="text-center mt-4 text-slate-400">{isScanning ? scanProgress : cleanProgress}% Complete</p>
                {isScanning && currentScanPath && (
                    <div className="mt-4 text-sm text-slate-500 font-mono bg-slate-900 p-3 rounded-md overflow-x-auto whitespace-nowrap">
                        Scanning: {currentScanPath}
                    </div>
                )}
            </div>
        )}

        {scanComplete && !isCleaned && !isCleaning && (
            <div className="bg-slate-800 p-8 rounded-lg animate-fadeIn">
                <h2 className="text-2xl font-bold mb-4">Scan Complete!</h2>
                <p className="text-lg mb-6">Found <span className="text-cyan-400 font-bold">{(totalJunkSize / 1024).toFixed(2)} GB</span> of junk files.</p>
                <div className="max-h-60 overflow-y-auto mb-6 pr-2">
                    {MOCK_JUNK_FILES.map(file => (
                        <div key={file.id} className="flex justify-between items-center bg-slate-700 p-3 rounded-md mb-2">
                            <div>
                                <p className="font-semibold">{file.name}</p>
                                <p className="text-sm text-slate-400">{file.category}</p>
                            </div>
                            <p className="text-cyan-400 font-mono">{(file.size).toFixed(2)} MB</p>
                        </div>
                    ))}
                </div>
                <button onClick={handleClean} className="w-full bg-green-500 text-white font-bold py-3 rounded-lg text-lg hover:bg-green-400 transition-colors">
                    Clean Now
                </button>
            </div>
        )}

        {isCleaned && (
             <div className="bg-slate-800 p-8 rounded-lg animate-fadeIn">
                <div className="text-center mb-8">
                     <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <h2 className="text-2xl font-bold text-green-400">System Cleaned!</h2>
                    <p className="text-slate-300">Removed {(totalJunkSize / 1024).toFixed(2)} GB of junk files.</p>
                </div>
                
                 <div className="bg-slate-700 p-6 rounded-lg">
                     <h3 className="text-xl font-semibold mb-4 flex items-center"><AIIcon /> <span className="ml-2">AI-Powered Optimization Tips</span></h3>
                     {isLoadingTips ? (
                         <p className="text-slate-400">Generating tips...</p>
                     ) : (
                         <ul className="list-disc list-inside text-slate-300 space-y-2">
                             {aiTips.split('\n').map((tip, index) => tip.trim() && <li key={index}>{tip.replace(/^-/, '').trim()}</li>)}
                         </ul>
                     )}
                 </div>
                 <button onClick={handleScan} className="w-full bg-cyan-500 text-white font-bold py-3 rounded-lg text-lg hover:bg-cyan-400 transition-colors mt-6">
                    Scan Again
                </button>
             </div>
        )}
    </div>
  )
}

export default JunkClean;
