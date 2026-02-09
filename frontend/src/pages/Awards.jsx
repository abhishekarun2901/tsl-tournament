import { useState, useEffect } from 'react';
import { getPlayers, getCleanSheets, getSettings } from '../services/api';
import { useLivePolling } from '../hooks/useLivePolling';
import LoadingSpinner from '../components/LoadingSpinner';

function Awards() {
    const [activeTab, setActiveTab] = useState('boot');
    const { data: players, loading: playersLoading } = useLivePolling(getPlayers, 10000);
    const { data: goalkeepers, loading: gkLoading } = useLivePolling(getCleanSheets, 10000);
    const [settings, setSettings] = useState({ showGoldenBoot: false, showGoldenGlove: false });

    useEffect(() => {
        getSettings().then(res => setSettings(res.data)).catch(() => { });
    }, []);

    if (playersLoading && !players) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <LoadingSpinner text="Loading awards..." />
            </div>
        );
    }

    // Filter and sort players by goals
    const scorers = players
        ?.filter(p => p.goals > 0)
        ?.sort((a, b) => b.goals - a.goals) || [];

    const topThreeScorers = scorers.slice(0, 3);
    const restScorers = scorers.slice(3);

    // Sort goalkeepers by clean sheets
    const sortedKeepers = goalkeepers
        ?.sort((a, b) => b.cleanSheets - a.cleanSheets) || [];
    const topThreeKeepers = sortedKeepers.slice(0, 3);
    const restKeepers = sortedKeepers.slice(3);

    // Check if either award should be shown
    const showBoot = settings.showGoldenBoot;
    const showGlove = settings.showGoldenGlove;

    // If neither is enabled, show a message
    if (!showBoot && !showGlove) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <section className="text-center mb-10">
                    <h1 className="font-display text-4xl md:text-5xl font-extrabold mb-4">
                        <span className="bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                            Awards
                        </span>
                    </h1>
                </section>
                <div className="card p-12 text-center">
                    <div className="text-6xl mb-4">🏆</div>
                    <p className="text-gray-500 text-lg">Awards will be announced soon!</p>
                    <p className="text-gray-400 text-sm mt-2">Check back once the tournament progresses</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <section className="text-center mb-10">
                <h1 className="font-display text-4xl md:text-5xl font-extrabold mb-4">
                    <span className="bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                        Awards
                    </span>
                </h1>
                <p className="text-gray-600 text-lg">
                    Tournament honors and achievements
                </p>
            </section>

            {/* Tabs - only show if both are enabled */}
            {showBoot && showGlove && (
                <div className="flex justify-center gap-2 mb-8">
                    <button
                        onClick={() => setActiveTab('boot')}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${activeTab === 'boot'
                                ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-lg'
                                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <span>👟</span> Golden Boot
                    </button>
                    <button
                        onClick={() => setActiveTab('glove')}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${activeTab === 'glove'
                                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <span>🧤</span> Golden Glove
                    </button>
                </div>
            )}

            {/* Golden Boot */}
            {showBoot && (activeTab === 'boot' || !showGlove) && (
                <div>
                    {!showGlove && (
                        <div className="flex items-center justify-center gap-2 mb-6">
                            <span className="text-2xl">👟</span>
                            <h2 className="font-display text-2xl font-bold text-gray-900">Golden Boot</h2>
                        </div>
                    )}

                    {scorers.length === 0 ? (
                        <div className="card p-12 text-center">
                            <div className="text-6xl mb-4">⚽</div>
                            <p className="text-gray-500 text-lg">No goals scored yet</p>
                        </div>
                    ) : (
                        <>
                            {/* Top 3 Podium */}
                            <Podium
                                data={topThreeScorers}
                                valueKey="goals"
                                emoji="⚽"
                                color="yellow"
                            />

                            {/* Rest of leaderboard */}
                            {restScorers.length > 0 && (
                                <Leaderboard
                                    data={restScorers}
                                    valueKey="goals"
                                    label="Goals"
                                    startRank={4}
                                />
                            )}
                        </>
                    )}
                </div>
            )}

            {/* Golden Glove */}
            {showGlove && (activeTab === 'glove' || !showBoot) && (
                <div>
                    {!showBoot && (
                        <div className="flex items-center justify-center gap-2 mb-6">
                            <span className="text-2xl">🧤</span>
                            <h2 className="font-display text-2xl font-bold text-gray-900">Golden Glove</h2>
                        </div>
                    )}

                    {sortedKeepers.length === 0 ? (
                        <div className="card p-12 text-center">
                            <div className="text-6xl mb-4">🧤</div>
                            <p className="text-gray-500 text-lg">No clean sheets recorded yet</p>
                        </div>
                    ) : (
                        <>
                            {/* Top 3 Podium */}
                            <Podium
                                data={topThreeKeepers}
                                valueKey="cleanSheets"
                                emoji="🧤"
                                color="blue"
                            />

                            {/* Rest of leaderboard */}
                            {restKeepers.length > 0 && (
                                <Leaderboard
                                    data={restKeepers}
                                    valueKey="cleanSheets"
                                    label="Clean Sheets"
                                    startRank={4}
                                />
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

// Podium Component
function Podium({ data, valueKey, emoji, color }) {
    const colorClasses = {
        yellow: {
            first: 'from-yellow-400 to-amber-500',
            firstBg: 'from-yellow-50 to-amber-50',
            badge: 'from-yellow-400 to-amber-400'
        },
        blue: {
            first: 'from-blue-400 to-cyan-500',
            firstBg: 'from-blue-50 to-cyan-50',
            badge: 'from-blue-400 to-cyan-400'
        }
    };
    const colors = colorClasses[color] || colorClasses.yellow;

    return (
        <div className="grid grid-cols-3 gap-4 mb-10 items-end">
            {/* 2nd Place */}
            {data[1] && (
                <div className="order-1">
                    <div className="card p-6 text-center bg-gradient-to-br from-gray-100 to-white border-t-4 border-gray-400">
                        <div className="w-16 h-16 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                            2
                        </div>
                        <h3 className="font-bold text-gray-900 text-lg">{data[1].name}</h3>
                        <p className="text-gray-500 text-sm mt-1">{data[1].teamId?.name}</p>
                        <div className="mt-4 inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
                            <span>{emoji}</span>
                            <span className="font-bold text-gray-700">{data[1][valueKey]}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* 1st Place */}
            {data[0] && (
                <div className="order-2">
                    <div className={`card p-8 text-center bg-gradient-to-br ${colors.firstBg} border-t-4 border-${color}-400 transform md:scale-110 shadow-xl relative z-10`}>
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                            <span className="text-3xl">👑</span>
                        </div>
                        <div className={`w-20 h-20 bg-gradient-to-br ${colors.first} rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold text-white shadow-xl`}>
                            1
                        </div>
                        <h3 className="font-bold text-gray-900 text-xl">{data[0].name}</h3>
                        <p className="text-gray-500 text-sm mt-1">{data[0].teamId?.name}</p>
                        <div className={`mt-4 inline-flex items-center gap-2 bg-gradient-to-r ${colors.badge} text-white px-5 py-2 rounded-full shadow-lg`}>
                            <span>{emoji}</span>
                            <span className="font-bold text-lg">{data[0][valueKey]}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* 3rd Place */}
            {data[2] && (
                <div className="order-3">
                    <div className="card p-6 text-center bg-gradient-to-br from-orange-50 to-amber-50 border-t-4 border-orange-400">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
                            3
                        </div>
                        <h3 className="font-bold text-gray-900 text-lg">{data[2].name}</h3>
                        <p className="text-gray-500 text-sm mt-1">{data[2].teamId?.name}</p>
                        <div className="mt-4 inline-flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-full">
                            <span>{emoji}</span>
                            <span className="font-bold text-orange-700">{data[2][valueKey]}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Leaderboard Component
function Leaderboard({ data, valueKey, label, startRank }) {
    return (
        <div className="card overflow-hidden border-2 border-gray-100">
            <table className="w-full">
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-16">Rank</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Player</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Team</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">{label}</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((player, index) => (
                        <tr key={player._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3">
                                <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-600 font-bold rounded-full text-sm">
                                    {startRank + index}
                                </span>
                            </td>
                            <td className="px-4 py-3 font-semibold text-gray-900">{player.name}</td>
                            <td className="px-4 py-3 text-gray-600">{player.teamId?.name}</td>
                            <td className="px-4 py-3 text-center">
                                <span className="inline-flex items-center gap-1 bg-primary-100 text-primary-700 px-3 py-1 rounded-full font-bold">
                                    {player[valueKey]}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Awards;
