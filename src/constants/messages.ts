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
      SEND_FAILED: "Failed to send email. Please try again later.",
      EMAIL_NOT_VERIFIED: "You must verify your email before logging in.",
      ALREADY_VERIFIED: "This email is already verified.",
      INVALID_OR_EXPIRED_TOKEN: "Invalid or expired reset token.",
      USER_INACTIVE: "User inactive.",
    },
    AUTHORIZATION: {
      FORBIDDEN: "You do not have permission to access this resource.",
      USER_NOT_AUTHENTICATED: "Access denied. User not authenticated.",
      CANNOT_CHANGE_ROLE: "Only administrators can change the role.",
    },
    GENERAL: {
      INTERNAL_SERVER: "Something went wrong. Please try again later.",
    },
    BUDGET: {
      DUPLICATE_BUDGET: "Duplicate budget.",
      NOT_FOUNTD: "Budget not found.",
    },
    ACCOUNT: {
      DUPLICATE_BUDGET: "Duplicate account.",
      NOT_FOUNTD: "Account not found.",
      CANNOT_DELETE_ACCOUNT_WITH_BALANCE_GREATER_THAN_ZERO:
        "Account cannot be deleted, the balance is greater than zero.",
    },
  },
  VALIDATION: {
    GENERAL: {
      INVALID_OBJECT_ID: "Invalid ObjectId format.",
    },
    USER: {
      NAME_REQUIRED: "Name is required.",
      EMAIL_REQUIRED: "Email is required.",
      INVALID_EMAIL: "Email format is invalid.",
      PASSWORD_REQUIRED: "Password is required.",
      PASSWORD_TOO_SHORT: (min: number) =>
        `Password must be at least ${min} characters`,
      INVALID_ROLE: "Invalid role. Allowed roles are: admin, user, viewer.",
      PASSWORD_WEAK:
        "Password must include uppercase, lowercase, number, and special character.",
    },
    BUDGET: {
      START_DATE_MUST_BE_BEFORE_END_DATE: "Start date must be before end date.",
      AMOUNT_REQUIRED: "Amount is required.",
      AMOUNT_MUST_BE_POSITIVE: "Amount must be positive.",
      START_DATE_REQUIRED: "Start date is required.",
      START_END_REQUIRED: "End date is required.",
      BUDGET_ALREADY_EXISTS:
        "A budget already exists for this category and date range.",
      CATEGORY_MUST_BE_PROVIDED_WHEN_UPDATE_RANGE_DATE:
        "A category must be provided when updating range date.",
      RANGE_DATE_MUST_BE_PROVIDED_WHEN_UPDATING_CATEGORY:
        "Range date must be provided when updating category.",
    },
    CATEGORY: {
      NOT_FOUND: "Category not found.",
      NAME: "Name is required.",
    },
    ACCOUNT: {
      NAME_REQUIRED: "Name is required.",
      BALANCE_REQUIRED: "Balance is required.",
    },
    TRANSACTION: {
      AMOUNT_REQUIRED: "Amount is required.",
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
      ACTIVATED: "User activated successfully.",
    },
    AUTH: {
      PASSWORD_UPDATED: "Password updated successfully",
      EMAIL_VERIFIED: "Email successfully verified.",
      VERIFICATION_EMAIL_RESENT: "Verification email resent successfully.",
      RESET_EMAIL_SENT: "Reset email sent successfully.",
    },
    CATEGORY: {
      CREATED: "Category created successfully.",
    },
    BUDGET: {
      CREATED: "Budget created successfully.",
      UPDATED: "Budget updated successfully.",
      DELETED: "Budget deleted successfully.",
    },
    ACCOUNT: {
      CREATED: "Account created successfully.",
      UPDATED: "Account updated successfully.",
      DELETED: "Account deleted successfully.",
    },
    TRANSACTION: {
      CREATED: "Transaction created successfully.",
      UPDATED: "Transaction updated successfully.",
      DELETED: "Transaction deleted successfully.",
    },
  },
};
