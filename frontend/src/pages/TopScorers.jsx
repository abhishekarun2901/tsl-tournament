import { getPlayers } from '../services/api';
import { useLivePolling } from '../hooks/useLivePolling';
import LoadingSpinner from '../components/LoadingSpinner';

function TopScorers() {
    const { data: players, loading } = useLivePolling(getPlayers, 10000);

    if (loading && !players) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <LoadingSpinner text="Loading top scorers..." />
            </div>
        );
    }

    // Filter and sort players by goals
    const scorers = players
        ?.filter(p => p.goals > 0)
        ?.sort((a, b) => b.goals - a.goals) || [];

    const topThree = scorers.slice(0, 3);
    const rest = scorers.slice(3);

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <section className="text-center mb-10">
                <h1 className="font-display text-4xl md:text-5xl font-extrabold mb-4">
                    <span className="bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                        Golden Boot
                    </span>
                </h1>
                <p className="text-gray-600 text-lg">
                    Top goal scorers of the tournament
                </p>
            </section>

            {scorers.length === 0 ? (
                <div className="card p-12 text-center">
                    <div className="text-6xl mb-4">⚽</div>
                    <p className="text-gray-500 text-lg">No goals scored yet</p>
                    <p className="text-gray-400 text-sm mt-2">Check back once matches are underway!</p>
                </div>
            ) : (
                <>
                    {/* Top 3 Podium */}
                    {topThree.length > 0 && (
                        <div className="grid grid-cols-3 gap-4 mb-10 items-end">
                            {/* 2nd Place */}
                            {topThree[1] && (
                                <div className="order-1 md:order-1">
                                    <div className="card p-6 text-center bg-gradient-to-br from-gray-100 to-white border-t-4 border-gray-400">
                                        <div className="w-16 h-16 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                                            2
                                        </div>
                                        <h3 className="font-bold text-gray-900 text-lg">{topThree[1].name}</h3>
                                        <p className="text-gray-500 text-sm mt-1">{topThree[1].teamId?.name}</p>
                                        <div className="mt-4 inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
                                            <span>⚽</span>
                                            <span className="font-bold text-gray-700">{topThree[1].goals}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 1st Place */}
                            {topThree[0] && (
                                <div className="order-2 md:order-2">
                                    <div className="card p-8 text-center bg-gradient-to-br from-yellow-50 to-amber-50 border-t-4 border-yellow-400 transform md:scale-110 shadow-xl relative z-10">
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                            <span className="text-3xl">👑</span>
                                        </div>
                                        <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold text-white shadow-xl">
                                            1
                                        </div>
                                        <h3 className="font-bold text-gray-900 text-xl">{topThree[0].name}</h3>
                                        <p className="text-gray-500 text-sm mt-1">{topThree[0].teamId?.name}</p>
                                        <div className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-amber-400 text-white px-5 py-2 rounded-full shadow-lg">
                                            <span>⚽</span>
                                            <span className="font-bold text-lg">{topThree[0].goals}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 3rd Place */}
                            {topThree[2] && (
                                <div className="order-3 md:order-3">
                                    <div className="card p-6 text-center bg-gradient-to-br from-orange-50 to-amber-50 border-t-4 border-orange-400">
                                        <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                                            3
                                        </div>
                                        <h3 className="font-bold text-gray-900 text-lg">{topThree[2].name}</h3>
                                        <p className="text-gray-500 text-sm mt-1">{topThree[2].teamId?.name}</p>
                                        <div className="mt-4 inline-flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-full">
                                            <span>⚽</span>
                                            <span className="font-bold text-orange-700">{topThree[2].goals}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Rest of the leaderboard */}
                    {rest.length > 0 && (
                        <div className="card overflow-hidden border-2 border-gray-100">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-16">Rank</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Player</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Team</th>
                                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Goals</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rest.map((player, index) => (
                                        <tr key={player._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-3">
                                                <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-600 font-bold rounded-full text-sm">
                                                    {index + 4}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 font-semibold text-gray-900">{player.name}</td>
                                            <td className="px-4 py-3 text-gray-600">{player.teamId?.name}</td>
                                            <td className="px-4 py-3 text-center">
                                                <span className="inline-flex items-center gap-1 bg-primary-100 text-primary-700 px-3 py-1 rounded-full font-bold">
                                                    ⚽ {player.goals}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default TopScorers;
