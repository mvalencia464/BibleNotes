import React, { useState, useEffect } from 'react';
import Icon from './Icon.js';

const NoteEditor = ({ book, chapter, verse, existingNote, onSave, onCancel }) => {
    const [content, setContent] = useState('');

    useEffect(() => {
        if (existingNote) {
            setContent(existingNote.content);
        }
    }, [existingNote]);

    const handleSave = () => {
        if (content.trim()) {
            onSave(content, existingNote?.id);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-background-light dark:bg-background-dark rounded-xl shadow-2xl w-full max-w-md">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            {existingNote ? 'Edit Note' : 'Add Note'}
                        </h2>
                        <button onClick={onCancel} className="p-2 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-700/50">
                            <Icon name="close" className="text-slate-500 dark:text-slate-400" />
                        </button>
                    </div>
                    <p className="font-semibold text-primary mb-4">{book} {chapter}:{verse}</p>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write your thoughts here..."
                        className="w-full h-40 p-3 rounded-lg bg-slate-200/60 dark:bg-slate-800/60 border-transparent focus:border-primary focus:ring-primary text-gray-800 dark:text-gray-200"
                        autoFocus
                    ></textarea>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800/50 px-6 py-4 rounded-b-xl flex justify-end gap-4">
                     <button onClick={onCancel} className="px-4 py-2 rounded-lg font-semibold text-gray-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="px-6 py-2 rounded-lg bg-primary text-white font-bold hover:bg-primary/90 transition-colors shadow-md shadow-primary/30">
                        Save Note
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NoteEditor;
