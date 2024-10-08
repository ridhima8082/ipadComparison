import { Selector } from 'testcafe';
 
fixture `Google Shopping`
    .page `https://www.google.com`
    .skipJsErrors();
 
    test('Search for expensive shoes and sort by price high to low', async t => {
 
 const shoes =Selector('.gLFyf')
        const shopping = Selector(Selector('a').withText('Shopping'))
        const addtobag = Selector('.MuiGrid-root.MuiGrid-grid-md-6')
        const addtocartitem = Selector('HeaderRightOptions_sprite__svmuJ HeaderRightOptions_cart_icon_VH__TbWOs')
        const size = Selector('CustomDropdown_selectedText__SI6LK closeClick  ')
        const shoesize = (Selector('li').withText('7'))
       
        await t
            .maximizeWindow()
            .typeText(shoes, 'Shoes')  
            .pressKey('enter')
            .click(shopping)
            .wait(2000)
            .click(Selector('a').withText('Reebok'))
            .wait(3000)
            .click((Selector('.Yf5aUd')))
            .click(Selector('div.YpcDnf.OSrXXb').withText('Price – high to low'))
            .wait(1000)
            const sellerFilter = Selector('span').withAttribute('title','Tata CLiQ Fashion')
    await t.click(sellerFilter);
    await t.navigateTo('https://luxury.tatacliq.com/reebok-mens-floatride-energy-4-adventure-blue-running-shoes/p-mp000000019033377?srsltid=AfmBOophCzle47w4cCfnVnukJE1UWE7EgNKeWToZecAl3Q6XxgrRd8pttwk')
    .wait(5000)
    .wait(5000)
    let addtocart='#myProductDetailInner > div.pdp-module__pdpNwDtlsInnerCon.undefined.NaN > div > div.pdp-module__flxRowNopCol50.pdp-module__padLt10 > button'
    let cart=('#app > div > header > div > div > div > div.headerRight > ul > li.headRgtLinks.bagSec > a > span.icons1.headRgtBagIcon');
    let quantitydropdown=Selector('select').withAttribute('name','quantity');
    let quantity = Selector('option').withAttribute('value','3');
    
    await t.scroll(0,300)
    .click(addtocart)
    .click(cart)
    .click(quantitydropdown)
    .click(quantity)
});    