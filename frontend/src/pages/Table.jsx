import { getStandings } from '../services/api';
import { useLivePolling } from '../hooks/useLivePolling';
import PointsTable from '../components/PointsTable';
import LoadingSpinner from '../components/LoadingSpinner';
import LastUpdated from '../components/LastUpdated';

function Table() {
    const { data: standings, loading, lastUpdated } = useLivePolling(getStandings, 10000);

    if (loading) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <LoadingSpinner text="Loading standings..." />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-display text-3xl font-bold text-gray-900">Points Table</h1>
                    <p className="text-gray-500 mt-1">Auto-calculated standings</p>
                </div>
                <LastUpdated timestamp={lastUpdated} />
            </div>

            {/* Points Info */}
            <div className="card p-4 mb-6 bg-gradient-to-r from-primary-50 to-secondary-50">
                <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-primary-600">3 pts</span>
                        <span className="text-gray-600">Win</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-600">1 pt</span>
                        <span className="text-gray-600">Draw</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-400">0 pts</span>
                        <span className="text-gray-600">Loss</span>
                    </div>
                </div>
            </div>

            {/* Table */}
            <PointsTable standings={standings} highlightTop={4} highlightBottom={1} />

            {/* Tiebreaker Info */}
            <div className="mt-6 p-4 bg-surface-100 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Tiebreaker Rules</h3>
                <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
                    <li>Points</li>
                    <li>Goal Difference (GD)</li>
                    <li>Goals For (GF)</li>
                    <li>Head-to-Head record</li>
                </ol>
            </div>
        </div>
    );
}

export default Table;
