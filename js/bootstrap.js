// Bootstrap - Initialize axios if needed (optional, using fetch API instead)
// This file is kept for compatibility but the app uses fetch API directly
if (typeof axios !== 'undefined') {
    window.axios = axios;
    window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
}

