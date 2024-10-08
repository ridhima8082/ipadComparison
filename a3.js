import { Selector } from 'testcafe';
 
fixture `Google Shopping Sort Test`
    .page `https://www.google.com`;
 
    test('Search for item and sort by price low to high', async t => {
    await t
        .typeText(Selector('#APjFqb'), 'Shoes')  
        .pressKey('enter');
    await t.click(Selector('a').withText('Shopping')); 

    await t.click(Selector('.Yf5aUd'));
    await t.click(Selector('div.YpcDnf.OSrXXb').withText('Price – high to low '))

} ) 