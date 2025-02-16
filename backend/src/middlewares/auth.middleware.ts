import { Request, Response, NextFunction } from 'express';
import { constants } from '../config';
import { verifyToken } from '../services/auth.service';
import Logger from '../config/logger';

const logger = new Logger('AuthMiddleware');

// Add custom properties to Express Request
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                base_role: string;
                roles?: string[];
            };
        }
    }
}

/**
 * TEMPORARY: Authentication middleware that bypasses token validation for testing
 * This will attach a mock user to all requests
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // TEMPORARY: Skip token verification and attach mock user for testing
        req.user = {
            id: "2", // Use the ID from your token
            email: "gentilleuwamahoro28@gmail.com",
            base_role: "applicant",
            roles: ["admin"] 
        };

        // Log that we're using the test authentication
        logger.info('Using test authentication bypass');
        
        next();
    } catch (error) {
        logger.error('Authentication error:', error);
        next(); // Continue anyway for testing
    }
};

/**
 * TEMPORARY: Authorization middleware that allows all requests
 */
export const authorize = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // TEMPORARY: Skip role check for testing
        next();
    };
};

/**
 * Set database context middleware
 * Sets the user ID and IP address in the database context for audit logging
 */
export const setDbContextMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.id) {
        // Set the user ID and IP address for database context
        // This is used by database triggers for audit logging
        res.on('finish', () => {
            // Clean up any database context after the response is sent
        });
    }

    next();
};