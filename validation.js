import { Selector } from 'testcafe';

fixture `Flipkart Product Search`
    .page `https://www.flipkart.com`;

test('Search for a product on Flipkart and validate results', async t => {
    // Close the login pop-up if it appears
    const closePopupButton = Selector('button').withText('✕');
    
    // If the popup exists, click to close it
    if (await closePopupButton.exists) {
        await t.click(closePopupButton);
    }

    // Search for a product
    const searchBox = Selector('input[name="q"]');
    const searchButton = Selector('button[type="submit"]');
    const productKeyword = 'laptop';

    await t
        .typeText(searchBox, productKeyword)
        .click(searchButton);

    // Wait for search results
    const productList = Selector('div._1YokD2 ._1AtVbE');

    // Validate the first product result contains the search keyword
    await t
        .expect(productList.count).gt(0, 'No products found in the search results')
        .expect(productList.nth(0).innerText).contains(productKeyword, `First result does not contain ${productKeyword}`);

    // Validate that there are more than 10 products in the search results
    await t
        .expect(productList.count).gte(10, 'Less than 10 products in the search results');
});