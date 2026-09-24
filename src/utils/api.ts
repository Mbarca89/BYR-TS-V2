import axios from 'axios';

export const SERVER_URL = (import.meta.env.VITE_SERVER_URL || '').replace(/\/$/, '');
const api = axios.create({ baseURL: SERVER_URL, withCredentials: true, timeout: 30000 });
let csrf: { headerName: string; token: string } | undefined;
let pendingCsrf: Promise<void> | undefined;

export const clearCsrf = () => { csrf = undefined; };
export async function refreshCsrf() {
    if (!pendingCsrf) {
        pendingCsrf = api.get('/api/auth/csrf').then(({ data }) => { csrf = data; })
            .finally(() => { pendingCsrf = undefined; });
    }
    await pendingCsrf;
}

api.interceptors.request.use(async config => {
    if (!['get', 'head', 'options'].includes((config.method || 'get').toLowerCase())) {
        if (!csrf) await refreshCsrf();
        if (csrf) config.headers.set(csrf.headerName, csrf.token);
    }
    return config;
});
api.interceptors.response.use(response => response, error => {
    if (error.response?.status === 401 && !error.config?.url?.endsWith('/api/auth/login')) {
        clearCsrf();
        window.dispatchEvent(new Event('byr-session-expired'));
    }
    if (error.response?.status === 403) clearCsrf();
    return Promise.reject(error);
});
export default api;
