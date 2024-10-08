import { Selector } from 'testcafe';
import fetch from 'node-fetch';

/*Scenario: retrieves population data from the Data USA API, 
verifies its integrity, analyzes the statistics, and logs the results. */

//fetching population data from the Data USA API
async function getPopulationData() {
    const apiUrl = 'https://datausa.io/api/data?drilldowns=Nation&measures=Population'; 
    const response = await fetch(apiUrl); 
    const data = await response.json(); 
    return data.data; 
}

fixture `Enhanced Population Data Verification Test`
    .page `https://datausa.io/`; 

test('Verify and Analyze Population Data from API', async t => {
    
    const populationData = await getPopulationData();

    console.log(`Fetched Population Data: ${JSON.stringify(populationData)}`);

    await t.expect(populationData.length).gt(0, 'Population data should not be empty');

    const nationCount = {};
    let totalPopulation = 0;
    let maxPopulation = { Nation: '', Population: 0 };
    let minPopulation = { Nation: '', Population: Infinity };

    for (const entry of populationData) {
        const nation = entry.Nation;
        const population = entry.Population;
        
        //for handling duplicates
        if (nationCount[nation]) {
            nationCount[nation]++;
            console.warn(`Duplicate nation found: ${nation}`); // Logging warning for duplicates states
        } else {
            nationCount[nation] = 1;
        }
        await t.expect(population).gt(0, `Population for ${nation} should be greater than 0`);
        totalPopulation += population;

        // max and min populations checking
        if (population > maxPopulation.Population) {
            maxPopulation = { Nation: nation, Population: population };
        }

        if (population < minPopulation.Population) {
            minPopulation = { Nation: nation, Population: population };
        }
    }

    // Calculating avg population
    const averagePopulation = totalPopulation / populationData.length;

    // Logging statistics
    console.log(`Total Population: ${totalPopulation}`);
    console.log(`Average Population: ${averagePopulation}`);
    console.log(`Max Population: ${maxPopulation.Nation} with ${maxPopulation.Population}`);
    console.log(`Min Population: ${minPopulation.Nation} with ${minPopulation.Population}`);

    // Sorting data by population in decreasing manner
    const sortedData = populationData.sort((a, b) => b.Population - a.Population);

    // Logging sorted data (top 5)
    console.log('Population of United States in decreasing order wrt year:');
    const year = populationData[0].Year;
    for (let i = 0; i < 5 && i < sortedData.length; i++) {
        console.log(`${sortedData[i].Nation}: ${sortedData[i].Population} (Year: ${year})`);
    }
    // Assertions for max and min population
    await t.expect(maxPopulation.Population).gt(0, 'Max population should be greater than 0');
    await t.expect(minPopulation.Population).gt(0, 'Min population should be greater than 0');
}).skipJsErrors();
