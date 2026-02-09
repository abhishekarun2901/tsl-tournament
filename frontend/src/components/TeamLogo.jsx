function TeamLogo({ team, size = 'md', className = '' }) {
    const sizes = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-12 h-12 text-sm',
        lg: 'w-16 h-16 text-base',
        xl: 'w-24 h-24 text-xl'
    };

    // Team color mapping for fallback logos
    const teamColors = {
        'Liverpool FC': 'from-red-500 to-red-600',
        'Inter Milan': 'from-blue-800 to-black',
        'Fiorentina': 'from-purple-600 to-purple-700',
        'Lazio': 'from-sky-400 to-sky-500',
        'Arsenal': 'from-red-600 to-red-700',
        'Força FC': 'from-yellow-500 to-green-500',
        'São Paulo FC': 'from-red-500 to-white',
        'AS Monaco': 'from-red-500 to-white'
    };

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ')
            .filter(word => !['FC', 'AS'].includes(word))
            .map(word => word[0])
            .join('')
            .slice(0, 3)
            .toUpperCase();
    };

    const gradientClass = teamColors[team?.name] || 'from-gray-400 to-gray-500';

    if (team?.logo) {
        return (
            <img
                src={team.logo}
                alt={team.name}
                className={`${sizes[size]} rounded-full object-cover ${className}`}
            />
        );
    }

    return (
        <div
            className={`${sizes[size]} rounded-full bg-gradient-to-br ${gradientClass} flex items-center justify-center font-bold text-white shadow-md ${className}`}
        >
            {getInitials(team?.name)}
        </div>
    );
}

export default TeamLogo;
