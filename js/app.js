//import './bootstrap';
/**
 * API Client for Bearer Token Authentication
 * Handles token storage in localStorage and API requests
 */

// Use production backend URL for GitHub Pages deployment
const API_BASE_URLS = [
    'https://apilaravel.bytevortexz.com/api',
    'https://laravel-massagebooking.bytevortexz.com/api',
];
window.API_BASE_URLS = API_BASE_URLS;
window.API_BASE_URL = API_BASE_URLS[0];

// Token management
const TokenManager = {
    /**
     * Get token from localStorage
     */
    getToken() {
        return localStorage.getItem('auth_token');
    },

    /**
     * Save token to localStorage
     */
    setToken(token) {
        localStorage.setItem('auth_token', token);
    },

    /**
     * Remove token from localStorage
     */
    removeToken() {
        localStorage.removeItem('auth_token');
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return !!this.getToken();
    }
};

const redirectToLogin = () => {
    const path = window.location.pathname;
    if (path.includes('/views/auth/login')) {
        return;
    }

    const parts = path.split('/');
    const viewsIndex = parts.indexOf('views');
    let basePath = '';

    if (viewsIndex > 1) {
        basePath = parts.slice(0, viewsIndex).join('/');
    }

    const loginPath = `${basePath}/views/auth/login.html`;
    window.location.href = loginPath;
};

// API Client
const apiClient = {
    /**
     * Make API request with Bearer token
     */
    async request(url, options = {}) {
        const token = TokenManager.getToken();
        
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...options.headers,
        };

        // Add Bearer token if available
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config = {
            method: options.method || 'GET',
            ...options,
            headers,
        };

        try {
            let response;
            let baseUrlUsed;
            let lastNetworkError;
            const retryableStatuses = new Set([404, 405, 500, 502, 503, 504]);

            for (const baseUrl of API_BASE_URLS) {
                try {
                    const candidateResponse = await fetch(`${baseUrl}${url}`, config);
                    response = candidateResponse;
                    baseUrlUsed = baseUrl;

                    if (API_BASE_URLS.length > 1 && retryableStatuses.has(candidateResponse.status)) {
                        continue;
                    }

                    break;
                } catch (error) {
                    lastNetworkError = error;
                    if (error instanceof TypeError) {
                        continue;
                    }
                    throw error;
                }
            }

            if (!response) {
                throw lastNetworkError || new Error('Failed to fetch');
            }

            if (baseUrlUsed) {
                window.API_BASE_URL = baseUrlUsed;
            }
            
            // Handle 401 Unauthorized - token expired or invalid
            if (response.status === 401) {
                TokenManager.removeToken();
                redirectToLogin();
                throw new Error('Session expired. Please login again.');
            }

            // Parse response based on content type
            // Note: response body can only be read once, so we read as text first
            let data;
            const contentType = response.headers.get('content-type') || '';
            let responseText = '';
            
            try {
                responseText = await response.text();
                
                if (contentType.includes('application/json') && responseText) {
                    try {
                        data = JSON.parse(responseText);
                    } catch (parseError) {
                        console.error('Error parsing JSON response:', parseError);
                        data = responseText; // Fallback to text
                    }
                } else {
                    data = responseText || null;
                }
            } catch (readError) {
                console.error('Error reading response:', readError);
                data = `HTTP ${response.status}: ${response.statusText}`;
            }
            
            if (!response.ok) {
                // Handle error response
                if (typeof data === 'string') {
                    throw new Error(data || `HTTP ${response.status}: ${response.statusText}`);
                }
                if (data && typeof data === 'object') {
                    const firstError = data?.errors ? Object.values(data.errors)?.flat?.()?.[0] : null;
                    throw new Error(firstError || data.message || `HTTP ${response.status}: ${response.statusText}`);
                }
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return data;
        } catch (error) {
            console.error('API Error:', {
                message: error.message,
                url: url,
                baseUrl: window.API_BASE_URL || API_BASE_URLS[0],
                error: error
            });
            // Re-throw with more context if it's a network error
            if (error instanceof TypeError && error.message.includes('fetch')) {
                throw new Error(`Network error: Unable to connect to the API. Please check your internet connection and try again.`);
            }
            throw error;
        }
    },

    /**
     * GET request
     */
    async get(url, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const fullUrl = queryString ? `${url}?${queryString}` : url;
        return this.request(fullUrl, { method: 'GET' });
    },

    /**
     * POST request
     */
    async post(url, data = {}) {
        return this.request(url, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    /**
     * PUT request
     */
    async put(url, data = {}) {
        return this.request(url, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    /**
     * DELETE request
     */
    async delete(url) {
        return this.request(url, { method: 'DELETE' });
    },

    /**
     * POST request with FormData (for file uploads)
     */
    async postFormData(url, formData) {
        console.log('[API] postFormData called for:', url);
        const token = TokenManager.getToken();
        const headers = {
            'Accept': 'application/json',
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
            console.log('[API] Token present, length:', token.length);
        } else {
            console.warn('[API] ⚠️ No token found!');
        }

        let response;
        let baseUrlUsed;
        let lastNetworkError;
        const retryableStatuses = new Set([404, 405, 500, 502, 503, 504]);

        for (const baseUrl of API_BASE_URLS) {
            try {
                const fullUrl = `${baseUrl}${url}`;
                console.log('[API] Attempting request to:', fullUrl);
                const candidateResponse = await fetch(fullUrl, {
                    method: 'POST',
                    headers,
                    body: formData,
                });
                response = candidateResponse;
                baseUrlUsed = baseUrl;
                console.log('[API] Response status:', candidateResponse.status, candidateResponse.statusText);

                if (API_BASE_URLS.length > 1 && retryableStatuses.has(candidateResponse.status)) {
                    console.log('[API] Retryable status, trying next URL...');
                    continue;
                }

                break;
            } catch (error) {
                console.error('[API] Request error:', error);
                lastNetworkError = error;
                if (error instanceof TypeError) {
                    continue;
                }
                throw error;
            }
        }

        if (!response) {
            console.error('[API] ❌ No response received, last error:', lastNetworkError);
            throw lastNetworkError || new Error('Failed to fetch');
        }

        if (baseUrlUsed) {
            window.API_BASE_URL = baseUrlUsed;
            console.log('[API] Using base URL:', baseUrlUsed);
        }

        if (response.status === 401) {
            console.error('[API] ❌ Unauthorized (401), redirecting to login');
            TokenManager.removeToken();
            redirectToLogin();
            throw new Error('Session expired. Please login again.');
        }

        // Parse response based on content type
        // Note: response body can only be read once, so we read as text first
        let data;
        const contentType = response.headers.get('content-type') || '';
        let responseText = '';
        
        try {
            responseText = await response.text();
            console.log('[API] Response text length:', responseText.length);
            console.log('[API] Content-Type:', contentType);
            
            if (contentType.includes('application/json') && responseText) {
                try {
                    data = JSON.parse(responseText);
                    console.log('[API] ✅ Parsed JSON response:', data);
                } catch (parseError) {
                    console.error('[API] ❌ Error parsing JSON response:', parseError);
                    console.error('[API] Response text:', responseText);
                    data = responseText; // Fallback to text
                }
            } else {
                console.log('[API] Non-JSON response, using as text');
                data = responseText || null;
            }
        } catch (readError) {
            console.error('[API] ❌ Error reading response:', readError);
            data = `HTTP ${response.status}: ${response.statusText}`;
        }
        
        if (!response.ok) {
            console.error('[API] ❌ Response not OK:', response.status, response.statusText);
            console.error('[API] Error data:', data);
            // Handle error response
            if (typeof data === 'string') {
                throw new Error(data || `HTTP ${response.status}: ${response.statusText}`);
            }
            if (data && typeof data === 'object') {
                const firstError = data?.errors ? Object.values(data.errors)?.flat?.()?.[0] : null;
                throw new Error(firstError || data.message || `HTTP ${response.status}: ${response.statusText}`);
            }
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        console.log('[API] ✅ Request successful, returning data');
        return data;
    },
};

// Authentication API
const authAPI = {
    /**
     * Login user
     */
    async login(email, password) {
        const response = await apiClient.post('/login', { email, password });
        
        if (response.token) {
            TokenManager.setToken(response.token);
        }
        
        return response;
    },

    /**
     * Register user
     */
    async register(userData) {
        return await apiClient.post('/register', userData);
    },

    /**
     * Verify OTP
     */
    async verifyOTP(email, otp) {
        return await apiClient.post('/verify-otp', { email, otp });
    },

    /**
     * Resend OTP
     */
    async resendOTP(email) {
        return await apiClient.post('/resend-otp', { email });
    },

    /**
     * Logout user
     */
    async logout() {
        try {
            await apiClient.post('/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            TokenManager.removeToken();
        }
    },

    /**
     * Get current user
     */
    async me() {
        return await apiClient.get('/me');
    },
};

// Customer API
const customerAPI = {
    /**
     * Get available therapists
     */
    async getAvailableTherapists() {
        return await apiClient.get('/customer/available-therapists');
    },
};

// Booking API
const bookingAPI = {
    /**
     * Get customer dashboard
     */
    async getDashboard(status = null) {
        const params = status ? { status } : {};
        return await apiClient.get('/customer/dashboard', params);
    },

    /**
     * Get available therapists
     */
    async getAvailableTherapists() {
        return await apiClient.get('/customer/available-therapists');
    },

    /**
     * Get all bookings
     */
    async getAll(status = null) {
        const params = status ? { status } : {};
        return await apiClient.get('/customer/bookings', params);
    },

    /**
     * Get single booking
     */
    async getById(id) {
        return await apiClient.get(`/customer/bookings/${id}`);
    },

    /**
     * Create booking
     */
    async create(bookingData) {
        return await apiClient.post('/customer/bookings', bookingData);
    },

    /**
     * Update booking
     */
    async update(id, bookingData) {
        return await apiClient.put(`/customer/bookings/${id}`, bookingData);
    },

    /**
     * Delete booking
     */
    async delete(id) {
        return await apiClient.delete(`/customer/bookings/${id}`);
    },
};

// Therapist API
const therapistAPI = {
    /**
     * Get therapist dashboard
     */
    async getDashboard(status = null) {
        const params = status ? { status } : {};
        return await apiClient.get('/therapist/dashboard', params);
    },

    /**
     * Get all bookings
     */
    async getBookings(status = null) {
        const params = status ? { status } : {};
        return await apiClient.get('/therapist/bookings', params);
    },

    /**
     * Accept booking
     */
    async acceptBooking(id) {
        return await apiClient.post(`/therapist/bookings/${id}/accept`);
    },

    /**
     * Decline booking
     */
    async declineBooking(id) {
        return await apiClient.post(`/therapist/bookings/${id}/decline`);
    },

    /**
     * Update booking status
     */
    async updateStatus(id, status) {
        return await apiClient.post(`/therapist/bookings/${id}/update-status`, { status });
    },

    /**
     * Toggle availability
     */
    async toggleAvailability() {
        return await apiClient.post('/therapist/toggle-availability');
    },

    /**
     * Get customers
     */
    async getCustomers() {
        return await apiClient.get('/therapist/customers');
    },
};

// Staff API
const staffAPI = {
    /**
     * Get staff dashboard
     */
    async getDashboard() {
        return await apiClient.get('/staff/dashboard');
    },

    /**
     * Get all users
     */
    async getUsers() {
        return await apiClient.get('/staff/users');
    },

    /**
     * Get all therapists
     */
    async getTherapists() {
        return await apiClient.get('/staff/therapists');
    },

    /**
     * Get single therapist
     */
    async getTherapist(id) {
        return await apiClient.get(`/staff/therapists/${id}`);
    },

    /**
     * Create therapist
     */
    async createTherapist(therapistData) {
        return await apiClient.post('/staff/therapists', therapistData);
    },

    /**
     * Update therapist
     */
    async updateTherapist(id, therapistData) {
        return await apiClient.put(`/staff/therapists/${id}`, therapistData);
    },

    /**
     * Get all bookings
     */
    async getBookings(status = null) {
        const params = status ? { status } : {};
        return await apiClient.get('/staff/bookings', params);
    },

    /**
     * Delete user
     */
    async deleteUser(id) {
        return await apiClient.delete(`/staff/users/${id}`);
    },

    /**
     * Delete therapist
     */
    async deleteTherapist(id) {
        return await apiClient.delete(`/staff/therapists/${id}`);
    },

    /**
     * Delete booking
     */
    async deleteBooking(id) {
        return await apiClient.delete(`/staff/bookings/${id}`);
    },
};

// Profile API
const profileAPI = {
    /**
     * Get profile
     */
    async get() {
        console.log('[ProfileAPI] Getting profile...');
        const response = await apiClient.get('/profile');
        console.log('[ProfileAPI] ✅ Profile data received:', response);
        if (response && response.user) {
            console.log('[ProfileAPI] User profile_image:', response.user.profile_image);
            console.log('[ProfileAPI] User profile_image_url:', response.user.profile_image_url);
        }
        return response;
    },

    /**
     * Update profile
     */
    async update(profileData) {
        console.log('[ProfileAPI] Updating profile (no image)...');
        console.log('[ProfileAPI] Update data:', profileData);
        const response = await apiClient.put('/profile', profileData);
        console.log('[ProfileAPI] ✅ Profile updated:', response);
        return response;
    },

    /**
     * Update profile with image
     */
    async updateWithImage(formData) {
        console.log('[ProfileAPI] Updating profile with image...');
        console.log('[ProfileAPI] FormData entries:', Array.from(formData.entries()).map(([key, value]) => {
            if (value instanceof File) {
                return [key, { name: value.name, size: value.size, type: value.type }];
            }
            return [key, value];
        }));
        const response = await apiClient.postFormData('/profile', formData);
        console.log('[ProfileAPI] ✅ Profile updated with image:', response);
        if (response && response.user) {
            console.log('[ProfileAPI] Updated user profile_image:', response.user.profile_image);
            console.log('[ProfileAPI] Updated user profile_image_url:', response.user.profile_image_url);
        }
        return response;
    },

    /**
     * Delete profile image
     */
    async deleteImage() {
        console.log('[ProfileAPI] Deleting profile image...');
        const response = await apiClient.delete('/profile/image');
        console.log('[ProfileAPI] ✅ Profile image deleted:', response);
        return response;
    },
};

// Export for use in other scripts
window.TokenManager = TokenManager;
window.apiClient = apiClient;
window.authAPI = authAPI;
window.customerAPI = customerAPI;
window.bookingAPI = bookingAPI;
window.therapistAPI = therapistAPI;
window.staffAPI = staffAPI;
window.profileAPI = profileAPI;

