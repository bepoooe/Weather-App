// Weather API configuration
const API_KEY = 'ea048e63dfc34185b6270054251906';
const API_BASE_URL = 'https://api.weatherapi.com/v1';

// DOM elements
const locationInput = document.getElementById('locationInput');
const searchBtn = document.getElementById('searchBtn');
const currentLocationBtn = document.getElementById('currentLocationBtn');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');
const weatherDisplay = document.getElementById('weatherDisplay');

// Weather data elements
const locationName = document.getElementById('locationName');
const localTime = document.getElementById('localTime');
const weatherIcon = document.getElementById('weatherIcon');
const currentTemp = document.getElementById('currentTemp');
const weatherCondition = document.getElementById('weatherCondition');
const feelsLike = document.getElementById('feelsLike');
const visibility = document.getElementById('visibility');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const pressure = document.getElementById('pressure');
const cloudCover = document.getElementById('cloudCover');
const uvIndex = document.getElementById('uvIndex');

// Debouncing and connection state
let searchTimeout;
let isSearching = false;

// Test API connection
async function testConnection() {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(`${API_BASE_URL}/current.json?key=${API_KEY}&q=London&aqi=no`, {
            signal: controller.signal,
            headers: { 'Accept': 'application/json' }
        });
        
        clearTimeout(timeoutId);
        return response.ok;
    } catch (error) {
        console.warn('Connection test failed:', error);
        return false;
    }
}

// Event listeners
searchBtn.addEventListener('click', handleSearch);
currentLocationBtn.addEventListener('click', handleCurrentLocation);
locationInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

// Search handler with debouncing
async function handleSearch() {
    const location = locationInput.value.trim();
    
    if (!location) {
        showError('Please enter a location');
        return;
    }
    
    // Prevent multiple simultaneous searches
    if (isSearching) {
        return;
    }
    
    // Clear any pending searches
    if (searchTimeout) {
        clearTimeout(searchTimeout);
    }
    
    // Debounce search requests
    searchTimeout = setTimeout(async () => {
        isSearching = true;
        try {
            await getWeatherData(location);
        } finally {
            isSearching = false;
        }
    }, 300);
}

// Current location handler
async function handleCurrentLocation() {
    if (!navigator.geolocation) {
        showError('Geolocation is not supported by this browser');
        return;
    }
    
    // Disable button and show loading state
    currentLocationBtn.disabled = true;
    currentLocationBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Getting Location...';
    
    try {
        const position = await getCurrentPosition();
        const { latitude, longitude } = position.coords;
        await getWeatherData(`${latitude},${longitude}`);
    } catch (error) {
        console.error('Geolocation error:', error);
        
        if (error.code === error.PERMISSION_DENIED) {
            showError('Location access denied. Please allow location access and try again.');
        } else if (error.code === error.POSITION_UNAVAILABLE) {
            showError('Location information is unavailable. Please try entering a location manually.');
        } else if (error.code === error.TIMEOUT) {
            showError('Location request timed out. Please try again.');
        } else {
            showError('Unable to get your location. Please try entering a location manually.');
        }
    } finally {
        // Re-enable button
        currentLocationBtn.disabled = false;
        currentLocationBtn.innerHTML = '<i class="fas fa-location-arrow"></i> Use Current Location';
    }
}

// Promisify geolocation
function getCurrentPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            resolve,
            reject,
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 600000 // 10 minutes
            }
        );
    });
}

// Fetch weather data from API with retry logic
async function getWeatherData(location, retryCount = 0) {
    const maxRetries = 2;
    showLoading();
    
    try {        // Create AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const response = await fetch(
            `${API_BASE_URL}/current.json?key=${API_KEY}&q=${encodeURIComponent(location)}&aqi=no`,
            {
                signal: controller.signal,
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'WeatherApp/1.0'
                }
            }
        );
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error.message);
        }
        
        displayWeatherData(data);
        
    } catch (error) {
        console.error('Error fetching weather data:', error);
        
        // Retry logic for network errors
        if ((error.name === 'AbortError' || error.name === 'TypeError' || error.message.includes('fetch')) && retryCount < maxRetries) {
            console.log(`Retrying request... Attempt ${retryCount + 1} of ${maxRetries}`);
            setTimeout(() => getWeatherData(location, retryCount + 1), 1000 * (retryCount + 1));
            return;
        }
        
        // Error handling
        if (error.name === 'AbortError') {
            showError('Request timed out. Please check your connection and try again.');
        } else if (error.message.includes('No matching location found')) {
            showError('Location not found. Please check the spelling and try again.');
        } else if (error.message.includes('API key')) {
            showError('API key error. Please check your API configuration.');
        } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
            showError('Network error. Please check your internet connection and try again.');
        } else if (error.message.includes('CORS') || error.message.includes('Mixed Content')) {
            showError('Security error. The app may need to be accessed over HTTPS.');
        } else if (error.message.includes('HTTP error! status:')) {
            const status = error.message.match(/status: (\d+)/)?.[1];
            if (status === '403') {
                showError('API access denied. Please check your API key.');
            } else if (status === '404') {
                showError('Weather service not found. Please try again later.');
            } else if (status === '429') {
                showError('Too many requests. Please wait a moment and try again.');
            } else if (status === '500' || status === '502' || status === '503') {
                showError('Weather service is temporarily unavailable. Please try again later.');
            } else {
                showError(`Server error (${status}). Please try again later.`);
            }
        } else {
            showError('Unable to fetch weather data. Please try again later.');
        }
    }
}

// Display weather data
function displayWeatherData(data) {
    const { location, current } = data;
    
    // Location information
    locationName.textContent = `${location.name}, ${location.region}, ${location.country}`;
    localTime.textContent = `Local time: ${formatDateTime(location.localtime)}`;
    
    // Current weather
    weatherIcon.src = `https:${current.condition.icon}`;
    weatherIcon.alt = current.condition.text;
    currentTemp.textContent = Math.round(current.temp_c);
    weatherCondition.textContent = current.condition.text;
    feelsLike.textContent = Math.round(current.feelslike_c);
    
    // Weather details
    visibility.textContent = `${current.vis_km} km`;
    humidity.textContent = `${current.humidity}%`;
    windSpeed.textContent = `${current.wind_kph} km/h ${current.wind_dir}`;
    pressure.textContent = `${current.pressure_mb} mb`;
    cloudCover.textContent = `${current.cloud}%`;
    uvIndex.textContent = getUVDescription(current.uv);
    
    showWeatherDisplay();
}

// Format date and time
function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Get UV description
function getUVDescription(uvValue) {
    if (uvValue <= 2) return `${uvValue} (Low)`;
    if (uvValue <= 5) return `${uvValue} (Moderate)`;
    if (uvValue <= 7) return `${uvValue} (High)`;
    if (uvValue <= 10) return `${uvValue} (Very High)`;
    return `${uvValue} (Extreme)`;
}

// UI state management functions
function showLoading() {
    hideAllDisplays();
    loading.style.display = 'block';
}

function showError(message) {
    hideAllDisplays();
    errorText.textContent = message;
    errorMessage.style.display = 'block';
}

function hideError() {
    errorMessage.style.display = 'none';
}

function showWeatherDisplay() {
    hideAllDisplays();
    weatherDisplay.style.display = 'block';
}

function hideAllDisplays() {
    loading.style.display = 'none';
    errorMessage.style.display = 'none';
    weatherDisplay.style.display = 'none';
}

// Initialize app
async function initializeApp() {
    try {
        // Test connection on load (but don't show error if it fails)
        const isConnected = await testConnection();
        if (!isConnected) {
            console.warn('Initial connection test failed - but will try again on search');
        } else {
            console.log('Initial connection test successful');
        }
        
        // Add online/offline listeners
        window.addEventListener('online', () => {
            console.log('Connection restored');
            hideError();
        });
        
        window.addEventListener('offline', () => {
            showError('No internet connection. Please check your network.');
        });
        
        // Only show offline error if we're definitely offline
        if (!navigator.onLine) {
            showError('No internet connection. Please check your network.');
        }
        
    } catch (error) {
        console.error('App initialization error:', error);
        // Don't show error to user during initialization
    }
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Handle API rate limiting
let lastRequestTime = 0;
const REQUEST_DELAY = 1000; // 1 second delay between requests

const originalGetWeatherData = getWeatherData;
getWeatherData = async function(location) {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    
    if (timeSinceLastRequest < REQUEST_DELAY) {
        await new Promise(resolve => setTimeout(resolve, REQUEST_DELAY - timeSinceLastRequest));
    }
    
    lastRequestTime = Date.now();
    return originalGetWeatherData.call(this, location);
};

// Service Worker registration for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
