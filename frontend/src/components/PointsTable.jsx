import TeamLogo from './TeamLogo';

function PointsTable({ standings, compact = false }) {
    if (!standings || standings.length === 0) {
        return (
            <div className="card p-8 text-center text-gray-500">
                No standings data available
            </div>
        );
    }

    // Sort standings by points (desc), then goal difference (desc), then goals for (desc)
    const sortedStandings = [...standings].sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.gd !== a.gd) return b.gd - a.gd;
        if (b.gf !== a.gf) return b.gf - a.gf;
        // Finally sort alphabetically by team name
        return (a.teamId?.name || '').localeCompare(b.teamId?.name || '');
    });

    if (compact) {
        return (
            <div className="card overflow-hidden">
                {sortedStandings.slice(0, 5).map((standing, index) => (
                    <div
                        key={standing._id}
                        className={`flex items-center justify-between p-3 border-b border-surface-100 last:border-b-0 hover:bg-surface-50 ${index === 0 ? 'bg-gradient-to-r from-yellow-50 to-white' : ''
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <span className={`font-bold w-6 text-center ${index < 4 ? 'text-primary-600' : 'text-gray-500'}`}>
                                {index + 1}
                            </span>
                            <span className="font-medium text-gray-900 text-sm">
                                {standing.teamId?.name}
                            </span>
                        </div>
                        <span className="font-bold text-gray-900">{standing.points}</span>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="card overflow-hidden border-2 border-gray-100">
            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-12">Pos</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Team</th>
                            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 w-12">P</th>
                            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 w-12">W</th>
                            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 w-12">D</th>
                            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 w-12">L</th>
                            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 w-12">GF</th>
                            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 w-12">GA</th>
                            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 w-12">GD</th>
                            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 w-16">Pts</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedStandings.map((standing, index) => (
                            <tr
                                key={standing._id}
                                className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${index === 0 ? 'bg-gradient-to-r from-yellow-50 to-white' : ''
                                    }`}
                            >
                                <td className="px-4 py-3">
                                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${index === 0
                                            ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-white'
                                            : index < 4
                                                ? 'bg-primary-100 text-primary-600'
                                                : 'bg-gray-100 text-gray-500'
                                        }`}>
                                        {index + 1}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <TeamLogo team={standing.teamId} size="sm" />
                                        <div>
                                            <span className="font-semibold text-gray-900">{standing.teamId?.name}</span>
                                            <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${standing.teamId?.pool === 'A'
                                                    ? 'bg-primary-100 text-primary-600'
                                                    : 'bg-secondary-100 text-secondary-600'
                                                }`}>
                                                Pool {standing.teamId?.pool}
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-center text-gray-600">{standing.played}</td>
                                <td className="px-4 py-3 text-center text-green-600 font-medium">{standing.won}</td>
                                <td className="px-4 py-3 text-center text-gray-500">{standing.draw}</td>
                                <td className="px-4 py-3 text-center text-red-500">{standing.lost}</td>
                                <td className="px-4 py-3 text-center text-gray-600">{standing.gf}</td>
                                <td className="px-4 py-3 text-center text-gray-600">{standing.ga}</td>
                                <td className="px-4 py-3 text-center font-medium">
                                    <span className={standing.gd > 0 ? 'text-green-600' : standing.gd < 0 ? 'text-red-500' : 'text-gray-500'}>
                                        {standing.gd > 0 ? `+${standing.gd}` : standing.gd}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <span className={`inline-flex items-center justify-center w-10 h-10 rounded-xl font-bold text-lg ${index === 0
                                            ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-white'
                                            : 'bg-gray-100 text-gray-900'
                                        }`}>
                                        {standing.points}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile View */}
            <div className="md:hidden">
                {sortedStandings.map((standing, index) => (
                    <div
                        key={standing._id}
                        className={`p-4 border-b border-gray-100 last:border-b-0 ${index === 0 ? 'bg-gradient-to-r from-yellow-50 to-white' : ''
                            }`}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${index === 0
                                        ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-white'
                                        : index < 4
                                            ? 'bg-primary-100 text-primary-600'
                                            : 'bg-gray-100 text-gray-500'
                                    }`}>
                                    {index + 1}
                                </span>
                                <TeamLogo team={standing.teamId} size="sm" />
                                <span className="font-semibold text-gray-900">{standing.teamId?.name}</span>
                            </div>
                            <span className={`inline-flex items-center justify-center w-10 h-10 rounded-xl font-bold text-lg ${index === 0
                                    ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-white'
                                    : 'bg-gray-100 text-gray-900'
                                }`}>
                                {standing.points}
                            </span>
                        </div>
                        <div className="grid grid-cols-4 gap-2 text-center text-sm">
                            <div className="bg-gray-50 rounded-lg p-2">
                                <div className="text-gray-400 text-xs">P</div>
                                <div className="font-semibold">{standing.played}</div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-2">
                                <div className="text-gray-400 text-xs">W-D-L</div>
                                <div className="font-semibold">
                                    <span className="text-green-600">{standing.won}</span>-
                                    <span className="text-gray-500">{standing.draw}</span>-
                                    <span className="text-red-500">{standing.lost}</span>
                                </div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-2">
                                <div className="text-gray-400 text-xs">GF-GA</div>
                                <div className="font-semibold">{standing.gf}-{standing.ga}</div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-2">
                                <div className="text-gray-400 text-xs">GD</div>
                                <div className={`font-semibold ${standing.gd > 0 ? 'text-green-600' : standing.gd < 0 ? 'text-red-500' : ''}`}>
                                    {standing.gd > 0 ? `+${standing.gd}` : standing.gd}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PointsTable;
