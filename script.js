const API_KEY = 'ffe4f34c88b04f318eb152639252407'; // Your provided API key
const BASE_URL = 'https://api.weatherapi.com/v1/current.json';

const cityInput = document.getElementById('city-input');
const searchButton = document.getElementById('search-button');
const locationName = document.getElementById('location-name');
const countryState = document.getElementById('country-state');
const temperature = document.getElementById('temperature');
const weatherCondition = document.getElementById('weather-condition');
const weatherIcon = document.getElementById('weather-icon');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const feelsLike = document.getElementById('feels-like');
const pressure = document.getElementById('pressure');
const errorMessage = document.getElementById('error-message');
const weatherDisplay = document.getElementById('weather-display');

// Map weather conditions to background images
// IMPORTANT: Ensure these image files exist in your 'images/' folder
// and the names match EXACTLY (case-sensitive on some systems).
const backgroundImages = {
    day: {
        'clear': 'images/day_clear.jpg',
        'sunny': 'images/day_clear.jpg', // WeatherAPI sometimes uses 'sunny'
        'partly cloudy': 'images/day_cloudy.jpg',
        'cloudy': 'images/day_cloudy.jpg',
        'overcast': 'images/day_cloudy.jpg',
        'mist': 'images/day_mist.jpg',
        'fog': 'images/day_mist.jpg',
        'freezing fog': 'images/day_mist.jpg',

        // Rain/Drizzle
        'patchy light drizzle': 'images/day_rain.jpg',
        'light drizzle': 'images/day_rain.jpg',
        'freezing drizzle': 'images/day_rain.jpg',
        'heavy freezing drizzle': 'images/day_rain.jpg',
        'patchy light rain': 'images/day_rain.jpg',
        'light rain': 'images/day_rain.jpg',
        'moderate rain at times': 'images/day_rain.jpg',
        'moderate rain': 'images/day_rain.jpg',
        'heavy rain at times': 'images/day_rain.jpg',
        'heavy rain': 'images/day_rain.jpg',
        'light freezing rain': 'images/day_rain.jpg',
        'moderate or heavy freezing rain': 'images/day_rain.jpg',
        'light rain shower': 'images/day_rain.jpg',
        'moderate or heavy rain shower': 'images/day_rain.jpg',
        'torrential rain shower': 'images/day_rain.jpg',

        // Snow/Sleet/Ice
        'patchy light snow': 'images/day_snow.jpg',
        'light snow': 'images/day_snow.jpg',
        'patchy moderate snow': 'images/day_snow.jpg',
        'moderate snow': 'images/day_snow.jpg',
        'patchy heavy snow': 'images/day_snow.jpg',
        'heavy snow': 'images/day_snow.jpg',
        'light sleet': 'images/day_snow.jpg',
        'moderate or heavy sleet': 'images/day_snow.jpg',
        'ice pellets': 'images/day_snow.jpg',
        'light showers of ice pellets': 'images/day_snow.jpg',
        'moderate or heavy showers of ice pellets': 'images/day_snow.jpg',
        'patchy light snow with thunder': 'images/day_snow.jpg', // Might combine with thunder later

        // Thunder
        'patchy light rain with thunder': 'images/day_thunder.jpg',
        'moderate or heavy rain with thunder': 'images/day_thunder.jpg',
        'thundery outbreaks possible': 'images/day_thunder.jpg',
    },
    night: {
        'clear': 'images/night_clear.jpg',
        'partly cloudy': 'images/night_cloudy.jpg',
        'cloudy': 'images/night_cloudy.jpg',
        'overcast': 'images/night_cloudy.jpg',
        'mist': 'images/night_mist.jpg',
        'fog': 'images/night_mist.jpg',
        'freezing fog': 'images/night_mist.jpg',

        // Rain/Drizzle
        'patchy light drizzle': 'images/night_rain.jpg',
        'light drizzle': 'images/night_rain.jpg',
        'freezing drizzle': 'images/night_rain.jpg',
        'heavy freezing drizzle': 'images/night_rain.jpg',
        'patchy light rain': 'images/night_rain.jpg',
        'light rain': 'images/night_rain.jpg',
        'moderate rain at times': 'images/night_rain.jpg',
        'moderate rain': 'images/night_rain.jpg',
        'heavy rain at times': 'images/night_rain.jpg',
        'heavy rain': 'images/night_rain.jpg',
        'light freezing rain': 'images/night_rain.jpg',
        'moderate or heavy freezing rain': 'images/night_rain.jpg',
        'light rain shower': 'images/night_rain.jpg',
        'moderate or heavy rain shower': 'images/night_rain.jpg',
        'torrential rain shower': 'images/night_rain.jpg',

        // Snow/Sleet/Ice
        'patchy light snow': 'images/night_snow.jpg',
        'light snow': 'images/night_snow.jpg',
        'patchy moderate snow': 'images/night_snow.jpg',
        'moderate snow': 'images/night_snow.jpg',
        'patchy heavy snow': 'images/night_snow.jpg',
        'heavy snow': 'images/night_snow.jpg',
        'light sleet': 'images/night_snow.jpg',
        'moderate or heavy sleet': 'images/night_snow.jpg',
        'ice pellets': 'images/night_snow.jpg',
        'light showers of ice pellets': 'images/night_snow.jpg',
        'moderate or heavy showers of ice pellets': 'images/night_snow.jpg',
        'patchy light snow with thunder': 'images/night_snow.jpg',

        // Thunder
        'patchy light rain with thunder': 'images/night_thunder.jpg',
        'moderate or heavy rain with thunder': 'images/night_thunder.jpg',
        'thundery outbreaks possible': 'images/night_thunder.jpg',
    }
};

// Default background if no specific match is found or on initial load
// Make sure these fallback images exist as well.
const defaultDayBg = 'images/day_clear.jpg';
const defaultNightBg = 'images/night_clear.jpg';

async function getWeatherData(city) {
    console.log(`Attempting to fetch weather for: ${city}`);
    try {
        const response = await fetch(`${BASE_URL}?key=${API_KEY}&q=${city}&aqi=no`);
        console.log("API Response Status:", response.status);

        if (!response.ok) {
            // Check for 400 Bad Request which often means city not found
            if (response.status === 400) {
                throw new Error('City not found. Please check the spelling.');
            }
            throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Weather Data received:", data);
        return data;
    } catch (error) {
        console.error("Error fetching weather data:", error);
        errorMessage.textContent = error.message || "An unexpected error occurred.";
        errorMessage.classList.remove('d-none');
        weatherDisplay.classList.add('d-none'); // Hide weather display on error
        // Also set a default background on error
        setDynamicBackground(1, 'clear'); // Default to clear day background
        return null;
    }
}

function updateWeatherDisplay(data) {
    if (!data) {
        // Error message already displayed by getWeatherData
        return;
    }

    errorMessage.classList.add('d-none'); // Hide any previous error messages
    weatherDisplay.classList.remove('d-none'); // Ensure weather display is visible

    // Populate data
    locationName.textContent = data.location.name;
    // Use data.location.region for state if available, otherwise just country
    countryState.textContent = `${data.location.region ? data.location.region + ', ' : ''}${data.location.country}`;
    temperature.innerHTML = `${Math.round(data.current.temp_c)}<sup class="temp-unit">°C</sup>`; // Use innerHTML for sup tag
    weatherCondition.textContent = data.current.condition.text;
    weatherIcon.src = data.current.condition.icon;
    weatherIcon.alt = data.current.condition.text;

    humidity.textContent = `${data.current.humidity}%`;
    windSpeed.textContent = `${data.current.wind_kph} km/h`;
    feelsLike.textContent = `${Math.round(data.current.feelslike_c)}°C`;
    pressure.textContent = `${data.current.pressure_mb} mb`;

    // Set dynamic background
    setDynamicBackground(data.current.is_day, data.current.condition.text);

    // Re-apply animations for new data
    // Remove and add classes to restart CSS animations
    weatherDisplay.classList.remove('animate__fadeIn');
    void weatherDisplay.offsetWidth; // Trigger reflow
    weatherDisplay.classList.add('animate__fadeIn');

    locationName.classList.remove('animate__fadeInDown');
    void locationName.offsetWidth;
    locationName.classList.add('animate__fadeInDown');

    temperature.classList.remove('animate__fadeIn');
    void temperature.offsetWidth;
    temperature.classList.add('animate__fadeIn');

    weatherIcon.classList.remove('animate__zoomIn');
    void weatherIcon.offsetWidth;
    weatherIcon.classList.add('animate__zoomIn');

    document.querySelectorAll('.small-details .col-md-auto').forEach((el, index) => {
        el.classList.remove('animate__fadeInUp');
        void el.offsetWidth;
        el.style.animationDelay = `${0.1 * index}s`; // Stagger animation
        el.classList.add('animate__fadeInUp');
    });
}

function setDynamicBackground(isDay, conditionText) {
    console.log("--- Setting Dynamic Background ---");
    console.log("Is Day:", isDay);
    console.log("Condition Text from API:", conditionText);

    let imageUrl;
    const weatherType = isDay === 1 ? 'day' : 'night'; // API returns 1 for day, 0 for night
    const normalizedCondition = conditionText.toLowerCase().trim(); // Normalize for lookup

    console.log("Determined weather type:", weatherType);
    console.log("Normalized condition for lookup:", normalizedCondition);

    // 1. Try exact match first
    if (backgroundImages[weatherType] && backgroundImages[weatherType][normalizedCondition]) {
        imageUrl = backgroundImages[weatherType][normalizedCondition];
        console.log("Exact match found:", imageUrl);
    } else {
        // 2. Fallback to broader category matching (contains logic)
        console.log("No exact match, trying broader categories...");
        if (normalizedCondition.includes('clear') || normalizedCondition.includes('sunny')) {
            imageUrl = backgroundImages[weatherType]['clear'];
        } else if (normalizedCondition.includes('cloud') || normalizedCondition.includes('overcast')) {
            imageUrl = backgroundImages[weatherType]['cloudy'];
        } else if (normalizedCondition.includes('rain') || normalizedCondition.includes('drizzle') || normalizedCondition.includes('showers')) {
            imageUrl = backgroundImages[weatherType]['light rain']; // Use a common rain image
        } else if (normalizedCondition.includes('snow') || normalizedCondition.includes('sleet') || normalizedCondition.includes('pellets')) {
            imageUrl = backgroundImages[weatherType]['light snow']; // Use a common snow image
        } else if (normalizedCondition.includes('thunder')) {
            imageUrl = backgroundImages[weatherType]['thundery outbreaks possible']; // Use thunder image
        } else if (normalizedCondition.includes('mist') || normalizedCondition.includes('fog')) {
            imageUrl = backgroundImages[weatherType]['mist'];
        } else {
            // 3. Absolute fallback if no conditions match
            imageUrl = isDay === 1 ? defaultDayBg : defaultNightBg;
            console.warn("No specific background match found for condition:", conditionText, ". Using default:", imageUrl);
        }
    }

    // Double-check if imageUrl is still undefined or invalid
    if (!imageUrl || !imageUrl.startsWith('images/')) {
        imageUrl = isDay === 1 ? defaultDayBg : defaultNightBg;
        console.error("Final fallback: imageUrl was invalid. Using default:", imageUrl);
    }

    // Apply the background image
    document.body.style.backgroundImage = `url('${imageUrl}')`;
    console.log("Applied background image URL:", document.body.style.backgroundImage);
}


// Event Listeners
searchButton.addEventListener('click', async () => {
    const city = cityInput.value.trim();
    if (city) {
        errorMessage.classList.add('d-none'); // Hide error on new search
        const data = await getWeatherData(city);
        updateWeatherDisplay(data);
    } else {
        errorMessage.textContent = "Please enter a city name.";
        errorMessage.classList.remove('d-none');
        weatherDisplay.classList.add('d-none'); // Hide weather display if input is empty
        // Set a default background if input is empty
        setDynamicBackground(1, 'clear'); // Default to clear day background
    }
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchButton.click();
    }
});

// Initial load with a default city (Akola, India as per your current location)
document.addEventListener('DOMContentLoaded', () => {
    cityInput.value = 'Akola';
    searchButton.click();
});
