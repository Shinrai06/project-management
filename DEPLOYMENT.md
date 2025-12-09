# Deployment Guide - Render

This guide walks you through deploying the backend Docker image to Render.

## Prerequisites

- A Render account (sign up at https://render.com)
- Your GitHub repository connected to Render
- MongoDB database (can be created on Render or use MongoDB Atlas)

## Step-by-Step Deployment

### 1. Create a New Web Service on Render

1. Log in to your Render dashboard
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository if not already connected
4. Select the repository containing this project

### 2. Configure the Service

Render will automatically detect the `render.yaml` file. If you prefer manual configuration:

- **Name**: `proj-mgmt-backend` (or your preferred name)
- **Environment**: `Docker`
- **Dockerfile Path**: `./backend/Dockerfile`
- **Docker Build Context**: `./backend`
- **Plan**: Free (or choose a paid plan for better performance)

### 3. Set Environment Variables

In the Render dashboard, navigate to your service's "Environment" tab and add the following environment variables:

#### Required Environment Variables

```bash
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb://your-mongodb-connection-string
SESSION_SECRET=your-session-secret-key-here
SESSION_EXPIRES_IN=24h
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://your-render-url.onrender.com/api/auth/google/callback
FRONTEND_ORIGIN=https://your-frontend-url.com
FRONTEND_GOOGLE_CALLBACK_URL=https://your-frontend-url.com/auth/callback
BASE_PATH=/api
```

#### Environment Variable Details

- **NODE_ENV**: Set to `production` for production deployments
- **PORT**: Render automatically sets this, but you can set it to `5000` to match the app default
- **MONGO_URI**: Your MongoDB connection string
  - For Render MongoDB: Use the connection string from your Render MongoDB service
  - For MongoDB Atlas: Use your Atlas connection string
- **SESSION_SECRET**: A secure random string for session encryption (generate with `openssl rand -base64 32`)
- **SESSION_EXPIRES_IN**: Session expiration time (e.g., `24h`, `7d`)
- **GOOGLE_CLIENT_ID**: From Google Cloud Console OAuth credentials
- **GOOGLE_CLIENT_SECRET**: From Google Cloud Console OAuth credentials
- **GOOGLE_CALLBACK_URL**: Your Render backend URL + `/api/auth/google/callback`
- **FRONTEND_ORIGIN**: Your frontend application URL (for CORS)
- **FRONTEND_GOOGLE_CALLBACK_URL**: Your frontend OAuth callback URL
- **BASE_PATH**: API base path (defaults to `/api` if not set)

### 4. Deploy

1. Click "Create Web Service" (or "Save Changes" if updating)
2. Render will automatically build your Docker image and deploy it
3. Monitor the build logs in the Render dashboard
4. Once deployed, your service will be available at `https://your-service-name.onrender.com`

### 5. Verify Deployment

1. Visit your service URL: `https://your-service-name.onrender.com`
2. You should see: `{"message": "Hello Subscribe to channel & share"}`
3. Test API endpoints: `https://your-service-name.onrender.com/api/...`

## Setting Up MongoDB on Render

### Option 1: Render MongoDB (Recommended for Free Tier)

1. In Render dashboard, click "New +" → "MongoDB"
2. Choose "Free" plan
3. Copy the "Internal Database URL" for your `MONGO_URI`
4. Note: Free tier MongoDB spins down after inactivity

### Option 2: MongoDB Atlas (Recommended for Production)

1. Create a free cluster at https://www.mongodb.com/cloud/atlas
2. Whitelist Render's IP addresses (or use `0.0.0.0/0` for development)
3. Create a database user
4. Copy the connection string and use it as `MONGO_URI`

## Auto-Deploy Configuration

The `render.yaml` file is configured with `autoDeploy: true`, which means:

- Every push to your main branch will trigger a new deployment
- You can disable this in the Render dashboard if needed

## Health Checks

Render automatically checks the root endpoint (`/`) for health monitoring. Ensure your service responds to GET requests at `/`.

## Free Tier Limitations

- Services spin down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds
- Limited CPU and memory resources
- Consider upgrading to a paid plan for production use

## Troubleshooting

### Build Fails

- Check build logs in Render dashboard
- Ensure all dependencies are in `package.json`
- Verify Dockerfile syntax

### Service Won't Start

- Check environment variables are set correctly
- Verify MongoDB connection string is valid
- Check service logs for error messages

### CORS Issues

- Ensure `FRONTEND_ORIGIN` matches your frontend URL exactly
- Include protocol (`https://`) in the URL

### Database Connection Issues

- Verify MongoDB URI is correct
- Check MongoDB service is running (if using Render MongoDB)
- Ensure IP whitelist includes Render's IPs (if using MongoDB Atlas)

## Updating Your Deployment

1. Push changes to your GitHub repository
2. Render will automatically detect changes and redeploy (if auto-deploy is enabled)
3. Or manually trigger deployment from Render dashboard

## Additional Resources

- [Render Documentation](https://render.com/docs)
- [Render Docker Guide](https://render.com/docs/docker)
- [Render Environment Variables](https://render.com/docs/environment-variables)
