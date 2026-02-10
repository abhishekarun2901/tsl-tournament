import { useState, useEffect } from 'react';
import * as api from '../services/api';
import TeamLogo from '../components/TeamLogo';

function UpdateTournament() {
    const [authenticated, setAuthenticated] = useState(false);
    const [secret, setSecret] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Data states
    const [teams, setTeams] = useState([]);
    const [players, setPlayers] = useState([]);
    const [matches, setMatches] = useState([]);
    const [settings, setSettings] = useState({ showGoldenBoot: false, showGoldenGlove: false });
    const [activeTab, setActiveTab] = useState('matches');

    // Form states
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.verifySecret(secret);
            setAuthenticated(true);
            localStorage.setItem('tsl_admin_secret', secret);
            loadData();
        } catch (err) {
            setError('Invalid secret key');
        } finally {
            setLoading(false);
        }
    };

    const loadData = async () => {
        try {
            const [teamsRes, playersRes, matchesRes, settingsRes] = await Promise.all([
                api.getTeams(),
                api.getPlayers(),
                api.getMatches(),
                api.getAdminSettings(localStorage.getItem('tsl_admin_secret'))
            ]);
            setTeams(teamsRes.data);
            setPlayers(playersRes.data);
            setMatches(matchesRes.data);
            setSettings(settingsRes.data);
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to load data' });
        }
    };

    useEffect(() => {
        const savedSecret = localStorage.getItem('tsl_admin_secret');
        if (savedSecret) {
            setSecret(savedSecret);
            api.verifySecret(savedSecret)
                .then(() => {
                    setAuthenticated(true);
                    loadData();
                })
                .catch(() => {
                    localStorage.removeItem('tsl_admin_secret');
                });
        }
    }, []);

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    // Settings functions
    const handleSettingsUpdate = async (key, value) => {
        try {
            const newSettings = { ...settings, [key]: value };
            await api.updateSettings(secret, newSettings);
            setSettings(newSettings);
            showMessage('success', `${key === 'showGoldenBoot' ? 'Golden Boot' : 'Golden Glove'} ${value ? 'enabled' : 'disabled'}`);
        } catch (err) {
            showMessage('error', 'Failed to update settings');
        }
    };

    // Match management functions
    const handleStatusChange = async (matchId, status) => {
        try {
            await api.updateMatchStatus(secret, matchId, { status });
            showMessage('success', `Match status updated to ${status}`);
            loadData();
        } catch (err) {
            showMessage('error', 'Failed to update status');
        }
    };

    const handleScoreUpdate = async (matchId, scoreA, scoreB) => {
        try {
            await api.updateMatchScore(secret, matchId, { scoreA: parseInt(scoreA), scoreB: parseInt(scoreB) });
            showMessage('success', 'Score updated');
            loadData();
        } catch (err) {
            showMessage('error', 'Failed to update score');
        }
    };

    const handleAddGoal = async (matchId, playerId, teamId, minute) => {
        try {
            await api.addGoal(secret, matchId, { playerId, teamId, minute: parseInt(minute) });
            showMessage('success', 'Goal added');
            loadData();
        } catch (err) {
            showMessage('error', 'Failed to add goal');
        }
    };

    const handleRemoveGoal = async (matchId, goalIndex) => {
        try {
            await api.removeGoal(secret, matchId, goalIndex);
            showMessage('success', 'Goal removed');
            loadData();
        } catch (err) {
            showMessage('error', 'Failed to remove goal');
        }
    };

    const handleMatchUpdate = async (matchId, data) => {
        try {
            await api.updateMatch(secret, matchId, data);
            showMessage('success', 'Match updated');
            loadData();
        } catch (err) {
            showMessage('error', 'Failed to update match');
        }
    };

    const handleCleanSheetUpdate = async (playerId, increment) => {
        try {
            await api.updateCleanSheet(secret, playerId, increment);
            showMessage('success', `Clean sheet ${increment > 0 ? 'added' : 'removed'}`);
            loadData();
        } catch (err) {
            showMessage('error', 'Failed to update clean sheet');
        }
    };

    const handleAssistUpdate = async (playerId, increment) => {
        try {
            await api.updateAssist(secret, playerId, increment);
            showMessage('success', `Assist ${increment > 0 ? 'added' : 'removed'}`);
            loadData();
        } catch (err) {
            showMessage('error', 'Failed to update assist');
        }
    };

    const handleRecalculateStandings = async () => {
        try {
            await api.recalculateStandings(secret);
            showMessage('success', 'Standings recalculated');
        } catch (err) {
            showMessage('error', 'Failed to recalculate standings');
        }
    };

    // Login Screen
    if (!authenticated) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center px-4">
                <div className="w-full max-w-md">
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 shadow-2xl">
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h1 className="font-display text-3xl font-bold text-white">TSL Admin</h1>
                            <p className="text-gray-400 text-sm mt-2">Enter your secret key to continue</p>
                        </div>

                        <form onSubmit={handleLogin}>
                            {error && (
                                <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 text-red-300 rounded-xl text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="mb-6">
                                <label className="block text-gray-400 text-sm font-medium mb-2">Secret Key</label>
                                <input
                                    type="password"
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                                    value={secret}
                                    onChange={(e) => setSecret(e.target.value)}
                                    placeholder="Enter secret key"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg"
                                disabled={loading}
                            >
                                {loading ? 'Verifying...' : 'Access Dashboard'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    // Admin Dashboard
    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="font-display text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">TSL Admin</h1>
                    <p className="text-gray-500 mt-1">Manage matches, teams, and scores</p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                    <button
                        onClick={handleRecalculateStandings}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors text-sm"
                    >
                        Recalculate Standings
                    </button>
                    <button
                        onClick={() => {
                            localStorage.removeItem('tsl_admin_secret');
                            setAuthenticated(false);
                            setSecret('');
                        }}
                        className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-lg transition-colors text-sm"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Message */}
            {message.text && (
                <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${message.type === 'success'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                    {message.text}
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {['matches', 'fixtures', 'settings', 'goalkeepers', 'assists', 'teams', 'players'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-5 py-2.5 rounded-xl font-semibold capitalize transition-all whitespace-nowrap ${activeTab === tab
                            ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        {tab === 'goalkeepers' ? '🧤 Keepers' : tab === 'assists' ? '🅰️ Assists' : tab}
                    </button>
                ))}
            </div>

            {/* Settings Tab */}
            {activeTab === 'settings' && (
                <div className="card p-6 space-y-6">
                    <h2 className="text-xl font-bold text-gray-900">Award Display Settings</h2>
                    <p className="text-gray-500 text-sm">Control which awards are visible to the public on the Awards page.</p>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-200">
                            <div className="flex items-center gap-3">
                                <span className="text-3xl">👟</span>
                                <div>
                                    <h3 className="font-bold text-gray-900">Golden Boot</h3>
                                    <p className="text-sm text-gray-600">Top goal scorers leaderboard</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleSettingsUpdate('showGoldenBoot', !settings.showGoldenBoot)}
                                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${settings.showGoldenBoot ? 'bg-green-500' : 'bg-gray-300'
                                    }`}
                            >
                                <span className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform ${settings.showGoldenBoot ? 'translate-x-7' : 'translate-x-1'
                                    }`} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                            <div className="flex items-center gap-3">
                                <span className="text-3xl">🧤</span>
                                <div>
                                    <h3 className="font-bold text-gray-900">Golden Glove</h3>
                                    <p className="text-sm text-gray-600">Best goalkeepers by clean sheets</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleSettingsUpdate('showGoldenGlove', !settings.showGoldenGlove)}
                                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${settings.showGoldenGlove ? 'bg-green-500' : 'bg-gray-300'
                                    }`}
                            >
                                <span className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform ${settings.showGoldenGlove ? 'translate-x-7' : 'translate-x-1'
                                    }`} />
                            </button>
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-xl text-sm text-gray-600">
                        <p><strong>💡 Tip:</strong> Enable these settings only when you're ready for the public to see the leaderboards. You can update clean sheets in the "🧤 Keepers" tab.</p>
                    </div>
                </div>
            )}

            {/* Matches Tab */}
            {activeTab === 'matches' && (
                <div className="space-y-4">
                    {matches.map(match => (
                        <MatchEditor
                            key={match._id}
                            match={match}
                            teams={teams}
                            players={players}
                            onStatusChange={handleStatusChange}
                            onScoreUpdate={handleScoreUpdate}
                            onAddGoal={handleAddGoal}
                            onRemoveGoal={handleRemoveGoal}
                            isSelected={selectedMatch === match._id}
                            onSelect={() => setSelectedMatch(selectedMatch === match._id ? null : match._id)}
                        />
                    ))}
                </div>
            )}

            {/* Fixtures Tab */}
            {activeTab === 'fixtures' && (
                <FixturesEditor
                    matches={matches}
                    teams={teams}
                    onUpdate={handleMatchUpdate}
                    onReload={loadData}
                    secret={secret}
                />
            )}

            {/* Goalkeepers Tab */}
            {activeTab === 'goalkeepers' && (
                <GoalkeeperManager
                    players={players}
                    onCleanSheetUpdate={handleCleanSheetUpdate}
                />
            )}

            {/* Assists Tab */}
            {activeTab === 'assists' && (
                <AssistManager
                    players={players}
                    teams={teams}
                    onAssistUpdate={handleAssistUpdate}
                />
            )}

            {/* Teams Tab */}
            {activeTab === 'teams' && (
                <div className="grid md:grid-cols-2 gap-4">
                    {teams.map(team => (
                        <div key={team._id} className="card p-5 hover:shadow-lg transition-shadow">
                            <div className="flex items-center gap-4">
                                <TeamLogo team={team} size="md" />
                                <div>
                                    <h3 className="font-bold text-gray-900">{team.name}</h3>
                                    <p className="text-sm text-gray-500">Pool {team.pool} • Manager: {team.manager}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Players Tab */}
            {activeTab === 'players' && (
                <div className="card overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Player</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Team</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Dept</th>
                                <th className="px-4 py-3 text-center font-semibold text-gray-700">Goals</th>
                                <th className="px-4 py-3 text-center font-semibold text-gray-700">GK</th>
                            </tr>
                        </thead>
                        <tbody>
                            {players.map(player => (
                                <tr key={player._id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium">{player.name}</td>
                                    <td className="px-4 py-3 text-gray-600">{player.teamId?.name}</td>
                                    <td className="px-4 py-3">
                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                                            {player.department}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center font-bold text-primary-600">{player.goals}</td>
                                    <td className="px-4 py-3 text-center">
                                        {player.isGoalkeeper && <span className="text-lg">🧤</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

// Match Editor Component
function MatchEditor({ match, teams, players, onStatusChange, onScoreUpdate, onAddGoal, onRemoveGoal, isSelected, onSelect }) {
    const [scoreA, setScoreA] = useState(match.scoreA);
    const [scoreB, setScoreB] = useState(match.scoreB);
    const [goalPlayer, setGoalPlayer] = useState('');
    const [goalTeam, setGoalTeam] = useState('');
    const [goalMinute, setGoalMinute] = useState('');

    useEffect(() => {
        setScoreA(match.scoreA);
        setScoreB(match.scoreB);
    }, [match]);

    const getPlayersForTeam = (teamId) => {
        return players.filter(p =>
            p.teamId?._id === teamId || p.teamId === teamId
        );
    };

    const handleGoalSubmit = () => {
        if (goalPlayer && goalTeam && goalMinute) {
            onAddGoal(match._id, goalPlayer, goalTeam, goalMinute);
            setGoalPlayer('');
            setGoalTeam('');
            setGoalMinute('');
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-card overflow-hidden border border-gray-100">
            <div
                className="p-4 sm:p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={onSelect}
            >
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2 sm:gap-4 flex-1 flex-wrap justify-center sm:justify-start">
                        <div className="flex items-center gap-2">
                            <TeamLogo team={match.teamA} size="sm" />
                            <span className="font-semibold text-gray-900 text-sm sm:text-base">{match.teamA?.name}</span>
                        </div>
                        <div className="px-3 sm:px-4 py-2 bg-gray-900 rounded-xl">
                            <span className="font-display text-lg sm:text-xl font-bold text-white">{match.scoreA} — {match.scoreB}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900 text-sm sm:text-base">{match.teamB?.name}</span>
                            <TeamLogo team={match.teamB} size="sm" />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide ${match.status === 'live' ? 'bg-red-100 text-red-600' :
                            match.status === 'finished' ? 'bg-gray-100 text-gray-600' :
                                'bg-blue-100 text-blue-600'
                            }`}>
                            {match.status}
                        </span>
                        <svg
                            className={`w-5 h-5 text-gray-400 transition-transform ${isSelected ? 'rotate-180' : ''}`}
                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>

            {isSelected && (
                <div className="border-t border-gray-100 p-4 sm:p-5 bg-gray-50 space-y-5" onClick={e => e.stopPropagation()}>
                    {/* Status Control */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Match Status</label>
                        <div className="flex gap-2 flex-wrap">
                            {['upcoming', 'live', 'finished'].map(status => (
                                <button
                                    key={status}
                                    onClick={() => onStatusChange(match._id, status)}
                                    className={`px-4 py-2 rounded-lg capitalize text-sm font-medium transition-all ${match.status === status
                                        ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow'
                                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Score Control */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Update Score</label>
                        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600 font-medium hidden sm:inline">{match.teamA?.name}</span>
                                <input
                                    type="number"
                                    min="0"
                                    className="w-14 sm:w-16 px-3 py-2 text-center font-bold border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                                    value={scoreA}
                                    onChange={(e) => setScoreA(e.target.value)}
                                />
                            </div>
                            <span className="text-gray-400 font-bold">—</span>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    min="0"
                                    className="w-14 sm:w-16 px-3 py-2 text-center font-bold border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                                    value={scoreB}
                                    onChange={(e) => setScoreB(e.target.value)}
                                />
                                <span className="text-sm text-gray-600 font-medium hidden sm:inline">{match.teamB?.name}</span>
                            </div>
                            <button
                                onClick={() => onScoreUpdate(match._id, scoreA, scoreB)}
                                className="px-4 py-2 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors text-sm"
                            >
                                Update
                            </button>
                        </div>
                    </div>

                    {/* Add Goal */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Add Goal Scorer</label>
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                            <select
                                className="flex-1 min-w-[140px] px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 bg-white text-sm"
                                value={goalTeam}
                                onChange={(e) => {
                                    setGoalTeam(e.target.value);
                                    setGoalPlayer('');
                                }}
                            >
                                <option value="">Team</option>
                                {teams.map(team => (
                                    <option key={team._id} value={team._id}>{team.name}</option>
                                ))}
                            </select>

                            <select
                                className="flex-1 min-w-[140px] px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 bg-white text-sm"
                                value={goalPlayer}
                                onChange={(e) => setGoalPlayer(e.target.value)}
                                disabled={!goalTeam}
                            >
                                <option value="">Player</option>
                                {getPlayersForTeam(goalTeam).map(p => (
                                    <option key={p._id} value={p._id}>{p.name}</option>
                                ))}
                            </select>

                            <input
                                type="number"
                                min="1"
                                max="120"
                                placeholder="Min"
                                className="w-16 sm:w-20 px-3 py-2 border border-gray-200 rounded-lg text-center focus:outline-none focus:border-primary-500 text-sm"
                                value={goalMinute}
                                onChange={(e) => setGoalMinute(e.target.value)}
                            />

                            <button
                                onClick={handleGoalSubmit}
                                className="px-4 py-2 bg-secondary-500 text-white font-medium rounded-lg hover:bg-secondary-600 transition-colors disabled:opacity-50 text-sm"
                                disabled={!goalPlayer || !goalTeam || !goalMinute}
                            >
                                Add
                            </button>
                        </div>
                    </div>

                    {/* Goal Scorers List with Remove Option */}
                    {match.goalscorers && match.goalscorers.length > 0 && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Goal Scorers</label>
                            <div className="space-y-2">
                                {match.goalscorers.map((goal, idx) => (
                                    <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <span className="text-lg">⚽</span>
                                            <span className="font-medium text-sm">{goal.playerId?.name || 'Unknown'}</span>
                                            <span className="text-gray-400 text-sm">{goal.minute}'</span>
                                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">{goal.teamId?.name}</span>
                                        </div>
                                        <button
                                            onClick={() => onRemoveGoal(match._id, idx)}
                                            className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                                            title="Remove goal"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// Fixtures Editor Component
function FixturesEditor({ matches, teams, onUpdate, onReload, secret }) {
    const [editingMatch, setEditingMatch] = useState(null);
    const [formData, setFormData] = useState({});

    const startEdit = (match) => {
        setEditingMatch(match._id);
        setFormData({
            teamA: match.teamA?._id,
            teamB: match.teamB?._id,
            matchNumber: match.matchNumber || '',
            matchTime: match.matchTime ? new Date(match.matchTime).toISOString().slice(0, 16) : ''
        });
    };

    const handleSave = async () => {
        await onUpdate(editingMatch, {
            teamA: formData.teamA,
            teamB: formData.teamB,
            matchNumber: parseInt(formData.matchNumber) || undefined,
            matchTime: formData.matchTime ? new Date(formData.matchTime).toISOString() : undefined
        });
        setEditingMatch(null);
    };

    return (
        <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-xl text-sm text-blue-700 border border-blue-200">
                <strong>📝 Fixtures Editor:</strong> Edit match details including teams playing, match number/order, and scheduled time.
            </div>

            {matches.map((match, idx) => (
                <div key={match._id} className="card p-4">
                    {editingMatch === match._id ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Team A</label>
                                    <select
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white"
                                        value={formData.teamA}
                                        onChange={(e) => setFormData({ ...formData, teamA: e.target.value })}
                                    >
                                        {teams.map(t => (
                                            <option key={t._id} value={t._id}>{t.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Team B</label>
                                    <select
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white"
                                        value={formData.teamB}
                                        onChange={(e) => setFormData({ ...formData, teamB: e.target.value })}
                                    >
                                        {teams.map(t => (
                                            <option key={t._id} value={t._id}>{t.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Match #</label>
                                    <input
                                        type="number"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                                        value={formData.matchNumber}
                                        onChange={(e) => setFormData({ ...formData, matchNumber: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Match Time</label>
                                    <input
                                        type="datetime-local"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                                        value={formData.matchTime}
                                        onChange={(e) => setFormData({ ...formData, matchTime: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => setEditingMatch(null)}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <span className="text-gray-400 font-mono text-sm">#{match.matchNumber || idx + 1}</span>
                                <div className="flex items-center gap-2">
                                    <TeamLogo team={match.teamA} size="xs" />
                                    <span className="font-medium">{match.teamA?.name}</span>
                                </div>
                                <span className="text-gray-400">vs</span>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">{match.teamB?.name}</span>
                                    <TeamLogo team={match.teamB} size="xs" />
                                </div>
                            </div>
                            <button
                                onClick={() => startEdit(match)}
                                className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                            >
                                Edit
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

// Goalkeeper Manager Component
function GoalkeeperManager({ players, onCleanSheetUpdate }) {
    const goalkeepers = players.filter(p => p.isGoalkeeper);

    if (goalkeepers.length === 0) {
        return (
            <div className="card p-8 text-center">
                <span className="text-4xl">🧤</span>
                <p className="text-gray-500 mt-4">No goalkeepers found in the database.</p>
                <p className="text-gray-400 text-sm mt-2">Mark players as goalkeepers in the seed data or player management.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-xl text-sm text-blue-700 border border-blue-200">
                <strong>🧤 Goalkeeper Manager:</strong> Update clean sheets for goalkeepers. Each clean sheet represents a match where the goalkeeper didn't concede a goal.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {goalkeepers.map(gk => (
                    <div key={gk._id} className="card p-4 flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-gray-900">{gk.name}</h3>
                            <p className="text-sm text-gray-500">{gk.teamId?.name}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => onCleanSheetUpdate(gk._id, -1)}
                                className="w-8 h-8 flex items-center justify-center bg-red-100 text-red-600 rounded-lg hover:bg-red-200 font-bold"
                                disabled={gk.cleanSheets <= 0}
                            >
                                -
                            </button>
                            <div className="text-center">
                                <span className="text-2xl font-bold text-gray-900">{gk.cleanSheets || 0}</span>
                                <p className="text-xs text-gray-500">Clean Sheets</p>
                            </div>
                            <button
                                onClick={() => onCleanSheetUpdate(gk._id, 1)}
                                className="w-8 h-8 flex items-center justify-center bg-green-100 text-green-600 rounded-lg hover:bg-green-200 font-bold"
                            >
                                +
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Assist Manager Component
function AssistManager({ players, teams, onAssistUpdate }) {
    const [filterTeam, setFilterTeam] = useState('');

    const filteredPlayers = filterTeam
        ? players.filter(p => (p.teamId?._id || p.teamId) === filterTeam)
        : players;

    // Sort by assists descending, then alphabetically
    const sortedPlayers = [...filteredPlayers].sort((a, b) => {
        if ((b.assists || 0) !== (a.assists || 0)) return (b.assists || 0) - (a.assists || 0);
        return a.name.localeCompare(b.name);
    });

    return (
        <div className="space-y-4">
            <div className="p-4 bg-purple-50 rounded-xl text-sm text-purple-700 border border-purple-200">
                <strong>🅰️ Assist Manager:</strong> Update assists for each player. Select a team to filter or view all players.
            </div>

            {/* Team Filter */}
            <div className="flex gap-2 flex-wrap">
                <button
                    onClick={() => setFilterTeam('')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${!filterTeam ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    All Teams
                </button>
                {teams.map(team => (
                    <button
                        key={team._id}
                        onClick={() => setFilterTeam(team._id)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${filterTeam === team._id ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        {team.name}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {sortedPlayers.map(player => (
                    <div key={player._id} className="card p-4 flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-gray-900">{player.name}</h3>
                            <p className="text-sm text-gray-500">{player.teamId?.name}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => onAssistUpdate(player._id, -1)}
                                className="w-8 h-8 flex items-center justify-center bg-red-100 text-red-600 rounded-lg hover:bg-red-200 font-bold"
                                disabled={(player.assists || 0) <= 0}
                            >
                                -
                            </button>
                            <div className="text-center">
                                <span className="text-2xl font-bold text-gray-900">{player.assists || 0}</span>
                                <p className="text-xs text-gray-500">Assists</p>
                            </div>
                            <button
                                onClick={() => onAssistUpdate(player._id, 1)}
                                className="w-8 h-8 flex items-center justify-center bg-green-100 text-green-600 rounded-lg hover:bg-green-200 font-bold"
                            >
                                +
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UpdateTournament;
