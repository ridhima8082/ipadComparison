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

    if (!data || !data.data) {
        throw new Error('Invalid API response structure');
    }

    return data.data;
}

fixture `Population Data Verification Test with Reporting`
    .page `https://datausa.io/`;

test('Verify and Analyze Population Data from API with Report Generation', async t => {
    try {
        const populationData = await getPopulationData();

        // Report structure
        const report = {
            totalPopulation: 0,
            averagePopulation: 0,
            maxPopulation: { Nation: '', Population: 0 },
            minPopulation: { Nation: '', Population: Infinity },
            topFiveNations: []
        };

        const nationCount = {};
        const alertThreshold = 1.5e9; 

        // Sorting data by Year to ensure it is consecutive
        populationData.sort((a, b) => {
            const yearA = typeof a.Year === 'string' ? parseInt(a.Year, 10) : a.Year;
            const yearB = typeof b.Year === 'string' ? parseInt(b.Year, 10) : b.Year;
            return yearA - yearB;
        });

        let totalPopulation = 0;
        let previousYear = null;

        for (const entry of populationData) {
            const { Nation, Population, Year } = entry;
            const yearAsNumber = typeof Year === 'string' ? parseInt(Year, 10) : Year;

            // Schema Validation
            await t.expect(typeof Population).eql('number', 'Population should be a number');
            await t.expect(typeof yearAsNumber).eql('number', 'Year should be a number');

            // Consecutive Year Validation
            if (previousYear !== null) {
                await t.expect(yearAsNumber).gt(previousYear, `Years should be consecutive. Found ${yearAsNumber} after ${previousYear}`);
            }
            previousYear = yearAsNumber;

            // Data Quality Check
            await t.expect(Population).gt(0, `Population for ${Nation} should be greater than 0`);
            totalPopulation += Population;

            // Max and Min Population Check
            if (Population > report.maxPopulation.Population) {
                report.maxPopulation = { Nation, Population };
            }

            if (Population < report.minPopulation.Population) {
                report.minPopulation = { Nation, Population };
            }

            // Threshold Check
            await t.expect(Population).lte(alertThreshold, `Population exceeds world population threshold for ${Nation}: ${Population}`);
        }

        // Calculate total and average population
        report.totalPopulation = totalPopulation;
        report.averagePopulation = totalPopulation / populationData.length;

        // Sorting nations by population and selecting top 5
        const sortedData = populationData.sort((a, b) => b.Population - a.Population);
        report.topFiveNations = sortedData.slice(0, 5).map(item => ({ Nation: item.Nation, Population: item.Population }));

        // Log the report
        console.log('--- Population Data Report ---');
        console.log(`Total Population: ${report.totalPopulation}`);
        console.log(`Average Population: ${report.averagePopulation}`);
        console.log(`Max Population: ${report.maxPopulation.Nation} with ${report.maxPopulation.Population}`);
        console.log(`Min Population: ${report.minPopulation.Nation} with ${report.minPopulation.Population}`);
        console.log('Top 5 Nations by Population:');
        report.topFiveNations.forEach((nation, index) => {
            console.log(`${index + 1}. ${nation.Nation}: ${nation.Population}`);
        });

    } catch (error) {
        console.error(error);
        await t.expect(false).ok(`Test failed due to error: ${error.message || error}`);
    }
}).skipJsErrors();
