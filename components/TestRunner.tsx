import React, { useState, useEffect } from 'react';
import { runAllTests, TestResult } from '../services/examService.test';

const IconCheckCircle = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-green-500 dark:text-green-400 mr-3 flex-shrink-0"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const IconXCircle = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-red-500 dark:text-red-400 mr-3 flex-shrink-0"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>;
const IconLoader = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 animate-spin mr-3"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>;

const TestRunner: React.FC = () => {
    const [results, setResults] = useState<TestResult[]>([]);
    const [isRunning, setIsRunning] = useState(true);

    useEffect(() => {
        // Run tests on component mount
        const testResults = runAllTests();
        setResults(testResults);
        setIsRunning(false);
    }, []);

    const passedCount = results.filter(r => r.passed).length;
    const failedCount = results.filter(r => !r.passed).length;

    const summaryColor = failedCount > 0 ? 'bg-red-500/10 border-red-500' : 'bg-green-500/10 border-green-500';
    const summaryText = failedCount > 0 ? `${failedCount} FAILED` : 'All Passed';

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 p-8 font-sans">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Unit Test Results</h1>
                    <p className="text-slate-500 dark:text-slate-400">Running automated tests for application logic.</p>
                </header>

                <div className={`mb-8 p-4 rounded-lg border ${summaryColor} flex justify-between items-center`}>
                    <div className="font-bold text-lg">
                        {isRunning ? 'Running tests...' : `Test Summary: ${passedCount} Passed, ${failedCount} Failed`}
                    </div>
                    <div className={`px-4 py-1 rounded-full text-sm font-semibold ${failedCount > 0 ? 'bg-red-200 dark:bg-red-400 text-red-900 dark:text-black' : 'bg-green-200 dark:bg-green-400 text-green-900 dark:text-black'}`}>
                       {isRunning ? 'IN PROGRESS' : summaryText}
                    </div>
                </div>

                <div className="space-y-4">
                    {isRunning && (
                        <div className="flex items-center justify-center p-8 bg-white dark:bg-slate-800 rounded-lg">
                            <IconLoader />
                            <span className="text-lg text-slate-600 dark:text-slate-300">Executing tests...</span>
                        </div>
                    )}
                    {results.map((result, index) => (
                        <div key={index} className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-slate-700">
                            <div className="flex items-start mb-2">
                                {result.passed ? <IconCheckCircle /> : <IconXCircle />}
                                <h2 className={`font-semibold ${result.passed ? 'text-slate-800 dark:text-slate-100' : 'text-red-600 dark:text-red-300'}`}>{result.name}</h2>
                            </div>
                            {!result.passed && (
                                <div className="bg-gray-50 dark:bg-slate-900 p-3 rounded-md mt-2 ml-9">
                                    <pre className="text-red-600 dark:text-red-300 text-sm whitespace-pre-wrap font-mono">{result.error}</pre>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TestRunner;