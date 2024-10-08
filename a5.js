import { Selector } from 'testcafe';
 
fixture `Google Shopping`
    .page `https://www.google.com`;
 
test('Search for item and sort by price high to low', async t => {
    await t
        .typeText(Selector('#APjFqb'), 'Mobile')  
        .pressKey('enter');
    await t.click(Selector('a').withText('Shopping'));
    await t.click(Selector('.Yf5aUd'));
    await t.click(Selector('div.YpcDnf.OSrXXb').withText('Price – low to high'));
   
    await t.wait(2000);
    await t.expect(Selector('div.vkYnff').innerText).contains('Sort by: Price – low to high')
 
 
    const mobile = Selector('.XrAfOe')
        const mobilecount = await mobile.count
        let prices_array=[]
         for(let i=0;i<mobilecount;i++){
            const pricetext =mobile.nth(i).innerText
            const price= parseFloat((await pricetext).replace('₹','').replace(',',''))
            prices_array.push(price)
           
}
    console.log(prices_array)
 
    for(let i=0;i<prices_array.length-1;i++){
        await t.expect(prices_array[i]).lte(prices_array[i+1])
        console.log(prices_array[i],prices_array[i+1])
    }
 
   
 
});