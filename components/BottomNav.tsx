
import React from 'react';
import { Screen } from '../types';
import { NAV_ITEMS } from '../constants';
import Icon from './Icon';

interface BottomNavProps {
  activeScreen: Screen;
  setScreen: (screen: Screen) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, setScreen }) => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-sm border-t border-gray-200/20 dark:border-gray-700/50 z-50">
      <nav className="flex justify-around items-center px-4 pt-2 pb-3">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setScreen(item.id)}
            className={`flex flex-col items-center justify-end gap-1 transition-colors ${
              activeScreen === item.id ? 'text-primary' : 'text-gray-500 dark:text-gray-400 hover:text-primary'
            }`}
          >
            <Icon name={item.icon} />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </footer>
  );
};

export default BottomNav;