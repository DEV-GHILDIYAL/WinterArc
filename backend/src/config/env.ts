import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const PORT = process.env.PORT || '5000';
export const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/winterarc';
export const JWT_SECRET = process.env.JWT_SECRET || 'winterarc_super_secret_jwt_key_2026';
export const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3000';
export const NODE_ENV = process.env.NODE_ENV || 'development';
