import { Selector, t } from 'testcafe';

fixture `Checkout Address Verification`
    .page `http://automationexercise.com`;

test('Verify address details in checkout page', async t => {
    // 1. Launch browser and navigate to the URL
    await t.navigateTo('http://automationexercise.com');

    // 2. Verify that home page is visible successfully
    const homePageBanner = Selector('.carousel-inner');
    await t.expect(homePageBanner.exists).ok('Home page is not visible.');

    // 3. Click 'Signup / Login' button
    const signupLoginButton = Selector('a').withText('Signup / Login');
    await t.click(signupLoginButton);

    // 4. Fill all details in Signup and create account
    const nameInput = Selector('input[name="name"]');
    const emailInput = Selector('input[data-qa="signup-email"]');
    const signupButton = Selector('button[data-qa="signup-button"]');

    const firstNameInput = Selector('input[data-qa="first_name"]');
    const lastNameInput = Selector('input[data-qa="last_name"]');
    const passwordInput = Selector('input[data-qa="password"]');
    const addressInput = Selector('input[data-qa="address"]');
    const countryDropdown = Selector('select[data-qa="country"]');
    const stateInput = Selector('input[data-qa="state"]');
    const cityInput = Selector('input[data-qa="city"]');
    const zipcodeInput = Selector('input[data-qa="zipcode"]');
    const mobileNumberInput = Selector('input[data-qa="mobile_number"]');
    const createAccountButton = Selector('button[data-qa="create-account"]');

    // Fill form with credentials
    await t
        .typeText(nameInput, 'Ridhima Sharma')
        .typeText(emailInput, 'rs11@hotmail.com')
        .click(signupButton)
        .typeText(firstNameInput, 'Ridhima')
        .typeText(lastNameInput, 'Sharma')
        .typeText(passwordInput, 'SecurePassword123')
        .typeText(addressInput, '456 Main Street')
        .click(countryDropdown)
        .click(countryDropdown.find('option').withText('India'))
        .typeText(stateInput, 'Jammu and Kashmir')
        .typeText(cityInput, 'Jammu')
        .typeText(zipcodeInput, '180001')
        .typeText(mobileNumberInput, '9876543210')
        .click(createAccountButton);

    // 5. Verify 'ACCOUNT CREATED!' and click 'Continue' button
    const accountCreatedMessage = Selector('h2').withText('ACCOUNT CREATED!');
    const continueButton = Selector('a').withText('Continue');
    await t
        .expect(accountCreatedMessage.exists).ok('Account was not created successfully.')
        .click(continueButton);

    // 6. Verify 'Logged in as username' at top
    const loggedInAs = Selector('a').withText('Logged in as Ridhima Sharma');
    await t.expect(loggedInAs.exists).ok('User is not logged in.');

    // 7. Add products to cart
    const productAddButton = Selector('a').withText('Add to cart').nth(0);
    await t.click(productAddButton);

    // 8. Wait for modal to appear and become visible
    const cartModal = Selector('#cartModal');
    await t.wait(3000); // Wait for 3 seconds
    await t.expect(cartModal.visible).ok('Cart modal is not visible.', { timeout: 15000 });

    // 9. Click 'Continue Shopping' button when visible
    const continueShoppingButton = Selector('button').withText('Continue Shopping');
    await t.click(continueShoppingButton);

    // 10. Click 'Cart' button, ensure it's visible and enabled
    const cartButton = Selector('a').withText('Cart');
    await t
        .expect(cartButton.visible).ok('Cart button is not visible.')
        .expect(cartButton.hasAttribute('disabled')).notOk('Cart button is disabled.')
        .click(cartButton);

    // 11. Verify that cart page is displayed
    const cartPageTitle = Selector('h2').withText('Shopping Cart');
    await t.wait(2000); // Added wait to ensure the page loads

    // Log current URL to troubleshoot
    const currentUrl = await t.eval(() => document.location.href);
    console.log('Current URL after clicking cart button:', currentUrl); // Log the current URL

    await t.expect(cartPageTitle.exists).ok('Cart page is not displayed.');

    // 12. Click 'Proceed To Checkout'
    const checkoutButton = Selector('a').withText('Proceed To Checkout');
    await t.expect(checkoutButton.exists).ok('Proceed To Checkout button not found');
    await t.click(checkoutButton);

    // 13. Verify delivery and billing address
    const deliveryAddress = Selector('#address_delivery');
    await t.expect(deliveryAddress.innerText).contains('456 Main Street', 'Delivery address does not match');

    const billingAddress = Selector('#address_invoice');
    await t.expect(billingAddress.innerText).contains('456 Main Street', 'Billing address does not match');

    // 14. Make payment - Enter dummy card details
    const nameOnCardInput = Selector('input[data-qa="name-on-card"]');
    const cardNumberInput = Selector('input[data-qa="card-number"]');
    const cvcInput = Selector('input[data-qa="cvc"]');
    const expirationMonthInput = Selector('input[data-qa="expiry-month"]');
    const expirationYearInput = Selector('input[data-qa="expiry-year"]');
    const payButton = Selector('button[data-qa="pay-button"]');

    await t
        .typeText(nameOnCardInput, 'Ridhima Sharma')
        .typeText(cardNumberInput, '4111111111111111')  // Dummy card number
        .typeText(cvcInput, '123')
        .typeText(expirationMonthInput, '12')
        .typeText(expirationYearInput, '2025')
        .click(payButton);

    // 15. Verify order success
    const orderSuccessMessage = Selector('p').withText('Your order has been placed successfully!');
    await t.expect(orderSuccessMessage.exists).ok('Order was not placed successfully.');

    // 16. Capture screenshot after successful order
    const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
    await t.takeScreenshot({
        path: `screenshots/order_success_${timestamp}.png`,
        fullPage: true
    });
});
