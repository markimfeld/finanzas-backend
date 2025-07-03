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
            CURRENT_PASSWORD_REQUIRED: "Current password is required",
            INCORRECT_CURRENT_PASSWORD: "Current password is incorrect",
            PASSWORD_TOO_SHORT: "Password must be at least 8 characters",
            INVALID_VERIFICATION_TOKEN: "Invalid or expired verification token.",
            SEND_FAILED: 'Failed to send email. Please try again later.',
            EMAIL_NOT_VERIFIED: 'You must verify your email before logging in.',
            ALREADY_VERIFIED: 'This email is already verified.',
            INVALID_OR_EXPIRED_TOKEN: 'Invalid or expired reset token.',
            USER_INACTIVE: 'User inactive.',
        },
        AUTHORIZATION: {
            FORBIDDEN: 'You do not have permission to access this resource.',
            USER_NOT_AUTHENTICATED: 'Access denied. User not authenticated.',
            CANNOT_CHANGE_ROLE: 'Only administrators can change the role.'
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
            PASSWORD_TOO_SHORT: (min: number) => `Password must be at least ${min} characters`,
            INVALID_ROLE: "Invalid role. Allowed roles are: admin, user, viewer.",
            PASSWORD_WEAK: "Password must include uppercase, lowercase, number, and special character."
        },
    },
    SUCCESS: {
        USER: {
            CREATED: "User created successfully.",
            UPDATED: "User updated successfully.",
            LOGGED_IN: "You have successfully logged in.",
            LOGGED_OUT: "You have successfully logged out.",
            TOKEN_REFRESHED: "Access token renovated successfully.",
            DEACTIVATED: "User deactivated successfully.",
            ACTIVATED: "User activated successfully."
        },
        AUTH: {
            PASSWORD_UPDATED: "Password updated successfully",
            EMAIL_VERIFIED: "Email successfully verified.",
            VERIFICATION_EMAIL_RESENT: 'Verification email resent successfully.',
            RESET_EMAIL_SENT: 'Reset email sent successfully.'
        }
    },
};
