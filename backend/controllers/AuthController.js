import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

/**
 * Generate JWT Token
 */
const generateToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: '7d' } // Token expires in 7 days
    );
};

/**
 * Register a new user
 */
export const register = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;

        // Validate required fields
        if (!name || !username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required (name, username, email, password)'
            });
        }

        // Validate password strength
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(409).json({
                    success: false,
                    message: 'Email already registered'
                });
            }
            if (existingUser.username === username) {
                return res.status(409).json({
                    success: false,
                    message: 'Username already taken'
                });
            }
        }

        // Hash password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Create new user
        const newUser = new User({
            name,
            username,
            email,
            passwordHash,
            clerkUserId: `user_${Date.now()}`, // Temporary until we fully migrate away from Clerk
            membership: 'freemium',
            loginCount: 0
        });

        await newUser.save();

        // Generate JWT token
        const token = generateToken(newUser._id);

        // Return user data without password
        const userResponse = {
            _id: newUser._id,
            name: newUser.name,
            username: newUser.username,
            email: newUser.email,
            membership: newUser.membership,
            image: newUser.image,
            isVerified: newUser.isVerified
        };

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: userResponse
        });

    } catch (error) {
        console.error('Registration error:', error);
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        });
    }
};

/**
 * Login user
 */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Update login count
        user.loginCount += 1;
        await user.save();

        // Generate JWT token
        const token = generateToken(user._id);

        // Return user data without password
        const userResponse = {
            _id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            membership: user.membership,
            image: user.image,
            isVerified: user.isVerified,
            loginCount: user.loginCount
        };

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: userResponse
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
};

/**
 * Get current user (for verifying token)
 */
export const getCurrentUser = async (req, res) => {
    try {
        if (!req.userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const userResponse = {
            _id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            membership: user.membership,
            image: user.image,
            isVerified: user.isVerified,
            loginCount: user.loginCount
        };

        res.status(200).json({
            success: true,
            user: userResponse
        });
    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

/**
 * Logout user (client-side token removal)
 */
export const logout = async (req, res) => {
    // With JWT, logout is handled client-side by removing the token
    // This endpoint is optional and can be used for any server-side cleanup
    res.status(200).json({
        success: true,
        message: 'Logout successful. Please remove token from client.'
    });
};