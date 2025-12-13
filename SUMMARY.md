# Frontend Package Summary

This directory contains the complete frontend for the ZenBook Massage Booking System, ready to be deployed separately from the Laravel backend.

## 📁 Directory Structure

```
github-frontend/
├── config.js                 # API configuration (UPDATE THIS!)
├── js/
│   └── api.js               # API client library
├── auth/                    # Authentication pages
│   ├── login.html
│   ├── register.html
│   ├── forgot-password.html
│   ├── reset-password.html
│   └── verify-otp.html
├── customer/                # Customer pages
│   ├── dashboard.html
│   └── create-booking.html
├── therapist/               # Therapist pages
│   ├── dashboard.html
│   ├── bookings.html
│   └── customers.html
├── staff/                   # Staff pages
│   ├── dashboard.html
│   └── therapists/
│       ├── index.html
│       ├── create.html
│       └── edit.html
├── profile/                 # Profile pages
│   └── show.html
├── layouts/                 # Layout templates
│   ├── app.html
│   ├── admin.html
│   └── therapist.html
├── Documentation/
│   ├── README.md           # Full documentation
│   ├── QUICKSTART.md       # Quick start guide
│   ├── BACKEND_SETUP.md    # Backend CORS setup
│   ├── DEPLOYMENT.md       # Deployment guide
│   └── SUMMARY.md          # This file
├── index.html              # Landing page
├── setup.html              # Configuration helper
└── EXAMPLE_USAGE.html      # Code examples
```

## 🚀 Quick Start

1. **Configure API URL** - Edit `config.js` with your backend URL
2. **Serve locally** - Use any HTTP server (Python, Node.js, PHP)
3. **Deploy** - Push to GitHub Pages, Netlify, Vercel, or any web host

See `QUICKSTART.md` for detailed instructions.

## ⚙️ Configuration

### Required: Update API URL

Edit `config.js`:

```javascript
const CONFIG = {
    API_BASE_URL: 'http://127.0.0.1:8000/api',  // Your backend
    STORAGE_URL: 'http://127.0.0.1:8000/storage',  // For images
};
```

### Backend CORS Setup

Your Laravel backend needs CORS configured. See `BACKEND_SETUP.md` for instructions.

## 📚 Documentation Files

- **README.md** - Complete documentation
- **QUICKSTART.md** - 5-minute setup guide
- **BACKEND_SETUP.md** - Backend CORS configuration
- **DEPLOYMENT.md** - Deployment to various platforms
- **EXAMPLE_USAGE.html** - Interactive code examples

## 🔧 Features

- ✅ Bearer token authentication
- ✅ API client with automatic token management
- ✅ Profile image upload support
- ✅ Role-based access (Customer, Therapist, Staff)
- ✅ Responsive design
- ✅ Dark theme UI

## 📝 Usage in HTML Files

Include these scripts in your HTML:

```html
<script src="./config.js"></script>
<script src="./js/api.js"></script>
```

Then use the API:

```javascript
// Login
await window.authAPI.login(email, password);

// Get profile
const profile = await window.profileAPI.get();

// Create booking
await window.bookingAPI.create(bookingData);
```

## 🔗 API Methods Available

- `window.authAPI` - Authentication
- `window.bookingAPI` - Bookings
- `window.therapistAPI` - Therapist operations
- `window.staffAPI` - Staff operations
- `window.profileAPI` - Profile management
- `window.TokenManager` - Token utilities

## ⚠️ Important Notes

1. **Update config.js** before deploying
2. **Configure backend CORS** to allow your frontend domain
3. **Use HTTPS** in production
4. **Test all functionality** after deployment

## 🐛 Troubleshooting

- **CORS errors** → Check `BACKEND_SETUP.md`
- **401 Unauthorized** → Verify token is stored and sent
- **Images not loading** → Check `STORAGE_URL` in config
- **API not found** → Verify `API_BASE_URL` in config

## 📦 What's Included

- All HTML view files from Laravel
- API client library
- Configuration system
- Documentation
- Example usage
- Setup helper

## 🎯 Next Steps

1. Read `QUICKSTART.md` to get started
2. Configure `config.js` with your backend URL
3. Test locally using `setup.html` and `EXAMPLE_USAGE.html`
4. Deploy using instructions in `DEPLOYMENT.md`
5. Update backend CORS settings (see `BACKEND_SETUP.md`)

## 📞 Support

For issues:
1. Check the documentation files
2. Review `EXAMPLE_USAGE.html` for code examples
3. Verify backend CORS configuration
4. Check browser console for errors

---

**Ready to deploy!** 🚀
