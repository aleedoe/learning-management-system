/**
 * JWT Helper
 * Token generation and verification utilities
 */

import jwt, { JwtPayload as BaseJwtPayload, SignOptions, Secret } from 'jsonwebtoken';
import config from '../config';
import { JwtPayload } from '../types';

/**
 * Generate access token
 */
export const generateAccessToken = (payload: Omit<JwtPayload, 'iat' | 'exp'>): string => {
    // Use type assertion for expiresIn since we know our config values are valid duration strings
    return jwt.sign(payload, config.jwt.accessSecret as Secret, {
        expiresIn: config.jwt.accessExpiresIn,
    } as SignOptions);
};

/**
 * Generate refresh token
 */
export const generateRefreshToken = (payload: Omit<JwtPayload, 'iat' | 'exp'>): string => {
    return jwt.sign(payload, config.jwt.refreshSecret as Secret, {
        expiresIn: config.jwt.refreshExpiresIn,
    } as SignOptions);
};

/**
 * Verify access token
 */
export const verifyAccessToken = (token: string): JwtPayload => {
    return jwt.verify(token, config.jwt.accessSecret) as JwtPayload;
};

/**
 * Verify refresh token
 */
export const verifyRefreshToken = (token: string): JwtPayload => {
    return jwt.verify(token, config.jwt.refreshSecret) as JwtPayload;
};

/**
 * Decode token without verification
 */
export const decodeToken = (token: string): BaseJwtPayload | string | null => {
    return jwt.decode(token);
};

type TimeUnit = 's' | 'm' | 'h' | 'd';

const multipliers: Record<TimeUnit, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
};

/**
 * Calculate token expiration date from duration string
 */
export const getExpirationDate = (duration: string): Date => {
    const now = Date.now();
    const match = duration.match(/^(\d+)([smhd])$/);

    if (!match) {
        throw new Error('Invalid duration format');
    }

    const value = parseInt(match[1], 10);
    const unit = match[2] as TimeUnit;

    return new Date(now + value * multipliers[unit]);
};
