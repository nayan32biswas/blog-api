import { KeyObject } from './types/common.type';

export const DATABASE: KeyObject = {
  HOST: '172.28.0.1',
  PORT: 5432,
  POSTGRES_USER: process.env.POSTGRES_USER,
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
  POSTGRES_DB: process.env.POSTGRES_DB,
};

export const EMAIL_CONF: KeyObject = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_HOST,
    pass: process.env.EMAIL_PASS,
  },
};

export const COMMON: KeyObject = {
  DEBUG: true,
  HOST: process.env.HOST || 'http://localhost:8000',
  PAGE_SIZE: 10,
  LOGIN_EXPIRES_IN: '48h',
  EMAIL_VERIFICATION_EXPIRES_IN: '1h',
  JWT_ALGORITHM: 'HS256',
};
