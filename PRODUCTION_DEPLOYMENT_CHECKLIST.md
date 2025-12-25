# ApniSec Production Deployment Checklist

## 🚀 Pre-Deployment Configuration

### ✅ Environment Variables Setup
1. **Database Configuration**
   ```bash
   DATABASE_URL="postgresql://username:password@hostname:port/database_name?sslmode=require"
   ```
   - Use a production PostgreSQL database (Vercel Postgres, Supabase, AWS RDS, etc.)
   - Ensure SSL is enabled (`sslmode=require`)

2. **JWT Security Secrets** ⚠️ CRITICAL
   ```bash
   JWT_SECRET="your-super-secure-jwt-secret-change-this"
   JWT_REFRESH_SECRET="your-super-secure-refresh-secret-change-this"
   ```
   - Generate new 64-character random strings for production
   - Use: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

3. **Email Configuration** ✅ COMPLETED
   ```bash
   RESEND_API_KEY="re_WhLXxnMd_36PHhke88dYm61Abjkxdho2M"
   RESEND_FROM_EMAIL="noreply@yourdomain.com"
   ```

4. **Application URLs**
   ```bash
   NEXT_PUBLIC_APP_URL="https://yourdomain.com"
   NODE_ENV="production"
   ```

### ✅ Database Setup
1. **Create Production Database**
   - Set up PostgreSQL instance (recommended: Vercel Postgres, Supabase, or AWS RDS)
   - Note down connection string

2. **Run Database Migrations**
   ```bash
   npx prisma db push
   # or if using migrations:
   npx prisma migrate deploy
   ```

3. **Verify Database Connection**
   ```bash
   npx prisma db seed  # if you have seed data
   ```

## 🔧 Code Configuration

### ✅ Authentication System Status
- ✅ Real authentication (no demo mode)
- ✅ Password hashing with bcrypt
- ✅ JWT token generation and validation
- ✅ Refresh token mechanism
- ✅ User registration and login
- ✅ Email validation
- ✅ Secure cookie management

### ✅ Email System Status
- ✅ Resend API integration
- ✅ Welcome email automation
- ✅ Password reset emails
- ✅ Issue notification emails
- ✅ Error handling and fallbacks

### ✅ Security Features
- ✅ Rate limiting middleware
- ✅ Input validation with Zod
- ✅ SQL injection protection (Prisma)
- ✅ XSS protection
- ✅ CSRF protection via SameSite cookies

## 🚀 Deployment Steps

### Option A: Vercel (Recommended)
1. **Connect Repository**
   ```bash
   npm i -g vercel
   vercel login
   vercel --prod
   ```

2. **Configure Environment Variables in Vercel Dashboard**
   - Go to Project Settings → Environment Variables
   - Add all production environment variables
   - Ensure `NODE_ENV` is set to `production`

3. **Database Setup on Vercel**
   ```bash
   # If using Vercel Postgres
   vercel postgres create
   # Copy the connection string to DATABASE_URL
   ```

### Option B: Other Platforms (Railway, Render, etc.)
1. **Set Environment Variables** in your platform's dashboard
2. **Configure Build Command**: `npm run build`
3. **Configure Start Command**: `npm start`

## 🧪 Pre-Production Testing

### Required Tests Before Go-Live
1. **Authentication Flow**
   ```bash
   # Test registration
   curl -X POST https://yourdomain.com/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"testpass123","name":"Test User"}'
   
   # Test login
   curl -X POST https://yourdomain.com/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"testpass123"}'
   ```

2. **Email Functionality**
   - Register a new user
   - Verify welcome email is sent
   - Check email in inbox or Resend dashboard

3. **Database Connectivity**
   - Verify users can register
   - Verify data persistence
   - Test user login with saved credentials

## 🔒 Security Checklist

### Pre-Deploy Security Review
- [ ] All environment variables use production values
- [ ] JWT secrets are unique and secure (64+ characters)
- [ ] Database uses SSL connections
- [ ] No sensitive data in client-side code
- [ ] CORS properly configured
- [ ] Rate limiting is active
- [ ] Error messages don't expose sensitive info

### Post-Deploy Security Monitoring
- [ ] Monitor failed login attempts
- [ ] Set up error tracking (Sentry recommended)
- [ ] Regular security updates
- [ ] Monitor API usage patterns

## 📋 Go-Live Verification

### Final Checks
1. **🌐 Website Accessibility**
   - [ ] Homepage loads correctly
   - [ ] Registration form works
   - [ ] Login form works
   - [ ] Dashboard accessible after login

2. **📧 Email Delivery**
   - [ ] Welcome emails arrive in inbox
   - [ ] Check spam folder if emails missing
   - [ ] Verify sender domain configuration

3. **🗄️ Database Operations**
   - [ ] User registration saves to database
   - [ ] User login authenticates against database
   - [ ] Refresh tokens work correctly

4. **🔐 Security Features**
   - [ ] JWT tokens expire correctly
   - [ ] Rate limiting prevents abuse
   - [ ] Logout clears sessions properly

## 🛠️ Production Monitoring

### Recommended Monitoring Setup
1. **Error Tracking**: Sentry or similar
2. **Performance Monitoring**: Vercel Analytics or Google Analytics
3. **Database Monitoring**: Your database provider's monitoring
4. **Email Delivery**: Resend dashboard for email metrics

### Key Metrics to Monitor
- Authentication success/failure rates
- Email delivery rates
- API response times
- Database connection health
- User registration trends

## 🆘 Troubleshooting Common Issues

### Database Connection Issues
```bash
# Test database connection
npx prisma db pull
```

### Email Not Sending
1. Verify Resend API key in environment variables
2. Check Resend dashboard for delivery status
3. Verify sender email domain is configured

### Authentication Issues
1. Verify JWT secrets are set
2. Check browser cookies are being set
3. Verify database user table exists

### Environment Variables Not Loading
1. Ensure `.env.production` file exists
2. Restart deployment after adding variables
3. Check platform-specific environment variable settings

---

## 🎉 Ready for Production!

Your ApniSec application is configured with:
- ✅ **Real Authentication System** (no demo mode)
- ✅ **Automated Welcome Emails** via Resend
- ✅ **Secure JWT Implementation**
- ✅ **Production-Ready Database Integration**
- ✅ **Comprehensive Security Measures**

**Next Steps**: Deploy to your chosen platform and run the verification checklist above!