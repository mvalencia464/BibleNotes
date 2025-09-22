
import React from 'react';
import { BibleBook } from '../types';
import Icon from '../components/Icon';

interface ChapterSelectionScreenProps {
  book: BibleBook;
  onSelectChapter: (chapter: number) => void;
  onBack: () => void;
}

const ChapterSelectionScreen: React.FC<ChapterSelectionScreenProps> = ({ book, onSelectChapter, onBack }) => {
    const chapters = Array.from({ length: book.chapters }, (_, i) => i + 1);

    const ChapterButton = ({ chapter }: { chapter: number }) => (
        <button
            onClick={() => onSelectChapter(chapter)}
            className="flex items-center justify-center rounded-lg p-3 aspect-square bg-gray-200 dark:bg-gray-800 hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors"
        >
            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200">{chapter}</h3>
        </button>
    );

    return (
        <div className="flex flex-col h-full bg-background-light dark:bg-background-dark">
            <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
                <div className="flex items-center p-4">
                    <button onClick={onBack} className="p-2 text-primary -ml-2">
                        <Icon name="arrow_back" />
                    </button>
                    <h1 className="flex-1 text-center text-lg font-bold text-gray-900 dark:text-white">{book.name}</h1>
                    <div className="w-10" />
                </div>
            </header>
            <main className="flex-1 overflow-y-auto">
                <div className="px-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white py-4">Select a Chapter</h2>
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                        {chapters.map(ch => <ChapterButton key={ch} chapter={ch} />)}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ChapterSelectionScreen;