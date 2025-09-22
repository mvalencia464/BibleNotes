import React, { useState, useEffect, useMemo } from 'react';
import Icon from '../components/Icon';
import { BibleBook, ApiVerse, Note, BibleChapter } from '../types';
import NoteEditor from '../components/NoteEditor';
import { getBibleBook } from '../db';
import { AVAILABLE_TRANSLATIONS } from '../constants';

interface BibleReaderScreenProps {
    book: BibleBook;
    chapter: number;
    notes: Note[];
    downloadedVersions: string[];
    onBack: () => void;
    onAddNote: (note: Omit<Note, 'id' | 'createdAt'>) => void;
    onUpdateNote: (note: Note) => void;
}

const BibleReaderScreen: React.FC<BibleReaderScreenProps> = ({ book, chapter, notes, downloadedVersions, onBack, onAddNote, onUpdateNote }) => {
    const [verses, setVerses] = useState<ApiVerse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [editingNote, setEditingNote] = useState<{ verse: ApiVerse, note?: Note } | null>(null);
    const [selectedTranslation, setSelectedTranslation] = useState('web');

    const notesByVerse = useMemo(() => {
        return notes.reduce((acc, note) => {
            acc[note.verse] = note;
            return acc;
        }, {} as { [key: number]: Note });
    }, [notes]);

    useEffect(() => {
        const fetchChapter = async () => {
            setLoading(true);
            setError(null);
            setVerses([]);
            try {
                // If a downloaded version is selected, try to get it from DB
                if (downloadedVersions.includes(selectedTranslation)) {
                    const offlineBookData = await getBibleBook(selectedTranslation, book.name);
                    if (offlineBookData) {
                        const chapterData = offlineBookData.chapters.find((ch: BibleChapter) => ch.chapter === chapter);
                        if (chapterData) {
                            setVerses(chapterData.verses);
                            return; // Exit here, data is loaded from DB
                        } else {
                           throw new Error(`Chapter ${chapter} not found in offline data.`);
                        }
                    }
                }
                
                // Fallback to online API
                const bookNameForApi = book.name.replace(/\s/g, '');
                const response = await fetch(`https://bible-api.com/${bookNameForApi}+${chapter}?translation=${selectedTranslation}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch chapter data. Please check your connection.');
                }
                const data = await response.json();
                if (data.error) {
                    throw new Error(data.error);
                }
                setVerses(data.verses);
            } catch (err: any) {
                setError(err.message || 'An unexpected error occurred.');
            } finally {
                setLoading(false);
            }
        };

        fetchChapter();
    }, [book, chapter, selectedTranslation, downloadedVersions]);
    
    const handleVerseClick = (verse: ApiVerse) => {
        const existingNote = notesByVerse[verse.verse];
        setEditingNote({ verse, note: existingNote });
    };

    const handleSaveNote = (content: string, id?: string) => {
        if (editingNote) {
            if (id) {
                // Editing existing note
                const updatedNote = { ...notesByVerse[editingNote.verse.verse], content };
                onUpdateNote(updatedNote);
            } else {
                // Adding new note
                onAddNote({
                    book: book.name,
                    chapter: chapter,
                    verse: editingNote.verse.verse,
                    content: content,
                });
            }
        }
        setEditingNote(null);
    };

    return (
        <div className="flex flex-col h-full bg-background-light dark:bg-background-dark">
            <header className="sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm z-10 border-b border-slate-200/50 dark:border-slate-800/50">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-800/50">
                            <Icon name="arrow_back" className="text-slate-600 dark:text-slate-400" />
                        </button>
                        <h1 className="text-lg font-bold text-gray-900 dark:text-white">{book.name} {chapter}</h1>
                         <div className="relative">
                            <select 
                                value={selectedTranslation}
                                onChange={e => setSelectedTranslation(e.target.value)}
                                className="pl-3 pr-8 py-1.5 text-sm font-semibold rounded-md appearance-none bg-slate-200/60 dark:bg-slate-800/60 border-transparent focus:border-primary focus:ring-primary text-gray-800 dark:text-gray-200"
                            >
                                {AVAILABLE_TRANSLATIONS.map(t => (
                                     <option key={t.id} value={t.id}>
                                        {t.name} {downloadedVersions.includes(t.id) ? '✓' : ''}
                                    </option>
                                ))}
                            </select>
                            <Icon name="arrow_drop_down" className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-slate-500" />
                        </div>
                    </div>
                </div>
            </header>
            <main className="flex-grow container mx-auto px-6 py-8">
                {loading && (
                    <div className="text-center py-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                        <p className="text-gray-500 dark:text-gray-400 mt-4">Loading...</p>
                    </div>
                )}
                {error && (
                    <div className="text-center py-10 px-4">
                        <p className="text-red-500 bg-red-100 dark:bg-red-900/30 rounded-lg p-4">
                            <strong>Error:</strong> {error}
                        </p>
                    </div>
                )}
                {!loading && !error && (
                     <div className="text-lg leading-relaxed text-gray-800 dark:text-gray-200 font-newsreader">
                        <p>
                        {verses.map((verse) => (
                           <span key={verse.verse} onClick={() => handleVerseClick(verse)} className="cursor-pointer hover:bg-primary/10 rounded-md">
                             <sup className="verse-number select-none">{verse.verse}</sup>
                             {verse.text.trim().replace(/\n/g, ' ')}
                             {notesByVerse[verse.verse] && <Icon name="edit_note" className="text-primary/50 text-sm align-middle mx-1" />}
                             {' '}
                           </span>
                        ))}
                        </p>
                     </div>
                )}
            </main>
            {editingNote && (
                <NoteEditor 
                    book={book.name}
                    chapter={chapter}
                    verse={editingNote.verse.verse}
                    existingNote={editingNote.note}
                    onSave={handleSaveNote}
                    onCancel={() => setEditingNote(null)}
                />
            )}
        </div>
    );
};

export default BibleReaderScreen;