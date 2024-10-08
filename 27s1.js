import { Selector } from 'testcafe';
import xlsx from 'xlsx';

// Function to read data from Excel
function readExcelData(filePath) {
    const workbook = xlsx.readFile(filePath);
    const sheet_name_list = workbook.SheetNames;
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    return data;
}

// Function to get items sorted by price
async function getSortedItemsByPrice(t, itemType) {
    await t
        .typeText('.search_input', itemType)
        .pressKey('enter');

    const items = [];
    const itemCount = await Selector('.product').count;

    for (let i = 0; i < itemCount; i++) {
        const itemName = await Selector('.product-name').nth(i).innerText;
        const itemPrice = parseFloat((await Selector('.product-price').nth(i).innerText).replace('$', ''));
        items.push({ name: itemName, price: itemPrice });
    }

    // Sort items by price
    items.sort((a, b) => a.price - b.price);
    return items;
}

fixture`AutomationExercise Shopping and Signup`
    .page`https://automationexercise.com/`;

// Data from Excel
const excelFile = './ShoppingItems.xlsx'; // Path to Excel file
const itemsData = readExcelData(excelFile);

test('Sign Up and Shop for Specific Items', async t => {
    // Sign Up process
    await t
        .click(Selector('a').withText('Signup / Login'))
        .typeText('#signup-name', 'Saira Test')
        .typeText('#signup-email', 'saira.test@example.com')
        .click(Selector('button').withText('Signup'))
        .typeText('#password', 'TestPassword123')
        .click('#days') // Assuming further inputs like DOB are required
        .click(Selector('button').withText('Create Account'))
        .expect(Selector('h2').withText('Account Created!').exists).ok();

    // Shopping process using data from the Excel sheet
    for (const item of itemsData) {
        const itemType = item['Item Type'];

        if (itemType === 'Jacket') {
            const jackets = await getSortedItemsByPrice(t, 'Jacket');
            const secondHighestJacket = jackets[jackets.length - 2]; // Second highest price
            await t
                .typeText('.search_input', secondHighestJacket.name)
                .pressKey('enter')
                .click(Selector('.product-name').withText(secondHighestJacket.name))
                .click('.add-to-cart')
                .click(Selector('button').withText('Continue Shopping'));
        }

        if (itemType === 'T-shirt') {
            const tshirts = await getSortedItemsByPrice(t, 'T-shirt');
            const secondLowestTshirt = tshirts[1]; // Second lowest price
            await t
                .typeText('.search_input', secondLowestTshirt.name)
                .pressKey('enter')
                .click(Selector('.product-name').withText(secondLowestTshirt.name))
                .click('.add-to-cart')
                .click(Selector('button').withText('Continue Shopping'));
        }

        if (itemType === 'Sweater') {
            const sweaters = await getSortedItemsByPrice(t, 'Sweater');
            const lowestPriceSweater = sweaters[0]; // Lowest price
            await t
                .typeText('.search_input', lowestPriceSweater.name)
                .pressKey('enter')
                .click(Selector('.product-name').withText(lowestPriceSweater.name))
                .click('.add-to-cart');
        }
    }

    // Proceed to Checkout
    await t
        .click(Selector('a').withText('Cart'))
        .click(Selector('button').withText('Proceed To Checkout'));

    // Verification (for simplicity, we will just check the cart contains some items)
    await t
        .expect(Selector('.cart_description').exists).ok();
});
