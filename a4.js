import { Selector } from 'testcafe';

fixture `Google Shopping Search`
    .page `https://www.google.com`;   

test('Search for an item and sort by price from high to low', async t => {
    // Search for an item
    await t
        .typeText(Selector('APjFqb'), 'Shoes')  // Correct Google search input selector
        .pressKey('enter');

    // Click on the "Shopping" link
    await t.click(Selector('YmvwI').withText('Shopping'));

    // Wait for the "Sort by" button to appear and click on it
    const sortByButton = Selector('Yf5aUd');
    await t
        .expect(sortByButton.exists).ok({ timeout: 10000 }) // Ensure it appears
        .click(sortByButton);

    // Select "Price: high to low" option
    const priceHighToLowOption = Selector('ibnC6b').withText('Price: high to low');
    await t
        .click(priceHighToLowOption);
});