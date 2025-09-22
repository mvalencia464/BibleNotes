import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import Icon from '../components/Icon';
import { SearchResultVerse } from '../types';

// NOTE: The AI client is initialized on-demand within the component
// to prevent the entire app from crashing if the API key is not available
// at load time, which was causing the white screen issue.
// const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface SearchScreenProps {
    onNavigate: (book: string, chapter: number) => void;
}

const SearchScreen: React.FC<SearchScreenProps> = ({ onNavigate }) => {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<SearchResultVerse[]>([]);
    const [hasSearched, setHasSearched] = useState(false);

    const performSearch = async () => {
        if (!query.trim()) return;
        setLoading(true);
        setError(null);
        setResults([]);
        setHasSearched(true);
        try {
            const apiKey = process.env.API_KEY;
            if (!apiKey) {
                throw new Error("API Key not found. The search feature is not configured.");
            }
            const ai = new GoogleGenAI({ apiKey });

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `You are a Bible search engine. Find verses related to "${query}".`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                book: { type: Type.STRING, description: 'The name of the book of the Bible, e.g., "John".' },
                                chapter: { type: Type.INTEGER, description: 'The chapter number.' },
                                verse: { type: Type.INTEGER, description: 'The verse number.' },
                                text: { type: Type.STRING, description: 'The full text of the verse.' }
                            },
                            required: ['book', 'chapter', 'verse', 'text']
                        }
                    }
                }
            });

            const jsonString = response.text.trim();
            const searchResults = JSON.parse(jsonString) as SearchResultVerse[];
            setResults(searchResults);
        } catch (err) {
            console.error(err);
            if (err instanceof Error && err.message.includes("API Key")) {
                setError("The search feature is not configured correctly. An API key is required.");
            } else {
                 setError("Sorry, something went wrong while searching. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        performSearch();
    };
    
    const highlightQuery = (text: string, query: string) => {
        if (!query) return text;
        const parts = text.split(new RegExp(`(${query})`, 'gi'));
        return (
            <span>
                {parts.map((part, i) =>
                    part.toLowerCase() === query.toLowerCase() ? (
                        <mark key={i} className="bg-primary/30 rounded-sm font-bold text-primary dark:text-primary-light">
                            {part}
                        </mark>
                    ) : (
                        part
                    )
                )}
            </span>
        );
    };

    return (
        <div className="relative flex h-screen w-full flex-col bg-background-light dark:bg-background-dark">
            <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
                <div className="flex items-center justify-between px-4 pt-4 pb-2">
                    <div className="w-12"></div>
                    <h1 className="flex-1 text-center text-xl font-bold text-slate-900 dark:text-white">Search</h1>
                    <div className="w-12"></div>
                </div>
                <div className="px-4 pb-4">
                    <form onSubmit={handleSearchSubmit} className="relative">
                        <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full rounded-full border-transparent bg-slate-200/60 dark:bg-slate-800/60 py-3 pl-10 pr-4 text-slate-900 placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-500 focus:border-primary focus:ring-primary"
                            placeholder="Search for verses or topics..."
                            type="search"
                        />
                    </form>
                </div>
            </header>
            <main className="flex-1 overflow-y-auto">
                {loading && (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                        <p className="text-gray-500 dark:text-gray-400 mt-4">Searching...</p>
                    </div>
                )}
                {error && (
                    <div className="text-center py-20 px-4">
                        <p className="text-red-500 bg-red-100 dark:bg-red-900/30 rounded-lg p-4">
                            <strong>Error:</strong> {error}
                        </p>
                    </div>
                )}
                {!loading && !error && hasSearched && results.length === 0 && (
                    <div className="text-center py-20 px-4">
                        <Icon name="search_off" className="text-6xl text-slate-300 dark:text-slate-600 mx-auto" />
                        <h3 className="mt-4 text-xl font-bold text-slate-700 dark:text-slate-200">No Results Found</h3>
                        <p className="mt-2 text-slate-500 dark:text-slate-400">Try a different search term.</p>
                    </div>
                )}
                {!loading && !error && !hasSearched && (
                     <div className="text-center py-20 px-4">
                        <Icon name="search" className="text-6xl text-slate-300 dark:text-slate-600 mx-auto" />
                        <h3 className="mt-4 text-xl font-bold text-slate-700 dark:text-slate-200">Search the Bible</h3>
                        <p className="mt-2 text-slate-500 dark:text-slate-400">Find verses by keyword or topic.</p>
                    </div>
                )}
                {results.length > 0 && (
                    <div className="space-y-2 p-4">
                        {results.map((verse, index) => (
                            <button key={index} onClick={() => onNavigate(verse.book, verse.chapter)} className="w-full text-left p-4 rounded-lg bg-slate-100 dark:bg-slate-800/60 hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors">
                                <p className="font-bold text-primary">{verse.book} {verse.chapter}:{verse.verse}</p>
                                <p className="text-slate-800 dark:text-slate-200">
                                    {highlightQuery(verse.text, query)}
                                </p>
                            </button>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default SearchScreen;