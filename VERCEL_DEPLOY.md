# Deploy EduNexa LMS to Vercel

## Project Structure
- **Frontend**: React + Vite (in `frontend/`)
- **Backend**: Express + MongoDB (in `backend/`)

## Prerequisites
1. [Vercel CLI](https://vercel.com/docs/cli) installed: `npm i -g vercel`
2. [MongoDB Atlas](https://www.mongodb.com/atlas) database URI
3. A JWT secret key

## Step-by-Step Deployment

### 1. Setup Environment Variables

Set these in the Vercel Dashboard (Project Settings > Environment Variables):

**Backend Variables:**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/edunexa?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=production
```

**Frontend Variables:**
```
VITE_API_URL=https://your-backend.vercel.app/api
```

> **Note**: Replace `your-backend.vercel.app` with your actual backend URL after first deployment.

### 2. Deploy Backend (API)

```bash
# Navigate to backend
cd backend

# Deploy using Vercel CLI
vercel --prod
```

Or deploy via Vercel Dashboard:
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Set root directory to `backend`
4. Add environment variables
5. Deploy

### 3. Deploy Frontend

```bash
# Navigate to frontend
cd frontend

# Build and deploy
vercel --prod
```

Or via Dashboard:
1. Create new project
2. Import same repository
3. Set root directory to `frontend`
4. Build command: `npm run build`
5. Output directory: `dist`
6. Add `VITE_API_URL` environment variable
7. Deploy

### 4. Update CORS (After Deployment)

Once you have your frontend URL, update the `backend/api/index.js` CORS configuration:

```javascript
if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
  return callback(null, true);
}
```

Add `FRONTEND_URL` environment variable to your backend:
```
FRONTEND_URL=https://your-frontend.vercel.app
```

## Alternative: Monorepo Deployment

If you want to deploy both frontend and backend together as a single project:

```bash
# From root directory
vercel --prod
```

This will use the `vercel.json` configuration in the root.

## Troubleshooting

### "No services configured" Error
If you see this error, ensure you have the correct `vercel.json` format. The `experimentalServices` approach is newer but the `builds` + `rewrites` approach in this config is more stable.

### CORS Errors
1. Check that `FRONTEND_URL` is set correctly in backend env vars
2. Ensure the CORS middleware allows your frontend domain
3. Check browser console for exact error messages

### API Not Responding
1. Verify `MONGODB_URI` is correct and database is accessible
2. Check Vercel function logs: `vercel logs --all`
3. Ensure `JWT_SECRET` is set

## Files Created for Deployment

1. `vercel.json` - Vercel configuration
2. `backend/api/index.js` - Serverless API entry point
3. `.env.example` - Environment variable template
4. This file - Deployment guide

## Post-Deployment Checklist

- [ ] Frontend loads correctly
- [ ] API health check responds (`/api/`)
- [ ] User registration/login works
- [ ] Courses load from database
- [ ] Enrollment functionality works
