// Build script to inject environment variables
const fs = require('fs');
const path = require('path');

// Get API key from environment variable
const API_KEY = process.env.WEATHER_API_KEY || 'ea048e63dfc34185b6270054251906';

// Generate config.js with the API key
const configContent = `// Weather App Configuration
window.WEATHER_CONFIG = {
    API_KEY: '${API_KEY}',
    API_BASE_URL: 'http://api.weatherapi.com/v1'
};`;

// Write the config file
fs.writeFileSync(path.join(__dirname, 'config.js'), configContent);

console.log('Configuration file generated successfully!');
console.log('API Key:', API_KEY.substring(0, 8) + '...' + API_KEY.substring(API_KEY.length - 4));
