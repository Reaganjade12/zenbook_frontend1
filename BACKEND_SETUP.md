# Backend CORS Configuration Guide

To allow your frontend to communicate with the Laravel backend, you need to configure CORS (Cross-Origin Resource Sharing).

## 1. Install CORS Package (if not already installed)

Laravel 11 includes CORS support by default, but ensure it's configured:

```bash
composer require fruitcake/laravel-cors
```

## 2. Configure CORS

### Option A: Using .env file (Recommended)

Add these to your `.env` file:

```env
# CORS Configuration
SANCTUM_STATEFUL_DOMAINS=your-frontend-domain.com,localhost,127.0.0.1
SESSION_DOMAIN=your-backend-domain.com

# For local development
# SANCTUM_STATEFUL_DOMAINS=localhost,127.0.0.1,localhost:3000,127.0.0.1:3000
```

### Option B: Update config/cors.php

If you have a `config/cors.php` file, update it:

```php
<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    
    'allowed_methods' => ['*'],
    
    'allowed_origins' => [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'https://your-frontend-domain.com',
        // Add your frontend domains here
    ],
    
    'allowed_origins_patterns' => [],
    
    'allowed_headers' => ['*'],
    
    'exposed_headers' => [],
    
    'max_age' => 0,
    
    'supports_credentials' => true,
];
```

### Option C: Update config/sanctum.php

Update `config/sanctum.php`:

```php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
    '%s%s%s',
    'localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1',
    env('APP_URL') ? ','.parse_url(env('APP_URL'), PHP_URL_HOST) : '',
    env('FRONTEND_URL') ? ','.parse_url(env('FRONTEND_URL'), PHP_URL_HOST) : '',
))),
```

## 3. Update Middleware

In `bootstrap/app.php`, ensure CORS middleware is enabled for API routes:

```php
->withMiddleware(function (Middleware $middleware): void {
    $middleware->api(prepend: [
        \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
    ]);
    
    $middleware->alias([
        'role' => \App\Http\Middleware\EnsureRole::class,
    ]);
})
```

## 4. Test CORS Configuration

You can test if CORS is working by making a request from your frontend:

```javascript
fetch('http://your-backend-url/api/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    body: JSON.stringify({
        email: 'test@example.com',
        password: 'password'
    })
})
.then(response => {
    console.log('CORS Headers:', response.headers);
    return response.json();
})
.then(data => console.log('Response:', data))
.catch(error => console.error('CORS Error:', error));
```

## 5. Common Issues

### Issue: CORS policy error

**Solution:** 
- Check that your frontend domain is in `allowed_origins` or `SANCTUM_STATEFUL_DOMAINS`
- Ensure `supports_credentials` is `true` if using cookies
- Verify the API endpoint is in the `paths` array

### Issue: 401 Unauthorized

**Solution:**
- Check if Bearer token is being sent in Authorization header
- Verify token is valid and not expired
- Check Sanctum configuration

### Issue: Preflight request fails

**Solution:**
- Ensure `allowed_methods` includes the HTTP methods you're using (GET, POST, PUT, DELETE, etc.)
- Check that `allowed_headers` includes all headers you're sending

## 6. Production Checklist

- [ ] Update `SANCTUM_STATEFUL_DOMAINS` with production frontend domain
- [ ] Update `allowed_origins` in `config/cors.php` with production domain
- [ ] Set `SESSION_DOMAIN` to your backend domain
- [ ] Test API calls from production frontend
- [ ] Verify Bearer token authentication works
- [ ] Check that file uploads work (profile images, etc.)

## 7. Security Notes

- Never use `'allowed_origins' => ['*']` in production
- Always specify exact domains in production
- Use HTTPS in production
- Keep CORS configuration in version control (without sensitive data)
