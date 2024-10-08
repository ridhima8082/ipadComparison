import { Selector } from 'testcafe';

fixture`Shopping Cart Update Test`
    .page`https://teststore.automationtesting.co.uk/index.php`;

test('Verify cart quantity update and total price change', async t => {

    const firstProduct = Selector('#content > section:nth-child(2) > div > div:nth-child(1) > article'); // Hummingbird printed t-shirt product link
    const addToCartButton = Selector('#add-to-cart-or-refresh > div.product-add-to-cart.js-product-add-to-cart > div > div.add > button');
    const proceedToCheckout = Selector('#blockcart-modal > div > div > div.modal-body > div > div.col-md-7 > div > div > a');
    const quantityInput = Selector('#main > div > div.cart-grid-body.col-lg-8 > div > div.cart-overview.js-cart > ul > li > div > div.product-line-grid-right.product-line-actions.col-md-5.col-xs-12 > div > div.col-md-10.col-xs-6 > div > div.col-md-6.col-xs-6.qty > div > input'); // Quantity input field in the cart
    const totalPrice = Selector('#main > div > div.cart-grid-right.col-lg-4 > div.card.cart-summary > div.cart-detailed-totals.js-cart-detailed-totals > div.card-block.cart-summary-totals.js-cart-summary-totals > div.cart-summary-line.cart-total > span.value'); // Total price element
    
    await t
        .click(firstProduct) 
        .click(addToCartButton)
        //Assertion-1: to check if product successfully added to cart 
        .expect(Selector('#myModalLabel').innerText).contains('Product successfully added to your shopping cart')
        .click(proceedToCheckout);
    
    let initialTotal = await totalPrice.innerText;
    console.log('Initial Total Price:', initialTotal);
    let initialTotalNumber = parseFloat(initialTotal.replace(/[^\d.-]/g, ''));
    
    await t
        .selectText(quantityInput)
        .pressKey('delete')
        .typeText(quantityInput, '3')
        .pressKey('enter'); 

    await t.wait(3000);
    let updatedTotal = await totalPrice.innerText;
    console.log('Updated Total Price:', updatedTotal);
    let updatedTotalNumber = parseFloat(updatedTotal.replace(/[^\d.-]/g, ''))
    
    //const initialTotalNumber = Number(initialTotal.replace('£', '').replace(',', ''));
    //const updatedTotalNumber = Number(updatedTotal.replace('£', '').replace(',', ''));
    
    //Assertion-2: to check if total price has updated or not after increasing quantity.
    //Assertion-3: to check if the initialTotalNuber and UpdatedTotal Number are not NaN
    //Assertion-4: to compare the initialTotal Number and updatedTotalNumber after parsing both
    await t
        .expect(quantityInput.value).eql('3', 'The quantity should be updated to 3')
        .expect(isNaN(initialTotalNumber)).notOk('Initial total should be a valid number') 
        .expect(isNaN(updatedTotalNumber)).notOk('Updated total should be a valid number')
        .expect(initialTotalNumber).notEql(updatedTotalNumber, 'The total price should be updated after changing the quantity')
        .expect(updatedTotalNumber).gt(initialTotalNumber, 'The total price should be greater after increasing the quantity');    
});
