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
                    Day 1 Schedule • 9 Matches • Starting 6:45 PM
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
                                ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg shadow-primary-500/30