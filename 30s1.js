import { Selector } from 'testcafe';
import fetch from 'node-fetch';

// Fetching population data from the Data USA API
async function getPopulationData() {
    const apiUrl = 'https://datausa.io/api/data?drilldowns=Nation&measures=Population';
    const response = await fetch(apiUrl);

    // Check for successful HTTP response status (200 OK)
    if (!response.ok) {
        throw new Error(`Failed to fetch population data. Status Code: ${response.status}`);
    }

    const data = await response.json();

    //C1: Ensure the API returned the expected structure
    if (!data || !data.data) {
        throw new Error('Invalid API response structure');
    }

    return data.data;
}

fixture `Enhanced Population Data Verification Test`
    .page `https://datausa.io/`;

test('Verify and Analyze Population Data from API', async t => {
    try {
        const populationData = await getPopulationData();

        // C2:Ensure data is not empty
        if (!Array.isArray(populationData) || populationData.length === 0) {
            throw new Error('Population data is empty or invalid');
        }

        console.log(`Fetched Population Data: ${JSON.stringify(populationData)}`);

        const nationCount = {};
        let totalPopulation = 0;
        let maxPopulation = { Nation: '', Population: 0 };
        let minPopulation = { Nation: '', Population: Infinity };

        // C3:Define alert threshold at the top
        const alertThreshold = 1.5e9; 

        //C4: Sort data by Year to ensure it is in consecutive order
        populationData.sort((a, b) => {
            // Convert Year to a number in case it is a string
            const yearA = typeof a.Year === 'string' ? parseInt(a.Year, 10) : a.Year;
            const yearB = typeof b.Year === 'string' ? parseInt(b.Year, 10) : b.Year;
            return yearA - yearB;
        });

        let previousYear = null; // For checking consecutive year
        for (const entry of populationData) {
            const { Nation, Population, Year } = entry;

            // year to a number if it's a string
            const yearAsNumber = typeof Year === 'string' ? parseInt(Year, 10) : Year;

            // C5: Data Schema Validation
            await t.expect(Object.keys(entry)).contains('Nation', `Entry missing 'Nation' key`);
            await t.expect(Object.keys(entry)).contains('Population', `Entry missing 'Population' key`);
            await t.expect(typeof Population).eql('number', 'Population should be a number');
            await t.expect(typeof yearAsNumber).eql('number', 'Year should be a number');

            // C6: Cross-Validation of Population Data
            if (previousYear !== null) {
                await t.expect(yearAsNumber).gt(previousYear, `Years should be consecutive. Found ${yearAsNumber} after ${previousYear}`);
            }
            previousYear = yearAsNumber;

            // Handle duplicates
            if (nationCount[Nation]) {
                nationCount[Nation]++;
                console.warn(`Duplicate nation found: ${Nation}`); // Logging warning for duplicate nations
            } else {
                nationCount[Nation] = 1;
            }

            // C7: Data Quality Check(Ensure population is non-negative)
            await t.expect(Population).gt(0, `Population for ${Nation} should be greater than 0`);
            totalPopulation += Population;

            // C8: API Response Time Check (population threshold check)
            await t.expect(Population).lte(alertThreshold, `Population exceeds world population threshold for ${Nation}: ${Population}`);

            // Check for max and min populations
            if (Population > maxPopulation.Population) {
                maxPopulation = { Nation, Population };
            }

            if (Population < minPopulation.Population) {
                minPopulation = { Nation, Population };
            }
        }
        const randomEntry = populationData[Math.floor(Math.random() * populationData.length)];
        console.log(`Randomly selected entry: ${randomEntry.Nation}, Population: ${randomEntry.Population}`);

        // C9:Edge Case Handling for Extreme Values
        await t.expect(maxPopulation.Population).lte(alertThreshold, `Max population exceeds realistic limit: ${maxPopulation.Population}`);

        // Calculate average population
        const averagePopulation = totalPopulation / populationData.length;

        // Log statistics
        console.log(`Total Population: ${totalPopulation}`);
        console.log(`Average Population: ${averagePopulation}`);
        console.log(`Max Population: ${maxPopulation.Nation} with ${maxPopulation.Population}`);
        console.log(`Min Population: ${minPopulation.Nation} with ${minPopulation.Population}`);

        // Sort data by population in decreasing order
        const sortedData = populationData.sort((a, b) => b.Population - a.Population);

        // Log top 5 sorted data
        console.log('Top 5 Nations by Population:');
        for (let i = 0; i < 5 && i < sortedData.length; i++) {
            console.log(`${sortedData[i].Nation}: ${sortedData[i].Population} (Year: ${sortedData[i].Year})`);
        }

        // Assertions for max and min population
        await t.expect(maxPopulation.Population).gt(0, 'Max population should be greater than 0');
        await t.expect(minPopulation.Population).gt(0, 'Min population should be greater than 0');

    } catch (error) {
        console.error(error); // Log the full error object
        await t.expect(false).ok(`Test failed due to error: ${error.message || error}`);
    }
}).skipJsErrors();
