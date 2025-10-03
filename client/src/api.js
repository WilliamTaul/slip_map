import axios from "axios";

const api = axios.create({
    withCredentials: true,
});

api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('auth/token')) {
            originalRequest._retry = true;

            try {
                const res = await api.post('http://localhost:3001/auth/token');
                
                const newAccessToken = res.data.token;
                localStorage.setItem('accessToken', newAccessToken);

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (err) {
                return Promise.reject(err);
            }
        }
        
        return Promise.reject(error);
    }
);

export default api;