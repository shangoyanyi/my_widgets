function initWeatherWidget() {
    const locationSelect = document.getElementById('location-select');
    const weatherInfo = document.getElementById('weather-info');

    const fetchWeather = async (locationName) => {
        // CWA Open Data API endpoint for general weather forecast
        const CWA_API_URL = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=rdec-key-123-45678-011121314`;
        
        weatherInfo.innerHTML = `
            <div class="weather-card p-6 rounded-lg shadow-lg w-full max-w-sm mx-auto">
                <p>Loading weather data...</p>
            </div>
        `;

        try {
            const response = await fetch(CWA_API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            if (!data.records || !data.records.location) {
                throw new Error('Invalid API response format');
            }

            const locationData = data.records.location.find(loc => loc.locationName === locationName);

            if (locationData) {
                const weatherElement = locationData.weatherElement;
                const minT = weatherElement.find(el => el.elementName === 'MinT').time[0].parameter.parameterName;
                const maxT = weatherElement.find(el => el.elementName === 'MaxT').time[0].parameter.parameterName;
                const temperature = `${minT} - ${maxT}`;
                const condition = weatherElement.find(el => el.elementName === 'Wx').time[0].parameter.parameterName;
                const pop = weatherElement.find(el => el.elementName === 'PoP').time[0].parameter.parameterName;

                const today = new Date();
                const month = (today.getMonth() + 1).toString().padStart(2, '0');
                const day = today.getDate().toString().padStart(2, '0');
                const formattedDate = `${month}/${day}`;

                weatherInfo.innerHTML = `
                    <div class="weather-card p-6 rounded-lg shadow-lg w-full max-w-sm mx-auto">
                        <p class="text-5xl font-bold mb-2">${formattedDate}</p>
                        <h2 class="text-2xl font-bold mb-2">${locationName}</h2>
                        <p>${condition}</p>
                        <p class="text-xl">${temperature}°C</p>
                        <p class="mt-2">降雨機率 ${pop}%</p>
                    </div>
                `;
            } else {
                throw new Error(`Could not find weather data for ${locationName}`);
            }
        } catch (error) {
            console.error('Fetch weather error:', error);
            weatherInfo.innerHTML = `<p>Could not fetch weather for ${locationName}.</p>`;
        }
    };

    locationSelect.addEventListener('change', (event) => fetchWeather(event.target.value));

    // Initial fetch
    fetchWeather(locationSelect.value);
}
