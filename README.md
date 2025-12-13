# ZenBook Frontend

This is the frontend application for the ZenBook Massage Booking System. It communicates with a Laravel backend API.

## Setup Instructions

### 1. Configure API URL

Before using the frontend, you need to configure the backend API URL. You have two options:

#### Option A: Update config.js (Recommended)

Edit `config.js` and update the `API_BASE_URL`:

```javascript
const CONFIG = {
    // Update this to your Laravel backend URL
    API_BASE_URL: 'https://your-backend-domain.com/api',
    STORAGE_URL: 'https://your-backend-domain.com/storage',
};
```

#### Option B: Set via HTML (For dynamic configuration)

In each HTML file, add this before loading `api.js`:

```html
<script>
    window.API_BASE_URL = 'https://your-backend-domain.com/api';
    window.STORAGE_URL = 'https://your-backend-domain.com/storage';
</script>
<script src="./js/api.js"></script>
```

### 2. Include Required Scripts

Make sure each HTML file includes the configuration and API scripts in the `<head>` or before closing `</body>`:

```html
<!-- Configuration (must be loaded first) -->
<script src="./config.js"></script>

<!-- API Client -->
<script src="./js/api.js"></script>
```

### 3. Update Image URLs

If you're using profile images or other storage URLs, update them to use the configurable storage URL:

```javascript
// Instead of hardcoded URLs, use:
const imageUrl = window.CONFIG.STORAGE_URL + '/profiles/image.jpg';
// Or
const imageUrl = (window.CONFIG && window.CONFIG.STORAGE_URL) || 'http://127.0.0.1:8000/storage' + '/profiles/image.jpg';
```

### 4. Backend CORS Configuration

Make sure your Laravel backend has CORS configured to allow requests from your frontend domain.

In your Laravel `.env` file, add:

```env
SANCTUM_STATEFUL_DOMAINS=your-frontend-domain.com,localhost
SESSION_DOMAIN=your-backend-domain.com
```

And in `config/cors.php`, ensure your frontend domain is allowed:

```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_origins' => ['https://your-frontend-domain.com'],
'allowed_origins_patterns' => [],
'allowed_headers' => ['*'],
'allowed_methods' => ['*'],
'exposed_headers' => [],
'max_age' => 0,
'supports_credentials' => true,
```

### 5. Local Development

For local development:

1. Update `config.js`:
   ```javascript
   API_BASE_URL: 'http://127.0.0.1:8000/api',
   STORAGE_URL: 'http://127.0.0.1:8000/storage',
   ```

2. Serve the frontend using a local server:
   ```bash
   # Using Python
   python -m http.server 3000
   
   # Using Node.js (http-server)
   npx http-server -p 3000
   
   # Using PHP
   php -S localhost:3000
   ```

3. Access the frontend at `http://localhost:3000`

### 6. Production Deployment

1. Update `config.js` with your production backend URL
2. Deploy all files to your web server (GitHub Pages, Netlify, Vercel, etc.)
3. Ensure your backend CORS settings allow your frontend domain

## File Structure

```
github-frontend/
├── config.js              # API configuration
├── js/
│   └── api.js            # API client library
├── auth/                 # Authentication pages
│   ├── login.html
│   ├── register.html
│   └── ...
├── customer/             # Customer pages
├── therapist/            # Therapist pages
├── staff/                # Staff pages
├── profile/              # Profile pages
└── layouts/              # Layout templates
```

## API Authentication

The frontend uses Bearer token authentication. Tokens are stored in `localStorage` with the key `auth_token`.

### Usage Example

```javascript
// Login
const response = await window.authAPI.login(email, password);
// Token is automatically stored

// Make authenticated requests
const profile = await window.profileAPI.get();

// Logout
await window.authAPI.logout();
// Token is automatically removed
```

## Available API Methods

- `window.authAPI` - Authentication (login, register, logout, me)
- `window.bookingAPI` - Booking management
- `window.therapistAPI` - Therapist operations
- `window.staffAPI` - Staff operations
- `window.profileAPI` - Profile management
- `window.apiClient` - Low-level API client
- `window.TokenManager` - Token management utilities

## Troubleshooting

### CORS Errors

If you see CORS errors, check:
1. Backend CORS configuration
2. API URL in `config.js` matches your backend
3. Frontend domain is allowed in backend CORS settings

### 401 Unauthorized

- Check if token is stored: `localStorage.getItem('auth_token')`
- Verify token is being sent in Authorization header
- Check if token has expired

### Images Not Loading

- Verify `STORAGE_URL` in config.js
- Check if storage symlink exists on backend: `php artisan storage:link`
- Verify image paths in database match storage structure

## Support

For issues or questions, please check the backend API documentation or contact the development team.
