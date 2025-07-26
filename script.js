const API_KEY = 'ffe4f34c88b04f318eb152639252407';
const BASE_URL = 'https://api.weatherapi.com/v1/current.json';

// Background images configuration
const backgroundImages = {
    day: {
        sunny: 'https://images.unsplash.com/photo-1566438480900-0609be27a4be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2096&q=80',
        cloudy: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80',
        rainy: 'https://images.unsplash.com/photo-1438449805896-28a666819a20?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        snowy: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2076&q=80',
        foggy: 'https://images.unsplash.com/photo-1504253163759-c23fccaebb55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80',
        default: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    },
    night: {
        clear: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
        cloudy: 'https://images.unsplash.com/photo-1492011221367-f47e3ccd77a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80',
        rainy: 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        snowy: 'https://images.unsplash.com/photo-1510305393541-3b927aab3b64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80',
        foggy: 'https://images.unsplash.com/photo-1507402016330-95ed0e9f091f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80',
        default: 'https://images.unsplash.com/photo-1534278931827-8a259344abe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80'
    }
};

document.addEventListener('DOMContentLoaded', function() {
    // Default city
    fetchWeather('London');
    
    // Form submission
    document.getElementById('weather-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const city = document.getElementById('city-input').value.trim();
        if (city) {
            fetchWeather(city);
        }
    });
});

async function fetchWeather(city) {
    try {
        // Show loading state
        document.getElementById('city-name').textContent = 'Loading...';
        document.getElementById('region-country').textContent = '--, --';
        document.getElementById('temperature').textContent = '--';
        document.getElementById('weather-condition').textContent = '--';
        
        const response = await fetch(`${BASE_URL}?key=${API_KEY}&q=${city}&aqi=yes`);
        
        if (!response.ok) {
            throw new Error('City not found');
        }
        
        const data = await response.json();
        updateWeatherUI(data);
    } catch (error) {
        console.error('Error fetching weather:', error);
        alert('Error fetching weather data. Please try another city.');
        document.getElementById('city-name').textContent = 'Error';
        document.getElementById('region-country').textContent = 'City not found';
    }
}

function updateWeatherUI(data) {
    const location = data.location;
    const current = data.current;
    
    // Update location info
    document.getElementById('city-name').textContent = location.name;
    document.getElementById('region-country').textContent = `${location.region ? location.region + ', ' : ''}${location.country}`;
    
    // Update weather info
    document.getElementById('temperature').textContent = current.temp_c;
    document.getElementById('weather-condition').textContent = current.condition.text;
    
    // Update weather icon
    const iconUrl = current.condition.icon.startsWith('//') 
        ? `https:${current.condition.icon}` 
        : current.condition.icon;
    document.getElementById('weather-icon').src = iconUrl;
    document.getElementById('weather-icon').alt = current.condition.text;
    
    // Update weather details
    document.getElementById('wind-speed').textContent = `${current.wind_kph} km/h`;
    document.getElementById('humidity').textContent = `${current.humidity}%`;
    document.getElementById('pressure').textContent = `${current.pressure_mb} hPa`;
    
    // Update last updated time
    const lastUpdated = new Date(location.localtime);
    document.getElementById('last-updated').textContent = lastUpdated.toLocaleString();
    
    // Set background based on day/night and weather condition
    setBackground(current.is_day, current.condition.text.toLowerCase());
    
    // Add animations
    animateElements();
}

function setBackground(isDay, weatherCondition) {
    const app = document.querySelector('.weather-app');
    const card = document.querySelector('.weather-card');
    
    // Determine if it's day or night
    const timeOfDay = isDay === 1 ? 'day' : 'night';
    card.classList.toggle('night-mode', timeOfDay === 'night');
    
    // Determine weather type based on condition text
    let weatherType = 'default';
    
    if (weatherCondition.includes('sunny') || weatherCondition.includes('clear')) {
        weatherType = timeOfDay === 'day' ? 'sunny' : 'clear';
    } 
    else if (weatherCondition.includes('cloud') || weatherCondition.includes('overcast')) {
        weatherType = 'cloudy';
    } 
    else if (weatherCondition.includes('rain') || 
             weatherCondition.includes('drizzle') || 
             weatherCondition.includes('shower') ||
             weatherCondition.includes('thunder')) {
        weatherType = 'rainy';
    } 
    else if (weatherCondition.includes('snow') || weatherCondition.includes('sleet') || weatherCondition.includes('blizzard')) {
        weatherType = 'snowy';
    } 
    else if (weatherCondition.includes('fog') || 
             weatherCondition.includes('mist') || 
             weatherCondition.includes('haze') ||
             weatherCondition.includes('smoke')) {
        weatherType = 'foggy';
    }
    
    // Set the background image
    const bgImage = backgroundImages[timeOfDay][weatherType] || backgroundImages[timeOfDay].default;
    app.style.backgroundImage = `url(${bgImage})`;
}

function animateElements() {
    const elements = [
        document.getElementById('city-name'),
        document.getElementById('region-country'),
        document.querySelector('.weather-main'),
        document.querySelector('.weather-details')
    ];
    
    elements.forEach((el, index) => {
        // Reset animation
        el.style.animation = 'none';
        void el.offsetWidth; // Trigger reflow
        
        // Apply animation with delay
        setTimeout(() => {
            if (index < 2) {
                el.classList.add('animate__animated', 'animate__fadeInDown');
            } else {
                el.classList.add('animate__animated', 'animate__fadeInUp');
            }
        }, index * 100);
    });
}
