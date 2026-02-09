function LastUpdated({ timestamp }) {
    if (!timestamp) return null;

    const getRelativeTime = (date) => {
        const seconds = Math.floor((new Date() - date) / 1000);

        if (seconds < 10) return 'Just now';
        if (seconds < 60) return `${seconds}s ago`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        return date.toLocaleTimeString();
    };

    return (
        <div className="flex items-center gap-2 text-xs text-gray-400">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Updated {getRelativeTime(timestamp)}</span>
        </div>
    );
}

export default LastUpdated;
