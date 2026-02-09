import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getTeam } from '../services/api';
import TeamLogo from '../components/TeamLogo';
import LoadingSpinner from '../components/LoadingSpinner';

function TeamDetail() {
    const { id } = useParams();
    const [team, setTeam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                setLoading(true);
                const response = await getTeam(id);
                setTeam(response.data);
            } catch (err) {
                setError('Failed to load team');
            } finally {
                setLoading(false);
            }
        };

        fetchTeam();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <LoadingSpinner text="Loading team..." />
            </div>
        );
    }

    if (error || !team) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8 text-center">
                <p className="text-red-500">{error || 'Team not found'}</p>
                <Link to="/teams" className="btn btn-primary mt-4">Back to Teams</Link>
            </div>
        );
    }

    const sortedPlayers = team.players || [];

    const getDepartmentColor = (department) => {
        switch (department) {
            case 'ME': return 'bg-blue-100 text-blue-700';
            case 'EC': return 'bg-green-100 text-green-700';
            case 'CSE': return 'bg-purple-100 text-purple-700';
            case 'EE': return 'bg-yellow-100 text-yellow-700';
            case 'CE': return 'bg-orange-100 text-orange-700';
            case 'IC': return 'bg-pink-100 text-pink-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getDepartmentFull = (dept) => {
        const deptNames = {
            'ME': 'Mechanical',
            'EC': 'Electronics',
            'CSE': 'Computer Science',
            'EE': 'Electrical',
            'CE': 'Civil',
            'IC': 'Instrumentation'
        };
        return deptNames[dept] || dept;
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Back Link */}
            <Link to="/teams" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 mb-6 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Teams
            </Link>

            {/* Team Header */}
            <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-8 mb-8 overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary-500 rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                    <TeamLogo team={team} size="xl" />
                    <div className="text-center md:text-left flex-1">
                        <div className="inline-block px-3 py-1 bg-white/10 text-white/80 rounded-full text-sm font-medium mb-2 backdrop-blur-sm">
                            Pool {team.pool}
                        </div>
                        <h1 className="font-display text-3xl md:text-4xl font-bold text-white">{team.name}</h1>
                        <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-6">
                            <div>
                                <p className="text-sm text-gray-400">Manager</p>
                                <p className="font-semibold text-white">{team.manager}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Captain</p>
                                <p className="font-semibold text-white">{team.captain}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Squad */}
            <section>
                <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Squad</h2>
                <div className="card overflow-hidden border-2 border-gray-100">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-12">#</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Player</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Dept</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Goals</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedPlayers.map((player, index) => (
                                <tr key={player._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 text-gray-400 font-medium">{player.jerseyNumber || index + 1}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-gray-900">{player.name}</span>
                                            {player.name === team.captain && (
                                                <span className="px-2 py-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-xs rounded font-bold">
                                                    C
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`px-2 py-1 rounded text-xs font-medium ${getDepartmentColor(player.department)}`}
                                            title={getDepartmentFull(player.department)}
                                        >
                                            {player.department}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        {player.goals > 0 ? (
                                            <span className="inline-flex items-center justify-center w-8 h-8 bg-primary-100 text-primary-700 font-bold rounded-full">
                                                {player.goals}
                                            </span>
                                        ) : (
                                            <span className="text-gray-300">—</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Department Legend */}
                <div className="mt-6 p-4 bg-surface-100 rounded-xl">
                    <p className="text-sm font-medium text-gray-600 mb-3">Departments</p>
                    <div className="flex flex-wrap gap-2">
                        {['ME', 'EC', 'CSE', 'EE', 'CE', 'IC'].map(dept => (
                            <span
                                key={dept}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium ${getDepartmentColor(dept)}`}
                            >
                                {dept} • {getDepartmentFull(dept)}
                            </span>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default TeamDetail;
