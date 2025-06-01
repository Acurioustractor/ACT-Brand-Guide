# Deployment Guide

## 🚀 Quick Deploy Options

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```
Add environment variables in Vercel dashboard.

### Railway
1. Connect GitHub repo to Railway
2. Add environment variables
3. Auto-deploys on push

### Render
1. Create Web Service from repo
2. Build: `npm install`, Start: `npm start`
3. Add environment variables

## 🌐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NOTION_TOKEN` | Integration token | No* |
| `NOTION_DATABASE_ID` | Projects database | No* |
| `NOTION_SUBMISSIONS_DATABASE_ID` | Submissions (optional) | No |

*Works with sample data if not provided

## 🔧 Production Setup

1. Set `NODE_ENV=production`
2. Configure CORS for your domain
3. Add rate limiting for API endpoints
4. Enable CDN for static assets

1. **Prepare for Vercel**
   ```bash
   # Create vercel.json configuration
   echo '{
     "functions": {
       "server.js": {
         "maxDuration": 30
       }
     },
     "routes": [
       {
         "src": "/api/(.*)",
         "dest": "/server.js"
       },
       {
         "src": "/(.*)",
         "dest": "/server.js"
       }
     ]
   }' > vercel.json
   ```

2. **Deploy**
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Deploy
   vercel
   ```

3. **Configure Environment Variables**
   - Go to your Vercel dashboard
   - Select your project
   - Go to Settings > Environment Variables
   - Add your Notion credentials:
     - `NOTION_TOKEN`
     - `NOTION_DATABASE_ID`
     - `NOTION_SUBMISSIONS_DATABASE_ID` (optional)

### Option 2: Railway

Railway provides excellent Node.js hosting with automatic deployments.

1. **Connect Repository**
   - Go to [Railway](https://railway.app)
   - Connect your GitHub repository
   - Railway will auto-detect Node.js

2. **Configure Environment Variables**
   - In your Railway dashboard
   - Go to Variables tab
   - Add your Notion credentials

3. **Deploy**
   - Railway deploys automatically on push

### Option 3: Render

1. **Create Web Service**
   - Go to [Render](https://render.com)
   - Create new Web Service
   - Connect your repository

2. **Configure Build**
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Environment Variables**
   - Add your Notion credentials in Environment tab

### Option 4: Heroku

1. **Prepare Heroku**
   ```bash
   # Install Heroku CLI
   # Create Procfile
   echo "web: npm start" > Procfile
   ```

2. **Deploy**
   ```bash
   heroku create your-app-name
   heroku config:set NOTION_TOKEN=your_token
   heroku config:set NOTION_DATABASE_ID=your_database_id
   git push heroku main
   ```

### Option 5: DigitalOcean App Platform

1. **Create App**
   - Go to DigitalOcean Apps
   - Create app from GitHub
   - Select Node.js runtime

2. **Configure**
   - Build Command: `npm install`
   - Run Command: `npm start`
   - Port: 3000

## 🌐 Custom Domain

### Vercel
```bash
vercel domains add yourdomain.com
```

### Other Platforms
- Configure DNS to point to your hosting provider
- Most platforms provide SSL certificates automatically

## 🔧 Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `NOTION_TOKEN` | Your Notion integration token | No* |
| `NOTION_DATABASE_ID` | Projects database ID | No* |
| `NOTION_SUBMISSIONS_DATABASE_ID` | Submissions database ID | No |
| `PORT` | Server port (auto-set by most hosts) | No |
| `DEBUG` | Enable debug logging | No |

*App works with sample data if not provided

## 📊 Performance Optimization

### Caching
Add Redis caching for production:

```javascript
// In server.js
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);

// Cache project data for 10 minutes
app.get('/api/projects', async (req, res) => {
  const cached = await client.get('projects');
  if (cached) {
    return res.json(JSON.parse(cached));
  }
  
  // Fetch from Notion...
  await client.setex('projects', 600, JSON.stringify(data));
  res.json(data);
});
```

### CDN
Enable CDN for static assets:
- Vercel: Automatic global CDN
- Cloudflare: Add in front of any hosting

## 🛡️ Security Considerations

1. **Environment Variables**
   - Never commit `.env` files
   - Use hosting platform's secure environment variables

2. **Rate Limiting**
   ```javascript
   const rateLimit = require('express-rate-limit');
   
   app.use('/api', rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each IP to 100 requests per windowMs
   }));
   ```

3. **CORS**
   - Configure CORS for your domain only in production
   ```javascript
   app.use(cors({
     origin: process.env.NODE_ENV === 'production' 
       ? 'https://yourdomain.com' 
       : true
   }));
   ```

## 📈 Monitoring

### Vercel Analytics
```bash
npm install @vercel/analytics
```

### Error Tracking
```bash
npm install @sentry/node
```

## 🔄 Automatic Deployments

### GitHub Actions (for any host)
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm test # if you have tests
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 🚨 Troubleshooting

### Common Issues

1. **Build Fails**
   - Check Node.js version (requires 16+)
   - Ensure all dependencies are in package.json

2. **Notion API Errors**
   - Verify integration token
   - Check database permissions
   - Ensure database ID is correct

3. **Port Issues**
   - Most hosts set PORT automatically
   - Don't hardcode port 3000 in production

### Debug Mode
```bash
DEBUG=true npm start
```

This will show detailed logs for troubleshooting. 