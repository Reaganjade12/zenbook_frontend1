/**
 * Layout Utilities
 * Helper functions for generating common layout elements
 */

const BACKEND_URL = 'https://apilaravel.bytevortexz.com';

// Generate navbar HTML
function generateNavbar(user) {
    if (!user) return '';
    
    const profileImageUrl = getProfileImageUrl(user);
    const roleDisplay = getRoleDisplayName(user.role);
    
    return `
        <div class="container">
            <nav class="navbar">
                <div>
                    <div class="navbar-brand">ZenBook</div>
                </div>
                <div class="navbar-user">
                    <a href="../profile/show.html" style="display: flex; align-items: center; gap: 10px; text-decoration: none; color: var(--text-dark); margin-right: 15px; padding: 5px 10px; border-radius: 12px; transition: all 0.3s ease;" onmouseover="this.style.background='rgba(34, 197, 94, 0.1)'" onmouseout="this.style.background='transparent'">
                        <img 
                            src="${profileImageUrl}" 
                            alt="Profile" 
                            style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 2px solid var(--primary);"
                            onerror="this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2740%27 height=%2740%27%3E%3Crect fill=%27%23e5e7eb%27 width=%2740%27 height=%2740%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 text-anchor=%27middle%27 dy=%27.3em%27 fill=%27%236b7280%27 font-family=%27Arial%27 font-size=%2716%27%3E👤%3C/text%3E%3C/svg%3E';"
                        >
                        <div style="text-align: left;">
                            <div style="font-weight: 600; font-size: 14px; color: var(--text-white);">${escapeHtml(user.name)}</div>
                            <div style="font-size: 12px; color: var(--text-light);">${roleDisplay}</div>
                        </div>
                    </a>
                    <a href="../profile/show.html" style="color: var(--text-white); text-decoration: none; font-weight: 500; padding: 8px 16px; border-radius: 8px; transition: all 0.3s ease;" onmouseover="this.style.background='rgba(59, 130, 246, 0.2)'" onmouseout="this.style.background='transparent'">Profile</a>
                    <a href="#" onclick="handleLogout(); return false;" style="color: var(--text-white); text-decoration: none; font-weight: 500; padding: 8px 16px; border-radius: 8px; transition: all 0.3s ease;" onmouseover="this.style.background='rgba(59, 130, 246, 0.2)'" onmouseout="this.style.background='transparent'">Logout</a>
                </div>
            </nav>
        </div>
    `;
}

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Format time
function formatTime(timeString) {
    if (!timeString) return '';
    let value = String(timeString);
    if (value.includes('T')) {
        value = value.split('T')[1];
    }
    if (value.includes(' ')) {
        const parts = value.split(' ');
        value = parts[parts.length - 1];
    }
    value = value.replace('Z', '');

    const [hours, minutes] = value.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

function getViewsBasePath() {
    const path = window.location.pathname;
    const parts = path.split('/');
    const viewsIndex = parts.indexOf('views');

    if (viewsIndex === -1) {
        return '/views';
    }

    const baseParts = parts.slice(0, viewsIndex + 1);
    return baseParts.join('/');
}

function buildViewsHref(relativePath) {
    const base = getViewsBasePath().replace(/\/+$/, '');
    const rel = String(relativePath || '').replace(/^\/+/, '');

    if (window.location.origin && window.location.origin !== 'null') {
        return `${window.location.origin}${base}/${rel}`;
    }

    return `${base}/${rel}`;
}

// Get status badge class
function getStatusBadgeClass(status) {
    return `badge-${status.replace('_', '-')}`;
}

// Format status text
function formatStatus(status) {
    return status.replace('_', ' ').split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

function ensureAdminLayoutStyles() {
    if (document.getElementById('admin-layout-styles')) return;

    const style = document.createElement('style');
    style.id = 'admin-layout-styles';
    style.textContent = `
        .admin-sidebar {
            width: 260px;
            background: rgba(15, 23, 42, 0.92);
            backdrop-filter: blur(20px);
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            overflow-y: auto;
            z-index: 1000;
            border-right: 1px solid rgba(59, 130, 246, 0.2);
        }

        .admin-sidebar-header {
            padding: 22px 18px;
            border-bottom: 1px solid rgba(59, 130, 246, 0.2);
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .admin-sidebar-logo {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 22px;
            line-height: 1;
        }

        .admin-sidebar-title {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 20px;
            font-weight: 700;
            color: var(--text-white);
            margin: 0;
        }

        .admin-sidebar-menu {
            padding: 14px 0;
        }

        .admin-menu-item {
            display: block;
            padding: 12px 18px;
            text-decoration: none;
            color: var(--text-light);
            font-weight: 500;
            border-left: 3px solid transparent;
            transition: all 0.2s ease;
        }

        .admin-menu-item:hover {
            background: rgba(59, 130, 246, 0.12);
            color: var(--text-white);
        }

        .admin-menu-item.active {
            background: rgba(59, 130, 246, 0.2);
            color: #93c5fd;
            border-left-color: #3b82f6;
        }

        .admin-sidebar-footer {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 16px 18px;
            border-top: 1px solid rgba(59, 130, 246, 0.2);
        }

        .admin-user-row {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 12px;
        }

        .admin-user-avatar {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid rgba(59, 130, 246, 0.35);
        }

        .admin-user-name {
            font-size: 13px;
            font-weight: 600;
            color: var(--text-white);
            margin: 0;
        }

        .admin-user-role {
            font-size: 11px;
            color: var(--text-light);
            margin: 0;
        }

        .admin-logout-btn {
            width: 100%;
            padding: 10px 12px;
            border-radius: 10px;
            border: 1px solid rgba(239, 68, 68, 0.35);
            background: rgba(239, 68, 68, 0.12);
            color: #fecaca;
            cursor: pointer;
            font-weight: 600;
        }

        .admin-logout-btn:hover {
            background: rgba(239, 68, 68, 0.2);
            color: white;
        }

        .admin-top-nav {
            background: rgba(30, 41, 59, 0.92);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(59, 130, 246, 0.2);
            border-radius: 20px;
            padding: 18px 22px;
            margin-bottom: 24px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 18px;
        }

        .admin-top-nav-title {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 22px;
            font-weight: 800;
            color: var(--text-white);
            margin: 0;
            white-space: nowrap;
        }

        .admin-top-nav-user {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .admin-top-nav-user img {
            width: 34px;
            height: 34px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid rgba(59, 130, 246, 0.35);
        }

        .mobile-menu-toggle {
            display: none;
        }
        
        .mobile-menu-overlay {
            display: none;
        }
        
        @media (max-width: 1024px) {
            .admin-sidebar {
                transform: translateX(-100%);
                transition: transform 0.3s ease;
            }
            
            .admin-sidebar.mobile-open {
                transform: translateX(0);
            }
            
            .mobile-menu-overlay {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                z-index: 999;
            }
            
            .mobile-menu-overlay.active {
                display: block;
            }
            
            .mobile-menu-toggle {
                display: flex;
                position: fixed;
                top: 16px;
                left: 16px;
                z-index: 1001;
                background: rgba(30, 41, 59, 0.95);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(59, 130, 246, 0.2);
                border-radius: 8px;
                padding: 10px;
                cursor: pointer;
                color: var(--text-white);
                font-size: 20px;
                width: 44px;
                height: 44px;
                align-items: center;
                justify-content: center;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            }
            
            .mobile-menu-toggle:hover {
                background: rgba(30, 41, 59, 1);
                border-color: rgba(59, 130, 246, 0.4);
            }
        }
        
        @media (max-width: 768px) {
            .mobile-menu-toggle {
                top: 12px;
                left: 12px;
                width: 40px;
                height: 40px;
                font-size: 18px;
            }
        }
        
        @media (max-width: 480px) {
            .mobile-menu-toggle {
                top: 10px;
                left: 10px;
                width: 36px;
                height: 36px;
                font-size: 16px;
                padding: 8px;
            }
        }
    `;
    document.head.appendChild(style);
}

async function refreshLayoutUserData() {
    try {
        const response = await authAPI.me();
        if (response && response.user) {
            return response.user;
        }
    } catch (error) {
        console.error('Error refreshing user data:', error);
    }
    return null;
}

function injectAdminLayout(options) {
    const user = options?.user;
    const pageTitle = options?.title || 'Admin Dashboard - ZenBook';
    const active = options?.active || 'dashboard';

    if (!user) return;

    ensureAdminLayoutStyles();

    const sidebarContainer = document.getElementById('sidebar-container');
    if (sidebarContainer && !sidebarContainer.dataset.rendered) {
        const dashboardHref = buildViewsHref('staff/dashboard.html');
        const therapistsHref = buildViewsHref('staff/therapists/index.html');
        const usersHref = buildViewsHref('staff/users/index.html');
        const adminsHref = buildViewsHref('staff/admins/index.html');
        const profileHref = buildViewsHref('profile/show.html');
        
        const isSuperAdmin = user.role === 'super_admin';

        sidebarContainer.innerHTML = `
            <div class="mobile-menu-overlay" id="admin-mobile-overlay" onclick="toggleMobileMenu('admin')"></div>
            <button class="mobile-menu-toggle" id="admin-mobile-toggle" onclick="toggleMobileMenu('admin')" aria-label="Toggle menu">☰</button>
            <aside class="admin-sidebar" id="admin-sidebar">
                <div class="admin-sidebar-header">
                    <div class="admin-sidebar-logo">●</div>
                    <div class="admin-sidebar-title">ZenBook</div>
                </div>

                <nav class="admin-sidebar-menu">
                    <a class="admin-menu-item ${active === 'dashboard' ? 'active' : ''}" href="${dashboardHref}" onclick="closeMobileMenu('admin')">Dashboard</a>
                    <a class="admin-menu-item ${active === 'users' ? 'active' : ''}" href="${usersHref}" onclick="closeMobileMenu('admin')">Manage Users</a>
                    <a class="admin-menu-item ${active === 'therapists' ? 'active' : ''}" href="${therapistsHref}" onclick="closeMobileMenu('admin')">Manage Therapists</a>
                    ${isSuperAdmin ? `<a class="admin-menu-item ${active === 'admins' ? 'active' : ''}" href="${adminsHref}" onclick="closeMobileMenu('admin')">Manage Admins</a>` : ''}
                    <a class="admin-menu-item ${active === 'profile' ? 'active' : ''}" href="${profileHref}" onclick="closeMobileMenu('admin')">My Profile</a>
                </nav>

                <div class="admin-sidebar-footer">
                    <div class="admin-user-row">
                        <img class="admin-user-avatar" src="${getProfileImageUrl(user)}" alt="Profile" onerror="this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2736%27 height=%2736%27%3E%3Crect fill=%27%23334155%27 width=%2736%27 height=%2736%27/%3E%3C/svg%3E';">
                        <div style="min-width: 0;">
                            <p class="admin-user-name">${escapeHtml(user.name || 'Admin')}</p>
                            <p class="admin-user-role">${escapeHtml(getRoleDisplayName(user.role || 'staff'))}</p>
                        </div>
                    </div>
                    <button class="admin-logout-btn" onclick="handleLogout(); return false;">→ Logout</button>
                </div>
            </aside>
        `;
        sidebarContainer.dataset.rendered = 'true';
        
        // Refresh user data and update images after a short delay to ensure layout is rendered
        setTimeout(async () => {
            const freshUser = await refreshLayoutUserData();
            if (freshUser) {
                const avatars = sidebarContainer.querySelectorAll('.admin-user-avatar');
                avatars.forEach(img => {
                    img.src = getProfileImageUrl(freshUser);
                });
            }
        }, 100);
    }

    const mainContent = document.getElementById('main-content');
    if (mainContent && !document.getElementById('admin-top-nav')) {
        const headerHtml = `
            <div id="admin-top-nav" class="admin-top-nav">
                <h1 class="admin-top-nav-title">${escapeHtml(pageTitle)}</h1>
                <div class="admin-top-nav-user">
                    <img src="${getProfileImageUrl(user)}" alt="Profile" onerror="this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2734%27 height=%2734%27%3E%3Crect fill=%27%23334155%27 width=%2734%27 height=%2734%27/%3E%3C/svg%3E';">
                    <div style="text-align: right;">
                        <div style="font-weight: 700; font-size: 13px; color: var(--text-white);">${escapeHtml(user.name || 'Admin')}</div>
                        <div style="font-size: 11px; color: var(--text-light);">${escapeHtml(getRoleDisplayName(user.role || 'staff'))}</div>
                    </div>
                </div>
            </div>
        `;
        mainContent.insertAdjacentHTML('afterbegin', headerHtml);
        
        // Refresh user data and update header images after a short delay
        setTimeout(async () => {
            const freshUser = await refreshLayoutUserData();
            if (freshUser) {
                const headerAvatars = document.querySelectorAll('#admin-top-nav .admin-top-nav-user img');
                headerAvatars.forEach(img => {
                    img.src = getProfileImageUrl(freshUser);
                });
            }
        }, 100);
    }
}

function ensureTherapistLayoutStyles() {
    if (document.getElementById('therapist-layout-styles')) return;

    const style = document.createElement('style');
    style.id = 'therapist-layout-styles';
    style.textContent = `
        .therapist-sidebar {
            width: 260px;
            background: rgba(15, 23, 42, 0.92);
            backdrop-filter: blur(20px);
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            overflow-y: auto;
            z-index: 1000;
            border-right: 1px solid rgba(59, 130, 246, 0.2);
        }

        .therapist-sidebar-header {
            padding: 22px 18px;
            border-bottom: 1px solid rgba(59, 130, 246, 0.2);
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .therapist-sidebar-logo {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 22px;
            line-height: 1;
        }

        .therapist-sidebar-title {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 20px;
            font-weight: 700;
            color: var(--text-white);
            margin: 0;
        }

        .therapist-sidebar-menu {
            padding: 14px 0;
        }

        .therapist-menu-item {
            display: block;
            padding: 12px 18px;
            text-decoration: none;
            color: var(--text-light);
            font-weight: 500;
            border-left: 3px solid transparent;
            transition: all 0.2s ease;
        }

        .therapist-menu-item:hover {
            background: rgba(59, 130, 246, 0.12);
            color: var(--text-white);
        }

        .therapist-menu-item.active {
            background: rgba(59, 130, 246, 0.2);
            color: #93c5fd;
            border-left-color: #3b82f6;
        }

        .therapist-sidebar-footer {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 16px 18px;
            border-top: 1px solid rgba(59, 130, 246, 0.2);
        }

        .therapist-user-row {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 12px;
        }

        .therapist-user-avatar {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid rgba(59, 130, 246, 0.35);
        }

        .therapist-user-name {
            font-size: 13px;
            font-weight: 600;
            color: var(--text-white);
            margin: 0;
        }

        .therapist-user-role {
            font-size: 11px;
            color: var(--text-light);
            margin: 0;
        }

        .therapist-logout-btn {
            width: 100%;
            padding: 10px 12px;
            border-radius: 10px;
            border: 1px solid rgba(239, 68, 68, 0.35);
            background: rgba(239, 68, 68, 0.12);
            color: #fecaca;
            cursor: pointer;
            font-weight: 600;
        }

        .therapist-logout-btn:hover {
            background: rgba(239, 68, 68, 0.2);
            color: white;
        }

        .therapist-top-nav {
            background: rgba(30, 41, 59, 0.92);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(59, 130, 246, 0.2);
            border-radius: 20px;
            padding: 18px 22px;
            margin-bottom: 24px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 18px;
        }

        .therapist-top-nav-title {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 22px;
            font-weight: 800;
            color: var(--text-white);
            margin: 0;
            white-space: nowrap;
        }

        .therapist-top-nav-user {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .therapist-top-nav-user img {
            width: 34px;
            height: 34px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid rgba(59, 130, 246, 0.35);
        }

        .mobile-menu-toggle {
            display: none;
        }
        
        .mobile-menu-overlay {
            display: none;
        }
        
        @media (max-width: 1024px) {
            .therapist-sidebar {
                transform: translateX(-100%);
                transition: transform 0.3s ease;
            }
            
            .therapist-sidebar.mobile-open {
                transform: translateX(0);
            }
            
            .mobile-menu-overlay {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                z-index: 999;
            }
            
            .mobile-menu-overlay.active {
                display: block;
            }
            
            .mobile-menu-toggle {
                display: flex;
                position: fixed;
                top: 16px;
                left: 16px;
                z-index: 1001;
                background: rgba(30, 41, 59, 0.95);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(59, 130, 246, 0.2);
                border-radius: 8px;
                padding: 10px;
                cursor: pointer;
                color: var(--text-white);
                font-size: 20px;
                width: 44px;
                height: 44px;
                align-items: center;
                justify-content: center;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            }
            
            .mobile-menu-toggle:hover {
                background: rgba(30, 41, 59, 1);
                border-color: rgba(59, 130, 246, 0.4);
            }
        }
        
        @media (max-width: 768px) {
            .mobile-menu-toggle {
                top: 12px;
                left: 12px;
                width: 40px;
                height: 40px;
                font-size: 18px;
            }
        }
        
        @media (max-width: 480px) {
            .mobile-menu-toggle {
                top: 10px;
                left: 10px;
                width: 36px;
                height: 36px;
                font-size: 16px;
                padding: 8px;
            }
        }
    `;
    document.head.appendChild(style);
}

function injectTherapistLayout(options) {
    const user = options?.user;
    const pageTitle = options?.title || 'Therapist Dashboard - ZenBook';
    const active = options?.active || 'dashboard';

    if (!user) return;

    ensureTherapistLayoutStyles();

    const sidebarContainer = document.getElementById('sidebar-container');
    if (sidebarContainer && !sidebarContainer.dataset.rendered) {
        const dashboardHref = buildViewsHref('therapist/dashboard.html');
        const bookingsHref = buildViewsHref('therapist/bookings.html');
        const customersHref = buildViewsHref('therapist/customers.html');
        const profileHref = buildViewsHref('profile/show.html');

        sidebarContainer.innerHTML = `
            <div class="mobile-menu-overlay" id="therapist-mobile-overlay" onclick="toggleMobileMenu('therapist')"></div>
            <button class="mobile-menu-toggle" id="therapist-mobile-toggle" onclick="toggleMobileMenu('therapist')" aria-label="Toggle menu">☰</button>
            <aside class="therapist-sidebar" id="therapist-sidebar">
                <div class="therapist-sidebar-header">
                    <div class="therapist-sidebar-logo">●</div>
                    <div class="therapist-sidebar-title">ZenBook</div>
                </div>

                <nav class="therapist-sidebar-menu">
                    <a class="therapist-menu-item ${active === 'dashboard' ? 'active' : ''}" href="${dashboardHref}" onclick="closeMobileMenu('therapist')">Dashboard</a>
                    <a class="therapist-menu-item ${active === 'bookings' ? 'active' : ''}" href="${bookingsHref}" onclick="closeMobileMenu('therapist')">Manage Bookings</a>
                    <a class="therapist-menu-item ${active === 'customers' ? 'active' : ''}" href="${customersHref}" onclick="closeMobileMenu('therapist')">My Customers</a>
                    <a class="therapist-menu-item ${active === 'profile' ? 'active' : ''}" href="${profileHref}" onclick="closeMobileMenu('therapist')">My Profile</a>
                </nav>

                <div class="therapist-sidebar-footer">
                    <div class="therapist-user-row">
                        <img class="therapist-user-avatar" src="${getProfileImageUrl(user)}" alt="Profile" onerror="this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2736%27 height=%2736%27%3E%3Crect fill=%27%23334155%27 width=%2736%27 height=%2736%27/%3E%3C/svg%3E';">
                        <div style="min-width: 0;">
                            <p class="therapist-user-name">${escapeHtml(user.name || 'Therapist')}</p>
                            <p class="therapist-user-role">${escapeHtml(getRoleDisplayName(user.role || 'therapist'))}</p>
                        </div>
                    </div>
                    <button class="therapist-logout-btn" onclick="handleLogout(); return false;">→ Logout</button>
                </div>
            </aside>
        `;
        sidebarContainer.dataset.rendered = 'true';
        
        // Refresh user data and update images after a short delay to ensure layout is rendered
        setTimeout(async () => {
            const freshUser = await refreshLayoutUserData();
            if (freshUser) {
                const avatars = sidebarContainer.querySelectorAll('.therapist-user-avatar');
                avatars.forEach(img => {
                    img.src = getProfileImageUrl(freshUser);
                });
            }
        }, 100);
    }

    const mainContent = document.getElementById('main-content');
    if (mainContent && !document.getElementById('therapist-top-nav')) {
        const headerHtml = `
            <div id="therapist-top-nav" class="therapist-top-nav">
                <h1 class="therapist-top-nav-title">${escapeHtml(pageTitle)}</h1>
                <div class="therapist-top-nav-user">
                    <img src="${getProfileImageUrl(user)}" alt="Profile" onerror="this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2734%27 height=%2734%27%3E%3Crect fill=%27%23334155%27 width=%2734%27 height=%2734%27/%3E%3C/svg%3E';">
                    <div style="text-align: right;">
                        <div style="font-weight: 700; font-size: 13px; color: var(--text-white);">${escapeHtml(user.name || 'Therapist')}</div>
                        <div style="font-size: 11px; color: var(--text-light);">${escapeHtml(getRoleDisplayName(user.role || 'therapist'))}</div>
                    </div>
                </div>
            </div>
        `;
        mainContent.insertAdjacentHTML('afterbegin', headerHtml);
        
        // Refresh user data and update header images after a short delay
        setTimeout(async () => {
            const freshUser = await refreshLayoutUserData();
            if (freshUser) {
                const headerAvatars = document.querySelectorAll('#therapist-top-nav .therapist-top-nav-user img');
                headerAvatars.forEach(img => {
                    img.src = getProfileImageUrl(freshUser);
                });
            }
        }, 100);
    }
}

// Refresh layout images after profile update
function refreshLayoutImages(user) {
    if (!user) {
        console.warn('[refreshLayoutImages] No user provided');
        return;
    }
    
    console.log('[refreshLayoutImages] Refreshing images for user:', user.id);
    console.log('[refreshLayoutImages] User object:', {
        id: user.id,
        name: user.name,
        profile_image: user.profile_image,
        profile_image_url: user.profile_image_url,
        has_profile_image: !!user.profile_image,
        has_profile_image_url: !!user.profile_image_url
    });
    
    const newImageUrl = getProfileImageUrl(user);
    console.log('[refreshLayoutImages] New image URL:', newImageUrl);
    
    // Update sidebar avatar if exists (Admin and Therapist)
    const sidebarAvatars = document.querySelectorAll('.admin-user-avatar, .therapist-user-avatar');
    console.log('[refreshLayoutImages] Found', sidebarAvatars.length, 'sidebar avatars');
    sidebarAvatars.forEach((img, index) => {
        if (img && user) {
            const oldSrc = img.src;
            img.src = newImageUrl;
            console.log(`[refreshLayoutImages] Updated sidebar avatar ${index + 1}:`, oldSrc, '->', img.src);
            // Force reload by triggering error handler if image fails
            img.onerror = function() {
                this.onerror = null;
                this.src = newImageUrl + (newImageUrl.includes('?') ? '&' : '?') + 't=' + Date.now();
            };
        }
    });
    
    // Update top nav avatar if exists (Admin and Therapist)
    const topNavAvatars = document.querySelectorAll('.admin-top-nav-user img, .therapist-top-nav-user img');
    console.log('[refreshLayoutImages] Found', topNavAvatars.length, 'top nav avatars');
    topNavAvatars.forEach((img, index) => {
        if (img && user) {
            const oldSrc = img.src;
            img.src = newImageUrl;
            console.log(`[refreshLayoutImages] Updated top nav avatar ${index + 1}:`, oldSrc, '->', img.src);
            // Force reload by triggering error handler if image fails
            img.onerror = function() {
                this.onerror = null;
                this.src = newImageUrl + (newImageUrl.includes('?') ? '&' : '?') + 't=' + Date.now();
            };
        }
    });
    
    // Update navbar avatar if exists (Customer layout)
    const navbarAvatars = document.querySelectorAll('.navbar-user img');
    console.log('[refreshLayoutImages] Found', navbarAvatars.length, 'navbar avatars');
    navbarAvatars.forEach((img, index) => {
        if (img && user) {
            const oldSrc = img.src;
            img.src = newImageUrl;
            console.log(`[refreshLayoutImages] Updated navbar avatar ${index + 1}:`, oldSrc, '->', img.src);
            // Force reload by triggering error handler if image fails
            img.onerror = function() {
                this.onerror = null;
                this.src = newImageUrl + (newImageUrl.includes('?') ? '&' : '?') + 't=' + Date.now();
            };
        }
    });
    
    console.log('[refreshLayoutImages] ✅ Image refresh complete');
}

// Mobile menu toggle functions
function toggleMobileMenu(type) {
    const sidebar = document.getElementById(`${type}-sidebar`);
    const overlay = document.getElementById(`${type}-mobile-overlay`);
    
    if (sidebar && overlay) {
        const isOpen = sidebar.classList.contains('mobile-open');
        if (isOpen) {
            closeMobileMenu(type);
        } else {
            sidebar.classList.add('mobile-open');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
}

function closeMobileMenu(type) {
    const sidebar = document.getElementById(`${type}-sidebar`);
    const overlay = document.getElementById(`${type}-mobile-overlay`);
    
    if (sidebar && overlay) {
        sidebar.classList.remove('mobile-open');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close mobile menu when clicking outside or on escape key
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('mobile-menu-overlay')) {
        const type = e.target.id.replace('-mobile-overlay', '');
        closeMobileMenu(type);
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeMobileMenu('admin');
        closeMobileMenu('therapist');
    }
});

// Export
window.generateNavbar = generateNavbar;
window.refreshLayoutImages = refreshLayoutImages;
window.escapeHtml = escapeHtml;
window.formatDate = formatDate;
window.formatTime = formatTime;
window.getStatusBadgeClass = getStatusBadgeClass;
window.formatStatus = formatStatus;
window.injectAdminLayout = injectAdminLayout;
window.injectTherapistLayout = injectTherapistLayout;
window.toggleMobileMenu = toggleMobileMenu;
window.closeMobileMenu = closeMobileMenu;

