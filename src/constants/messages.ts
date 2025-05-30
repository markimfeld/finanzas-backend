export const MESSAGES = {
  ERROR: {
    USER: {
      ALREADY_EXISTS: 'Email already in use',
      NOT_FOUND: 'User not found'
    },
    AUTH: {
      INVALID_CREDENTIALS: 'Invalid email or password',
      TOKEN_MISSING: 'Authorization token missing or malformed',
      TOKEN_INVALID: 'Invalid or expired token',
    },
    GENERAL: {
      INTERNAL_SERVER: 'Something went wrong. Please try again later.'
    }
  },
  VALIDATION: {
    USER: {
      NAME_REQUIRED: 'Name is required.',
      EMAIL_REQUIRED: 'Email is required.',
      INVALID_EMAIL: 'Email format is invalid.',
      PASSWORD_REQUIRED: 'Password is required.',
      PASSWORD_TOO_SHORT: 'Password must be at least 8 characters.'
    }
  },
  SUCCESS: {
    USER: {
      CREATED: "Usuario creado correctamente.",
      LOGGED_IN: "Inicio de sesión exitoso.",
    }
  }
}
