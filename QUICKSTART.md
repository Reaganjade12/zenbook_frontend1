# Quick Start Guide

Get your ZenBook frontend up and running in 5 minutes!

## Step 1: Configure API URL

Open `config.js` and update the API URL:

```javascript
const CONFIG = {
    API_BASE_URL: 'http://127.0.0.1:8000/api',  // Your Laravel backend
    STORAGE_URL: 'http://127.0.0.1:8000/storage',  // For images
};
```

Or use the setup page: Open `setup.html` in your browser and configure it there.

## Step 2: Serve the Frontend

### Option A: Simple HTTP Server

```bash
# Python 3
python -m http.server 3000

# Node.js (if you have http-server installed)
npx http-server -p 3000

# PHP
php -S localhost:3000
```

### Option B: GitHub Pages

1. Push to GitHub
2. Go to repository Settings > Pages
3. Select branch and folder
4. Your site will be available at `https://username.github.io/repository-name`

## Step 3: Configure Backend CORS

In your Laravel backend `.env` file:

```env
SANCTUM_STATEFUL_DOMAINS=localhost,127.0.0.1,localhost:3000,your-frontend-domain.com
```

See `BACKEND_SETUP.md` for detailed CORS configuration.

## Step 4: Test the Connection

1. Open `EXAMPLE_USAGE.html` in your browser
2. Click "Check Config" to verify API URL
3. Try logging in with test credentials

## Step 5: Use in Your HTML Files

Make sure to include the scripts in your HTML files:

```html
<!-- At the top of <head> or before closing </body> -->
<script src="./config.js"></script>
<script src="./js/api.js"></script>
```

Then use the API:

```javascript
// Login
const response = await window.authAPI.login('email@example.com', 'password');

// Get profile
const profile = await window.profileAPI.get();

// Create booking
const booking = await window.bookingAPI.create({
    therapist_id: 1,
    date: '2024-12-25',
    time: '10:00',
    duration: 60
});
```

## Troubleshooting

### CORS Errors
- Check `BACKEND_SETUP.md` for CORS configuration
- Verify your frontend domain is in `SANCTUM_STATEFUL_DOMAINS`

### 401 Unauthorized
- Make sure you're logged in first
- Check if token is stored: `localStorage.getItem('auth_token')`

### API Not Found
- Verify the API URL in `config.js`
- Check that your Laravel backend is running
- Test the API endpoint directly in browser/Postman

## Next Steps

- Read `README.md` for detailed documentation
- Check `BACKEND_SETUP.md` for backend configuration
- See `EXAMPLE_USAGE.html` for code examples
