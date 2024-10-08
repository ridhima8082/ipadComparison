import { Selector } from 'testcafe';

fixture `Google Shopping`
    .page `https://shopping.google.com/`;

test('Buying a Reebok shoe with highest price', async t => {
    const searchBox = Selector('#REsRA'); 
    await t
        .typeText(searchBox, 'shoes')
        .pressKey('enter');

    await t.wait(5000);  

    const brandFilter = Selector('a').withText('Reebok').nth(0);
    await t
        .click(brandFilter);
    await t.wait(3000); 

    const sellerFilter = Selector('a').withText('Reebok').nth(6); 
    await t
        .click(sellerFilter);
    await t.wait(3000);  

    
    const sortDropdown = Selector('div[jsname="oYxtQd"]')
        .withAttribute('role', 'button')
        .withAttribute('tabindex', '0')
        .withText('Sort by: Relevance');
    await t
       .click(sortDropdown);

    const sortOption = Selector('div[jsname="ibnC6b"]').withText('Price – high to low');
    await t
        .click(sortOption);

    await t.wait(5000); 

    const expensiveShoe = Selector('div[jsname="haAclf"]').nth(5);
    await t
        .scrollIntoView(expensiveShoe)
        .click(expensiveShoe);

    await t.wait(5000);

    const selectReebok = Selector('a.shntl')
        .withText('Free delivery')
        .withAttribute('href', /reebok\.abfrl\.in/);
    
    await t
        .scrollIntoView(selectReebok) 
        .expect(selectReebok.visible).ok('Reebok link is not visible') 
        .click(selectReebok);

    const addToCartButton = Selector('button').withAttribute('data-testid', 'add-to-cart');
    await t
        .scrollIntoView(addToCartButton) 
        .expect(addToCartButton.visible).ok('Add to cart button is not visible') 
        .click(addToCartButton);

});
