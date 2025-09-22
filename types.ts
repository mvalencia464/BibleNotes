export enum Screen {
    Welcome = 'Welcome',
    Home = 'Home',
    Bible = 'Bible',
    Notes = 'Notes',
    Library = 'Library',
    Search = 'Search',
    Downloads = 'Downloads',
    Settings = 'Settings',
    Sermons = 'Sermons',
}

export interface BibleBook {
  name: string;
  abbr: string;
  chapters: number;
  testament: 'OT' | 'NT';
}

export interface Note {
    id: string;
    book: string;
    chapter: number;
    verse: number;
    content: string;
    createdAt: number;
}

export interface Sermon {
    sermon_number: number;
    volume: string;
    title: string;
    full_title: string;
    biblical_reference: string;
    scripture_reference: string;
    source_url: string;
    content: string;
    content_length: number;
    biblical_book: string;
}

export interface SermonCollection {
    metadata: any;
    statistics: any;
    sermons: Sermon[];
}

export interface Download {
    id: string;
    name: string;
    description: string;
    progress: number | 'downloaded';
}

export interface ApiVerse {
  book_id: string;
  book_name: string;
  chapter: number;
  verse: number;
  text: string;
}

export interface BibleChapter {
    chapter: number;
    verses: ApiVerse[];
}

export interface SearchResultVerse {
    book: string;
    chapter: number;
    verse: number;
    text: string;
}