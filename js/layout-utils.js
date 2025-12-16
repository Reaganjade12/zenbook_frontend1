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
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
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

        @media (max-width: 900px) {
            .admin-sidebar {
                display: none;
            }
        }
    `;
    document.head.appendChild(style);
}

function injectAdminLayout(options) {
    const user = options?.user;
    const pageTitle = options?.title || 'Admin Dashboard - ZenBook';
    const active = options?.active || 'dashboard';

    if (!user) return;

    ensureAdminLayoutStyles();

    const sidebarContainer = document.getElementById('sidebar-container');
    if (sidebarContainer && !sidebarContainer.dataset.rendered) {
        const dashboardHref = new URL('dashboard.html', window.location.href).href;
        const therapistsHref = new URL('therapists/index.html', window.location.href).href;
        const profileHref = new URL('../profile/show.html', window.location.href).href;

        sidebarContainer.innerHTML = `
            <aside class="admin-sidebar">
                <div class="admin-sidebar-header">
                    <div class="admin-sidebar-logo">●</div>
                    <div class="admin-sidebar-title">ZenBook</div>
                </div>

                <nav class="admin-sidebar-menu">
                    <a class="admin-menu-item ${active === 'dashboard' ? 'active' : ''}" href="${dashboardHref}">Dashboard</a>
                    <a class="admin-menu-item ${active === 'therapists' ? 'active' : ''}" href="${therapistsHref}">Manage Therapists</a>
                    <a class="admin-menu-item ${active === 'profile' ? 'active' : ''}" href="${profileHref}">My Profile</a>
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
    }
}

// Export
window.generateNavbar = generateNavbar;
window.escapeHtml = escapeHtml;
window.formatDate = formatDate;
window.formatTime = formatTime;
window.getStatusBadgeClass = getStatusBadgeClass;
window.formatStatus = formatStatus;
window.injectAdminLayout = injectAdminLayout;

