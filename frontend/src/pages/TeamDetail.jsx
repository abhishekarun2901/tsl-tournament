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
            'ME': 'Mechanical Engineering',
            'EC': 'Electronics & Communication',
            'CSE': 'Computer Science',
            'EE': 'Electrical Engineering',
            'CE': 'Civil Engineering',
            'IC': 'Instrumentation & Control'
        };
        return deptNames[dept] || dept;
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Back Link */}
            <Link to="/teams" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Teams
            </Link>

            {/* Team Header */}
            <div className="card p-8 mb-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <TeamLogo team={team} size="xl" />
                    <div className="text-center md:text-left flex-1">
                        <div className="inline-block px-3 py-1 bg-surface-100 text-gray-600 rounded-full text-sm font-medium mb-2">
                            Pool {team.pool}
                        </div>
                        <h1 className="font-display text-3xl font-bold text-gray-900">{team.name}</h1>
                        <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-6">
                            <div>
                                <p className="text-sm text-gray-500">Manager</p>
                                <p className="font-semibold text-gray-900">{team.manager}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Captain</p>
                                <p className="font-semibold text-gray-900">{team.captain}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Squad Size</p>
                                <p className="font-semibold text-gray-900">{sortedPlayers.length} players</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Squad */}
            <section>
                <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Squad</h2>
                <div className="card overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="table-header">
                                <th className="px-4 py-3 text-left w-12">#</th>
                                <th className="px-4 py-3 text-left">Player</th>
                                <th className="px-4 py-3 text-left">Department</th>
                                <th className="px-4 py-3 text-center">Goals</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedPlayers.map((player, index) => (
                                <tr key={player._id} className="table-row">
                                    <td className="px-4 py-3 text-gray-500">{player.jerseyNumber || index + 1}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-gray-900">{player.name}</span>
                                            {player.name === team.captain && (
                                                <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs rounded font-medium">
                                                    Captain
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
                                            <span className="font-bold text-primary-600">{player.goals}</span>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Department Legend */}
                <div className="mt-4 p-4 bg-surface-100 rounded-lg">
                    <p className="text-sm font-medium text-gray-600 mb-2">Departments</p>
                    <div className="flex flex-wrap gap-2">
                        {['ME', 'EC', 'CSE', 'EE', 'CE', 'IC'].map(dept => (
                            <span
                                key={dept}
                                className={`px-2 py-1 rounded text-xs ${getDepartmentColor(dept)}`}
                                title={getDepartmentFull(dept)}
                            >
                                {dept} - {getDepartmentFull(dept)}
                            </span>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default TeamDetail;
