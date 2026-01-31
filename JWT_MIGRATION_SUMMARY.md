# JWT Authentication Migration Summary

## Overview
Successfully migrated from Clerk-based authentication to JWT-based authentication across the entire SiteIQ backend.

## What Was Changed

### 1. New JWT Authentication Middleware
**File Created:** `backend/middleware/authenticateJWT.js`
- Verifies JWT tokens from `Authorization: Bearer <token>` header
- Attaches `req.user` and `req.userId` to request object
- Handles token expiration and validation errors

**Usage in Routes:**
```javascript
import authenticateJWT from '../middleware/authenticateJWT.js';
router.get('/profile', authenticateJWT, getUserProfile);
```

### 2. Updated Routes (JWT Middleware Applied)
All protected routes now use `authenticateJWT` middleware:

- ✅ `routes/userRoutes.js` - User profile, deletion, subscriptions
- ✅ `routes/dashboardRoutes.js` - Dashboard overview, websites, chat history
- ✅ `routes/seoRoutes.js` - SEO reports generation and retrieval
- ✅ `routes/techstackroute.js` - Tech stack recommendations
- ✅ `routes/chatRoutes.js` - Website chat functionality
- ✅ `routes/websiteRoutes.js` - Website management
- ✅ `routes/history.routes.js` - Website history tracking
- ✅ `routes/lightHouse.routes.js` - Lighthouse analysis
- ✅ `routes/seoRecommendation.routes.js` - SEO recommendations
- ✅ `routes/techstackChatRoute.js` - Tech stack chat
- ✅ `routes/userChatRoutes.js` - User chat management
- ✅ `routes/stripeRoute.js` - Stripe checkout (authentication added)

### 3. Updated Controllers
All controllers now use `req.userId` instead of `req.auth.userId`:

- ✅ `controllers/chatController.js`
- ✅ `controllers/dashboardController.js`
- ✅ `controllers/seoRecommendation.controller.js`
- ✅ `controllers/seoController.js`
- ✅ `controllers/lightHouse.controller.js`
- ✅ `controllers/history.controller.js`
- ✅ `controllers/techStackController.js`
- ✅ `controllers/techstackChatController.js`
- ✅ `controllers/websiteController.js`
- ✅ `controllers/userChatController.js`
- ✅ `controllers/stripeController.js`

### 4. Updated Middleware
- ✅ `middleware/checkSubscriptionLimit.js` - Now uses `req.userId`

### 5. Server.js Cleanup
- Removed unused Clerk imports (`clerkMiddleware`, `mockClerkAuth`)
- Cleaned up imports section

## Migration Checklist

### What You Need to Do Next:

1. **Environment Variables**
   Add to your `.env` file:
   ```env
   JWT_SECRET=your-super-secret-jwt-key-here
   ```
   Generate a secure secret: `openssl rand -base64 64`

2. **User Registration/Login Endpoints**
   You'll need to create these endpoints to issue JWT tokens:
   
   ```javascript
   // Example login endpoint
   router.post('/login', async (req, res) => {
     const { email, password } = req.body;
     // Verify credentials
     const user = await User.findOne({ email });
     // ... password verification logic
     
     // Generate JWT token
     const token = jwt.sign(
       { userId: user._id }, 
       process.env.JWT_SECRET,
       { expiresIn: '7d' }
     );
     
     res.json({ token, user });
   });
   ```

3. **Update Frontend**
   - Store JWT token (localStorage, cookies, etc.)
   - Send token in Authorization header:
     ```javascript
     headers: {
       'Authorization': `Bearer ${token}`
     }
     ```

4. **Remove Clerk Dependencies**
   ```bash
   npm uninstall @clerk/express
   ```

5. **Database Considerations**
   - The User model still has `clerkUserId` field
   - Consider migrating to regular password-based auth:
     - Add `password` field (hashed with bcrypt)
     - Remove `clerkUserId` field
     - Or keep both for backward compatibility

## API Request Format

### Before (Clerk):
```javascript
headers: {
  'Authorization': 'Clerk user_xxxxx'
}
```

### After (JWT):
```javascript
headers: {
  'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
}
```

## Token Payload
The JWT token contains:
```json
{
  "userId": "mongodb_object_id",
  "iat": 1234567890,
  "exp": 1234567890
}
```

## Error Responses
The JWT middleware returns consistent error responses:
- `401 Unauthorized: No token provided` - Missing Authorization header
- `401 Unauthorized: Invalid token` - Token is malformed or tampered
- `401 Unauthorized: Token expired` - Token has expired
- `404 User not found` - Token valid but user doesn't exist

## Testing
Test each protected endpoint with:
1. No token (should return 401)
2. Invalid token (should return 401)
3. Valid token (should work normally)

Example test:
```bash
# Without token
curl http://localhost:4500/api/users/profile

# With token
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:4500/api/users/profile
```

## Notes
- Webhook routes remain unauthenticated (verified by webhook signatures)
- All user-facing routes now require JWT authentication
- Database queries still use `clerkUserId` field - consider renaming to `userId` in future
