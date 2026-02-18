# Nginx Setup and Deployment Guide

This guide covers setting up nginx as a reverse proxy for your project management backend API, compatible with your existing Render deployment.

## Overview

The nginx setup provides:
- **Reverse Proxy**: Routes requests to your backend API
- **Rate Limiting**: Protects against abuse with different limits for auth vs general API
- **Security Headers**: Adds essential security headers
- **Gzip Compression**: Reduces response sizes
- **Health Checks**: Monitors service health
- **Load Balancing**: Ready for scaling backend instances

## Architecture

```
Internet → Nginx (Port 80) → Backend API (Port 5000)
```

- Nginx handles incoming traffic on port 80
- Backend runs on port 5000 (internal)
- Nginx proxies requests to backend with proper headers

## Files Created

1. **`nginx/nginx.conf`** - Main nginx configuration
2. **`nginx/Dockerfile`** - Nginx container definition
3. **`docker-compose.nginx.yml`** - Local development setup
4. **`render.nginx.yaml`** - Render deployment configuration

## Local Development

### Prerequisites
- Docker and Docker Compose
- Environment variables set in `.env` file

### Running with Nginx

1. **Create environment file**:
```bash
cp backend/.env.example .env
# Edit .env with your actual values
```

2. **Start services**:
```bash
docker-compose -f docker-compose.nginx.yml up -d
```

3. **Test the setup**:
```bash
# Health check
curl http://localhost/health

# API test
curl http://localhost/api/
```

4. **View logs**:
```bash
# Nginx logs
docker-compose -f docker-compose.nginx.yml logs nginx

# Backend logs
docker-compose -f docker-compose.nginx.yml logs backend
```

5. **Stop services**:
```bash
docker-compose -f docker-compose.nginx.yml down
```

## Render Deployment

### Option 1: Replace Existing Deployment

1. **Backup current render.yaml**:
```bash
cp render.yaml render.yaml.backup
```

2. **Replace with nginx version**:
```bash
cp render.nginx.yaml render.yaml
```

3. **Update environment variables** in Render dashboard for both services:
   - Backend: All existing environment variables
   - Nginx: No additional variables needed (uses internal service discovery)

4. **Deploy** - Push changes to trigger deployment

### Option 2: Gradual Migration

1. **Deploy nginx as a separate service**:
   - Use `render.nginx.yaml` as a new service
   - Keep existing backend running
   - Test nginx setup thoroughly
   - Switch DNS/domain to point to nginx service

### Environment Variables for Render

Both services need these environment variables in the Render dashboard:

#### Backend Service (`proj-mgmt-backend`)
```bash
NODE_ENV=production
PORT=5000
MONGO_URI=your-mongodb-connection-string
SESSION_SECRET=your-session-secret
SESSION_EXPIRES_IN=24h
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://your-nginx-url.onrender.com/api/auth/google/callback
FRONTEND_ORIGIN=https://your-frontend-url.com
FRONTEND_GOOGLE_CALLBACK_URL=https://your-frontend-url.com/auth/callback
BASE_PATH=/api
```

#### Nginx Service (`proj-mgmt-nginx`)
```bash
# No additional variables needed
# Uses internal service discovery to connect to backend
```

## Nginx Configuration Details

### Rate Limiting
- **General API**: 10 requests/second (burst 20)
- **Auth endpoints**: 5 requests/second (burst 10)
- Prevents brute force attacks on authentication

### Security Headers
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

### Gzip Compression
Compresses responses for:
- Text files (HTML, CSS, JavaScript)
- JSON API responses
- SVG images

### Health Checks
- **Nginx**: `/health` endpoint
- **Backend**: `/` endpoint
- Both services monitored by container orchestrator

## Monitoring and Logs

### Access Logs
Format includes:
- Client IP
- Timestamp
- HTTP method and path
- Response status
- User agent
- Forwarded headers

### Error Logs
Captures nginx errors and warnings for troubleshooting.

### Monitoring in Render
- Both services have health checks configured
- Render dashboard shows service status
- Logs available in Render console

## Performance Considerations

### Connection Handling
- `keepalive_timeout: 65s`
- `worker_connections: 1024`
- Backend connection pooling enabled

### Timeouts
- Connect timeout: 30s
- Send timeout: 30s
- Read timeout: 30s

### Scaling
- Nginx can handle multiple backend instances
- Update `upstream backend` block for multiple servers
- Consider load balancing algorithms for production

## Troubleshooting

### Common Issues

1. **502 Bad Gateway**
   - Backend service not running
   - Check backend health: `curl http://localhost:5000/`
   - Verify backend logs

2. **Connection Refused**
   - Nginx can't reach backend
   - Check network configuration
   - Verify service discovery in Docker/Render

3. **Rate Limiting**
   - Too many requests from same IP
   - Adjust limits in `nginx.conf`
   - Check `limit_req_zone` settings

4. **CORS Issues**
   - Update `FRONTEND_ORIGIN` in backend
   - Ensure nginx forwards proper headers
   - Check preflight requests

### Debug Commands

```bash
# Test nginx configuration
docker exec proj-mgmt-nginx nginx -t

# Reload nginx config
docker exec proj-mgmt-nginx nginx -s reload

# Check backend connectivity
docker exec proj-mgmt-nginx curl http://backend:5000/

# View active connections
docker exec proj-mgmt-nginx nginx -s status
```

## Security Best Practices

1. **Regular Updates**: Keep nginx image updated
2. **Monitor Logs**: Watch for suspicious activity
3. **Rate Limits**: Adjust based on traffic patterns
4. **SSL/TLS**: Enable HTTPS in production (Render handles this)
5. **Firewall**: Restrict direct backend access

## Migration Checklist

- [ ] Backup existing configuration
- [ ] Test nginx setup locally
- [ ] Update environment variables
- [ ] Deploy to staging first
- [ ] Verify all API endpoints work
- [ ] Test authentication flow
- [ ] Monitor performance
- [ ] Update DNS/domain if needed
- [ ] Decommission old setup (if applicable)

## Next Steps

1. **SSL/TLS**: Configure HTTPS (Render provides automatic SSL)
2. **Caching**: Add response caching for static content
3. **Monitoring**: Set up detailed metrics and alerting
4. **Scaling**: Configure multiple backend instances
5. **CDN**: Consider CDN for static assets
