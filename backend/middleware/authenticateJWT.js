import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * JWT Authentication Middleware
 * Verifies JWT token from Authorization header and attaches user to request
 */
const authenticateJWT = async (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                success: false,
                error: 'Unauthorized: No token provided' 
            });
        }

        // Extract token
        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        

        req.userId = decoded.userId;
        
        next();
    } catch (error) {
        console.error('JWT Authentication error:', error);

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                success: false,
                error: 'Unauthorized: Invalid token' 
            });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false,
                error: 'Unauthorized: Token expired' 
            });
        }

        res.status(500).json({ 
            success: false,
            error: 'Internal server error' 
        });
    }
};

export default authenticateJWT;
