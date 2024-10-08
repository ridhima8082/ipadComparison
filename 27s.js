import { Selector } from "testcafe";
 
fixture('Starting Testcafe')
.page('https://www.google.com/').skipJsErrors();
test('Finding second highest and third lowest item', async t => {
    await t.maximizeWindow();
 
    //searching for shoes
    const searchBoxText = Selector('#APjFqb');
    await t.typeText(searchBoxText, 'Shoes');
 
    //selecting the search option
    await t.pressKey('enter');
 
    //selecting the shopping link
    const shoppingLink = Selector('div').withAttribute('class', 'YmvwI').withText('Shopping');
    await t.click(shoppingLink);
    await t.wait(1000);
 
    //Opening the Drop down
    const openingDropDdown = Selector('.Yf5aUd');
    await t.click(openingDropDdown);
    //Selectig the low to high value
    const highToLow = Selector('div').withAttribute('class', 'YpcDnf OSrXXb').withText('Price – high to low');
    await t.click(highToLow);
 
    const allProducts = Selector('.kHxwFf')
    const productCount = await allProducts.count
    const productArray = [];
    const selectedProducts = [];
    for (let i = 0; i < productCount; i++) {
        const productText = await allProducts.nth(i).innerText;
        const price=parseFloat(( productText).replace('₹','').replace(',',''));
        productArray.push(price);
    }
 
   
    console.log(productArray);
    console.log("Second highest item: ",productArray[1]);
    console.log("Third lowest item: ",productArray[productArray.length-3]);
 
 
});