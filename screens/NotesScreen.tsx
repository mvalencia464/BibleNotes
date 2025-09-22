import React, { useState, useMemo } from 'react';
import { Note } from '../types';
import Icon from '../components/Icon';
import NoteEditor from '../components/NoteEditor';

interface NotesScreenProps {
    notes: Note[];
    onUpdateNote: (note: Note) => void;
    onDeleteNote: (id: string) => void;
    onGoToBible: () => void;
}

const NotesScreen: React.FC<NotesScreenProps> = ({ notes, onUpdateNote, onDeleteNote, onGoToBible }) => {
    const [editingNote, setEditingNote] = useState<Note | null>(null);
    const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);

    const groupedNotes = useMemo(() => {
        const sortedNotes = [...notes].sort((a, b) => b.createdAt - a.createdAt);
        return sortedNotes.reduce((acc, note) => {
            const book = note.book;
            if (!acc[book]) acc[book] = {};
            const chapter = note.chapter;
            if (!acc[book][chapter]) acc[book][chapter] = [];
            acc[book][chapter].push(note);
            return acc;
        }, {} as Record<string, Record<number, Note[]>>);
    }, [notes]);

    const handleSaveNote = (content: string, id?: string) => {
        if (editingNote) {
            onUpdateNote({ ...editingNote, content });
        }
        setEditingNote(null);
    };

    const confirmDelete = () => {
        if (noteToDelete) {
            onDeleteNote(noteToDelete.id);
            setNoteToDelete(null);
        }
    }

    const NoteItem: React.FC<{ note: Note }> = ({ note }) => {
        const [menuOpen, setMenuOpen] = useState(false);
        return (
            <div className="group relative rounded-lg bg-slate-100 dark:bg-slate-800/60">
                <div className="p-4">
                    <p className="mb-1 font-bold text-slate-600 dark:text-slate-300">{note.book} {note.chapter}:{note.verse}</p>
                    <p className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap">{note.content}</p>
                </div>
                <div className="absolute right-2 top-2">
                    <button onClick={() => setMenuOpen(!menuOpen)} className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-700">
                        <Icon name="more_vert" className="text-xl" />
                    </button>
                    {menuOpen && (
                         <div onMouseLeave={() => setMenuOpen(false)} className="absolute right-0 mt-2 w-32 origin-top-right rounded-md bg-white dark:bg-slate-900 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                            <div className="py-1">
                                <button onClick={() => { setEditingNote(note); setMenuOpen(false); }} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800">
                                    <Icon name="edit" className="text-base"/> Edit
                                </button>
                                <button onClick={() => { setNoteToDelete(note); setMenuOpen(false); }} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-slate-800">
                                   <Icon name="delete" className="text-base"/> Delete
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
    
    return (
        <div className="relative flex h-screen w-full flex-col bg-background-light dark:bg-background-dark">
            <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
                <div className="flex items-center justify-between px-4 pt-4 pb-2">
                    <div className="w-12"></div>
                    <h1 className="flex-1 text-center text-xl font-bold text-slate-900 dark:text-white">Notes</h1>
                    <div className="w-12"></div>
                </div>
                <div className="px-4 pb-4">
                    <div className="relative">
                        <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                        <input className="w-full rounded-full border-transparent bg-slate-200/60 dark:bg-slate-800/60 py-3 pl-10 pr-4 text-slate-900 placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-500 focus:border-primary focus:ring-primary" placeholder="Search notes" type="search"/>
                    </div>
                </div>
            </header>
            <main className="flex-1 overflow-y-auto">
                {notes.length === 0 ? (
                    <div className="text-center py-20 px-4">
                        <Icon name="edit_note" className="text-6xl text-slate-300 dark:text-slate-600 mx-auto" />
                        <h3 className="mt-4 text-xl font-bold text-slate-700 dark:text-slate-200">No Notes Yet</h3>
                        <p className="mt-2 text-slate-500 dark:text-slate-400">Tap the '+' button to add your first note from the Bible reader.</p>
                    </div>
                ) : (
                    <div className="space-y-8 p-4">
                        {Object.keys(groupedNotes).map(bookName => (
                            <div key={bookName}>
                                <h2 className="mb-3 text-lg font-bold text-slate-900 dark:text-white">{bookName}</h2>
                                <div className="space-y-4">
                                    {Object.keys(groupedNotes[bookName]).map(chapterNum => (
                                        <div key={chapterNum}>
                                            <h3 className="mb-2 pl-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Chapter {chapterNum}</h3>
                                            <div className="space-y-1">
                                                {groupedNotes[bookName][parseInt(chapterNum)].map(note => (
                                                    <NoteItem key={note.id} note={note} />
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
            <button onClick={onGoToBible} className="absolute bottom-24 right-4 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-105 active:scale-95">
                <Icon name="add" className="text-3xl" />
            </button>

            {editingNote && (
                 <NoteEditor 
                    book={editingNote.book}
                    chapter={editingNote.chapter}
                    verse={editingNote.verse}
                    existingNote={editingNote}
                    onSave={handleSaveNote}
                    onCancel={() => setEditingNote(null)}
                />
            )}
            
            {noteToDelete && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                     <div className="bg-background-light dark:bg-background-dark rounded-xl shadow-2xl w-full max-w-sm">
                        <div className="p-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Delete Note?</h2>
                            <p className="text-gray-600 dark:text-gray-300 mt-2">Are you sure you want to permanently delete this note?</p>
                        </div>
                        <div className="bg-slate-100 dark:bg-slate-800/50 px-6 py-4 rounded-b-xl flex justify-end gap-4">
                            <button onClick={() => setNoteToDelete(null)} className="px-4 py-2 rounded-lg font-semibold text-gray-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                Cancel
                            </button>
                            <button onClick={confirmDelete} className="px-6 py-2 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 transition-colors shadow-md shadow-red-600/30">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotesScreen;