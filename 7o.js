import { Selector, ClientFunction } from 'testcafe';

//Addition 1: Client Function to get the title of the page
const getPageTitle = ClientFunction(() => document.title);

// Data for the tests
const data = {
    firstName: 'Ridhima',
    lastName: 'Sharma',
    email: `rs1${Math.floor(Math.random() * 1000)}@hotmail.com`,
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

//Addittion 2: Page Object for LoginPage
class LoginPage {
    constructor() {
        this.emailInput = Selector('input[type=email]');
        this.passwordInput = Selector('#password');
        this.submitButton = Selector('button[type=submit]');
    }
    
    async login(t, email, password) {
        await t
            .typeText(this.emailInput, email)
            .typeText(this.passwordInput, password)
            .click(this.submitButton);
    }
}

//Addition 3: Page Object for CheckoutPage
class CheckoutPage {
    constructor() {
        this.deliveryAddress = Selector('#address_delivery');
        this.billingAddress = Selector('#address_invoice');
        this.placeOrderButton = Selector('#cart_items > div > div:nth-child(7) > a').withText('Place Order');
    }

    async verifyAddresses(t) {
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
    }
}

//Addition 4: Fixture hooks for setup and teardown
fixture `Automation Demo`
    .page `https://automationexercise.com/`
    .beforeEach(async t => {
        await t.maximizeWindow();
        console.log(await getPageTitle());
    });

const loginPage = new LoginPage();
const checkoutPage = new CheckoutPage();

test('Verify that home page is visible successfully', async t => {
    await t
        .expect(Selector('a').withText('Home').exists).ok();
});

test('Complete Checkout Process with Address Verification and Summary', async t => {
    // Account creation
    await t.click(Selector('a').withText('Signup / Login'));
    await t
        .typeText('#form > div > div > div:nth-child(3) > div > form > input[type=text]:nth-child(2)', data.firstName)
        .typeText('#form > div > div > div:nth-child(3) > div > form > input[type=email]:nth-child(3)', data.email)
        .click('#form > div > div > div:nth-child(3) > div > form > button')
        .wait(2000);

    await t.click(Selector('#id_gender2'));
    
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

    // Verify if name is shown on the top or not
    const welcomeText = Selector('#header > div > div > div > div.col-sm-8 > div > ul > li:nth-child(10) > a > b').innerText;
    await t.expect(welcomeText).contains('Ridhima');

    // Add products to the cart
    await t.click(Selector('a').withText('Products'));
    await t.click(Selector('a').withText('Add to cart').nth(0));
    await t.wait(2000);
    await t.click('#cartModal > div > div > div.modal-body > p:nth-child(2) > a > u');
    await t.wait(2000);

    // Proceed to checkout
    await t.click(Selector('#do_action > div.container > div > div > a'));

    // Verify delivery and billing addresses
    await checkoutPage.verifyAddresses(t);
});
