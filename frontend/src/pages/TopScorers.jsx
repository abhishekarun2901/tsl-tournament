import { getTopScorers } from '../services/api';
import { useLivePolling } from '../hooks/useLivePolling';
import TeamLogo from '../components/TeamLogo';
import LoadingSpinner from '../components/LoadingSpinner';
import LastUpdated from '../components/LastUpdated';

function TopScorers() {
    const { data: scorers, loading, lastUpdated } = useLivePolling(getTopScorers, 10000);

    if (loading) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <LoadingSpinner text="Loading top scorers..." />
            </div>
        );
    }

    const getMedalColor = (rank) => {
        switch (rank) {
            case 1: return 'bg-gradient-to-br from-yellow-300 to-yellow-500 text-white';
            case 2: return 'bg-gradient-to-br from-gray-300 to-gray-400 text-white';
            case 3: return 'bg-gradient-to-br from-amber-600 to-amber-700 text-white';
            default: return 'bg-surface-100 text-gray-700';
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-display text-3xl font-bold text-gray-900">Top Scorers</h1>
                    <p className="text-gray-500 mt-1">Golden Boot race</p>
                </div>
                <LastUpdated timestamp={lastUpdated} />
            </div>

            {/* No scorers fallback */}
            {(!scorers || scorers.length === 0) && (
                <div className="card p-12 text-center">
                    <div className="text-6xl mb-4">⚽</div>
                    <p className="text-gray-500">No goals scored yet.</p>
                    <p className="text-sm text-gray-400 mt-1">The race for the Golden Boot begins when the first goal is scored!</p>
                </div>
            )}

            {/* Top 3 Podium */}
            {scorers && scorers.length >= 3 && (
                <div className="grid grid-cols-3 gap-4 mb-8">
                    {/* Second Place */}
                    <div className="card p-4 text-center order-1">
                        <div className="text-3xl mb-2">🥈</div>
                        <TeamLogo team={scorers[1].teamId} size="md" className="mx-auto" />
                        <p className="font-semibold text-gray-900 mt-2 text-sm">{scorers[1].name}</p>
                        <p className="text-xs text-gray-500">{scorers[1].teamId?.name}</p>
                        <p className="font-display text-2xl font-bold text-gray-700 mt-2">{scorers[1].goals}</p>
                    </div>

                    {/* First Place */}
                    <div className="card p-6 text-center order-2 ring-2 ring-yellow-300 bg-yellow-50/50 relative">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-white text-xs font-bold px-3 py-1 rounded-full">
                            LEADER
                        </div>
                        <div className="text-4xl mb-2">🥇</div>
                        <TeamLogo team={scorers[0].teamId} size="lg" className="mx-auto" />
                        <p className="font-bold text-gray-900 mt-2">{scorers[0].name}</p>
                        <p className="text-sm text-gray-500">{scorers[0].teamId?.name}</p>
                        <p className="font-display text-3xl font-bold text-primary-600 mt-2">{scorers[0].goals}</p>
                    </div>

                    {/* Third Place */}
                    <div className="card p-4 text-center order-3">
                        <div className="text-3xl mb-2">🥉</div>
                        <TeamLogo team={scorers[2].teamId} size="md" className="mx-auto" />
                        <p className="font-semibold text-gray-900 mt-2 text-sm">{scorers[2].name}</p>
                        <p className="text-xs text-gray-500">{scorers[2].teamId?.name}</p>
                        <p className="font-display text-2xl font-bold text-gray-700 mt-2">{scorers[2].goals}</p>
                    </div>
                </div>
            )}

            {/* Full List */}
            {scorers && scorers.length > 0 && (
                <div className="card overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="table-header">
                                <th className="px-4 py-3 text-left w-16">Rank</th>
                                <th className="px-4 py-3 text-left">Player</th>
                                <th className="px-4 py-3 text-left">Team</th>
                                <th className="px-4 py-3 text-center w-20">Goals</th>
                            </tr>
                        </thead>
                        <tbody>
                            {scorers.map((scorer, index) => {
                                const rank = index + 1;
                                return (
                                    <tr key={scorer._id} className="table-row">
                                        <td className="px-4 py-3">
                                            <span className={`w-8 h-8 inline-flex items-center justify-center rounded-full font-bold text-sm ${getMedalColor(rank)}`}>
                                                {rank}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="font-medium text-gray-900">{scorer.name}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <TeamLogo team={scorer.teamId} size="sm" />
                                                <span className="text-gray-600 text-sm">{scorer.teamId?.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`font-bold text-lg ${rank <= 3 ? 'text-primary-600' : 'text-gray-900'}`}>
                                                {scorer.goals}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default TopScorers;
