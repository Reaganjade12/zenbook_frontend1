/**
 * Authentication Utilities
 * Helper functions for checking authentication and loading user data
 */

// Check if user is authenticated and redirect if not
async function requireAuth(requiredRole = null) {
    if (!TokenManager.isAuthenticated()) {
        window.location.href = '../auth/login.html';
        return false;
    }

    try {
        const response = await authAPI.me();
        const user = response.user;

        // Check role if required
        if (requiredRole) {
            const roleMap = {
                'customer': ['customer'],
                'therapist': ['therapist', 'cleaner'],
                'admin': ['staff', 'super_admin']
            };

            const allowedRoles = roleMap[requiredRole] || [requiredRole];
            if (!allowedRoles.includes(user.role)) {
                // Redirect based on user role
                if (user.role === 'staff' || user.role === 'super_admin') {
                    window.location.href = '../staff/dashboard.html';
                } else if (user.role === 'therapist' || user.role === 'cleaner') {
                    window.location.href = '../therapist/dashboard.html';
                } else {
                    window.location.href = '../customer/dashboard.html';
                }
                return false;
            }
        }

        return user;
    } catch (error) {
        console.error('Auth check failed:', error);
        TokenManager.removeToken();
        window.location.href = '../auth/login.html';
        return false;
    }
}

// Load user data and populate profile elements
async function loadUserProfile() {
    try {
        const user = await authAPI.me();
        return user.user;
    } catch (error) {
        console.error('Failed to load user profile:', error);
        return null;
    }
}

// Get profile image URL
function getProfileImageUrl(user) {
    console.log('[getProfileImageUrl] Called with user:', user ? { id: user.id, name: user.name, role: user.role } : 'null');
    
    if (!user) {
        console.log('[getProfileImageUrl] No user provided, returning default avatar');
        return 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2740%27 height=%2740%27%3E%3Crect fill=%27%23e5e7eb%27 width=%2740%27 height=%2740%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 text-anchor=%27middle%27 dy=%27.3em%27 fill=%27%236b7280%27 font-family=%27Arial%27 font-size=%2716%27%3E👤%3C/text%3E%3C/svg%3E';
    }

    // Prefer profile_image_url if it's a full URL, otherwise use profile_image
    let candidate = null;
    let source = 'none';
    
    if (user.profile_image_url) {
        const urlValue = String(user.profile_image_url);
        console.log('[getProfileImageUrl] Found profile_image_url:', urlValue);
        source = 'profile_image_url';
        
        if (urlValue.startsWith('http://') || urlValue.startsWith('https://')) {
            // Convert HTTP to HTTPS to avoid mixed content issues
            let secureUrl = urlValue;
            if (urlValue.startsWith('http://')) {
                console.log('[getProfileImageUrl] Converting HTTP to HTTPS:', urlValue);
                secureUrl = urlValue.replace('http://', 'https://');
                console.log('[getProfileImageUrl] Converted URL:', secureUrl);
            }
            const finalUrl = secureUrl + (secureUrl.includes('?') ? '&' : '?') + 'v=' + Date.now();
            console.log('[getProfileImageUrl] Returning URL from profile_image_url:', finalUrl);
            return finalUrl;
        }
        candidate = urlValue;
    }
    
    if (!candidate && user.profile_image) {
        console.log('[getProfileImageUrl] Using profile_image path:', user.profile_image);
        candidate = user.profile_image;
        source = 'profile_image';
    }
    
    if (!candidate) {
        console.log('[getProfileImageUrl] No image data found, returning default avatar');
        return 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2740%27 height=%2740%27%3E%3Crect fill=%27%23e5e7eb%27 width=%2740%27 height=%2740%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 text-anchor=%27middle%27 dy=%27.3em%27 fill=%27%236b7280%27 font-family=%27Arial%27 font-size=%2716%27%3E👤%3C/text%3E%3C/svg%3E';
    }
    
    // Always use HTTPS for backend URL to avoid mixed content issues
    const backendUrl = 'https://apilaravel.bytevortexz.com';
    const imageValue = String(candidate);
    console.log('[getProfileImageUrl] Building URL from', source, ':', imageValue);
    
    // If it's already a full URL, convert HTTP to HTTPS
    if (imageValue.startsWith('http://') || imageValue.startsWith('https://')) {
        let secureUrl = imageValue;
        if (imageValue.startsWith('http://')) {
            console.log('[getProfileImageUrl] Converting HTTP to HTTPS:', imageValue);
            secureUrl = imageValue.replace('http://', 'https://');
            console.log('[getProfileImageUrl] Converted URL:', secureUrl);
    }
        const finalUrl = secureUrl + (secureUrl.includes('?') ? '&' : '?') + 'v=' + Date.now();
        console.log('[getProfileImageUrl] Returning full URL:', finalUrl);
        return finalUrl;
    }
    
    // Handle different path formats - use API route for better CORS handling
    let finalUrl;
    if (imageValue.startsWith('/storage/')) {
        // Convert /storage/ to /api/storage/
        finalUrl = `${backendUrl}/api${imageValue}?v=${Date.now()}`;
    } else if (imageValue.startsWith('storage/')) {
        // Convert storage/ to /api/storage/
        finalUrl = `${backendUrl}/api/${imageValue}?v=${Date.now()}`;
    } else if (imageValue.startsWith('/api/storage/')) {
        // Already using API route
        finalUrl = `${backendUrl}${imageValue}?v=${Date.now()}`;
    } else if (imageValue.startsWith('api/storage/')) {
        // Already using API route (without leading slash)
        finalUrl = `${backendUrl}/${imageValue}?v=${Date.now()}`;
    } else {
        // Default: assume it's a relative path from storage root, use API route
        finalUrl = `${backendUrl}/api/storage/${imageValue}?v=${Date.now()}`;
    }
    
    console.log('[getProfileImageUrl] Built final URL from path:', finalUrl);
    return finalUrl;
}

// Get role display name
function getRoleDisplayName(role) {
    if (role === 'cleaner' || role === 'therapist') {
        return 'Massage Therapist';
    }
    if (role === 'super_admin') {
        return 'Super Admin';
    }
    return role.charAt(0).toUpperCase() + role.slice(1);
}

// Handle logout
async function handleLogout() {
    try {
        await authAPI.logout();
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        TokenManager.removeToken();
        window.location.href = '../auth/login.html';
    }
}

// Export for use in other scripts
window.requireAuth = requireAuth;
window.loadUserProfile = loadUserProfile;
window.getProfileImageUrl = getProfileImageUrl;
window.getRoleDisplayName = getRoleDisplayName;
window.handleLogout = handleLogout;
