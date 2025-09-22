import React, { useState, useMemo } from 'react';
import { Sermon, SermonCollection } from '../types';
import Icon from '../components/Icon';

interface SermonsScreenProps {
    sermonCollection: SermonCollection | null;
    onBack: () => void;
    onRefresh: () => void;
}

const SermonContent: React.FC<{ content: string }> = ({ content }) => {
    const cleanedContent = content
        .replace(/_Charles Hadden Spurgeon_[\s\S]*$/, '')
        .replace(/\[Continue.*?\]/g, '')
        .trim();

    const createMarkup = (text: string) => {
        const html = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/_(.*?)_/g, '<em>$1</em>')
            .replace(/ /g, ' '); // Replace non-breaking spaces
        return { __html: html };
    };
    
    return (
        <div className="space-y-4">
            {cleanedContent.split('\n\n').map((paragraph, index) => (
                <p key={index} dangerouslySetInnerHTML={createMarkup(paragraph)} />
            ))}
        </div>
    );
};

const SermonReader: React.FC<{ sermon: Sermon, onBack: () => void }> = ({ sermon, onBack }) => {
    return (
        <div className="absolute inset-0 bg-background-light dark:bg-background-dark z-20 flex flex-col">
            <header className="sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm z-10 border-b border-slate-200/50 dark:border-slate-800/50">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-800/50">
                            <Icon name="arrow_back" className="text-slate-600 dark:text-slate-400" />
                        </button>
                        <h1 className="text-lg font-bold text-gray-900 dark:text-white truncate px-2">{sermon.title}</h1>
                        <div className="w-10"></div>
                    </div>
                </div>
            </header>
            <main className="flex-grow overflow-y-auto p-6 text-lg leading-relaxed text-gray-800 dark:text-gray-200 font-newsreader">
                <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{sermon.full_title}</h2>
                <p className="italic text-gray-600 dark:text-gray-400 mb-6">{sermon.biblical_reference}</p>
                <SermonContent content={sermon.content} />
            </main>
        </div>
    );
};


const SermonsScreen: React.FC<SermonsScreenProps> = ({ sermonCollection, onBack, onRefresh }) => {
    const [selectedSermon, setSelectedSermon] = useState<Sermon | null>(null);

    const groupedSermons = useMemo(() => {
        if (!sermonCollection) return {};
        return sermonCollection.sermons.reduce((acc, sermon) => {
            const book = sermon.biblical_book || 'Other';
            if (!acc[book]) {
                acc[book] = [];
            }
            acc[book].push(sermon);
            return acc;
        }, {} as Record<string, Sermon[]>);
    }, [sermonCollection]);

    if (!sermonCollection) {
        return (
             <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark">
                <header className="sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm z-10">
                    <div className="flex items-center p-4">
                        <button onClick={onBack} className="p-2 -ml-2">
                            <Icon name="arrow_back" className="text-gray-800 dark:text-gray-200" />
                        </button>
                        <h1 className="text-xl font-bold text-center flex-1 text-gray-900 dark:text-white pr-8">Sermon Notes</h1>
                    </div>
                </header>
                <main className="flex-grow flex flex-col items-center justify-center text-center p-4">
                    <Icon name="cloud_off" className="text-6xl text-slate-300 dark:text-slate-600 mx-auto" />
                    <h3 className="mt-4 text-xl font-bold text-slate-700 dark:text-slate-200">Notes Not Downloaded</h3>
                    <p className="mt-2 text-slate-500 dark:text-slate-400">Please go to Settings &gt; Downloads to get the sermon notes for offline access.</p>
                </main>
            </div>
        );
    }
    
    if (selectedSermon) {
        return <SermonReader sermon={selectedSermon} onBack={() => setSelectedSermon(null)} />;
    }

    const bookOrder = Object.keys(groupedSermons).sort();

    return (
        <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark">
            <header className="sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm z-10">
                <div className="flex items-center p-4">
                    <button onClick={onBack} className="p-2 -ml-2">
                        <Icon name="arrow_back" className="text-gray-800 dark:text-gray-200" />
                    </button>
                    <h1 className="text-xl font-bold text-center flex-1 text-gray-900 dark:text-white pr-8">Spurgeon's Sermon Notes</h1>
                </div>
            </header>
            <main className="flex-grow overflow-y-auto p-4 space-y-4">
                {bookOrder.map(bookName => (
                    <div key={bookName}>
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2 pl-2">{bookName}</h2>
                        <ul className="divide-y divide-gray-200/20 dark:divide-gray-700/50">
                            {groupedSermons[bookName].map(sermon => (
                                <li key={sermon.sermon_number}>
                                    <button onClick={() => setSelectedSermon(sermon)} className="w-full flex items-center gap-4 py-3 px-2 text-left hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-lg">
                                        <div className="flex-grow">
                                            <p className="font-semibold text-gray-900 dark:text-white">{sermon.title}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{sermon.full_title}</p>
                                        </div>
                                        <Icon name="arrow_forward_ios" className="text-slate-400 dark:text-slate-500 text-sm" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </main>
        </div>
    );
};

export default SermonsScreen;