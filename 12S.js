import { Selector } from 'testcafe';

fixture`Shopping Cart Update Test`
    .page`https://teststore.automationtesting.co.uk/index.php`;

test('Verify cart quantity update and total price change', async t => {
    
    const firstProduct = Selector('#content > section:nth-child(2) > div > div:nth-child(1) > article'); // Hummingbird printed t-shirt product link
    const addToCartButton = Selector('#add-to-cart-or-refresh > div.product-add-to-cart.js-product-add-to-cart > div > div.add > button');
    const proceedToCheckout = Selector('#blockcart-modal > div > div > div.modal-body > div > div.col-md-7 > div > div > a')
    const quantityInput = Selector('#main > div > div.cart-grid-body.col-lg-8 > div > div.cart-overview.js-cart > ul > li > div > div.product-line-grid-right.product-line-actions.col-md-5.col-xs-12 > div > div.col-md-10.col-xs-6 > div > div.col-md-6.col-xs-6.qty > div > input'); // Quantity input field in the cart
    const totalPrice = Selector('#main > div > div.cart-grid-right.col-lg-4 > div.card.cart-summary > div.cart-detailed-totals.js-cart-detailed-totals > div.card-block.cart-summary-totals.js-cart-summary-totals > div.cart-summary-line.cart-total > span.label'); // Total price element
    
    await t
        .click(firstProduct) 
        .click(addToCartButton) 
        .click(proceedToCheckout); 
        
    
    const initialTotal = await totalPrice.innerText;
    await t
        .selectText(quantityInput)
        .pressKey('delete') 
        .typeText(quantityInput, '3')
        .pressKey('enter');
    
});
