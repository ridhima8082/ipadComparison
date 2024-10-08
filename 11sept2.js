import { Selector } from 'testcafe';

// Sample data representing the spreadsheet input
const itemsToSearch = ['Capgemini T-shirt', 'Capgemini Mug', 'Capgemini Pen'];

// Function to simulate report generation (console logging for now)
const generateReport = (itemsAdded, totalAmount) => {
    console.log(`Items added to cart:\n${itemsAdded.join('\n')}\nTotal: $${totalAmount}`);
};

// Define page elements (selectors)
const searchBox = Selector('#top_search'); // Ensure correct selector
const addToCartButton = Selector('.add-to-cart-btn');
const outOfStockLabel = Selector('.out-of-stock');
const cartTotal = Selector('#cart-total');
const cartItems = Selector('.cart-item');

fixture`Capgemini Branding Store`
    .page('https://capgeminibrandstore.printstop.co.in/');

test('Capgemini Branding Store - Login', async t => {
    const username = Selector('#email_signup');
    const password = Selector('#password_signup');
    const loginButton = Selector('#btnlogin');
    const submit = Selector("#Submit");

    await t
        .typeText(username, 'ridhima.sharma@capgemini.com')
        .click(loginButton)
        .wait(45000)  // Adjust wait time as needed
        .typeText(password, 'Ridhima@123')
        .click(loginButton); // Assuming this is the same login button
});

test('Add available items to cart and generate report', async t => {
    let itemsAdded = [];
    let totalAmount = 0;

    for (const item of itemsToSearch) {
        // Search for the item
        await t
            .typeText(searchBox, item)
            .pressKey('enter');

        // Check if the item is in stock
        const outOfStockExists = await outOfStockLabel.exists;

        if (!outOfStockExists) {
            // Add item to cart if not out of stock
            await t.click(addToCartButton);

            // Add the item to the list of added items
            itemsAdded.push(item);

            // Extract price of the item and update total amount
            const itemPrice = await Selector('.item-price').innerText;
            totalAmount += parseFloat(itemPrice.replace('$', '')); // Assuming price is in dollars
        }
    }

    // Check that the cart total reflects the added items
    const displayedTotal = parseFloat((await cartTotal.innerText).replace('$', ''));
    await t.expect(displayedTotal).eql(totalAmount, 'Total price should match the sum of added items');

    // Generate report
    generateReport(itemsAdded, totalAmount);

    console.log('Items added:', itemsAdded);
    console.log('Total amount:', totalAmount);
});