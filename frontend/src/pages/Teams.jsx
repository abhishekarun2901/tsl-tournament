import { Link } from 'react-router-dom';
import { getTeams } from '../services/api';
import { useLivePolling } from '../hooks/useLivePolling';
import TeamLogo from '../components/TeamLogo';
import LoadingSpinner from '../components/LoadingSpinner';

function Teams() {
    const { data: teams, loading } = useLivePolling(getTeams, 30000);

    if (loading) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <LoadingSpinner text="Loading teams..." />
            </div>
        );
    }

    // Group teams by pool
    const poolA = teams?.filter(t => t.pool === 'A') || [];
    const poolB = teams?.filter(t => t.pool === 'B') || [];

    const TeamCard = ({ team }) => (
        <Link
            to={`/teams/${team._id}`}
            className="card p-6 hover:shadow-card-hover transition-all duration-300 group"
        >
            <div className="flex items-center gap-4">
                <TeamLogo team={team} size="lg" />
                <div className="flex-1 min-w-0">
                    <h3 className="font-display font-bold text-lg text-gray-900 group-hover:text-primary-600 transition-colors truncate">
                        {team.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Manager: {team.manager}
                    </p>
                    <p className="text-sm text-gray-500">
                        Captain: {team.captain}
                    </p>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-primary-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </div>
        </Link>
    );

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="font-display text-3xl font-bold text-gray-900">Teams</h1>
                <p className="text-gray-500 mt-1">All participating teams in the tournament</p>
            </div>

            {/* Pool A */}
            <section className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-primary-500 text-white px-4 py-1.5 rounded-lg font-bold">
                        Pool A
                    </div>
                    <div className="flex-1 h-px bg-surface-300"></div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    {poolA.map(team => (
                        <TeamCard key={team._id} team={team} />
                    ))}
                </div>
            </section>

            {/* Pool B */}
            <section>
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-secondary-500 text-white px-4 py-1.5 rounded-lg font-bold">
                        Pool B
                    </div>
                    <div className="flex-1 h-px bg-surface-300"></div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    {poolB.map(team => (
                        <TeamCard key={team._id} team={team} />
                    ))}
                </div>
            </section>
        </div>
    );
}

export default Teams;
