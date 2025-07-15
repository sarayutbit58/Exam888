
import React, { useRef } from 'react';
import type { ExamResult, Domain } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


interface DashboardProps {
  onStartExam: () => void;
  onStartStudyConfig: () => void;
  onStartFlashcardConfig: () => void;
  onStartWeakestDomainStudy: () => void;
  examHistory: ExamResult[];
  onViewResult: (result: ExamResult) => void;
  onImportHistory: (history: ExamResult[]) => void;
}

const IconBook = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 text-cyan-400"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
);
const IconPlay = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
);
const IconUpload = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
);
const IconDownload = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
);
const IconBrain = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2"><path d="M12 2a9.5 9.5 0 0 0-3.57 18.26a.5.5 0 0 1-.43.64H6.5a2.5 2.5 0 0 1-2.5-2.5V17a4.5 4.5 0 0 1 4.5-4.5h0A4.5 4.5 0 0 1 13 17v1.5a2.5 2.5 0 0 1 0 5h0a2.5 2.5 0 0 1 2.5-2.5V17A4.5 4.5 0 0 1 20 12.5h0A4.5 4.5 0 0 1 15.5 8H12a2.5 2.5 0 0 0-2.5-2.5V2"/><path d="M12 2v5.5"/><path d="m15.5 8-3-2.5"/><path d="m8.5 8 3-2.5"/></svg>
);
const IconLayers = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
);
const IconCrosshair = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2"><circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/></svg>
);


const HistoryChart: React.FC<{ history: ExamResult[] }> = ({ history }) => {
    if (history.length < 2) return null;
    const chartData = history.map((result, index) => ({
      name: `Exam ${index + 1}`,
      score: result.score,
      date: new Date(result.date).toLocaleDateString(),
    }));
  
    return (
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">Performance Over Time</h2>
            <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer>
                    <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                        <XAxis dataKey="name" tick={{ fill: '#94a3b8' }} />
                        <YAxis tick={{ fill: '#94a3b8' }} domain={[0, 1000]} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', color: '#cbd5e1' }}
                          labelStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                          formatter={(value, name, props) => [`${value} on ${props.payload.date}`, 'Score']}
                        />
                        <Legend wrapperStyle={{ color: '#cbd5e1' }}/>
                        <Line type="monotone" dataKey="score" stroke="#22d3ee" strokeWidth={2} dot={{ r: 4, fill: '#22d3ee' }} activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
      </div>
    );
};

const domainColors: { [key: string]: string } = {
    "Security Principles": "#8884d8",
    "Business Continuity (BC), Disaster Recovery (DR) & Incident Response Concepts": "#82ca9d",
    "Access Controls Concepts": "#ffc658",
    "Network Security": "#ff7300",
    "Security Operations": "#00C49F",
};
  
const DomainPerformanceChart: React.FC<{ history: ExamResult[] }> = ({ history }) => {
    if (history.length < 2) return null;

    const allDomains = Object.keys(domainColors);

    const chartData = history.map((result, index) => {
        const examData: { [key: string]: string | number | undefined } = {
            name: `Exam ${index + 1}`,
        };
        allDomains.forEach(domain => {
            const domainScore = result.domainScores.find(ds => ds.domain === domain);
            examData[domain] = domainScore ? domainScore.score : undefined;
        });
        return examData;
    });

    return (
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">Domain Performance Over Time</h2>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                        <XAxis dataKey="name" tick={{ fill: '#94a3b8' }} />
                        <YAxis tick={{ fill: '#94a3b8' }} domain={[0, 100]} unit="%" />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', color: '#cbd5e1' }}
                            labelStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                            formatter={(value: number) => [`${value.toFixed(1)}%`, 'Score']}
                        />
                        <Legend wrapperStyle={{ position: 'relative', bottom: 0, color: '#cbd5e1' }}/>
                        {allDomains.map(domain => (
                            <Line 
                                key={domain} 
                                type="monotone" 
                                dataKey={domain} 
                                name={domain.replace(/ \(.+\)/, '').replace('Concepts', '')}
                                stroke={domainColors[domain] || '#ffffff'} 
                                strokeWidth={2} 
                                connectNulls
                                dot={{ r: 4 }}
                                activeDot={{ r: 8 }}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

const Dashboard: React.FC<DashboardProps> = ({ onStartExam, onStartStudyConfig, onStartFlashcardConfig, onStartWeakestDomainStudy, examHistory, onViewResult, onImportHistory }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExport = () => {
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
          JSON.stringify(examHistory)
        )}`;
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = `isc2-cc-exam-history-${new Date().toISOString()}.json`;
        link.click();
      };
    
      const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              const text = e.target?.result;
              if (typeof text === 'string') {
                const importedHistory = JSON.parse(text);
                // Basic validation
                if (Array.isArray(importedHistory)) {
                    onImportHistory(importedHistory);
                    alert('History imported successfully!');
                } else {
                    alert('Invalid history file format.');
                }
              }
            } catch (error) {
              console.error("Error importing history:", error);
              alert("Failed to import history. The file might be corrupted.");
            }
          };
          reader.readAsText(file);
        }
      };
      
      const stats = {
          totalExams: examHistory.length,
          averageScore: examHistory.length > 0 ? Math.round(examHistory.reduce((acc, r) => acc + r.score, 0) / examHistory.length) : 0,
          bestScore: examHistory.length > 0 ? Math.max(...examHistory.map(r => r.score)) : 0,
      };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-6xl mx-auto">
        <header className="text-center mb-10">
            <div className="flex justify-center items-center gap-4 mb-4">
                <IconBook />
                <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">ISC2 CC Exam Simulator</h1>
            </div>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Your personal hub for ISC2 Certified in Cybersecurity exam preparation.
          </p>
        </header>

        <HistoryChart history={examHistory} />
        <DomainPerformanceChart history={examHistory} />


        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-slate-800/50 p-8 rounded-2xl border border-slate-700 flex flex-col justify-center">
            <h2 className="text-2xl font-semibold text-white mb-6">Start a New Session</h2>
            <div className='w-full space-y-4'>
                <button
                    onClick={onStartExam}
                    className="w-full flex items-center justify-center bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-900"
                >
                    <IconPlay/>
                    Full Exam Mode
                </button>
                <button
                    onClick={onStartStudyConfig}
                    className="w-full flex items-center justify-center bg-transparent hover:bg-cyan-500/10 border-2 border-cyan-500 text-cyan-400 font-bold py-3 px-6 rounded-lg transition-colors active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-900"
                >
                    <IconBrain />
                    Advanced Study
                </button>
                 <button
                    onClick={onStartFlashcardConfig}
                    className="w-full flex items-center justify-center bg-transparent hover:bg-violet-500/10 border-2 border-violet-500 text-violet-400 font-bold py-3 px-6 rounded-lg transition-colors active:scale-95 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:ring-offset-2 focus:ring-offset-slate-900"
                >
                    <IconLayers />
                    Flashcard Review
                </button>
                <button
                    onClick={onStartWeakestDomainStudy}
                    disabled={examHistory.length === 0}
                    className="w-full flex items-center justify-center bg-transparent hover:bg-amber-500/10 border-2 border-amber-500 text-amber-400 font-bold py-3 px-6 rounded-lg transition-colors active:scale-95 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <IconCrosshair />
                    Review Weakest Domain
                </button>
            </div>
            <div className="flex gap-4 mt-8 justify-center">
                <button
                    onClick={handleExport}
                    disabled={examHistory.length === 0}
                    className="flex items-center justify-center text-sm bg-slate-700 hover:bg-slate-600 active:bg-slate-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-slate-300 font-medium py-2 px-4 rounded-md transition-colors"
                >
                    <IconDownload/>
                    Export
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImport}
                    className="hidden"
                    accept=".json"
                />
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center text-sm bg-slate-700 hover:bg-slate-600 active:bg-slate-500 text-slate-300 font-medium py-2 px-4 rounded-md transition-colors"
                >
                    <IconUpload/>
                    Import
                </button>
            </div>
          </div>

          <div className="lg:col-span-2 bg-slate-800/50 p-8 rounded-2xl border border-slate-700">
            <h2 className="text-2xl font-semibold text-white mb-4">Exam History</h2>
            {examHistory.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-slate-400">No completed exams yet.</p>
                    <p className="text-slate-500 text-sm mt-2">Your results will appear here after you complete an exam.</p>
                </div>
            ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6 text-center">
                    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                        <p className="text-sm text-slate-400">Exams Taken</p>
                        <p className="text-2xl font-bold text-white">{stats.totalExams}</p>
                    </div>
                    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                        <p className="text-sm text-slate-400">Average Score</p>
                        <p className="text-2xl font-bold text-white">{stats.averageScore}</p>
                    </div>
                    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                        <p className="text-sm text-slate-400">Best Score</p>
                        <p className={`text-2xl font-bold ${stats.bestScore >= 700 ? 'text-green-400' : 'text-red-400'}`}>{stats.bestScore}</p>
                    </div>
              </div>
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {examHistory.slice().reverse().map((result) => (
                  <div key={result.id} className="bg-slate-800 p-4 rounded-lg flex justify-between items-center border border-slate-700">
                    <div>
                      <p className="font-semibold text-white">{new Date(result.date).toLocaleDateString()}</p>
                      <p className={`text-sm font-bold ${result.score >= 700 ? 'text-green-400' : 'text-red-400'}`}>
                        Score: {result.score} / 1000
                      </p>
                    </div>
                    <button
                      onClick={() => onViewResult(result)}
                      className="bg-slate-700 hover:bg-slate-600 active:bg-slate-500 text-slate-300 font-medium py-2 px-4 rounded-md transition-colors text-sm"
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;