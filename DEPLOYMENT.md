# Deployment Guide

This guide covers deploying the ZenBook frontend to various platforms.

## GitHub Pages

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/zenbook-frontend.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings > Pages
   - Source: Deploy from a branch
   - Branch: main
   - Folder: / (root)
   - Click Save

3. **Update Config**
   - Your site will be at: `https://yourusername.github.io/zenbook-frontend`
   - Update `config.js` with your backend API URL
   - Update backend CORS to allow `yourusername.github.io`

## Netlify

1. **Deploy via Git**
   - Connect your GitHub repository
   - Build command: (leave empty, static site)
   - Publish directory: `/` (root)

2. **Environment Variables** (Optional)
   - Add `VITE_API_BASE_URL` or similar if using build tools
   - Or update `config.js` directly

3. **Custom Domain** (Optional)
   - Add your custom domain in Netlify settings
   - Update backend CORS to allow your domain

## Vercel

1. **Deploy**
   ```bash
   npm i -g vercel
   vercel
   ```

2. **Or via Dashboard**
   - Import your GitHub repository
   - Framework Preset: Other
   - Build Command: (leave empty)
   - Output Directory: `/`

## Traditional Web Hosting

1. **Upload Files**
   - Upload all files via FTP/SFTP to your web root
   - Maintain the folder structure

2. **Update Config**
   - Edit `config.js` with your backend URL
   - Ensure paths are correct (relative paths work)

3. **HTTPS**
   - Ensure your hosting supports HTTPS
   - Update API URLs to use HTTPS

## Important Notes

### API URL Configuration

After deployment, update `config.js`:

```javascript
const CONFIG = {
    // Production backend URL
    API_BASE_URL: 'https://api.yourdomain.com/api',
    STORAGE_URL: 'https://api.yourdomain.com/storage',
};
```

### CORS Configuration

Make sure your backend allows your frontend domain:

```env
SANCTUM_STATEFUL_DOMAINS=your-frontend-domain.com,www.your-frontend-domain.com
```

### Path Issues

If you deploy to a subdirectory (e.g., `/zenbook/`), update paths:

```html
<!-- Instead of -->
<script src="./config.js"></script>

<!-- Use -->
<script src="/zenbook/config.js"></script>
```

Or use a base tag:

```html
<base href="/zenbook/">
```

### Testing

After deployment:
1. Test login functionality
2. Verify API calls work
3. Check image loading
4. Test all user roles (customer, therapist, staff)

## Troubleshooting

### 404 Errors
- Check file paths are correct
- Verify case sensitivity (Linux servers are case-sensitive)
- Check `.htaccess` or server configuration

### CORS Errors
- Verify backend CORS configuration
- Check API URL in `config.js`
- Ensure credentials are included in requests

### Images Not Loading
- Verify `STORAGE_URL` in config
- Check backend storage symlink
- Verify image paths in API responses
