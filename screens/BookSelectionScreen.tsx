
import React from 'react';
import { BIBLE_BOOKS } from '../constants';
import { BibleBook } from '../types';
import Icon from '../components/Icon';

interface BookSelectionScreenProps {
  onSelectBook: (book: BibleBook) => void;
  onBack: () => void;
}

const BookSelectionScreen: React.FC<BookSelectionScreenProps> = ({ onSelectBook, onBack }) => {
    const oldTestament = BIBLE_BOOKS.filter(b => b.testament === 'OT');
    const newTestament = BIBLE_BOOKS.filter(b => b.testament === 'NT');

    const BookButton = ({ book }: { book: BibleBook }) => (
        <button
            onClick={() => onSelectBook(book)}
            className="flex items-center justify-center rounded-lg p-3 aspect-square bg-gray-200 dark:bg-gray-800 hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors"
        >
            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200">{book.abbr}</h3>
        </button>
    );
    
    return (
        <div className="flex flex-col h-full bg-background-light dark:bg-background-dark">
            <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
                <div className="flex items-center p-4">
                    <button onClick={onBack} className="p-2 text-primary -ml-2">
                        <Icon name="arrow_back" />
                    </button>
                    <h1 className="flex-1 text-center text-lg font-bold text-gray-900 dark:text-white">Select a Book</h1>
                    <div className="w-10" />
                </div>
            </header>
            <main className="flex-1 overflow-y-auto">
                <div className="px-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white py-4">Old Testament</h2>
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                        {oldTestament.map(book => <BookButton key={book.name} book={book} />)}
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white py-4 mt-6">New Testament</h2>
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                        {newTestament.map(book => <BookButton key={book.name} book={book} />)}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default BookSelectionScreen;