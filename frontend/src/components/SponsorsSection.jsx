import spon1 from '../assets/spon1.jpeg';
import spon2 from '../assets/spon2.jpeg';
import spon3 from '../assets/spon3.jpeg';
import spon4 from '../assets/spon4.jpeg';

const sponsors = [
    { id: 1, image: spon1 },
    { id: 2, image: spon2 },
    { id: 3, image: spon3 },
    { id: 4, image: spon4 }
];

function SponsorsSection() {
    return (
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 md:p-12">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-72 h-72 bg-primary-500 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-500 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
            </div>

            <div className="relative z-10">
                <div className="text-center mb-10">
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
                        Our Sponsors
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full"></div>
                </div>

                {/* 2x2 Grid of Sponsors */}
                <div className="grid grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {sponsors.map((sponsor) => (
                        <div
                            key={sponsor.id}
                            className="group relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <img
                                src={sponsor.image}
                                alt="Sponsor"
                                className="relative z-10 w-full h-40 md:h-56 object-contain filter brightness-110"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export { SponsorsSection };
export default SponsorsSection;
