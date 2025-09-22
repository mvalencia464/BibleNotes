import React from 'react';
import Icon from '../components/Icon';

interface HomeScreenProps {
    onGoToSettings: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onGoToSettings }) => {
    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
            <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
                <div className="flex items-center p-4 pb-2 justify-between">
                    <div className="w-12"></div>
                    <h1 className="flex-1 text-center text-lg font-bold text-gray-900 dark:text-white">Home</h1>
                    <div className="flex w-12 items-center justify-end">
                        <button onClick={onGoToSettings} className="flex h-12 w-12 items-center justify-center rounded-full text-gray-600 dark:text-gray-300 hover:bg-primary/10 dark:hover:bg-primary/20">
                            <Icon name="settings" />
                        </button>
                    </div>
                </div>
            </header>
            <main className="p-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Welcome back, Ethan</h2>
                <section className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Daily Reading</h3>
                    <div className="flex items-stretch justify-between gap-4 rounded-lg bg-white dark:bg-slate-800 p-4 shadow-sm">
                        <div className="flex flex-col gap-1 flex-1">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Psalm 23</p>
                            <p className="text-base font-bold text-gray-900 dark:text-white">The Lord is my shepherd...</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">A psalm of David.</p>
                        </div>
                        <div className="w-24 h-24 bg-primary/20 rounded-lg flex items-center justify-center">
                            <Icon name="auto_stories" className="text-primary text-3xl" />
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default HomeScreen;