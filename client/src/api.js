import axios from "axios";

const api = axios.create({
    withCredentials: true,
});

api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                await api.post('http://localhost:3001/auth/token');

                return api(originalRequest);
            } catch (err) {
                return Promise.reject(err);
            }
        }
        
        return Promise.reject(error);
    }
);

export default api;