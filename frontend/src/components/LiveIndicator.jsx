function LiveIndicator({ minute }) {
    return (
        <div className="flex items-center gap-2 px-3 py-1 bg-red-50 border border-red-200 rounded-full">
            <span className="live-dot"></span>
            <span className="text-red-600 font-semibold text-sm">
                LIVE {minute ? `${minute}'` : ''}
            </span>
        </div>
    );
}

export default LiveIndicator;
