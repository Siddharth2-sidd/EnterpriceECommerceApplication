import axios from "axios";
// const baseURL = import.meta.env.VITE_API_URL;
const baseURL = "https://ecommerce-api-12-achua4h0cpb2ecdu.centralindia-01.azurewebsites.net/api";
const axiosClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Separate client prevents the refresh request from passing
// through the normal response interceptor.
const refreshClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshPromise = null;

function getAccessToken(data) {
  return (data?.token ?? data?.data?.token ?? null);
}

function getRefreshToken(data) {
  return (data?.refreshToken ?? null);
}

function clearAuthentication() {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");

  // AuthContext can listen for this event and update React state.
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("auth:logout"));
  }
}

// Attach the latest access token to each normal request.
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const requestUrl = originalRequest.url ?? "";
    const isRefreshRequest = requestUrl.includes("/Auth/refresh-token");

    // Refresh only once per failed request.
    // Do not refresh for login/refresh failures or other status codes.
    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      isRefreshRequest
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      clearAuthentication();
      return Promise.reject(error);
    }

    try {
      // Concurrent 401 responses share the same refresh request.
      if (!refreshPromise) {
        refreshPromise = refreshClient
          .post("/Auth/refresh-token", {
            // Your Swagger request schema uses this plural name.
            refreshTokens: refreshToken,
          })
          .then((response) => {
            const data = response?.data?.data ?? response.data;
            const newAccessToken = getAccessToken(data);
            const newRefreshToken = getRefreshToken(data);

            if (!newAccessToken) {
              throw new Error(
                "Refresh response did not contain an access token."
              );
            }

            localStorage.setItem("token", newAccessToken);

            // Keep the old refresh token only if your backend
            // does not rotate it. If rotation is enabled, use
            // the newly returned refresh token.
            if (newRefreshToken) {
              localStorage.setItem("refreshToken", newRefreshToken);
            }
            return newAccessToken;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      const newAccessToken = await refreshPromise;

      originalRequest.headers = originalRequest.headers ?? {};
      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      return axiosClient(originalRequest);
    } catch (refreshError) {
      clearAuthentication();
      return Promise.reject(refreshError);
    }
  }
);

export default axiosClient;
