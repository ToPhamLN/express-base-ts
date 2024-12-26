export const BASE_API = "api/v1";
export const COOKIE_REFRESH_TOKEN = "refresh-token";

export const routes = {
    auth: {
        root: `/${BASE_API}/auth`,
        login: `/login/client`,
        register: `/register`,
        verifyEmail: `/verify-email`,
        logout: `/logout`,
        refreshToken: `/refresh-token`,
    },
    user: {
        root: `/${BASE_API}/user`,
        login: `/login/client`,
        register: `/register`,
        verifyEmail: `/verify-email`,
        logout: `/logout`,
        refreshToken: `/refresh-token`,
    },
};
