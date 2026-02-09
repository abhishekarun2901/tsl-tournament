import spon1 from '../assets/spon1.jpeg';
import spon2 from '../assets/spon2.jpeg';
import spon3 from '../assets/spon3.jpeg';
import spon4 from '../assets/spon4.jpeg';

function SponsorsSection() {
    const sponsors = [
        { name: 'Sponsor 1', logo: spon1 },
        { name: 'Sponsor 2', logo: spon2 },
        { name: 'Sponsor 3', logo: spon3 },
        { name: 'Sponsor 4', logo: spon4 }
    ];

    return (
        <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl sm:rounded-3xl p-6 sm:p-10 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-1/4 w-32 sm:w-64 h-32 sm:h-64 bg-primary-500 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-24 sm:w-48 h-24 sm:h-48 bg-secondary-500 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10">
                {/* Header */}
                <div className="text-center mb-6 sm:mb-10">
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2">
                        Our Sponsors
                    </h2>
                    <p className="text-gray-400 text-sm sm:text-base">
                        Proudly supported by
                    </p>
                </div>

                {/* 2x2 Sponsor Grid */}
                <div className="grid grid-cols-2 gap-3 sm:gap-6 max-w-2xl mx-auto">
                    {sponsors.map((sponsor, index) => (
                        <div
                            key={index}
                            className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center justify-center hover:bg-white/15 transition-all duration-300 hover:scale-105 group"
                        >
                            <img
                                src={sponsor.logo}
                                alt={sponsor.name}
                                className="w-full h-auto max-h-24 sm:max-h-32 object-contain rounded-lg opacity-90 group-hover:opacity-100 transition-opacity"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SponsorsSection;
