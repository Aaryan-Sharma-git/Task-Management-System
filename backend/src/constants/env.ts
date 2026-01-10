import "dotenv/config";

const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;

  if (value === undefined) {
    throw new Error(`Environment variable ${key} is undefined`);
  }

  return value;
};

export const MONGO_URI = getEnv('MONGO_URI');
export const PORT = getEnv('PORT', '8000');
export const FRONTEND_URL = getEnv('FRONTEND_URL');
export const JWT_ACCESS_TOKEN_SECRET = getEnv('JWT_ACCESS_TOKEN_SECRET');
export const JWT_REFRESH_TOKEN_SECRET = getEnv('JWT_REFRESH_TOKEN_SECRET');
