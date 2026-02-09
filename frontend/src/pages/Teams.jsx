import { Link } from 'react-router-dom';
import { getTeams } from '../services/api';
import { useLivePolling } from '../hooks/useLivePolling';
import TeamLogo from '../components/TeamLogo';
import LoadingSpinner from '../components/LoadingSpinner';

function Teams() {
    const { data: teams, loading } = useLivePolling(getTeams, 30000);

    if (loading && !teams) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <LoadingSpinner text="Loading teams..." />
            </div>
        );
    }

    const poolA = teams?.filter(t => t.pool === 'A') || [];
    const poolB = teams?.filter(t => t.pool === 'B') || [];

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <section className="text-center mb-10">
                <h1 className="font-display text-4xl md:text-5xl font-extrabold mb-4">
                    <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                        Competing
                    </span>
                    <span className="bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
                        {' '}Teams
                    </span>
                </h1>
                <p className="text-gray-600 text-lg">
                    8 Teams • 2 Pools
                </p>
            </section>

            {/* Pool A */}
            <section className="mb-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg shadow-primary-500/30">
                        POOL A
                    </div>
                    <div className="h-px flex-1 bg-gradient-to-r from-primary-200 to-transparent"></div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    {poolA.map(team => (
                        <TeamCard key={team._id} team={team} />
                    ))}
                </div>
            </section>

            {/* Pool B */}
            <section>
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-gradient-to-r from-secondary-500 to-secondary-600 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg shadow-secondary-500/30">
                        POOL B
                    </div>
                    <div className="h-px flex-1 bg-gradient-to-r from-secondary-200 to-transparent"></div>
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

function TeamCard({ team }) {
    return (
        <Link
            to={`/teams/${team._id}`}
            className="group card p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-2 border-transparent hover:border-primary-200"
        >
            <div className="flex items-center gap-5">
                <div className="relative">
                    <TeamLogo team={team} size="lg" />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-500/20 to-secondary-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="flex-1">
                    <h3 className="font-display text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                        {team.name}
                    </h3>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm">
                        <div>
                            <span className="text-gray-400">Manager:</span>
                            <span className="text-gray-700 font-medium ml-1">{team.manager}</span>
                        </div>
                        <div>
                            <span className="text-gray-400">Captain:</span>
                            <span className="text-gray-700 font-medium ml-1">{team.captain}</span>
                        </div>
                    </div>
                </div>
                <svg className="w-5 h-5 text-gray-300 group-hover:text-primary-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </div>
        </Link>
    );
}

export default Teams;
