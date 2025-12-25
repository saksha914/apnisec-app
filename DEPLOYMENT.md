# Deploying ApniSec to Render

This guide will help you deploy the ApniSec application to Render with a PostgreSQL database.

## 🚀 Quick Deployment Steps

### 1. Prepare Your Code

Make sure your code is committed to a Git repository (GitHub, GitLab, or Bitbucket):

```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### 2. Deploy to Render

#### Option A: Using render.yaml (Recommended)

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Blueprint"
3. Connect your Git repository
4. Render will automatically detect the `render.yaml` file and set up:
   - PostgreSQL database
   - Web service with environment variables

#### Option B: Manual Setup

1. **Create Database First:**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "PostgreSQL"
   - Name: `apnisec-db`
   - Plan: Free
   - Click "Create Database"
   - Copy the "External Database URL" (starts with `postgresql://`)

2. **Create Web Service:**
   - Click "New +" → "Web Service"
   - Connect your Git repository
   - Configure:
     - **Name:** `apnisec-app`
     - **Runtime:** Node
     - **Build Command:** `npm install && npx prisma db push && npm run build`
     - **Start Command:** `npm start`

### 3. Configure Environment Variables

In your Render web service settings, add these environment variables:

#### Required Variables
```env
NODE_ENV=production
DATABASE_URL=<your-render-postgresql-url>
JWT_SECRET=<generate-a-strong-secret>
JWT_REFRESH_SECRET=<generate-another-strong-secret>
JWT_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Optional (for Email Functionality)
```env
RESEND_API_KEY=<your-resend-api-key>
RESEND_FROM_EMAIL=noreply@yourdomain.com
NEXT_PUBLIC_APP_URL=<your-render-app-url>
```

### 4. Generate Strong Secrets

For JWT secrets, use strong random strings. You can generate them using:

```bash
# Generate JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate JWT_REFRESH_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 5. Deploy and Monitor

1. Render will automatically build and deploy your application
2. Monitor the deployment logs for any issues
3. Once deployed, test your application at the provided Render URL

## 🔧 Environment Variable Details

### Database Configuration
- **DATABASE_URL**: PostgreSQL connection string from Render database
  - Format: `postgresql://username:password@host:port/database`

### Authentication
- **JWT_SECRET**: Secret for signing access tokens (32+ chars)
- **JWT_REFRESH_SECRET**: Secret for signing refresh tokens (32+ chars)
- **JWT_EXPIRY**: Access token expiry time (default: 15m)
- **JWT_REFRESH_EXPIRY**: Refresh token expiry time (default: 7d)

### Rate Limiting
- **RATE_LIMIT_WINDOW_MS**: Time window in milliseconds (default: 900000 = 15 minutes)
- **RATE_LIMIT_MAX_REQUESTS**: Max requests per window (default: 100)

### Email (Optional)
- **RESEND_API_KEY**: Your Resend API key for email functionality
- **RESEND_FROM_EMAIL**: Email address to send from
- **NEXT_PUBLIC_APP_URL**: Your application's public URL

## 🧪 Testing Your Deployment

### 1. Health Check
Visit `https://your-app.onrender.com/health` - should return:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "apnisec-app"
}
```

### 2. Test Registration
```bash
curl -X POST https://your-app.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"SecurePass123","name":"Test User"}'
```

### 3. Test Landing Page
Visit `https://your-app.onrender.com` - should show the ApniSec landing page

## 🔍 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify DATABASE_URL is correct
   - Ensure Prisma schema is pushed: `npx prisma db push`

2. **Build Fails**
   - Check build logs in Render dashboard
   - Ensure all dependencies are in `package.json`
   - Verify Node.js version compatibility

3. **JWT Errors**
   - Ensure JWT_SECRET and JWT_REFRESH_SECRET are set
   - Secrets should be at least 32 characters long

4. **Rate Limiting Issues**
   - Check rate limit environment variables
   - Monitor application logs for rate limit errors

### Debug Commands

If you need to debug your deployment:

```bash
# Check database connection
npx prisma db pull

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# View database
npx prisma studio
```

## 📊 Monitoring

### Application Health
- Health endpoint: `/health`
- Monitor response times and error rates in Render dashboard

### Database
- Monitor database performance in Render PostgreSQL dashboard
- Check connection limits and query performance

### Logs
- View application logs in Render dashboard
- Check for authentication errors, rate limiting, and database issues

## 🔧 Scaling and Optimization

### Performance
- Render free tier has limitations
- Consider upgrading to paid plans for production use
- Monitor application performance and database usage

### Security
- Rotate JWT secrets regularly
- Monitor for suspicious activity in logs
- Implement additional security headers in production

---

## 🎉 Deployment Complete!

Your ApniSec application is now live on Render! You can:

1. **Access the app**: https://your-app.onrender.com
2. **Register users**: Create accounts and test authentication
3. **Manage issues**: Create, update, and delete security issues
4. **Monitor health**: Check `/health` endpoint

For support, refer to the main [README.md](README.md) or check the Render documentation.