# 🚀 Quick Start Guide - Password Authentication

## Prerequisites
- Node.js installed
- MongoDB running
- bcrypt installed ✅
- jsonwebtoken installed ✅

## Step 1: Configure Environment
Create or update your `.env` file:

```bash
# Generate a secure JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Add to `.env`:
```env
JWT_SECRET=<paste the generated secret here>
MONGODB_URI=mongodb://localhost:27017/siteiq
PORT=4500
```

## Step 2: Start the Server
```bash
cd backend
npm start
```

You should see:
```
Server is running on http://localhost:4500
Connected to MongoDB
```

## Step 3: Test Authentication

### Option A: Using cURL

#### 1. Register a new user
```bash
curl -X POST http://localhost:4500/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "password": "securePass123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

#### 2. Login
```bash
curl -X POST http://localhost:4500/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePass123"
  }'
```

#### 3. Get current user (replace TOKEN with your actual token)
```bash
curl -X GET http://localhost:4500/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

### Option B: Using the Test Script
```bash
node backend/tests/auth.manual.test.js
```

### Option C: Using Postman/Thunder Client
1. Import `SiteIQ_Auth_Postman_Collection.json`
2. Run "Register User" request
3. Token will be automatically saved
4. Run "Get Current User" to verify

## Step 4: Use Protected Routes

All existing routes now require authentication. Add the token to requests:

```bash
# Example: Get user profile
curl -X GET http://localhost:4500/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN"

# Example: Get dashboard
curl -X GET http://localhost:4500/api/dashboard/overview \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Troubleshooting

### Error: "JWT_SECRET is not defined"
- Make sure `.env` file exists in backend directory
- Verify `JWT_SECRET` is set in `.env`
- Restart the server

### Error: "MongoDB connection failed"
- Make sure MongoDB is running
- Check `MONGODB_URI` in `.env`
- Default: `mongodb://localhost:27017/siteiq`

### Error: "Email already registered"
- Try a different email address
- Or use the login endpoint instead

### Error: "Invalid token"
- Token may have expired (7 days)
- Register/login again to get a new token

## Frontend Integration Example

```javascript
// Register
async function register(name, username, email, password) {
  const response = await fetch('http://localhost:4500/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, username, email, password })
  });
  
  const data = await response.json();
  if (data.success) {
    localStorage.setItem('token', data.token);
    return data.user;
  }
  throw new Error(data.message);
}

// Login
async function login(email, password) {
  const response = await fetch('http://localhost:4500/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  if (data.success) {
    localStorage.setItem('token', data.token);
    return data.user;
  }
  throw new Error(data.message);
}

// Make authenticated request
async function fetchProtectedData(endpoint) {
  const token = localStorage.getItem('token');
  const response = await fetch(`http://localhost:4500${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (response.status === 401) {
    // Token expired or invalid
    localStorage.removeItem('token');
    window.location.href = '/login';
    return;
  }
  
  return response.json();
}
```

## React Example with Context

```javascript
// AuthContext.js
import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      fetch('http://localhost:4500/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setUser(data.user);
          } else {
            logout();
          }
        })
        .catch(() => logout());
    }
  }, [token]);

  const login = async (email, password) => {
    const response = await fetch('http://localhost:4500/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    if (data.success) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('token', data.token);
    }
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

## Security Checklist

- ✅ Passwords hashed with bcrypt
- ✅ JWT tokens with expiration
- ✅ Password hash excluded from responses
- ✅ Token verification on protected routes
- ✅ Email validation
- ✅ Username validation
- ⚠️ TODO: Add rate limiting
- ⚠️ TODO: Add email verification
- ⚠️ TODO: Add password reset

## API Endpoints Summary

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login user |
| GET | `/api/auth/me` | ✅ | Get current user |
| POST | `/api/auth/logout` | ✅ | Logout (informational) |
| GET | `/api/users/profile` | ✅ | User profile |
| GET | `/api/dashboard/overview` | ✅ | Dashboard data |
| GET | `/api/websites` | ✅ | User websites |
| ... | All other routes | ✅ | Protected |

## Next Steps

1. ✅ Set JWT_SECRET in .env
2. ✅ Test authentication endpoints
3. 🔄 Update your frontend to use JWT tokens
4. 🔄 Remove Clerk dependencies
5. 🔄 Add email verification (optional)
6. 🔄 Add password reset (optional)
7. 🔄 Add rate limiting (recommended)

## Need Help?

- Check [AUTHENTICATION_API.md](./AUTHENTICATION_API.md) for full API documentation
- Check [AUTH_IMPLEMENTATION_SUMMARY.md](./AUTH_IMPLEMENTATION_SUMMARY.md) for implementation details
- Run test script: `node backend/tests/auth.manual.test.js`

---

🎉 **You're all set!** Start building your authenticated application!
