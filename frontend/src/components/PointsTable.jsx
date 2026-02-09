import TeamLogo from './TeamLogo';

function PointsTable({ standings, highlightTop = 4, highlightBottom = 1 }) {
    if (!standings || standings.length === 0) {
        return (
            <div className="card p-8 text-center text-gray-500">
                No standings data available
            </div>
        );
    }

    const getPositionChange = (standing, currentIndex) => {
        if (standing.previousPosition === null || standing.previousPosition === undefined) {
            return 'same';
        }
        const currentPosition = currentIndex + 1;
        if (standing.previousPosition > currentPosition) return 'up';
        if (standing.previousPosition < currentPosition) return 'down';
        return 'same';
    };

    const getPositionIcon = (change) => {
        switch (change) {
            case 'up':
                return <span className="pos-up">▲</span>;
            case 'down':
                return <span className="pos-down">▼</span>;
            default:
                return <span className="pos-same">–</span>;
        }
    };

    return (
        <div className="card overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="table-header">
                            <th className="px-4 py-3 text-left w-12">#</th>
                            <th className="px-4 py-3 text-left">Team</th>
                            <th className="px-4 py-3 text-center w-12">P</th>
                            <th className="px-4 py-3 text-center w-12">W</th>
                            <th className="px-4 py-3 text-center w-12">D</th>
                            <th className="px-4 py-3 text-center w-12">L</th>
                            <th className="px-4 py-3 text-center w-12">GF</th>
                            <th className="px-4 py-3 text-center w-12">GA</th>
                            <th className="px-4 py-3 text-center w-12">GD</th>
                            <th className="px-4 py-3 text-center w-16">Pts</th>
                        </tr>
                    </thead>
                    <tbody>
                        {standings.map((standing, index) => {
                            const position = index + 1;
                            const isTop = position <= highlightTop;
                            const isBottom = position > standings.length - highlightBottom;
                            const positionChange = getPositionChange(standing, index);

                            return (
                                <tr
                                    key={standing._id}
                                    className={`table-row transition-all duration-500 ${isTop ? 'top-4 bg-primary-50/30' : ''
                                        } ${isBottom ? 'relegation bg-red-50/30' : ''}`}
                                >
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1">
                                            <span className="font-bold text-gray-700">{position}</span>
                                            {getPositionIcon(positionChange)}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <TeamLogo team={standing.teamId} size="sm" />
                                            <span className="font-medium text-gray-900">
                                                {standing.teamId?.name}
                                            </span>
                                            <span className="text-xs text-gray-400 bg-surface-100 px-2 py-0.5 rounded">
                                                Pool {standing.teamId?.pool}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-center text-gray-600">{standing.played}</td>
                                    <td className="px-4 py-3 text-center text-green-600 font-medium">{standing.won}</td>
                                    <td className="px-4 py-3 text-center text-gray-600">{standing.draw}</td>
                                    <td className="px-4 py-3 text-center text-red-600 font-medium">{standing.lost}</td>
                                    <td className="px-4 py-3 text-center text-gray-600">{standing.gf}</td>
                                    <td className="px-4 py-3 text-center text-gray-600">{standing.ga}</td>
                                    <td className="px-4 py-3 text-center font-medium">
                                        <span className={standing.gd > 0 ? 'text-green-600' : standing.gd < 0 ? 'text-red-600' : 'text-gray-600'}>
                                            {standing.gd > 0 ? `+${standing.gd}` : standing.gd}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className="font-bold text-lg text-gray-900">{standing.points}</span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden">
                {standings.map((standing, index) => {
                    const position = index + 1;
                    const isTop = position <= highlightTop;
                    const isBottom = position > standings.length - highlightBottom;
                    const positionChange = getPositionChange(standing, index);

                    return (
                        <div
                            key={standing._id}
                            className={`p-4 border-b border-surface-200 last:border-b-0 ${isTop ? 'border-l-4 border-l-primary-500 bg-primary-50/30' : ''
                                } ${isBottom ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1 w-8">
                                        <span className="font-bold text-gray-700">{position}</span>
                                        {getPositionIcon(positionChange)}
                                    </div>
                                    <TeamLogo team={standing.teamId} size="sm" />
                                    <div>
                                        <p className="font-medium text-gray-900 text-sm">{standing.teamId?.name}</p>
                                        <p className="text-xs text-gray-500">
                                            {standing.played}P · GD: {standing.gd > 0 ? `+${standing.gd}` : standing.gd}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-xl text-gray-900">{standing.points}</p>
                                    <p className="text-xs text-gray-500">pts</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="px-4 py-3 bg-surface-100 border-t border-surface-200 flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary-500 rounded"></div>
                    <span>Top 4</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span>Bottom</span>
                </div>
            </div>
        </div>
    );
}

export default PointsTable;
