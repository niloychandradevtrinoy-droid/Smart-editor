
import React, { useState, useEffect } from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

const RamBoost: React.FC = () => {
  const [ramUsage, setRamUsage] = useState(78);
  const [isBoosting, setIsBoosting] = useState(false);
  const [isBoosted, setIsBoosted] = useState(false);

  const data = [{ name: 'RAM', value: ramUsage }];

  const handleBoost = () => {
    setIsBoosting(true);
    setIsBoosted(false);
    setTimeout(() => {
      const newRamUsage = Math.floor(ramUsage * 0.5) + Math.floor(Math.random() * 5);
      setRamUsage(newRamUsage);
      setIsBoosting(false);
      setIsBoosted(true);
    }, 2000);
  };

  useEffect(() => {
    if(isBoosted){
        const timer = setTimeout(() => setIsBoosted(false), 3000);
        return () => clearTimeout(timer);
    }
  }, [isBoosted])


  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">RAM Boost</h1>
      <div className="bg-slate-800 p-8 rounded-lg flex flex-col items-center">
        <h2 className="text-2xl font-semibold mb-4">Current RAM Usage</h2>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <RadialBarChart
              innerRadius="70%"
              outerRadius="90%"
              data={data}
              startAngle={90}
              endAngle={-270}
              barSize={30}
            >
              <PolarAngleAxis
                type="number"
                domain={[0, 100]}
                angleAxisId={0}
                tick={false}
              />
              <RadialBar
                background
                dataKey="value"
                cornerRadius={15}
                className="fill-cyan-500 transition-all duration-1000"
              />
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-5xl font-bold fill-white"
              >
                {`${ramUsage}%`}
              </text>
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
        
        {isBoosted && (
             <p className="text-green-400 font-semibold mb-6 text-lg">RAM Boosted Successfully!</p>
        )}

        <button 
          onClick={handleBoost} 
          disabled={isBoosting}
          className="bg-cyan-500 text-white font-bold py-4 px-10 rounded-full text-lg shadow-lg hover:bg-cyan-400 transition-all duration-300 transform hover:scale-105 disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center"
        >
          {isBoosting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Boosting...
            </>
          ) : (
             'Boost RAM'
          )}
        </button>
      </div>
    </div>
  );
};

export default RamBoost;
