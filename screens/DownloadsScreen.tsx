import React, { useState, useEffect } from 'react';
import { AVAILABLE_TRANSLATIONS, BIBLE_BOOKS, AVAILABLE_RESOURCES } from '../constants';
import Icon from '../components/Icon';
import { deleteBibleVersion, saveBibleBook, saveSermons, deleteSermons, areSermonsDownloaded } from '../db';
import { SPURGEON_SERMONS_DATA } from '../data/sermons';

interface DownloadsScreenProps {
    downloadedVersions: string[];
    onDownloadsChanged: () => void;
}

interface DownloadProgress {
    [versionId: string]: number | 'deleting' | 'downloading' | null;
}

const fetchWithRetry = async (url: string, retries = 3, delay = 500): Promise<Response> => {
    let lastError;
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url);
            if (response.ok) return response;
            throw new Error(`Request failed with status ${response.status}`);
        } catch (error) {
            lastError = error;
            if (error instanceof Error && error.message.startsWith('Request failed with status')) {
                throw error;
            }
            console.warn(`Attempt ${i + 1} for ${url} failed. Retrying...`, error);
            if (i < retries - 1) {
                await new Promise(res => setTimeout(res, delay * Math.pow(2, i)));
            }
        }
    }
    throw lastError;
};


const DownloadsScreen: React.FC<DownloadsScreenProps> = ({ downloadedVersions, onDownloadsChanged }) => {
    const [progress, setProgress] = useState<DownloadProgress>({});
    const [sermonsDownloaded, setSermonsDownloaded] = useState(false);

    useEffect(() => {
        areSermonsDownloaded().then(setSermonsDownloaded);
    }, []);

    const handleDownloadsChanged = () => {
        areSermonsDownloaded().then(setSermonsDownloaded);
        onDownloadsChanged();
    }

    const handleDownloadSermons = async () => {
        setProgress(prev => ({...prev, 'spurgeon-sermons': 'downloading' }));
        try {
            // In a real app, we might fetch this. Here we use local data.
            await saveSermons(SPURGEON_SERMONS_DATA);
            handleDownloadsChanged();
        } catch (error) {
            console.error("Error saving sermons:", error);
            alert("Failed to save sermon notes.");
        } finally {
            setProgress(prev => ({...prev, 'spurgeon-sermons': null }));
        }
    }

    const handleDeleteSermons = async () => {
        setProgress(prev => ({...prev, 'spurgeon-sermons': 'deleting' }));
        await deleteSermons();
        handleDownloadsChanged();
        setProgress(prev => ({...prev, 'spurgeon-sermons': null }));
    }

    const handleDownload = async (versionId: string, version_name: string) => {
        setProgress(prev => ({ ...prev, [versionId]: 0 }));

        for (let i = 0; i < BIBLE_BOOKS.length; i++) {
            const book = BIBLE_BOOKS[i];
            
            const bookDataForDb: { book_name: string, chapters: any[] } = {
                book_name: book.name,
                chapters: [],
            };

            try {
                for (let chapterNum = 1; chapterNum <= book.chapters; chapterNum++) {
                    await new Promise(resolve => setTimeout(resolve, 150));

                    const bookNameForApi = book.name.replace(/\s/g, '');
                    const response = await fetchWithRetry(`https://bible-api.com/${bookNameForApi}+${chapterNum}?translation=${versionId}`);
                    
                    const chapterData = await response.json();
                    
                    bookDataForDb.chapters.push({
                        chapter: chapterNum,
                        verses: chapterData.verses,
                    });
                }

                await saveBibleBook(versionId, version_name, book.name, bookDataForDb);
                
                const currentProgress = ((i + 1) / BIBLE_BOOKS.length) * 100;
                setProgress(prev => ({ ...prev, [versionId]: currentProgress }));

            } catch (error) {
                console.error(`Error downloading ${book.name} for ${versionId}:`, error);
                alert(`Failed to download ${book.name} for ${version_name}. Please check your internet connection and try again.`);
                setProgress(prev => ({ ...prev, [versionId]: null }));
                return;
            }
        }
        
        setProgress(prev => ({ ...prev, [versionId]: null }));
        onDownloadsChanged();
    };

    const handleDelete = async (versionId: string) => {
        setProgress(prev => ({...prev, [versionId]: 'deleting'}));
        await deleteBibleVersion(versionId);
        setProgress(prev => ({...prev, [versionId]: null}));
        onDownloadsChanged();
    }
    
    const ResourceItem: React.FC<{ resource: typeof AVAILABLE_RESOURCES[0] }> = ({ resource }) => {
        const isDownloaded = sermonsDownloaded;
        const currentProgress = progress[resource.id];
        const isDownloading = currentProgress === 'downloading';
        const isDeleting = currentProgress === 'deleting';

        return (
            <div className="flex items-center gap-4 rounded-lg bg-slate-100 dark:bg-slate-800 p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary dark:bg-primary/30">
                    <Icon name="collections_bookmark" />
                </div>
                <div className="flex-1">
                    <p className="font-bold text-zinc-900 dark:text-white">{resource.name}</p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{resource.description}</p>
                </div>
                <div className="w-24 text-right">
                    {isDownloaded && !isDeleting && (
                         <button onClick={handleDeleteSermons} className="px-4 py-2 rounded-lg font-semibold text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-sm">
                            Delete
                        </button>
                    )}
                    {isDownloading && <p className="text-sm font-medium text-primary">Downloading...</p>}
                    {isDeleting && <p className="text-sm font-medium text-slate-500">Deleting...</p>}
                    {!isDownloaded && !isDownloading && !isDeleting && (
                        <button onClick={handleDownloadSermons} className="px-4 py-2 rounded-lg bg-primary text-white font-bold hover:bg-primary/90 transition-colors shadow-md shadow-primary/30 text-sm">
                            Download
                        </button>
                    )}
                </div>
            </div>
        )
    }


    const DownloadItem: React.FC<{ trans: typeof AVAILABLE_TRANSLATIONS[0] }> = ({ trans }) => {
        const isDownloaded = downloadedVersions.includes(trans.id);
        const currentProgress = progress[trans.id];
        const isDownloading = typeof currentProgress === 'number';
        const isDeleting = currentProgress === 'deleting';

        return (
            <div className="flex items-center gap-4 rounded-lg bg-slate-100 dark:bg-slate-800 p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary dark:bg-primary/30">
                    <Icon name="menu_book" />
                </div>
                <div className="flex-1">
                    <p className="font-bold text-zinc-900 dark:text-white">{trans.name}</p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{trans.description}</p>
                    {isDownloading && (
                         <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-primary/20 dark:bg-primary/30">
                            <div className="h-full rounded-full bg-primary" style={{ width: `${currentProgress}%` }}></div>
                        </div>
                    )}
                </div>
                <div className="w-24 text-right">
                    {isDownloaded && !isDeleting && (
                         <button onClick={() => handleDelete(trans.id)} className="px-4 py-2 rounded-lg font-semibold text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-sm">
                            Delete
                        </button>
                    )}
                    {isDownloading && <p className="text-sm font-medium text-primary">{Math.round(currentProgress as number)}%</p>}
                    {isDeleting && <p className="text-sm font-medium text-slate-500">Deleting...</p>}
                    {!isDownloaded && !isDownloading && !isDeleting && (
                        <button onClick={() => handleDownload(trans.id, trans.name)} className="px-4 py-2 rounded-lg bg-primary text-white font-bold hover:bg-primary/90 transition-colors shadow-md shadow-primary/30 text-sm">
                            Download
                        </button>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="relative flex h-screen min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
            <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
                <div className="flex items-center justify-between px-4 pt-4 pb-2">
                    <div className="w-12"></div>
                    <h1 className="flex-1 text-center text-xl font-bold text-slate-900 dark:text-white">Downloads</h1>
                    <div className="w-12"></div>
                </div>
            </header>
            <main className="flex-1 overflow-y-auto p-4 space-y-8">
                <section className="space-y-4">
                    <h2 className="px-2 text-lg font-bold text-zinc-900 dark:text-white">Bible Translations</h2>
                    <div className="space-y-2">
                        {AVAILABLE_TRANSLATIONS.map(trans => (
                            <DownloadItem key={trans.id} trans={trans} />
                        ))}
                    </div>
                </section>
                <section className="space-y-4">
                    <h2 className="px-2 text-lg font-bold text-zinc-900 dark:text-white">Library Resources</h2>
                    <div className="space-y-2">
                        {AVAILABLE_RESOURCES.map(res => (
                            <ResourceItem key={res.id} resource={res} />
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default DownloadsScreen;