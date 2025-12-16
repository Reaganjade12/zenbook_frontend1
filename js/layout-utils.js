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

// Export
window.generateNavbar = generateNavbar;
window.escapeHtml = escapeHtml;
window.formatDate = formatDate;
window.formatTime = formatTime;
window.getStatusBadgeClass = getStatusBadgeClass;
window.formatStatus = formatStatus;
