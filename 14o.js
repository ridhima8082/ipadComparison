import { Selector } from 'testcafe';

fixture `AccuWeather Forecast`
    .page `https://www.accuweather.com/`;

const jammuSearchInput = Selector('.search-input'); // Selector for the search input
const firstSearchResult = Selector('.location-name').nth(0); // Selector for the first entry (Jammu)
const currentTempSelector = Selector('.temp'); // Selector for current temperature

// Function to convert Celsius to Fahrenheit
const celsiusToFahrenheit = (celsius) => (celsius * 9/5) + 32;

test('Retrieve and convert temperatures from AccuWeather', async t => {
    // Search for Jammu
    await t
        .typeText(jammuSearchInput, 'Jammu')
        .pressKey('enter')
        .wait(5000); // Wait for the search results to load

    // Click on the first result (Jammu)
    await t
        .click(firstSearchResult)
        .wait(5000); // Wait for the location page to load

    // Get the current temperature
    const currentTempText = await currentTempSelector.innerText;
    const currentTempCelsius = parseFloat(currentTempText); // Convert to float

    // Log the current temperature in Celsius
    console.log(`Current location temperature: ${currentTempCelsius}°C`);

    // Convert Celsius to Fahrenheit
    const currentTempFahrenheit = celsiusToFahrenheit(currentTempCelsius);

    // Log the current temperature in Fahrenheit
    console.log(`Current location temperature: ${currentTempFahrenheit}°F`);
});
