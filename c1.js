import { Selector } from 'testcafe';

fixture `Corporate Directory Search`
    .page `https://corporatedirectory.capgemini.com/MyDirectory/portals/std/index-portal.jsp`;

test('Search multiple users and generate reports', async t => {
    // Navigate to the search input on the Corporate directory page
    const searchInput = Selector('#searchInput'); // Replace with the actual selector for the search input field
    const searchButton = Selector('#searchButton'); // Replace with actual selector for the search button
    const nextPageButton = Selector('.nextPage');   // Replace with actual selector for the "Next" button
    const prevPageButton = Selector('.prevPage');   // Replace with actual selector for the "Previous" button
    const pageLinks = Selector('.pageLink');        // Replace with actual selector for page number links
    const resultsCounter = Selector('.resultCount'); // Replace with the actual selector for the result count
    const searchInputs = ['Rah', 'Ridh', 'Swa']
    // Placeholder for storing search results
    let searchReport = [];

    for (const searchQuery of searchInputs) {
        // Perform the search for each input
        await t
            .typeText(searchInput, searchQuery, { replace: true })
            .click(searchButton)
            .wait(2000); // Wait for results to load

        // Verify the number of search results for the query
        const resultCount = await resultsCounter.innerText;
        searchReport.push({
            searchQuery,
            resultCount
        });

        // Paginate through results using Next and Previous
        const isNextButtonVisible = await nextPageButton.exists;
        if (isNextButtonVisible) {
            await t.click(nextPageButton);
            await t.expect(prevPageButton.exists).ok(); // Verify previous button is now available
            await t.click(prevPageButton); // Navigate back to the first page
        }

        // Test clicking a specific page number
        const specificPage = pageLinks.nth(1); // Example: clicking the second page (0-based index)
        if (await specificPage.exists) {
            await t.click(specificPage);
            await t.expect(specificPage.hasClass('active')).ok(); // Check if the clicked page is now active
        }
    }

    // Generate the search report for all the queries
    console.log('Search Report:');
    searchReport.forEach(entry => {
        console.log(`Search Query: ${entry.searchQuery}, Results Found: ${entry.resultCount}`);
    });
});
