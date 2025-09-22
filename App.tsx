import React, { useState, useEffect } from 'react';
import { BibleBook, Screen, Note, SermonCollection } from './types';
import WelcomeScreen from './screens/WelcomeScreen';
import HomeScreen from './screens/HomeScreen';
import BibleReaderScreen from './screens/BibleReaderScreen';
import NotesScreen from './screens/NotesScreen';
import LibraryScreen from './screens/LibraryScreen';
import DownloadsScreen from './screens/DownloadsScreen';
import BottomNav from './components/BottomNav';
import BookSelectionScreen from './screens/BookSelectionScreen';
import ChapterSelectionScreen from './screens/ChapterSelectionScreen';
import useLocalStorage from './hooks/useLocalStorage';
import { getDownloadedVersions, getSermons, areSermonsDownloaded } from './db';
import SearchScreen from './screens/SearchScreen';
import SettingsScreen from './screens/SettingsScreen';
import SermonsScreen from './screens/SermonsScreen';
import { BIBLE_BOOKS } from './constants';

const App: React.FC = () => {
    const [screen, setScreen] = useState<Screen>(Screen.Welcome);
    const [selectedBook, setSelectedBook] = useState<BibleBook | null>(null);
    const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
    const [notes, setNotes] = useLocalStorage<Note[]>('notes', []);
    const [downloadedVersions, setDownloadedVersions] = useState<string[]>([]);
    const [sermonCollection, setSermonCollection] = useState<SermonCollection | null>(null);
    
    const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
        if (typeof window !== 'undefined' && window.localStorage) {
            const theme = localStorage.getItem('color-theme');
            if (theme === 'dark') return true;
            if (theme === 'light') return false;
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return false;
    });

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
        }
    }, [isDarkMode]);

    const checkDownloads = async () => {
        const versions = await getDownloadedVersions();
        setDownloadedVersions(versions);
        const sermons = await getSermons();
        setSermonCollection(sermons ?? null);
    };

    useEffect(() => {
        checkDownloads();
    }, []);

    const handleSetScreen = (newScreen: Screen) => {
        if (newScreen !== screen) {
            setSelectedBook(null);
            setSelectedChapter(null);
        }
        setScreen(newScreen);
    };
    
    const addNote = (note: Omit<Note, 'id' | 'createdAt'>) => {
        const newNote: Note = {
            ...note,
            id: Date.now().toString(),
            createdAt: Date.now(),
        };
        setNotes([...notes, newNote]);
    };

    const updateNote = (updatedNote: Note) => {
        setNotes(notes.map(note => note.id === updatedNote.id ? updatedNote : note));
    };

    const deleteNote = (noteId: string) => {
        setNotes(notes.filter(note => note.id !== noteId));
    };

    const handleNavigateToVerse = (bookName: string, chapter: number) => {
        const book = BIBLE_BOOKS.find(b => b.name === bookName);
        if (book) {
            setSelectedBook(book);
            setSelectedChapter(chapter);
            setScreen(Screen.Bible);
        }
    };
    
    const renderBibleFlow = () => {
        if (selectedBook && selectedChapter) {
            return <BibleReaderScreen 
                book={selectedBook} 
                chapter={selectedChapter} 
                onBack={() => setSelectedChapter(null)}
                notes={notes.filter(n => n.book === selectedBook.name && n.chapter === selectedChapter)}
                onAddNote={addNote}
                onUpdateNote={updateNote}
                downloadedVersions={downloadedVersions}
            />;
        }
        if (selectedBook) {
            return <ChapterSelectionScreen 
                book={selectedBook} 
                onSelectChapter={(ch) => setSelectedChapter(ch)}
                onBack={() => setSelectedBook(null)}
            />;
        }
        return <BookSelectionScreen 
            onSelectBook={(book) => setSelectedBook(book)}
            onBack={() => handleSetScreen(Screen.Home)}
        />;
    }

    const renderScreen = () => {
        switch (screen) {
            case Screen.Home:
                return <HomeScreen onGoToSettings={() => setScreen(Screen.Settings)} />;
            case Screen.Bible:
                return renderBibleFlow();
            case Screen.Notes:
                return <NotesScreen 
                    notes={notes}
                    onUpdateNote={updateNote}
                    onDeleteNote={deleteNote}
                    onGoToBible={() => handleSetScreen(Screen.Bible)}
                />;
            case Screen.Library:
                return <LibraryScreen onNavigate={setScreen} />;
            case Screen.Sermons:
                return <SermonsScreen 
                            sermonCollection={sermonCollection} 
                            onBack={() => setScreen(Screen.Library)} 
                            onRefresh={checkDownloads} />;
            case Screen.Downloads:
                return <DownloadsScreen 
                    downloadedVersions={downloadedVersions}
                    onDownloadsChanged={checkDownloads}
                />;
            case Screen.Settings:
                return <SettingsScreen 
                    onNavigate={setScreen}
                    onBack={() => setScreen(Screen.Home)}
                />;
            case Screen.Search:
                return <SearchScreen onNavigate={handleNavigateToVerse} />;
            case Screen.Welcome:
            default:
                return <WelcomeScreen onGetStarted={() => handleSetScreen(Screen.Home)} />;
        }
    };

    if (screen === Screen.Welcome) {
        return <WelcomeScreen onGetStarted={() => handleSetScreen(Screen.Home)} />;
    }

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow pb-20">{renderScreen()}</main>
            <BottomNav activeScreen={screen} setScreen={handleSetScreen} />
        </div>
    );
};

export default App;