// Update the updateWeatherDisplay function to handle responsive layouts
function updateWeatherDisplay(data) {
    if (!data) return;

    errorMessage.classList.add('d-none');
    weatherDisplay.classList.remove('d-none');

    // Update weather data
    locationName.textContent = data.location.name;
    countryState.textContent = `${data.location.region ? data.location.region + ', ' : ''}${data.location.country}`;
    temperature.innerHTML = `${Math.round(data.current.temp_c)}<sup class="temp-unit">°C</sup>`;
    weatherCondition.textContent = data.current.condition.text;
    weatherIcon.src = data.current.condition.icon;
    weatherIcon.alt = data.current.condition.text;

    // Update weather details
    humidity.textContent = `${data.current.humidity}%`;
    windSpeed.textContent = `${data.current.wind_kph} km/h`;
    feelsLike.textContent = `${Math.round(data.current.feelslike_c)}°C`;
    pressure.textContent = `${data.current.pressure_mb} mb`;

    // Set dynamic background
    setDynamicBackground(data.current.is_day, data.current.condition.text);

    // Responsive animations
    restartAnimations();
}

function restartAnimations() {
    weatherDisplay.classList.remove('animate__fadeIn');
    void weatherDisplay.offsetWidth;
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

    document.querySelectorAll('.small-details .col-md-3').forEach((el, index) => {
        el.classList.remove('animate__fadeInUp');
        void el.offsetWidth;
        el.style.animationDelay = `${0.1 * index}s`;
        el.classList.add('animate__fadeInUp');
    });
}

// [Rest of your existing JavaScript code remains the same]
