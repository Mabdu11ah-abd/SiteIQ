# Authentication API Documentation

## Overview
Password-based authentication system using JWT (JSON Web Tokens) and bcrypt for secure password hashing.

## Base URL
```
http://localhost:4500/api/auth
```

---

## Endpoints

### 1. Register New User
**POST** `/api/auth/register`

Creates a new user account with hashed password.

#### Request Body
```json
{
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Validation Rules
- `name`: Required, 3-50 characters
- `username`: Required, 3-30 characters, alphanumeric + underscore only, unique
- `email`: Required, valid email format, unique
- `password`: Required, minimum 6 characters

#### Success Response (201 Created)
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "60d5ec49f1b2c72b8c8e4f1a",
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "membership": "freemium",
    "image": "https://default-avatar.com/avatar.png",
    "isVerified": false
  }
}
```

#### Error Responses
```json
// 400 - Missing fields
{
  "success": false,
  "message": "All fields are required (name, username, email, password)"
}

// 400 - Password too short
{
  "success": false,
  "message": "Password must be at least 6 characters long"
}

// 409 - Email exists
{
  "success": false,
  "message": "Email already registered"
}

// 409 - Username taken
{
  "success": false,
  "message": "Username already taken"
}
```

---

### 2. Login User
**POST** `/api/auth/login`

Authenticates user and returns JWT token.

#### Request Body
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "60d5ec49f1b2c72b8c8e4f1a",
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "membership": "freemium",
    "image": "https://default-avatar.com/avatar.png",
    "isVerified": false,
    "loginCount": 5
  }
}
```

#### Error Responses
```json
// 400 - Missing fields
{
  "success": false,
  "message": "Email and password are required"
}

// 401 - Invalid credentials
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

### 3. Get Current User
**GET** `/api/auth/me`

Returns currently authenticated user's information.

#### Headers Required
```
Authorization: Bearer <your_jwt_token>
```

#### Success Response (200 OK)
```json
{
  "success": true,
  "user": {
    "_id": "60d5ec49f1b2c72b8c8e4f1a",
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "membership": "freemium",
    "image": "https://default-avatar.com/avatar.png",
    "isVerified": false,
    "loginCount": 5
  }
}
```

#### Error Responses
```json
// 401 - No token
{
  "success": false,
  "error": "Unauthorized: No token provided"
}

// 401 - Invalid token
{
  "success": false,
  "error": "Unauthorized: Invalid token"
}

// 401 - Expired token
{
  "success": false,
  "error": "Unauthorized: Token expired"
}

// 404 - User not found
{
  "success": false,
  "error": "User not found"
}
```

---

### 4. Logout
**POST** `/api/auth/logout`

Endpoint for logout acknowledgment. (Client should remove token)

#### Headers Required
```
Authorization: Bearer <your_jwt_token>
```

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Logout successful. Please remove token from client."
}
```

---

## JWT Token Details

### Token Structure
```javascript
{
  "userId": "60d5ec49f1b2c72b8c8e4f1a",
  "iat": 1643723400,  // Issued at
  "exp": 1644328200   // Expires (7 days from iat)
}
```

### Token Expiration
- Tokens expire after **7 days**
- Client should handle token refresh or re-login

### Token Usage
Include the token in all protected API requests:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Security Features

1. **Password Hashing**: bcrypt with 10 salt rounds
2. **JWT Signing**: HS256 algorithm with secret key
3. **Email Case-Insensitive**: All emails stored lowercase
4. **Password Hash Exclusion**: Password hashes never returned in responses
5. **Login Tracking**: Login count incremented on each successful login

---

## Example Usage

### JavaScript (Fetch API)

#### Register
```javascript
const response = await fetch('http://localhost:4500/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@example.com',
    password: 'securePassword123'
  })
});

const data = await response.json();
if (data.success) {
  // Store token
  localStorage.setItem('token', data.token);
  console.log('Registered:', data.user);
}
```

#### Login
```javascript
const response = await fetch('http://localhost:4500/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'securePassword123'
  })
});

const data = await response.json();
if (data.success) {
  localStorage.setItem('token', data.token);
  console.log('Logged in:', data.user);
}
```

#### Get Current User
```javascript
const token = localStorage.getItem('token');
const response = await fetch('http://localhost:4500/api/auth/me', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();
if (data.success) {
  console.log('Current user:', data.user);
}
```

#### Protected API Call
```javascript
const token = localStorage.getItem('token');
const response = await fetch('http://localhost:4500/api/users/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

## cURL Examples

### Register
```bash
curl -X POST http://localhost:4500/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

### Login
```bash
curl -X POST http://localhost:4500/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

### Get Current User
```bash
curl -X GET http://localhost:4500/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Environment Variables Required

Add to your `.env` file:
```env
JWT_SECRET=your-super-secret-jwt-key-here-minimum-32-characters
MONGODB_URI=mongodb://localhost:27017/siteiq
PORT=4500
```

**Generate a secure JWT secret:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## Client-Side Implementation Tips

### 1. Token Storage
```javascript
// Store token after login/register
localStorage.setItem('token', data.token);

// Or use secure httpOnly cookies (preferred for production)
```

### 2. Axios Interceptor
```javascript
import axios from 'axios';

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 3. Handle Token Expiration
```javascript
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## Migration Notes

### From Clerk to JWT
- Old `clerkUserId` field is now optional (for backward compatibility)
- New users get auto-generated `clerkUserId` as `user_<timestamp>`
- All controllers now use `req.userId` instead of `req.auth.userId`
- Password-based auth completely independent of Clerk

### Database Changes
```javascript
// User model updates:
clerkUserId: { type: String, sparse: true, unique: true } // Optional now
passwordHash: { type: String, required: true } // Required for new users
```
