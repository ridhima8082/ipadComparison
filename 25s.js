import { Selector } from 'testcafe';
import fetch from 'node-fetch';
import https from 'https';

const httpsAgent = new https.Agent({
    rejectUnauthorized: false //SSL Certificate won't be asked now 
});

async function getBitcoinPrice() {
    const apiUrl = 'https://api.coindesk.com/v1/bpi/currentprice.json';
    const response = await fetch(apiUrl, { agent: httpsAgent });
    const data = await response.json();
    return data.bpi.USD.rate_float;  // to get Bitcoin price in USD
}

fixture `Bitcoin Price Comparison`
    .page `https://www.coindesk.com/price/bitcoin`;

test('Compare Bitcoin prices from API', async t => {
    //to get bitcoin price from the CoinDesk API
    const apiBitcoinPrice = await getBitcoinPrice();

    //Bitcoin price on CoinDesk page
    const sitePriceSelector = Selector('div.flex.justify-end.items-center span.Noto_Sans_2xl_Sans-700-2xl.text-color-black');
    await t.wait(10000);  

    //was giving an error because the element was not appearing so added this to resolve
    await t.expect(sitePriceSelector.exists).ok('The Bitcoin price element is not found on the page');

    // to get the text out of the sitePriceSelector Element
    const sitePriceText = await sitePriceSelector.innerText;

    const siteBitcoinPrice = parseFloat(sitePriceText.replace(/[$,]/g, ''));

    console.log(`Bitcoin price as per CoinDesk website: ${siteBitcoinPrice}`);
    console.log(`Bitcoin price as per CoinDesk API: ${apiBitcoinPrice}`);

    //some fluctuations allowed
    await t.expect(Math.abs(siteBitcoinPrice - apiBitcoinPrice) < 100)
           .ok('The Bitcoin price on the site does not match the price from the API');

    await t.takeScreenshot();       
}).skipJsErrors();
