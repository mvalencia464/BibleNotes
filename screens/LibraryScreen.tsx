import React, { useState, useEffect } from 'react';
import Icon from '../components/Icon';
import { Screen } from '../types';
import { areSermonsDownloaded } from '../db';

interface LibraryScreenProps {
    onNavigate: (screen: Screen) => void;
}

const LibraryScreen: React.FC<LibraryScreenProps> = ({ onNavigate }) => {
    const [sermonsDownloaded, setSermonsDownloaded] = useState(false);

    useEffect(() => {
        areSermonsDownloaded().then(setSermonsDownloaded);
    }, []);

    const handleSermonClick = () => {
        if (sermonsDownloaded) {
            onNavigate(Screen.Sermons);
        } else {
            alert("Please download Spurgeon's Sermon Notes from the Settings > Downloads screen first.");
            onNavigate(Screen.Settings);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark">
            <header className="sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm z-10">
                <div className="flex items-center p-4">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">Library</h1>
                </div>
            </header>
            <main className="flex-grow overflow-y-auto p-4 space-y-4">
                <button 
                    onClick={handleSermonClick}
                    className="flex w-full items-center gap-4 rounded-lg bg-slate-100 dark:bg-slate-800 p-4 text-left transition-colors hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary dark:bg-primary/30">
                        <Icon name="collections_bookmark" />
                    </div>
                    <div className="flex-1">
                        <p className="font-bold text-zinc-900 dark:text-white">Spurgeon's Sermon Notes</p>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">A collection of sermon notes by Charles H. Spurgeon.</p>
                    </div>
                    <Icon name="arrow_forward_ios" className="text-slate-400 dark:text-slate-500" />
                </button>
            </main>
        </div>
    );
};

export default LibraryScreen;