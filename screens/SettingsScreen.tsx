import React from 'react';
import Icon from '../components/Icon';
import { Screen } from '../types';

interface SettingsScreenProps {
    onBack: () => void;
    onNavigate: (screen: Screen) => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack, onNavigate }) => {
    
    const SettingsItem: React.FC<{icon: string, title: string, description: string, onClick: () => void}> = ({ icon, title, description, onClick }) => (
        <button onClick={onClick} className="flex w-full items-center gap-4 rounded-lg bg-slate-100 dark:bg-slate-800 p-4 text-left transition-colors hover:bg-slate-200 dark:hover:bg-slate-700">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary dark:bg-primary/30">
                <Icon name={icon} />
            </div>
            <div className="flex-1">
                <p className="font-bold text-zinc-900 dark:text-white">{title}</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
            </div>
            <Icon name="arrow_forward_ios" className="text-slate-400 dark:text-slate-500" />
        </button>
    );

    return (
        <div className="relative flex h-screen w-full flex-col bg-background-light dark:bg-background-dark">
            <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
                <div className="flex items-center justify-between px-4 pt-4 pb-2">
                    <div className="w-12">
                         <button onClick={onBack} className="flex h-12 w-12 items-center justify-center rounded-full text-gray-600 dark:text-gray-300 hover:bg-primary/10 dark:hover:bg-primary/20">
                            <Icon name="arrow_back" />
                        </button>
                    </div>
                    <h1 className="flex-1 text-center text-xl font-bold text-slate-900 dark:text-white">Settings</h1>
                    <div className="w-12"></div>
                </div>
            </header>
            <main className="flex-1 overflow-y-auto p-4">
                <div className="space-y-2">
                    <SettingsItem 
                        icon="download_for_offline"
                        title="Manage Offline Downloads"
                        description="Download or remove Bible translations for offline use."
                        onClick={() => onNavigate(Screen.Downloads)}
                    />
                </div>
            </main>
        </div>
    );
};

export default SettingsScreen;