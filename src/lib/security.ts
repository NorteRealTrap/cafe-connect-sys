export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
export const JWT_ALGORITHM = 'HS256';

if (!JWT_SECRET && process.env.NODE_ENV !== 'production') {
  console.warn('⚠️  JWT_SECRET não definido no .env');
}

export const securityConfig = {
  jwt: {
    secret: JWT_SECRET,
    expiresIn: JWT_EXPIRES_IN,
    algorithm: JWT_ALGORITHM as const,
  },
  password: {
    minLength: 8,
    maxLength: 128,
    requireSpecialChar: true,
    requireNumbers: true,
    requireUppercase: true,
  },
  encryption: {
    algorithm: 'aes-256-gcm',
    keyLength: 32,
  }
};

export const validatePassword = (password: string): boolean => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
  return password.length >= securityConfig.password.minLength && regex.test(password);
};

export const sanitizeString = (input: string): string => {
  return input
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, 1000);
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

export const sanitizeForLogs = (input: string | undefined | null): string => {
  if (input == null) return '';
  return String(input)
    .replace(/[\r\n]/g, ' ')
    .replace(/\s+/g, ' ')
    .substring(0, 1000);
};

export const sanitizeForDisplay = (input: string | undefined | null): string => {
  if (input == null) return '';
  return String(input)
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .substring(0, 500);
};
