
import React from 'react';
import Icon from '../components/Icon';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onGetStarted }) => {
  return (
    <div className="relative flex flex-col h-screen justify-between overflow-x-hidden p-6 bg-background-light dark:bg-background-dark text-gray-900 dark:text-white">
      <div className="flex flex-col items-center justify-center flex-grow text-center">
        <div className="bg-primary/20 dark:bg-primary/30 text-primary p-5 rounded-xl inline-block shadow-lg mb-8">
          <svg className="w-16 h-16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        </div>
        <h1 className="text-4xl font-bold">Your Daily Bread</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">Find clarity and peace in scripture.</p>
      </div>
      <div className="flex-shrink-0">
        <div className="flex justify-center items-center space-x-6 text-gray-500 dark:text-gray-400 mb-8">
          <div className="flex flex-col items-center space-y-1">
            <Icon name="edit_note" className="text-2xl" />
            <span className="text-xs font-medium">Notes</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <Icon name="event" className="text-2xl" />
            <span className="text-xs font-medium">Plans</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <Icon name="headphones" className="text-2xl" />
            <span className="text-xs font-medium">Audio</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <Icon name="cloud_off" className="text-2xl" />
            <span className="text-xs font-medium">Offline</span>
          </div>
        </div>
        <div className="px-6 py-6">
          <button onClick={onGetStarted} className="w-full bg-primary text-white font-bold py-4 px-5 rounded-xl shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all duration-300 transform hover:scale-105">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;