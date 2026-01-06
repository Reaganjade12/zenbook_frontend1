/**
 * Authentication Utilities
 * Helper functions for checking authentication and loading user data
 */

// Helper function to build absolute path for redirects
function buildLoginPath() {
    const currentPath = window.location.pathname;
    let basePath = '';
    
    // Extract base path
    if (currentPath.includes('/views/')) {
        basePath = currentPath.split('/views/')[0];
    }
    
    // Ensure basePath starts with / and doesn't end with /
    if (basePath && !basePath.startsWith('/')) {
        basePath = '/' + basePath;
    }
    if (basePath.endsWith('/')) {
        basePath = basePath.slice(0, -1);
    }
    
    return window.location.origin + basePath + '/views/auth/login.html';
}

// Helper function to build dashboard path
function buildDashboardPath(role) {
    const currentPath = window.location.pathname;
    let basePath = '';
    
    // Extract base path
    if (currentPath.includes('/views/')) {
        basePath = currentPath.split('/views/')[0];
    }
    
    // Ensure basePath starts with / and doesn't end with /
    if (basePath && !basePath.startsWith('/')) {
        basePath = '/' + basePath;
    }
    if (basePath.endsWith('/')) {
        basePath = basePath.slice(0, -1);
    }
    
    let dashboardPath = '';
    if (role === 'staff' || role === 'super_admin') {
        dashboardPath = basePath + '/views/staff/dashboard.html';
    } else if (role === 'therapist' || role === 'cleaner') {
        dashboardPath = basePath + '/views/therapist/dashboard.html';
    } else {
        dashboardPath = basePath + '/views/customer/dashboard.html';
    }
    
    return window.location.origin + dashboardPath;
}

// Check if user is authenticated and redirect if not
async function requireAuth(requiredRole = null) {
    if (!TokenManager.isAuthenticated()) {
        window.location.href = buildLoginPath();
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
                window.location.href = buildDashboardPath(user.role);
                return false;
            }
        }

        return user;
    } catch (error) {
        console.error('Auth check failed:', error);
        TokenManager.removeToken();
        window.location.href = buildLoginPath();
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
        window.location.href = buildLoginPath();
    }
}

// Toast Notification System - Mobile-friendly notifications
function showToastNotification(message, type = 'success') {
    // Remove any existing toast notifications
    const existingToast = document.querySelector('.toast-notification-container');
    if (existingToast) {
        existingToast.remove();
    }

    // Create toast notification container
    const toastContainer = document.createElement('div');
    toastContainer.className = 'toast-notification-container';
    
    const icon = type === 'success' ? '✅' : '⚠️';
    const toastClass = type === 'success' ? 'toast-success' : 'toast-error';
    const duration = type === 'success' ? 5000 : 8000;
    
    // Escape HTML to prevent XSS
    const escapeHtmlForToast = (str) => {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    };
    
    toastContainer.innerHTML = `
        <div class="toast-notification ${toastClass}">
            <div class="toast-content">
                <span class="toast-icon">${icon}</span>
                <span class="toast-message">${escapeHtmlForToast(message)}</span>
            </div>
            <button class="toast-close" onclick="closeToastNotification(this)" aria-label="Close notification">&times;</button>
            <div class="toast-progress" style="animation-duration: ${duration}ms;"></div>
        </div>
    `;
    
    document.body.appendChild(toastContainer);
    
    // Auto dismiss
    setTimeout(() => {
        closeToastNotification(toastContainer.querySelector('.toast-close'));
    }, duration);
}

function closeToastNotification(button) {
    if (!button) return;
    const toastContainer = button.closest('.toast-notification-container');
    if (toastContainer) {
        const toast = toastContainer.querySelector('.toast-notification');
        if (toast) {
            toast.classList.add('toast-closing');
            setTimeout(() => {
                toastContainer.remove();
            }, 300);
        }
    }
}

// Export for use in other scripts
window.requireAuth = requireAuth;
window.loadUserProfile = loadUserProfile;
window.getProfileImageUrl = getProfileImageUrl;
window.getRoleDisplayName = getRoleDisplayName;
window.handleLogout = handleLogout;
window.showToastNotification = showToastNotification;
window.closeToastNotification = closeToastNotification;
