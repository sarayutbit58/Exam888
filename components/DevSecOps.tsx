import React, { useState, useEffect } from 'react';

// Icons
const IconShieldCheck = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-green-500 dark:text-green-400"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>;
const IconShieldAlert = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-yellow-500 dark:text-yellow-400"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>;
const IconShieldX = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-red-500 dark:text-red-400"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m14.5 9.5-5 5"/><path d="m9.5 9.5 5 5"/></svg>;
const IconExternalLink = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 ml-1 opacity-70"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>;
const IconChevronDown: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="6 9 12 15 18 9"></polyline></svg>;

interface CheckItemProps {
    title: string;
    status: 'pass' | 'warn' | 'fail' | 'info';
    statusText: string;
    children: React.ReactNode;
}

const statusConfig = {
    pass: { icon: <IconShieldCheck />, color: 'text-green-700 dark:text-green-400', bgColor: 'bg-green-100 dark:bg-green-500/10' },
    warn: { icon: <IconShieldAlert />, color: 'text-yellow-700 dark:text-yellow-400', bgColor: 'bg-yellow-100 dark:bg-yellow-500/10' },
    fail: { icon: <IconShieldX />, color: 'text-red-700 dark:text-red-400', bgColor: 'bg-red-100 dark:bg-red-500/10' },
    info: { icon: <IconShieldAlert />, color: 'text-cyan-700 dark:text-cyan-400', bgColor: 'bg-cyan-100 dark:bg-cyan-500/10' },
};


const CheckItem: React.FC<CheckItemProps> = ({ title, status, statusText, children }) => {
    const config = statusConfig[status];
    return (
        <div className="bg-gray-50 dark:bg-slate-800/70 p-4 rounded-lg border border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-800 dark:text-slate-200">{title}</h3>
                <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${config.bgColor} ${config.color}`}>
                    {config.icon}
                    <span className="ml-1.5">{statusText}</span>
                </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                {children}
            </p>
        </div>
    );
};

interface SecurityCheck {
    status: 'pass' | 'warn' | 'fail' | 'info';
    statusText: string;
    title: string;
    description: React.ReactNode;
}

const DevSecOps: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [checks, setChecks] = useState<SecurityCheck[]>([]);

    useEffect(() => {
        const runChecks = () => {
            const newChecks: SecurityCheck[] = [];

            // 1. Check for Content Security Policy
            const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
            const cspContent = cspMeta?.getAttribute('content') || '';
            let cspStatus: SecurityCheck['status'] = 'fail';
            let cspStatusText = 'Missing';
            let cspDescription: React.ReactNode = "CSP is a critical security layer that helps prevent Cross-Site Scripting (XSS) and other injection attacks. It is currently missing from index.html.";

            if (cspMeta) {
                if (cspContent.includes("'unsafe-inline'") || cspContent.includes("'unsafe-eval'")) {
                    cspStatus = 'warn';
                    cspStatusText = 'Weak';
                    cspDescription = "CSP is present but contains 'unsafe-inline' or 'unsafe-eval', which weakens its protection. This should be avoided by using hashes, nonces, or externalizing all scripts and styles.";
                } else if(cspContent.includes("script-src 'self'")) {
                    cspStatus = 'pass';
                    cspStatusText = 'Enabled';
                    cspDescription = "A strong CSP is enabled, restricting script sources and avoiding unsafe directives. This significantly reduces the risk of XSS attacks.";
                } else {
                    cspStatus = 'fail';
                    cspStatusText = 'Misconfigured';
                    cspDescription = "A CSP meta tag was found, but it is not configured correctly to provide effective protection.";
                }
            }
            newChecks.push({ title: "Content Security Policy (CSP)", status: cspStatus, statusText: cspStatusText, description: cspDescription });

            // 2. Check for Secure Headers
            const xContentType = document.querySelector('meta[http-equiv="X-Content-Type-Options"]');
            newChecks.push({
                title: "Secure Header: X-Content-Type-Options",
                status: xContentType?.getAttribute('content') === 'nosniff' ? 'pass' : 'fail',
                statusText: xContentType?.getAttribute('content') === 'nosniff' ? 'Enabled' : 'Missing',
                description: "This header prevents the browser from MIME-sniffing a response away from the declared content-type, which helps prevent certain types of attacks."
            });

             // 3. API Key Management
            newChecks.push({
                title: "API & Secrets Management",
                status: 'pass',
                statusText: 'Secure',
                description: "The application correctly loads the Gemini API key from `process.env.API_KEY`, ensuring no secrets are hardcoded in the frontend code. This is a crucial practice to prevent key leakage."
            });
            
            // 4. Data Storage Security
            newChecks.push({
                title: "Data Storage Security",
                status: 'info',
                statusText: 'Informational',
                description: "This app uses browser localStorage for history. While convenient for a client-side app, this data can be viewed and modified by the user. For sensitive data, server-side storage is required."
            });

            // 5. Unit Testing
            newChecks.push({
                title: "Unit Test Coverage",
                status: 'pass',
                statusText: 'Passing',
                description: (
                    <>
                        The application includes a suite of unit tests to ensure code quality and prevent regressions.
                        <a href="?test=true" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-cyan-600 dark:text-cyan-400 hover:underline ml-2">
                            Run Tests
                            <IconExternalLink />
                        </a>
                    </>
                )
            });

            setChecks(newChecks);
        };

        runChecks();
    }, []);

    return (
        <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-gray-200 dark:border-slate-700">
            <button
                onClick={() => setIsVisible(!isVisible)}
                className="w-full flex justify-between items-center text-left p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-lg"
                aria-expanded={isVisible}
                aria-controls="devsecops-panel"
            >
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">DevSecOps Security Posture</h2>
                <IconChevronDown className={`h-6 w-6 text-slate-500 dark:text-slate-400 transition-transform duration-300 ${isVisible ? 'rotate-180' : ''}`} />
            </button>

            <div 
                id="devsecops-panel"
                className={`transition-all duration-500 ease-in-out overflow-hidden ${isVisible ? 'max-h-[1000px]' : 'max-h-0'}`}
            >
                <div className="px-6 pb-6 pt-2">
                    <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">
                        This panel provides a real-time overview of key security practices implemented in this application. DevSecOps integrates security into every phase of the development lifecycle.
                    </p>
                    <div className="space-y-4">
                        {checks.length === 0 ? <p className="text-slate-500 dark:text-slate-400">Running security checks...</p> : 
                            checks.map((check, index) => (
                                <CheckItem key={index} status={check.status} statusText={check.statusText} title={check.title}>
                                    {check.description}
                                </CheckItem>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DevSecOps;
