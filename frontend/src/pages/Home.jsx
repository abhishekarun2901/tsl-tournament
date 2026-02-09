import { useMemo } from 'react';
import { getMatches } from '../services/api';
import { useLivePolling } from '../hooks/useLivePolling';
import MatchCard from '../components/MatchCard';
import LoadingSpinner from '../components/LoadingSpinner';
import SponsorsSection from '../components/SponsorsSection';

function Home() {
    const { data: matches, loading: matchesLoading } = useLivePolling(getMatches, 10000);

    const { liveMatches, upcomingMatches, finishedMatches } = useMemo(() => {
        if (!matches) return { liveMatches: [], upcomingMatches: [], finishedMatches: [] };

        const live = matches.filter(m => m.status === 'live');
        const upcoming = matches.filter(m => m.status === 'upcoming');
        const finished = matches.filter(m => m.status === 'finished').reverse();

        return { liveMatches: live, upcomingMatches: upcoming, finishedMatches: finished };
    }, [matches]);

    // Calculate days until tournament
    const daysUntil = useMemo(() => {
        if (!matches || matches.length === 0) return null;
        const firstMatch = matches[0];
        if (!firstMatch?.matchTime) return null;

        const matchDate = new Date(firstMatch.matchTime);
        const today = new Date();
        const diffTime = matchDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }, [matches]);

    if (matchesLoading) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <LoadingSpinner text="Loading tournament data..." />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Hero Section */}
            <section className="relative text-center mb-12 py-12">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50 rounded-3xl -z-10"></div>
                <div className="absolute inset-0 opacity-30 -z-10">
                    <div className="absolute top-10 left-10 w-32 h-32 bg-primary-300 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-40 h-40 bg-secondary-300 rounded-full blur-3xl"></div>
                </div>

                <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full text-sm font-semibold mb-6 shadow-lg shadow-primary-500/30">
                    {daysUntil !== null && daysUntil > 0 ? (
                        <>
                            <span className="text-lg">⚽</span>
                            {daysUntil === 1 ? 'Tomorrow!' : `${daysUntil} days to go`}
                        </>
                    ) : (
                        <>
                            <span className="live-dot"></span>
                            Live Tournament
                        </>
                    )}
                </div>
                <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-extrabold mb-6">
                    <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                        Thekkinkad
                    </span>
                    <br />
                    <span className="bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-500 bg-clip-text text-transparent">
                        Super League
                    </span>
                </h1>
                <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto font-medium">
                    Live scores, fixtures, and standings for the ultimate local football tournament
                </p>
            </section>

            {/* Live Matches */}
            {liveMatches.length > 0 && (
                <section className="mb-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="relative">
                            <span className="live-dot"></span>
                            <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75"></span>
                        </div>
                        <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900">Live Now</h2>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        {liveMatches.map((match) => (
                            <MatchCard key={match._id} match={match} />
                        ))}
                    </div>
                </section>
            )}

            {/* Match Schedule and Tournament Info */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content - Match Schedule */}
                <div className="lg:col-span-2 space-y-10">
                    {/* Day 1 Fixtures */}
                    <section>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="bg-gradient-to-r from-secondary-500 to-secondary-600 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg shadow-secondary-500/30">
                                DAY 1
                            </div>
                            <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900">
                                Match Schedule
                            </h2>
                        </div>

                        {upcomingMatches.length > 0 && (
                            <div className="space-y-4">
                                {upcomingMatches.map((match, index) => (
                                    <div key={match._id} className="relative group">
                                        <div className="absolute -left-4 top-1/2 -translate-y-1/2 bg-gradient-to-br from-primary-500 to-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg shadow-primary-500/30 opacity-0 md:opacity-100 group-hover:scale-110 transition-transform">
                                            {match.matchNumber || index + 1}
                                        </div>
                                        <div className="md:ml-6">
                                            <MatchCard match={match} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {upcomingMatches.length === 0 && finishedMatches.length === 0 && (
                            <div className="card p-12 text-center">
                                <div className="text-6xl mb-4">⚽</div>
                                <p className="text-gray-500 text-lg">No matches scheduled</p>
                            </div>
                        )}
                    </section>

                    {/* Recent Results */}
                    {finishedMatches.length > 0 && (
                        <section>
                            <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                                Results
                            </h2>
                            <div className="grid gap-4">
                                {finishedMatches.map((match) => (
                                    <MatchCard key={match._id} match={match} />
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Sidebar - Tournament Info */}
                <div className="space-y-6">
                    {/* Tournament Info */}
                    <section className="card p-5 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
                        <h3 className="font-display font-bold text-lg mb-4">Tournament Info</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Teams</span>
                                <span className="font-bold text-primary-400">8</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Day 1 Matches</span>
                                <span className="font-bold text-primary-400">9</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Kickoff</span>
                                <span className="font-bold text-secondary-400">6:45 PM</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Match Duration</span>
                                <span className="font-bold text-secondary-400">15 mins</span>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            {/* Full Sponsors Section */}
            <section className="mt-16">
                <SponsorsSection />
            </section>
        </div>
    );
}

export default Home;
