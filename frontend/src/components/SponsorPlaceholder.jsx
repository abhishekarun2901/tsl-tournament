function SponsorPlaceholder({ size = 'md', title = 'Sponsor' }) {
    const sizes = {
        sm: 'h-20',
        md: 'h-32',
        lg: 'h-48'
    };

    return (
        <div className={`${sizes[size]} bg-gradient-to-br from-surface-100 to-surface-200 rounded-xl border-2 border-dashed border-surface-300 flex flex-col items-center justify-center gap-2 hover:border-primary-300 hover:bg-primary-50/30 transition-all duration-300`}>
            <div className="w-12 h-12 bg-surface-300 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-surface-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            </div>
            <span className="text-sm font-medium text-surface-500">{title}</span>
        </div>
    );
}

function SponsorBanner() {
    return (
        <div className="bg-white rounded-xl shadow-card p-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 text-center">
                Official Sponsors
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <SponsorPlaceholder title="Title Sponsor" />
                <SponsorPlaceholder title="Gold Sponsor" />
                <SponsorPlaceholder title="Silver Sponsor" />
                <SponsorPlaceholder title="Partner" />
            </div>
        </div>
    );
}

export { SponsorPlaceholder, SponsorBanner };
export default SponsorPlaceholder;
