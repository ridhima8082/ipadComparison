import { Selector } from 'testcafe';

const email = 'ridhimasharma4484@gmail.com';
const password = 'Ridhima@8082';

fixture `Udemy Login Test`
    .page `https://www.udemy.com/join/login-popup/`;

test('Login to Udemy', async t => {
    const emailInput = Selector('input[name="email"]');
    const passwordInput = Selector('input[name="password"]');
    //const loginButton = Selector('input[name="submit"]');
    
    
    await t
        .typeText(emailInput, email)
        .typeText(passwordInput, password)
        //.click(loginButton)
        .expect(Selector('h1').withText('What to learn next?').exists)
        .ok(); 
});