# Weather App

A simple, responsive weather application that provides current weather information for any location using the WeatherAPI service.

## Features

- 🌤️ Real-time weather data
- 📱 Responsive design for mobile and desktop
- 🔍 Search by city name or coordinates
- 🌍 Automatic geolocation detection
- 📊 Comprehensive weather details including:
  - Current temperature and "feels like" temperature
  - Weather conditions with icons
  - Humidity, visibility, and pressure
  - Wind speed and direction
  - Cloud cover and UV index
- ⚡ Fast loading with error handling
- 🎨 Modern, beautiful UI with animations

## How to Use

1. **Open the App**: Open `index.html` in your web browser
2. **Search for Weather**: 
   - Type a city name, address, or location in the search box
   - Press Enter or click the Search button
3. **View Results**: The app will display comprehensive weather information for your searched location

## API Configuration

This app uses WeatherAPI (weatherapi.com) with the following API key:
- **API Key**: `ea048e63dfc34185b6270054251906`

The API provides:
- Current weather conditions
- Location information
- Weather icons
- Detailed meteorological data

## Files Structure

```
Weather App/
├── index.html          # Main HTML file
├── style.css           # Styling and responsive design
├── script.js           # JavaScript functionality and API calls
├── sw.js              # Service worker for offline functionality
└── README.md          # This file
```

## Technical Details

### Technologies Used
- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with Flexbox and Grid
- **Vanilla JavaScript**: API integration and DOM manipulation
- **Font Awesome**: Icons for better visual appeal
- **Service Worker**: Basic offline functionality

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Features Implemented
- Responsive design for all screen sizes
- Error handling for invalid locations
- Loading states with animations
- Geolocation API integration
- Rate limiting for API requests
- Service worker for caching

## Setup Instructions

1. **Download/Clone**: Save all files to a folder on your computer
2. **Open**: Double-click `index.html` or open it in your web browser
3. **Start Using**: The app is ready to use immediately!

### For Local Development
If you want to run it on a local server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (with http-server package)
npx http-server

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000` in your browser.

## API Usage

The app makes requests to:
```
http://api.weatherapi.com/v1/current.json?key=YOUR_API_KEY&q=LOCATION
```

### Rate Limits
- Free tier: 1,000,000 calls per month
- Built-in request throttling to prevent abuse

## Customization

### Changing the API Key
If you need to use a different API key, edit the `API_KEY` constant in `script.js`:

```javascript
const API_KEY = 'your-new-api-key-here';
```

### Styling
Customize the appearance by modifying `style.css`. The app uses CSS custom properties for easy theme changes.

### Adding Features
The modular JavaScript structure makes it easy to add new features like:
- 7-day forecast
- Weather alerts
- Multiple location favorites
- Temperature unit switching

## Troubleshooting

### Common Issues

1. **"Location not found" error**
   - Check spelling of the location
   - Try using a larger city name nearby
   - Use latitude,longitude format for precise locations

2. **API errors**
   - Verify internet connection
   - Check if API key is valid
   - Ensure you haven't exceeded rate limits

3. **App not loading**
   - Make sure all files are in the same folder
   - Check browser console for JavaScript errors
   - Try opening in a different browser

### Error Messages
- **"Please enter a location"**: The search field is empty
- **"Location not found"**: The entered location doesn't exist in the API database
- **"Network error"**: Check your internet connection
- **"API key error"**: The API key is invalid or expired

## License

This project is open source and available under the MIT License.

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Verify all files are present and in the correct location
3. Test with a simple location like "London" or "New York"

## Version History

- **v1.0**: Initial release with basic weather display
- Current version includes geolocation, service worker, and comprehensive error handling
