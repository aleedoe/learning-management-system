/**
 * Password Helper
 * Bcrypt password hashing and verification
 */

import bcrypt from 'bcrypt';
import config from '../config';

/**
 * Hash a password
 */
export const hashPassword = async (password: string): Promise<string> => {
    return bcrypt.hash(password, config.bcrypt.saltRounds);
};

/**
 * Compare password with hash
 */
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
    return bcrypt.compare(password, hash);
};
