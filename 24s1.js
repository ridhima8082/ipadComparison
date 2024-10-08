import { Selector } from 'testcafe';

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
    phone: '1234567890'
};

fixture `Automation Demo`.page `https://automationexercise.com/`;

// Reusable function to click an element with a retry mechanism
async function clickWithRetry(t, selector) {
    const exists = await selector.exists;
    const visible = await selector.visible;

    await t.click(selector);
}

test('Verify that home page is visible successfully', async t => {
    await t
        .maximizeWindow()
        .expect(Selector('a').withText('Home').exists).ok();
});

test('Complete Checkout Process with Address Verification', async t => {
    // Account creation
    await t.click(Selector('a').withText('Signup / Login'));
    await t
        .typeText('#form > div > div > div:nth-child(3) > div > form > input[type=text]:nth-child(2)', data.firstName)
        .typeText('#form > div > div > div:nth-child(3) > div > form > input[type=email]:nth-child(3)', data.email)
        .click('#form > div > div > div:nth-child(3) > div > form > button')
        .wait(2000);

    await clickWithRetry(t, Selector('#id_gender2'));
    
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
    await clickWithRetry(t, Selector('a').withText('Add to cart').nth(0));
    await t.wait(2000);
    await clickWithRetry(t, '#cartModal > div > div > div.modal-body > p:nth-child(2) > a > u');
    await t.wait(2000);

    // Proceed to checkout
    await clickWithRetry(t, '#do_action > div.container > div > div > a');

    // Verify delivery address
    const deliveryAddress = Selector('#address_delivery');
    await t
        .expect(deliveryAddress.innerText).contains(data.address1)
        .expect(deliveryAddress.innerText).contains(data.address2)
        .expect(deliveryAddress.innerText).contains(data.city)
        .expect(deliveryAddress.innerText).contains(data.state)
        .expect(deliveryAddress.innerText).contains(data.zipCode);

    // Verify billing address
    const billingAddress = Selector('#address_invoice');
    await t
        .expect(billingAddress.innerText).contains(data.address1)
        .expect(billingAddress.innerText).contains(data.address2)
        .expect(billingAddress.innerText).contains(data.city)
        .expect(billingAddress.innerText).contains(data.state)
        .expect(billingAddress.innerText).contains(data.zipCode);
});
