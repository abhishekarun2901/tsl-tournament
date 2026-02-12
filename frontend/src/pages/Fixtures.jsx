import { useState, useMemo } from 'react';
import { getMatches } from '../services/api';
import { useLivePolling } from '../hooks/useLivePolling';
import MatchCard from '../components/MatchCard';
import LoadingSpinner from '../components/LoadingSpinner';

function Fixtures() {
    const { data: matches, loading } = useLivePolling(getMatches, 10000);
    const [filter, setFilter] = useState('all');

    const filteredMatches = useMemo(() => {
        if (!matches) return [];

        let filtered = [...matches];

        if (filter === 'upcoming') {
            filtered = filtered.filter(m => m.status === 'upcoming');
        } else if (filter === 'live') {
            filtered = filtered.filter(m => m.status === 'live');
        } else if (filter === 'finished') {
            filtered = filtered.filter(m => m.status === 'finished');
        }

        return filtered;
    }, [matches, filter]);

    const filterCounts = useMemo(() => {
        if (!matches) return { all: 0, upcoming: 0, live: 0, finished: 0 };
        return {
            all: matches.length,
            upcoming: matches.filter(m => m.status === 'upcoming').length,
            live: matches.filter(m => m.status === 'live').length,
            finished: matches.filter(m => m.status === 'finished').length
        };
    }, [matches]);

    if (loading && !matches) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <LoadingSpinner text="Loading fixtures..." />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <section className="text-center mb-10">
                <h1 className="font-display text-4xl md:text-5xl font-extrabold mb-4">
                    <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                        Match
                    </span>
                    <span className="bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
                        {' '}Fixtures
                    </span>
                </h1>
                <p className="text-gray-600 text-lg">
                    Day 2 Schedule • 6 Matches • Starting 6:45 PM
                </p>
            </section>

            {/* Filter Tabs */}
            <div className="flex justify-center gap-2 mb-8 flex-wrap">
                {[
                    { key: 'all', label: 'All', count: filterCounts.all },
                    { key: 'upcoming', label: 'Upcoming', count: filterCounts.upcoming },
                    { key: 'live', label: 'Live', count: filterCounts.live },
                    { key: 'finished', label: 'Finished', count: filterCounts.finished }
                ].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setFilter(tab.key)}
                        className={`px-5 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 ${filter === tab.key
                            ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg shadow-primary-500/30'
                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                            }`}
                    >
                        {tab.key === 'live' && tab.count > 0 && (
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        )}
                        {tab.label}
                        <span className={`text-xs px-2 py-0.5 rounded-full ${filter === tab.key
                            ? 'bg-white/20'
                            : 'bg-gray-100'
                            }`}>
                            {tab.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* Matches List */}
            {filteredMatches.length > 0 ? (
                <div className="space-y-4">
                    {filteredMatches.map((match, index) => {
                        // Find the index of this match in the original full list to determine headings
                        const originalIndex = matches ? matches.findIndex(m => m._id === match._id) : index;

                        return (
                            <div key={match._id}>
                                {/* Semi-final Heading - 4th match (index 3) */}
                                {originalIndex === 3 && (
                                    <div className="text-center mt-12 mb-6 animate-fade-in-up">
                                        <h2 className="font-display text-3xl font-bold">
                                            <span className="bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
                                                Semi-final 1
                                            </span>
                                        </h2>
                                        <div className="h-1 w-24 mx-auto bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mt-2 opacity-50"></div>
                                    </div>
                                )}

                                {/* Semi-final Heading - 5th match (index 4) */}
                                {originalIndex === 4 && (
                                    <div className="text-center mt-12 mb-6 animate-fade-in-up">
                                        <h2 className="font-display text-3xl font-bold">
                                            <span className="bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
                                                Semi-final 2
                                            </span>
                                        </h2>
                                        <div className="h-1 w-24 mx-auto bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mt-2 opacity-50"></div>
                                    </div>
                                )}

                                {/* Final Heading - 6th match (index 5) */}
                                {originalIndex === 5 && (
                                    <div className="text-center mt-16 mb-8 animate-fade-in-up">
                                        <div className="flex items-center justify-center gap-4 mb-2">
                                            <span className="text-4xl">🏆</span>
                                            <h2 className="font-display text-4xl font-black tracking-wider uppercase">
                                                <span className="bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 bg-clip-text text-transparent drop-shadow-sm">
                                                    Grand Final
                                                </span>
                                            </h2>
                                            <span className="text-4xl">🏆</span>
                                        </div>
                                        <div className="h-1.5 w-48 mx-auto bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 rounded-full shadow-lg shadow-amber-500/30"></div>
                                    </div>
                                )}

                                <div className="relative group">
                                    <div className="absolute -left-4 top-1/2 -translate-y-1/2 bg-gradient-to-br from-primary-500 to-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg shadow-primary-500/30 opacity-0 md:opacity-100 group-hover:scale-110 transition-transform">
                                        {match.matchNumber || originalIndex + 1}
                                    </div>
                                    <div className="md:ml-6">
                                        <MatchCard match={match} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="card p-12 text-center">
                    <div className="text-6xl mb-4">
                        {filter === 'live' ? '📺' : filter === 'finished' ? '🏆' : '⚽'}
                    </div>
                    <p className="text-gray-500 text-lg">
                        {filter === 'live'
                            ? 'No live matches at the moment'
                            : filter === 'finished'
                                ? 'No finished matches yet'
                                : 'No matches found'}
                    </p>
                </div>
            )}
        </div>
    );
}

export default Fixtures;
