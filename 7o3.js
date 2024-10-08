import { Selector, ClientFunction } from 'testcafe';

// Client Function to get the title of the page
const getPageTitle = ClientFunction(() => document.title);

// Generate unique email for each test to avoid conflicts
const generateUniqueEmail = () => `rs1${Math.floor(Math.random() * 1000)}@hotmail.com`;

// Data for the tests
const data = {
    firstName: 'Ridhima',
    lastName: 'Sharma',
    email: generateUniqueEmail(),
    company: 'Capgemini',
    password: 'WHOCARES',
    address1: 'Jammu',
    address2: 'Jammu',
    city: 'Jammu',
    state: 'J&K',
    zipCode: '181133',
    phone: '1234567890',
    cardNumber: '1111111111111111',
    cardCvc: '123',
    cardExpMonth: '12',
    cardExpYear: '2050'
};

// Page Object for LoginPage
class LoginPage {
    constructor() {
        this.emailInput = Selector('input[type=email]');
        this.passwordInput = Selector('#password');
        this.submitButton = Selector('button[type=submit]');
    }
    
    async login(t, email, password) {
        console.log("Logging in with email and password...");
        await t
            .typeText(this.emailInput, email)
            .typeText(this.passwordInput, password)
            .click(this.submitButton);
        console.log("Login successful");
    }
}

// Page Object for CheckoutPage
class CheckoutPage {
    constructor() {
        this.deliveryAddress = Selector('#address_delivery');
        this.billingAddress = Selector('#address_invoice');
        this.placeOrderButton = Selector('#cart_items > div > div:nth-child(7) > a').withText('Place Order');
    }

    async verifyAddresses(t) {
        console.log("Verifying addresses...");
        await t
            .expect(this.deliveryAddress.innerText).contains(data.address1)
            .expect(this.deliveryAddress.innerText).contains(data.address2)
            .expect(this.deliveryAddress.innerText).contains(data.city)
            .expect(this.deliveryAddress.innerText).contains(data.state)
            .expect(this.deliveryAddress.innerText).contains(data.zipCode);

        await t
            .expect(this.billingAddress.innerText).contains(data.address1)
            .expect(this.billingAddress.innerText).contains(data.address2)
            .expect(this.billingAddress.innerText).contains(data.city)
            .expect(this.billingAddress.innerText).contains(data.state)
            .expect(this.billingAddress.innerText).contains(data.zipCode);
        console.log("Address verification completed");
    }
}

// Fixture hooks for setup and teardown
fixture `Automation Demo`
    .page `https://automationexercise.com/`
    .beforeEach(async t => {
        await t.maximizeWindow(); // Maximize window for visibility, but you can comment this out if needed
        console.log("Page title: " + await getPageTitle());
        await t.wait(3000); // Add wait to ensure page is loaded properly
        await t.expect(Selector('body').exists).ok({ timeout: 5000 }); // Ensure the body is loaded
    });

const loginPage = new LoginPage();
const checkoutPage = new CheckoutPage();

test('Verify that home page is visible successfully', async t => {
    console.log("Verifying home page visibility...");
    await t
        .expect(Selector('a').withText('Home').visible).ok(); // Ensure 'Home' link is visible
    console.log("Home page is visible");
});

test('Complete Checkout Process with Address Verification and Summary', async t => {
    // Update the email for this test instance
    data.email = generateUniqueEmail();

    // Account creation
    console.log("Navigating to Signup / Login page...");
    await t.click(Selector('a').withText('Signup / Login'));

    console.log("Filling signup form...");
    await t
        .typeText('#form > div > div > div:nth-child(3) > div > form > input[type=text]:nth-child(2)', data.firstName)
        .typeText('#form > div > div > div:nth-child(3) > div > form > input[type=email]:nth-child(3)', data.email)
        .click('#form > div > div > div:nth-child(3) > div > form > button')
        .wait(2000); // Wait for page transition

    await t.click(Selector('#id_gender2').exists); // Ensure the gender radio button exists before clicking
    await t
        .typeText('#password', data.password)
        .click('#days')
        .click('#days > option:nth-child(6)')
        .click('#months')
        .click('#months > option:nth-child(3)')
        .click('#years')
        .click('#years > option:nth-child(17)')
        .click('#newsletter')
        .click('#optin')
        .typeText('#first_name', data.firstName)
        .typeText('#last_name', data.lastName)
        .typeText('#company', data.company)
        .typeText('#address1', data.address1)
        .typeText('#address2', data.address2)
        .typeText('#state', data.state)
        .typeText('#city', data.city)
        .typeText('#zipcode', data.zipCode)
        .typeText('#mobile_number', data.phone)
        .click('#form > div > div > div > div.login-form > form > button')
        .takeScreenshot(`screenshots/loggedIn.png`)
        .expect(Selector('#form > div > div > div > h2 > b').innerText).contains('ACCOUNT CREATED!')
        .click('#form > div > div > div > div > a');
    await t.takeScreenshot(`screenshots/accountCreated.png`);

    console.log("Account created successfully");

    // Verify if name is shown on the top
    console.log("Verifying welcome text...");
    const welcomeText = await Selector('#header > div > div > div > div.col-sm-8 > div > ul > li:nth-child(10) > a > b').innerText;
    await t.expect(welcomeText).contains('Ridhima');

    // Add products to the cart
    console.log("Adding product to the cart...");
    await t.click(Selector('a').withText('Products'));
    await t.click(Selector('a').withText('Add to cart').nth(0));
    await t.wait(2000);
    await t.click('#cartModal > div > div > div.modal-body > p:nth-child(2) > a > u');
    await t.wait(2000);

    // Proceed to checkout
    console.log("Proceeding to checkout...");
    await t.click(Selector('#do_action > div.container > div > div > a'));

    // Verify delivery and billing addresses
    await checkoutPage.verifyAddresses(t);
});
