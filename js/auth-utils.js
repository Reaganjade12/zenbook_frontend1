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
                'admin': ['staff']
            };

            const allowedRoles = roleMap[requiredRole] || [requiredRole];
            if (!allowedRoles.includes(user.role)) {
                // Redirect based on user role
                if (user.role === 'staff') {
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
    if (!user) {
        return 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2740%27 height=%2740%27%3E%3Crect fill=%27%23e5e7eb%27 width=%2740%27 height=%2740%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 text-anchor=%27middle%27 dy=%27.3em%27 fill=%27%236b7280%27 font-family=%27Arial%27 font-size=%2716%27%3E👤%3C/text%3E%3C/svg%3E';
    }

    const candidate = user.profile_image || user.profile_image_url;
    if (!candidate) {
        return 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2740%27 height=%2740%27%3E%3Crect fill=%27%23e5e7eb%27 width=%2740%27 height=%2740%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 text-anchor=%27middle%27 dy=%27.3em%27 fill=%27%236b7280%27 font-family=%27Arial%27 font-size=%2716%27%3E👤%3C/text%3E%3C/svg%3E';
    }
    
    const backendUrl = 'https://apilaravel.bytevortexz.com';
    const imageValue = String(candidate);
    if (imageValue.startsWith('http://') || imageValue.startsWith('https://')) {
        return imageValue;
    }
    if (imageValue.startsWith('/storage/')) {
        return `${backendUrl}${imageValue}`;
    }
    if (imageValue.startsWith('storage/')) {
        return `${backendUrl}/${imageValue}`;
    }
    return `${backendUrl}/storage/${imageValue}`;
}

// Get role display name
function getRoleDisplayName(role) {
    if (role === 'cleaner' || role === 'therapist') {
        return 'Massage Therapist';
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
