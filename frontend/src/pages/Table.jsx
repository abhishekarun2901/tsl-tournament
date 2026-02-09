import { getStandings } from '../services/api';
import { useLivePolling } from '../hooks/useLivePolling';
import PointsTable from '../components/PointsTable';
import LoadingSpinner from '../components/LoadingSpinner';

function Table() {
    const { data: standings, loading } = useLivePolling(getStandings, 10000);

    if (loading && !standings) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <LoadingSpinner text="Loading standings..." />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <section className="text-center mb-10">
                <h1 className="font-display text-4xl md:text-5xl font-extrabold mb-4">
                    <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                        Points
                    </span>
                    <span className="bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
                        {' '}Table
                    </span>
                </h1>
                <p className="text-gray-600 text-lg">
                    Live standings • Sorted by points & goal difference
                </p>
            </section>

            {/* Pool Legend */}
            <div className="flex justify-center gap-4 mb-8">
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-primary-500"></span>
                    <span className="text-sm text-gray-600">Pool A</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-secondary-500"></span>
                    <span className="text-sm text-gray-600">Pool B</span>
                </div>
            </div>

            {/* Standings Table */}
            {standings && <PointsTable standings={standings} />}

            {/* Tiebreaker Info */}
            <div className="mt-8 p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl text-white">
                <h3 className="font-display font-bold text-lg mb-4">Tiebreaker Rules</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="text-center p-3 bg-white/10 rounded-xl">
                        <div className="text-2xl font-bold text-primary-400">1st</div>
                        <div className="text-gray-400">Points</div>
                    </div>
                    <div className="text-center p-3 bg-white/10 rounded-xl">
                        <div className="text-2xl font-bold text-primary-400">2nd</div>
                        <div className="text-gray-400">Goal Difference</div>
                    </div>
                    <div className="text-center p-3 bg-white/10 rounded-xl">
                        <div className="text-2xl font-bold text-primary-400">3rd</div>
                        <div className="text-gray-400">Goals For</div>
                    </div>
                    <div className="text-center p-3 bg-white/10 rounded-xl">
                        <div className="text-2xl font-bold text-primary-400">4th</div>
                        <div className="text-gray-400">Head-to-Head</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Table;
