export const MESSAGES = {
    ERROR: {
        USER: {
            ALREADY_EXISTS: "Email already in use",
            NOT_FOUND: "User not found",
        },
        AUTH: {
            INVALID_CREDENTIALS: "Invalid email or password",
            TOKEN_MISSING: "Authorization token missing or malformed",
            TOKEN_INVALID: "Invalid or expired token",
            REFRESH_TOKEN_MISSING: "Refresh token is missing.",
            REFRESH_TOKEN_INVALID: "Refresh token is invalid or expired.",
            ALREADY_LOGGED_OUT: "Already logged out.",
        },
        GENERAL: {
            INTERNAL_SERVER: "Something went wrong. Please try again later.",
        },
    },
    VALIDATION: {
        USER: {
            NAME_REQUIRED: "Name is required.",
            EMAIL_REQUIRED: "Email is required.",
            INVALID_EMAIL: "Email format is invalid.",
            PASSWORD_REQUIRED: "Password is required.",
            PASSWORD_TOO_SHORT: "Password must be at least 8 characters.",
        },
    },
    SUCCESS: {
        USER: {
            CREATED: "User created successfully.",
            LOGGED_IN: "You have successfully logged in.",
            LOGGED_OUT: "You have successfully logged out.",
            TOKEN_REFRESHED: "Access token renovated successfully.",
        },
    },
};
