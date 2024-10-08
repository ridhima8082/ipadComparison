import { Selector } from 'testcafe';
import xlsx from 'node-xlsx';
import fs from 'fs';

// Load the spreadsheet data
const workSheetsFromFile = xlsx.parse(`${__dirname}/items.xlsx`);
const items = workSheetsFromFile[0].data; // Assuming item names are in the first sheet and first column

fixture `Capgemini Branding Store`
    .page `https://brandingstore.capgemini.com`; // Example URL, replace with actual branding store URL

test('Add items to cart', async t => {
    // Iterate over the items from the spreadsheet
    for (let i = 1; i < items.length; i++) {  // Skipping the header row
        const itemName = items[i][0]; // Assuming item name is in the first column

        // Find the item in the branding store (assuming an item is found by its name)
        const item = Selector('div.item').withText(itemName);

        // Ensure the item exists
        await t.expect(item.exists).ok(`Item "${itemName}" not found`);

        // Add the item to the cart (assuming a button with the text 'Add to cart')
        const addToCartButton = item.find('button').withText('Add to cart');
        await t.click(addToCartButton);
    }

    // Assert that the cart contains the right number of items
    const cartItemCount = await Selector('span.cart-item-count').innerText;
    await t.expect(Number(cartItemCount)).eql(items.length - 1, 'All items should be in the cart');
});