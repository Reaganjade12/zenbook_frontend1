/**
 * Frontend Configuration
 * Update this file with your Laravel backend API URL
 * 
 * You can also set these via:
 * 1. window.API_BASE_URL and window.STORAGE_URL before loading this script
 * 2. localStorage.setItem('api_base_url', '...') and localStorage.setItem('storage_url', '...')
 */

// API Configuration
const CONFIG = {
    // Priority: window variable > localStorage > default
    API_BASE_URL: window.API_BASE_URL || localStorage.getItem('api_base_url') || 'https://laravel-massagebooking.bytevortexz.com/api',
    
    // Storage URL for images (if different from API base)
    STORAGE_URL: window.STORAGE_URL || localStorage.getItem('storage_url') || 'https://laravel-massagebooking.bytevortexz.com/storage',
};

// Make config available globally
window.CONFIG = CONFIG;
