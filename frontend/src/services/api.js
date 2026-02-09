import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Public API calls
export const getTeams = () => api.get('/teams');
export const getTeam = (id) => api.get(`/teams/${id}`);
export const getMatches = () => api.get('/matches');
export const getLiveMatches = () => api.get('/matches/live');
export const getTodayMatches = () => api.get('/matches/today');
export const getStandings = () => api.get('/standings');
export const getPlayers = () => api.get('/players');
export const getTopScorers = () => api.get('/topscorers');
export const getCleanSheets = () => api.get('/cleansheets');
export const getSettings = () => api.get('/settings');

// Admin API calls
const adminApi = (secret) => {
    return axios.create({
        baseURL: `${API_URL}/admin`,
        headers: {
            'Content-Type': 'application/json',
            'x-admin-secret': secret
        }
    });
};

export const verifySecret = (secret) =>
    adminApi(secret).post('/verify');

// Settings
export const getAdminSettings = (secret) =>
    adminApi(secret).get('/settings');

export const updateSettings = (secret, data) =>
    adminApi(secret).put('/settings', data);

// Teams
export const createTeam = (secret, data) =>
    adminApi(secret).post('/team', data);

export const updateTeam = (secret, id, data) =>
    adminApi(secret).put(`/team/${id}`, data);

// Players
export const createPlayer = (secret, data) =>
    adminApi(secret).post('/player', data);

export const updatePlayer = (secret, id, data) =>
    adminApi(secret).put(`/player/${id}`, data);

export const updateCleanSheet = (secret, playerId, increment) =>
    adminApi(secret).patch(`/player/${playerId}/cleansheet`, { increment });

// Matches
export const createMatch = (secret, data) =>
    adminApi(secret).post('/match', data);

export const updateMatch = (secret, id, data) =>
    adminApi(secret).put(`/match/${id}`, data);

export const deleteMatch = (secret, id) =>
    adminApi(secret).delete(`/match/${id}`);

export const updateMatchStatus = (secret, id, data) =>
    adminApi(secret).patch(`/match/${id}/status`, data);

export const updateMatchScore = (secret, id, data) =>
    adminApi(secret).patch(`/match/${id}/score`, data);

export const addGoal = (secret, matchId, data) =>
    adminApi(secret).post(`/match/${matchId}/goal`, data);

export const removeGoal = (secret, matchId, goalIndex) =>
    adminApi(secret).delete(`/match/${matchId}/goal`, { data: { goalIndex } });

export const addCard = (secret, matchId, data) =>
    adminApi(secret).post(`/match/${matchId}/card`, data);

export const reorderMatches = (secret, matchOrders) =>
    adminApi(secret).patch('/matches/reorder', { matchOrders });

export const recalculateStandings = (secret) =>
    adminApi(secret).post('/recalculate-standings');

export default api;
