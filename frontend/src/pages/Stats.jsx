import { useState, useEffect } from 'react';
import { getPlayers, getCleanSheets, getSettings } from '../services/api';
import { useLivePolling } from '../hooks/useLivePolling';
import LoadingSpinner from '../components/LoadingSpinner';

function Stats() {
    const [activeTab, setActiveTab] = useState('scorers');
    const { data: players, loading: playersLoading } = useLivePolling(getPlayers, 10000);
    const { data: goalkeepers, loading: gkLoading } = useLivePolling(getCleanSheets, 10000);
    const [settings, setSettings] = useState({
        showGoldenBoot: false,
        showGoldenGlove: false,
        showGoldenBall: false,
        goldenBallPlayer: null
    });

    useEffect(() => {
        getSettings().then(res => setSettings(res.data)).catch(() => { });
    }, []);

    if (playersLoading && !players) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <LoadingSpinner text="Loading stats..." />
            </div>
        );
    }

    // Sort players by goals
    const scorers = players
        ?.filter(p => p.goals > 0)
        ?.sort((a, b) => b.goals - a.goals) || [];

    // Sort players by assists
    const assisters = players
        ?.filter(p => p.assists > 0)
        ?.sort((a, b) => b.assists - a.assists) || [];

    // Sort goalkeepers by clean sheets
    const sortedKeepers = goalkeepers
        ?.sort((a, b) => b.cleanSheets - a.cleanSheets) || [];

    // Find Golden Ball player
    const goldenBallPlayer = settings.goldenBallPlayer
        ? players?.find(p => p._id === settings.goldenBallPlayer)
        : null;

    // Check if any award should be shown
    const showAwards = settings.showGoldenBoot || settings.showGoldenGlove || settings.showGoldenBall;

    const tabs = [
        { id: 'scorers', label: '⚽ Top Scorers', count: scorers.length },
    ];

    if (settings.showTopAssists !== false) { // Default to true if undefined
        tabs.push({ id: 'assists', label: '🅰️ Top Assists', count: assisters.length });
    }

    if (settings.showTopGoalkeepers !== false) {
        tabs.push({ id: 'goalkeepers', label: '🧤 Best Goalkeepers', count: sortedKeepers.length });
    }

    if (showAwards) {
        tabs.push({ id: 'awards', label: '🏆 Awards', count: null });
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <section className="text-center mb-10">
                <h1 className="font-display text-4xl md:text-5xl font-extrabold mb-4">
                    <span className="bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
                        Stats
                    </span>
                </h1>
                <p className="text-gray-600 text-lg">
                    Tournament statistics and leaderboards
                </p>
            </section>

            {/* Tabs */}
            <div className="flex justify-center gap-2 mb-8 flex-wrap">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 ${activeTab === tab.id
                            ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        {tab.label}
                        {tab.count !== null && (
                            <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-white/20' : 'bg-gray-100'
                                }`}>
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Top Scorers Tab */}
            {activeTab === 'scorers' && (
                <div>
                    {scorers.length === 0 ? (
                        <div className="card p-12 text-center">
                            <div className="text-6xl mb-4">⚽</div>
                            <p className="text-gray-500 text-lg">No goals scored yet</p>
                        </div>
                    ) : (
                        <StatsTable
                            data={scorers}
                            valueKey="goals"
                            label="Goals"
                            emoji="⚽"
                        />
                    )}
                </div>
            )}

            {/* Top Assists Tab */}
            {activeTab === 'assists' && (
                <div>
                    {assisters.length === 0 ? (
                        <div className="card p-12 text-center">
                            <div className="text-6xl mb-4">🅰️</div>
                            <p className="text-gray-500 text-lg">No assists recorded yet</p>
                        </div>
                    ) : (
                        <StatsTable
                            data={assisters}
                            valueKey="assists"
                            label="Assists"
                            emoji="🅰️"
                        />
                    )}
                </div>
            )}

            {/* Top Goalkeepers Tab */}
            {activeTab === 'goalkeepers' && (
                <div>
                    {sortedKeepers.length === 0 ? (
                        <div className="card p-12 text-center">
                            <div className="text-6xl mb-4">🧤</div>
                            <p className="text-gray-500 text-lg">No clean sheets recorded yet</p>
                        </div>
                    ) : (
                        <StatsTable
                            data={sortedKeepers}
                            valueKey="cleanSheets"
                            label="Clean Sheets"
                            emoji="🧤"
                        />
                    )}
                </div>
            )}

            {/* Awards Tab */}
            {activeTab === 'awards' && showAwards && (
                <div className="space-y-8">
                    {/* Golden Boot */}
                    {settings.showGoldenBoot && scorers.length > 0 && (
                        <AwardCard
                            title="Golden Boot"
                            subtitle="Top Scorer"
                            emoji="👟"
                            color="yellow"
                            player={scorers[0]}
                            value={scorers[0]?.goals}
                            valueLabel="Goals"
                        />
                    )}

                    {/* Golden Glove */}
                    {settings.showGoldenGlove && sortedKeepers.length > 0 && (
                        <AwardCard
                            title="Golden Glove"
                            subtitle="Best Goalkeeper"
                            emoji="🧤"
                            color="blue"
                            player={sortedKeepers[0]}
                            value={sortedKeepers[0]?.cleanSheets}
                            valueLabel="Clean Sheets"
                        />
                    )}

                    {/* Golden Ball */}
                    {settings.showGoldenBall && goldenBallPlayer && (
                        <AwardCard
                            title="Golden Ball"
                            subtitle="Most Valuable Player"
                            emoji="⚽"
                            color="gold"
                            player={goldenBallPlayer}
                            value={null}
                            valueLabel="MVP"
                        />
                    )}

                    {!settings.showGoldenBoot && !settings.showGoldenGlove && !settings.showGoldenBall && (
                        <div className="card p-12 text-center">
                            <div className="text-6xl mb-4">🏆</div>
                            <p className="text-gray-500 text-lg">Awards will be announced soon!</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// Stats Table Component
function StatsTable({ data, valueKey, label, emoji }) {
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
                                <span className={`inline-flex items-center justify-center w-8 h-8 font-bold rounded-full text-sm ${index === 0 ? 'bg-yellow-100 text-yellow-700' :
                                    index === 1 ? 'bg-gray-200 text-gray-700' :
                                        index === 2 ? 'bg-orange-100 text-orange-700' :
                                            'bg-gray-100 text-gray-600'
                                    }`}>
                                    {index + 1}
                                </span>
                            </td>
                            <td className="px-4 py-3 font-semibold text-gray-900">{player.name}</td>
                            <td className="px-4 py-3 text-gray-600">{player.teamId?.name}</td>
                            <td className="px-4 py-3 text-center">
                                <span className="inline-flex items-center gap-1 bg-primary-100 text-primary-700 px-3 py-1 rounded-full font-bold">
                                    {emoji} {player[valueKey]}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// Award Card Component
function AwardCard({ title, subtitle, emoji, color, player, value, valueLabel }) {
    const colorClasses = {
        yellow: 'from-yellow-400 to-amber-500',
        blue: 'from-blue-400 to-cyan-500',
        gold: 'from-yellow-500 to-yellow-600'
    };

    return (
        <div className={`card p-8 text-center bg-gradient-to-br from-${color === 'gold' ? 'yellow' : color}-50 to-white border-t-4 border-${color === 'gold' ? 'yellow' : color}-400`}>
            <div className="text-5xl mb-4">{emoji}</div>
            <h3 className={`font-display text-2xl font-bold bg-gradient-to-r ${colorClasses[color]} bg-clip-text text-transparent mb-1`}>
                {title}
            </h3>
            <p className="text-gray-500 text-sm mb-6">{subtitle}</p>

            <div className={`w-20 h-20 bg-gradient-to-br ${colorClasses[color]} rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold text-white shadow-xl`}>
                👑
            </div>

            <h4 className="font-bold text-gray-900 text-xl">{player?.name}</h4>
            <p className="text-gray-500 text-sm mt-1">{player?.teamId?.name}</p>

            {value !== null && (
                <div className={`mt-4 inline-flex items-center gap-2 bg-gradient-to-r ${colorClasses[color]} text-white px-5 py-2 rounded-full shadow-lg`}>
                    <span className="font-bold text-lg">{value} {valueLabel}</span>
                </div>
            )}
        </div>
    );
}

export default Stats;
