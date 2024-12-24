export const STATUS = {
    SUCCESS: 200,
    BAD_REQUEST: 400,
    SERVER_ERROR: 500,
    UN_AUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    CREATED: 201,
    NO_CONTENT: 204,
};

export const BASE_API = "api/v1";
export const COOKIE_REFRESH_TOKEN = "refresh-token";

export const routes = {
    user: {
        root: `/${BASE_API}/user`,
        login: `/login/client`,
        register: `/register`,
        verifyEmail: `/verify-email`,
        logout: `/logout`,
        refreshToken: `/refresh-token`,
    },
};
