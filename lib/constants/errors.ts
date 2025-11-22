export const AUTH_ERRORS = {
  FIREBASE_NOT_CONFIGURED: 'Firebase is not configured. Please check your .env.local file.',
  INVALID_EMAIL: 'Invalid email address',
  USER_NOT_FOUND: 'User not found',
  WRONG_PASSWORD: 'Incorrect password',
  INVALID_CREDENTIALS: 'Invalid email or password',
  EMAIL_ALREADY_IN_USE: 'This email is already registered',
  WEAK_PASSWORD: 'Password is too weak',
  POPUP_CLOSED: 'Sign-in popup was closed',
  POPUP_BLOCKED: 'Popup was blocked by browser. Please allow popups for this site.',
  INVALID_LINK: 'The sign-in link is invalid or has expired',
  EXPIRED_LINK: 'The sign-in link has expired. Please request a new one.',
  ACCOUNT_DISABLED: 'This account has been disabled',
  UNKNOWN_ERROR: 'An unknown error occurred',
} as const;

export const VALIDATION_MESSAGES = {
  REQUIRED_FIELDS: 'Please fill in all required fields',
  PASSWORD_MIN_LENGTH: 'Password must be at least 6 characters',
  PASSWORDS_DONT_MATCH: 'Passwords do not match',
  INVALID_EMAIL_FORMAT: 'Please enter a valid email address',
} as const;

