import { Selector } from 'testcafe';

fixture `User Login`
    .page `https://magento.softwaretestingboard.com/`;

const loginLink = Selector('a').withText('Sign In');
const loginEmailInput = Selector('#email');
const loginPasswordInput = Selector('#pass');
const loginButton = Selector('button').withText('Sign In');
const welcomeMessage = Selector('span.logged-in').withText('Welcome, Ridhima Sharma!');
const errorMessage = Selector('.message-error');
const customerMenuTrigger = Selector('.customer-welcome');
const logoutLink = Selector('a').withText('Sign Out');

test('User Logging in', async t => {
    await t
        .click(loginLink);

    await t
        .typeText(loginEmailInput, 'rs@hotmail.com')
        .typeText(loginPasswordInput, 'Ridhima@000')
        .click(loginButton);

    await t
        .expect(welcomeMessage.exists).ok('Welcome, Ridhima Sharma!');
    console.log('Assertion Passing- Ridhima Sharma logged in.');    

    await t
        .click(customerMenuTrigger) 
        .click(logoutLink);          

    await t
        .click(loginLink)
        .typeText(loginEmailInput, 'rs@hotmail.com')
        .typeText(loginPasswordInput, 'IncorrectPassword')
        .click(loginButton);

    await t
        .expect(errorMessage.exists).ok('Error message is displayed for invalid credentials');
    console.log('Assertion Failing: Invalid Login attempt for Ridhima Sharma');    
});
