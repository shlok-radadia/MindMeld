import axios from "axios";


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response) => response,
  (error) => {
    // console.log("AXIOS 401 FROM:", error.config?.url);
    // console.log("TOKEN EXISTS:", localStorage.getItem("token"));
    // return Promise.reject(error);
    const status = error.response?.status;
    const url = error.config?.url;

    
    if (
      status === 401 &&
      !url.includes("/api/users/login") &&
      !url.includes("/api/users/register")
    ) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;