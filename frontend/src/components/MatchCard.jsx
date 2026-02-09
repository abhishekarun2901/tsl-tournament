import { useState } from 'react';
import TeamLogo from './TeamLogo';
import LiveIndicator from './LiveIndicator';

function MatchCard({ match, showDetails = true }) {
    const [expanded, setExpanded] = useState(false);

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            weekday: 'short',
            day: 'numeric',
            month: 'short'
        });
    };

    const getStatusBadge = () => {
        switch (match.status) {
            case 'live':
                return <LiveIndicator minute={match.currentMinute} />;
            case 'finished':
                return (
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs sm:text-sm font-medium">
                        Full Time
                    </span>
                );
            default:
                return (
                    <span className="px-3 py-1 bg-secondary-50 text-secondary-600 rounded-full text-xs sm:text-sm font-medium">
                        {formatTime(match.matchTime)}
                    </span>
                );
        }
    };

    const hasGoals = match.goalscorers && match.goalscorers.length > 0;
    const hasCards = match.cards && match.cards.length > 0;

    // Group goalscorers by team
    const teamAGoals = match.goalscorers?.filter(
        g => g.teamId?._id === match.teamA?._id || g.teamId === match.teamA?._id
    ) || [];
    const teamBGoals = match.goalscorers?.filter(
        g => g.teamId?._id === match.teamB?._id || g.teamId === match.teamB?._id
    ) || [];

    return (
        <div
            className={`card p-3 sm:p-4 hover:shadow-card-hover transition-all duration-300 ${match.status === 'live' ? 'ring-2 ring-red-200 bg-red-50/30' : ''
                }`}
        >
            {/* Match Date for upcoming */}
            {match.status === 'upcoming' && (
                <div className="text-center text-xs text-gray-500 mb-2">
                    {formatDate(match.matchTime)}
                </div>
            )}

            {/* Main Match Display - Mobile Optimized */}
            <div className="flex items-center justify-between gap-2">
                {/* Team A */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <TeamLogo team={match.teamA} size="sm" className="flex-shrink-0" />
                        <span className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base truncate">
                            {match.teamA?.name}
                        </span>
                    </div>
                </div>

                {/* Score - Always visible */}
                <div className="flex-shrink-0 px-2 sm:px-4 md:px-6 text-center">
                    {match.status === 'upcoming' ? (
                        <span className="text-lg sm:text-xl md:text-2xl font-bold text-gray-400">vs</span>
                    ) : (
                        <div className="flex items-center gap-1 sm:gap-2">
                            <span className={`text-xl sm:text-2xl md:text-3xl font-extrabold ${match.scoreA > match.scoreB ? 'text-primary-600' : 'text-gray-900'}`}>
                                {match.scoreA}
                            </span>
                            <span className="text-gray-300 text-lg sm:text-xl">—</span>
                            <span className={`text-xl sm:text-2xl md:text-3xl font-extrabold ${match.scoreB > match.scoreA ? 'text-primary-600' : 'text-gray-900'}`}>
                                {match.scoreB}
                            </span>
                        </div>
                    )}
                </div>

                {/* Team B */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-end gap-2 sm:gap-3">
                        <span className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base truncate text-right">
                            {match.teamB?.name}
                        </span>
                        <TeamLogo team={match.teamB} size="sm" className="flex-shrink-0" />
                    </div>
                </div>
            </div>

            {/* Status Badge */}
            <div className="flex justify-center mt-2 sm:mt-3">
                {getStatusBadge()}
            </div>

            {/* Expand button */}
            {showDetails && (hasGoals || hasCards) && (
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="w-full mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-surface-200 text-xs sm:text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1"
                >
                    {expanded ? 'Hide details' : 'Show goal scorers'}
                    <svg
                        className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            )}

            {/* Expanded Details */}
            {expanded && (
                <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-surface-200 animate-slide-up">
                    <div className="grid grid-cols-2 gap-2 sm:gap-4">
                        {/* Team A Scorers */}
                        <div className="space-y-1">
                            {teamAGoals.map((goal, idx) => (
                                <div key={idx} className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                                    <span>⚽</span>
                                    <span className="text-gray-700 truncate">{goal.playerId?.name || 'Unknown'}</span>
                                    <span className="text-gray-400">{goal.minute}'</span>
                                </div>
                            ))}
                        </div>

                        {/* Team B Scorers */}
                        <div className="space-y-1 text-right">
                            {teamBGoals.map((goal, idx) => (
                                <div key={idx} className="flex items-center justify-end gap-1 sm:gap-2 text-xs sm:text-sm">
                                    <span className="text-gray-400">{goal.minute}'</span>
                                    <span className="text-gray-700 truncate">{goal.playerId?.name || 'Unknown'}</span>
                                    <span>⚽</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Cards */}
                    {hasCards && (
                        <div className="mt-2 pt-2 border-t border-surface-100">
                            {match.cards.map((card, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                                    <span>
                                        {card.cardType === 'red' ? '🟥' : '🟨'}
                                    </span>
                                    <span className="truncate">{card.playerId?.name || 'Unknown'}</span>
                                    <span className="text-gray-400">{card.minute}'</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default MatchCard;
