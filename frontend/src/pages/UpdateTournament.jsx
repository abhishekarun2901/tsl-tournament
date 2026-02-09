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
            const [teamsRes, playersRes, matchesRes] = await Promise.all([
                api.getTeams(),
                api.getPlayers(),
                api.getMatches()
            ]);
            setTeams(teamsRes.data);
            setPlayers(playersRes.data);
            setMatches(matchesRes.data);
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
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-display text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">TSL Admin</h1>
                    <p className="text-gray-500 mt-1">Manage matches, teams, and scores</p>
                </div>
                <div className="flex items-center gap-3">
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
                {['matches', 'teams', 'players'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-5 py-2.5 rounded-xl font-semibold capitalize transition-all ${activeTab === tab
                            ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

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
                            isSelected={selectedMatch === match._id}
                            onSelect={() => setSelectedMatch(selectedMatch === match._id ? null : match._id)}
                        />
                    ))}
                </div>
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
function MatchEditor({ match, teams, players, onStatusChange, onScoreUpdate, onAddGoal, isSelected, onSelect }) {
    const [scoreA, setScoreA] = useState(match.scoreA);
    const [scoreB, setScoreB] = useState(match.scoreB);
    const [goalPlayer, setGoalPlayer] = useState('');
    const [goalTeam, setGoalTeam] = useState('');
    const [goalMinute, setGoalMinute] = useState('');

    useEffect(() => {
        setScoreA(match.scoreA);
        setScoreB(match.scoreB);
    }, [match]);

    // Get all players for selected team (from all teams, not just match teams)
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
                className="p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={onSelect}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="flex items-center gap-3">
                            <TeamLogo team={match.teamA} size="sm" />
                            <span className="font-semibold text-gray-900">{match.teamA?.name}</span>
                        </div>
                        <div className="px-4 py-2 bg-gray-900 rounded-xl">
                            <span className="font-display text-xl font-bold text-white">{match.scoreA} — {match.scoreB}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="font-semibold text-gray-900">{match.teamB?.name}</span>
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
                <div className="border-t border-gray-100 p-5 bg-gray-50 space-y-5" onClick={e => e.stopPropagation()}>
                    {/* Status Control */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Match Status</label>
                        <div className="flex gap-2">
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
                        <div className="flex items-center gap-4 flex-wrap">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600 font-medium">{match.teamA?.name}</span>
                                <input
                                    type="number"
                                    min="0"
                                    className="w-16 px-3 py-2 text-center font-bold border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                                    value={scoreA}
                                    onChange={(e) => setScoreA(e.target.value)}
                                />
                            </div>
                            <span className="text-gray-400 font-bold">—</span>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    min="0"
                                    className="w-16 px-3 py-2 text-center font-bold border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                                    value={scoreB}
                                    onChange={(e) => setScoreB(e.target.value)}
                                />
                                <span className="text-sm text-gray-600 font-medium">{match.teamB?.name}</span>
                            </div>
                            <button
                                onClick={() => onScoreUpdate(match._id, scoreA, scoreB)}
                                className="px-4 py-2 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors"
                            >
                                Update Score
                            </button>
                        </div>
                    </div>

                    {/* Add Goal */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Add Goal Scorer</label>
                        <div className="flex flex-wrap gap-3">
                            <select
                                className="flex-1 min-w-[180px] px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 bg-white"
                                value={goalTeam}
                                onChange={(e) => {
                                    setGoalTeam(e.target.value);
                                    setGoalPlayer('');
                                }}
                            >
                                <option value="">Select Team</option>
                                {teams.map(team => (
                                    <option key={team._id} value={team._id}>{team.name}</option>
                                ))}
                            </select>

                            <select
                                className="flex-1 min-w-[180px] px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 bg-white"
                                value={goalPlayer}
                                onChange={(e) => setGoalPlayer(e.target.value)}
                                disabled={!goalTeam}
                            >
                                <option value="">Select Player</option>
                                {getPlayersForTeam(goalTeam).map(p => (
                                    <option key={p._id} value={p._id}>{p.name}</option>
                                ))}
                            </select>

                            <input
                                type="number"
                                min="1"
                                max="120"
                                placeholder="Min"
                                className="w-20 px-3 py-2 border border-gray-200 rounded-lg text-center focus:outline-none focus:border-primary-500"
                                value={goalMinute}
                                onChange={(e) => setGoalMinute(e.target.value)}
                            />

                            <button
                                onClick={handleGoalSubmit}
                                className="px-4 py-2 bg-secondary-500 text-white font-medium rounded-lg hover:bg-secondary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!goalPlayer || !goalTeam || !goalMinute}
                            >
                                Add Goal
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            💡 You can select any team to record goals (e.g., for own goals or corrections)
                        </p>
                    </div>

                    {/* Goal Scorers List */}
                    {match.goalscorers && match.goalscorers.length > 0 && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Goal Scorers</label>
                            <div className="space-y-2">
                                {match.goalscorers.map((goal, idx) => (
                                    <div key={idx} className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-100">
                                        <span className="text-lg">⚽</span>
                                        <span className="font-medium">{goal.playerId?.name || 'Unknown'}</span>
                                        <span className="text-gray-400 text-sm">{goal.minute}'</span>
                                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">{goal.teamId?.name}</span>
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

export default UpdateTournament;
