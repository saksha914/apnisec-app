# ApniSec - Enterprise Cybersecurity Platform

A full-stack Next.js 15+ application for managing cybersecurity services including Cloud Security, Red Team Assessment, and VAPT (Vulnerability Assessment and Penetration Testing).

## 🚀 Features

### Backend Architecture (OOP-Based)
- **Custom JWT Authentication** with bcrypt password hashing
- **Refresh Token System** for secure session management
- **Class-based OOP Architecture** with dependency injection
- **Custom Rate Limiting** (100 requests per 15 minutes per IP/user)
- **Email Integration** with Resend API and HTML templates
- **RESTful APIs** following OOP principles

### Frontend
- **Modern Next.js 15+** with App Router and React 19+
- **Responsive Design** with Tailwind CSS
- **SEO Optimized** pages with metadata and structured data
- **Professional Landing Page** with ApniSec branding
- **Issue Management Dashboard** with filtering and search
- **User Profile Management** with password change functionality

### Security Features
- **Rate Limiting** with proper HTTP 429 responses
- **Input Validation** using Zod schemas
- **SQL Injection Protection** via Prisma ORM
- **XSS Protection** with proper data sanitization
- **CSRF Protection** built into Next.js

## 🏗️ Architecture

### Backend Structure
```
lib/
├── core/                     # Core OOP infrastructure
│   ├── base/                # Base classes
│   ├── interfaces/          # TypeScript interfaces
│   └── errors/              # Custom error classes
├── auth/                    # Authentication system
│   ├── services/           # Auth business logic
│   ├── middleware/         # Auth middleware
│   └── validators/         # Input validation
├── users/                   # User management
├── issues/                  # Issue management
├── ratelimit/               # Rate limiting
└── email/                   # Email services
```

### API Endpoints

#### Authentication
- `POST /api/auth/register` - User registration with welcome email
- `POST /api/auth/login` - User login with JWT tokens
- `POST /api/auth/logout` - Logout and token invalidation
- `POST /api/auth/refresh` - Refresh access token

#### User Profile
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/profile/password` - Change password

#### Issue Management
- `GET /api/issues` - Get user issues with filtering
- `POST /api/issues` - Create new issue with email notification
- `GET /api/issues/[id]` - Get specific issue
- `PUT /api/issues/[id]` - Update issue
- `DELETE /api/issues/[id]` - Delete issue

## 🛠️ Technology Stack

- **Framework:** Next.js 15+ with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** Custom JWT with bcrypt
- **Email:** Resend API
- **Validation:** Zod schemas
- **Rate Limiting:** Custom implementation with database storage

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Resend API key (for email functionality)

## ⚡ Quick Start

### 1. Clone and Install
```bash
git clone <repository-url>
cd apnisec-app
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env
```

### 3. Configure Environment Variables
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/apnisec?schema=public"

# JWT Authentication
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_REFRESH_SECRET="your-refresh-token-secret-change-this-in-production"
JWT_EXPIRY="15m"
JWT_REFRESH_EXPIRY="7d"

# Resend Email API
RESEND_API_KEY="re_your_resend_api_key"
RESEND_FROM_EMAIL="hello@yourdomain.com"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"

# Rate Limiting
RATE_LIMIT_WINDOW_MS="900000"  # 15 minutes
RATE_LIMIT_MAX_REQUESTS="100"
```

### 4. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Run migrations (if using an existing database)
npx prisma migrate dev

# Or push schema to database
npx prisma db push
```

### 5. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 🚀 Deployment

### Recommended Platforms
- **Vercel** (recommended for Next.js)
- **Railway** (for full-stack with database)
- **Netlify** (frontend only)

### Deployment Steps

#### Vercel Deployment
1. Push code to GitHub repository
2. Connect repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically

#### Environment Variables for Production
Ensure all environment variables are properly set in your deployment platform:
- Database URL (use a cloud database like Supabase, PlanetScale, or Neon)
- JWT secrets (generate strong, unique secrets)
- Resend API key
- Application URL

## 🧪 Testing the Application

### API Testing with cURL

#### Register a new user
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"SecurePass123","name":"Test User"}'
```

#### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"SecurePass123"}'
```

#### Create an issue (requires authentication)
```bash
curl -X POST http://localhost:3000/api/issues \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{"title":"Security Vulnerability","description":"Found SQL injection in login form","type":"VAPT","priority":"HIGH"}'
```

## 📊 SEO Optimization

The application includes comprehensive SEO optimization:

- **Meta tags** with proper title, description, and keywords
- **Open Graph** tags for social media sharing
- **Structured data** for search engines
- **Semantic HTML** with proper heading hierarchy
- **Mobile-responsive** design
- **Fast loading** with Next.js optimization

### Lighthouse Score Targets
- **Performance:** 90+
- **Accessibility:** 95+
- **Best Practices:** 95+
- **SEO:** 90+

## 🏛️ OOP Architecture Details

### Base Classes
- **BaseRepository:** Generic repository with CRUD operations
- **BaseService:** Business logic layer with validation
- **BaseHandler:** HTTP request handling with error management
- **BaseValidator:** Input validation using Zod schemas

### Design Patterns
- **Dependency Injection:** Services inject repositories
- **Factory Pattern:** Error handling with specific error types
- **Middleware Pattern:** Authentication and rate limiting
- **Repository Pattern:** Data access abstraction
- **Strategy Pattern:** Validation strategies for different entities

### Error Handling
Custom error classes with proper HTTP status codes:
- `ValidationError` (400)
- `AuthenticationError` (401)
- `AuthorizationError` (403)
- `NotFoundError` (404)
- `ConflictError` (409)
- `RateLimitError` (429)

## 📧 Email Templates

Professional HTML email templates for:
- **Welcome email** on user registration
- **Issue creation** notifications with issue details
- **Password reset** emails (foundation for future implementation)

## 🔒 Security Best Practices

### Implemented Security Measures
- **Password hashing** with bcrypt (10 rounds)
- **JWT tokens** with short expiry times
- **Refresh token rotation** for enhanced security
- **Rate limiting** to prevent abuse
- **Input validation** on all endpoints
- **SQL injection protection** via Prisma ORM
- **XSS protection** with proper data handling




