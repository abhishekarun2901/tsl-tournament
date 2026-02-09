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

export const createTeam = (secret, data) =>
    adminApi(secret).post('/team', data);

export const updateTeam = (secret, id, data) =>
    adminApi(secret).put(`/team/${id}`, data);

export const createPlayer = (secret, data) =>
    adminApi(secret).post('/player', data);

export const updatePlayer = (secret, id, data) =>
    adminApi(secret).put(`/player/${id}`, data);

export const createMatch = (secret, data) =>
    adminApi(secret).post('/match', data);

export const updateMatchStatus = (secret, id, data) =>
    adminApi(secret).patch(`/match/${id}/status`, data);

export const updateMatchScore = (secret, id, data) =>
    adminApi(secret).patch(`/match/${id}/score`, data);

export const addGoal = (secret, matchId, data) =>
    adminApi(secret).post(`/match/${matchId}/goal`, data);

export const removeGoal = (secret, matchId, data) =>
    adminApi(secret).delete(`/match/${matchId}/goal`, { data });

export const addCard = (secret, matchId, data) =>
    adminApi(secret).post(`/match/${matchId}/card`, data);

export const recalculateStandings = (secret) =>
    adminApi(secret).post('/recalculate-standings');

export default api;
