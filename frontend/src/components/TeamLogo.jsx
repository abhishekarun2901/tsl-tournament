function TeamLogo({ team, size = 'md', className = '' }) {
    const sizeClasses = {
        xs: 'w-6 h-6 text-xs',
        sm: 'w-8 h-8 sm:w-10 sm:h-10 text-xs sm:text-sm',
        md: 'w-10 h-10 sm:w-12 sm:h-12 text-sm',
        lg: 'w-14 h-14 sm:w-16 sm:h-16 text-lg',
        xl: 'w-20 h-20 sm:w-24 sm:h-24 text-xl sm:text-2xl'
    };

    const getInitials = (name) => {
        if (!name) return '?';
        const words = name.split(' ');
        if (words.length >= 2) {
            return (words[0][0] + words[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    const getTeamColor = (name) => {
        const colors = {
            'Liverpool FC': 'from-red-500 to-red-600',
            'Inter Milan': 'from-blue-900 to-blue-950',
            'Fiorentina': 'from-purple-600 to-purple-700',
            'Lazio': 'from-sky-400 to-sky-500',
            'Arsenal': 'from-red-600 to-red-700',
            'Força FC': 'from-green-500 to-green-600',
            'São Paulo FC': 'from-red-700 to-gray-900',
            'AS Monaco': 'from-red-500 to-red-600'
        };
        return colors[name] || 'from-gray-500 to-gray-600';
    };

    if (team?.logo) {
        return (
            <img
                src={team.logo}
                alt={team.name}
                className={`${sizeClasses[size]} rounded-full object-cover shadow-md ${className}`}
            />
        );
    }

    return (
        <div
            className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${getTeamColor(team?.name)} 
                flex items-center justify-center font-bold text-white shadow-md 
                ring-2 ring-white/30 flex-shrink-0 ${className}`}
        >
            {getInitials(team?.name)}
        </div>
    );
}

export default TeamLogo;
