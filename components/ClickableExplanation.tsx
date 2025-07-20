import React from 'react';

interface ClickableExplanationProps {
  explanation: string;
  keywords: string[];
  onKeywordClick: (keyword: string) => void;
}

const ClickableExplanation: React.FC<ClickableExplanationProps> = ({ explanation, keywords, onKeywordClick }) => {
    // Create a regex that finds any of the keywords, case-insensitively.
    // We filter out short/common keywords to avoid too many buttons.
    const filteredKeywords = keywords.filter(k => k.length > 3 && !['this', 'that', 'with', 'from'].includes(k.toLowerCase()));
    if (filteredKeywords.length === 0) {
        return <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{explanation}</p>;
    }

    const regex = new RegExp(`\\b(${filteredKeywords.join('|')})\\b`, 'gi');
    const parts = explanation.split(regex);

    return (
        <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
            {parts.map((part, index) => {
                const isKeyword = regex.test(part) && filteredKeywords.some(k => k.toLowerCase() === part.toLowerCase());
                if (isKeyword) {
                    return (
                        <button
                            key={index}
                            onClick={() => onKeywordClick(part)}
                            className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 font-semibold px-1.5 py-0.5 rounded-md transition-colors mx-0.5 border border-cyan-500/20"
                        >
                            {part}
                        </button>
                    );
                }
                return <span key={index}>{part}</span>;
            })}
        </p>
    );
};

export default ClickableExplanation;