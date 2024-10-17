import { Selector } from 'testcafe';
import * as XLSX from 'xlsx';
 
 
const data = {
    firstName: 'Lily',
    lastName: 'Blossom',
    email: `lilyblossom${Math.floor(Math.random() * 1000)}@example.com`,
    company: 'Capgemini',
    password: 'Password123',
    address1: '123 Main St',
    address2: 'Bellandur',
    city: 'Bangalore',
    state: 'Karnataka',
    zipCode: '56001',
    phone: '1234567890',
    cardNumber: '50000010003333',
    cardCvc: '123',
    cardExpMonth: '12',
    cardExpYear: '2025'
};
 
fixture (`Automation Demo`).page(`https://automationexercise.com/`).skipJsErrors();
 
test('Verify that home page is visible successfully', async t => {
    let homePage = false;
    await t
    .maximizeWindow()
    .expect(Selector('a').withText('Home').exists).ok();
    homePage = true;
    console.log(`Home page is visible: ${homePage}`);
})
 
test('Complete Checkout Process with Address Verification and Summary', async t => {
    let accountCreated = false;
    let productAdded = false;
    let productDeleted = false;
    let orderPlaced = false;
    let accountDeleted = false;
    //Account creation
    await t.click(Selector('a').withText('Signup / Login'));
    await t
    .typeText('#form > div > div > div:nth-child(3) > div > form > input[type=text]:nth-child(2)', data.firstName)
    .typeText('#form > div > div > div:nth-child(3) > div > form > input[type=email]:nth-child(3)', data.email)
    .click('#form > div > div > div:nth-child(3) > div > form > button')
    .wait(2000)
    .click('#id_gender2')
    .typeText('#password', data.password)
    .click('#days')
    .click('#days > option:nth-child(6)')
    .click('#months')
    .click('#months > option:nth-child(3)')
    .click('#years')
    .click('#years > option:nth-child(17)')
    .click('#newsletter')
    .click('#optin')
    .typeText('#first_name', data.firstName)
    .typeText('#last_name', data.lastName)
    .typeText('#company', data.company)
    .typeText('#address1', data.address1)
    .typeText('#address2', data.address2)
    .typeText('#state', data.state)
    .typeText('#city', data.city)
    .typeText('#zipcode', data.zipCode)
    .typeText('#mobile_number', data.phone)
    .click('#form > div > div > div > div.login-form > form > button')
    // .wait(2000)
    .takeScreenshot(`screenshots/loggedIn.png`)
    // .takeScreenshot({fullPage:true})
    .expect(Selector('#form > div > div > div > h2 > b').innerText).contains('ACCOUNT CREATED!')
    .click('#form > div > div > div > div > a');
    await t.takeScreenshot(`screenshots/accountCreated.png`);
    accountCreated = true;
    // .takeScreenshot({fullPage:true})
    // await t.wait(5000);
 
    //Verify if name is shown on the top or not
    const welcomeText = Selector('#header > div > div > div > div.col-sm-8 > div > ul > li:nth-child(10) > a > b').innerText
    await t.expect(welcomeText).contains('Lily')
 
    //Add products to the cart
    // await t.click(Selector('a').withText('Products'));
    // const addToCartButtons = Selector('a').withText('Add to cart');
    // await t
    //     .click(addToCartButtons.nth(0)) // Add first product
    //     .click(Selector('button').withText('Continue Shopping'))
    //     // .click(addToCartButtons.nth(2)) // Add second product
    //     // .click(Selector('button').withText('Continue Shopping'))
    // productAdded = true;
    // await t.wait(2000);
 
    //logout
    await t.click('#header > div > div > div > div.col-sm-8 > div > ul > li:nth-child(4) > a');
 
    //login
    await t
    .typeText('#form > div > div > div.col-sm-4.col-sm-offset-1 > div.login-form > form > input[type=email]:nth-child(2)', data.email)
    .typeText('#form > div > div > div.col-sm-4.col-sm-offset-1 > div.login-form > form > input[type=password]:nth-child(3)', data.password)
    .click('#form > div > div > div.col-sm-4.col-sm-offset-1 > div.login-form > form > button');
 
 
    const productContainer = Selector('.productinfo');
    const productCount = await productContainer.count;  // Get the number of products
    const productArray = [];
 
    for (let i = 0; i < productCount; i++) {
        // Extract product name and price for each product
        const productName = await productContainer.nth(i).find('p').innerText;
        const productPrice = await productContainer.nth(i).find('h2').innerText;
 
        // Parse the price to extract the numeric value
        const price = parseFloat(productPrice.replace('Rs.', ''));
 
        // Store the product name and price in an array
        const pair = { productName, price };
        productArray.push(pair);
    }
 
    // console.log(productArray);
 
    const worksheet = XLSX.utils.json_to_sheet(productArray);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
 
    // Define the file path
    const filePath = 'automationProducts.xlsx';
 
    // Writing the workbook to a file
    XLSX.writeFile(workbook, filePath);
 
 
    console.log('Excel file created');
 
 
 
    const firstThreeProducts = productArray.slice(0, 3);  // Get the first three products
 
    // Iterate over the first two products and add them to the cart
    for (const product of firstThreeProducts) {
        const productName = product.productName;  // Product name from Excel
        const productPrice = product.price;       // Price from Excel
 
        console.log(`Adding product to the cart: ${productName}
            Price of ${productName}: Rs. ${productPrice}`);
 
        // Find and add the product to the cart using TestCafe
        const productContainer = Selector('.productinfo').withText(productName);
 
       
        // Ensure that the product is found and visible on the page
        await t
            .expect(productContainer.exists).ok(`Product with name "${productName}" not found on the page.`)
            .click(productContainer.find('.add-to-cart'))  // Click the "Add to cart" button
            .wait(1000);  // Wait to ensure the product is added to the cart
 
        console.log(`Product "${productName}" has been added to the cart.`);
        await t.click(Selector('button').withText('Continue Shopping'));
    }
 
   
 
    //add new product to the cart
    // await t.click(Selector('a').withText('Products'));
    // await t.click(addToCartButtons.nth(2));
    // await t.click(Selector('button').withText('Continue Shopping'));
    // await t.click('#header > div > div > div > div.col-sm-8 > div > ul > li:nth-child(3) > a');
    // await t.wait(2000);
 
 
    await t.click('#header > div > div > div > div.col-sm-8 > div > ul > li:nth-child(3) > a');
    productAdded = true;
    const cartRows = Selector('tbody tr').withAttribute('id');
    const itemCount = await cartRows.count;
    let calculatedTotal = 0;
 
    for (let i = 0; i < itemCount; i++) {
        const priceText = await cartRows.nth(i).find('.cart_price p').innerText;  
        const quantityText = await cartRows.nth(i).find('.cart_quantity button').innerText;
 
        // Log raw values for debugging
        // console.log(`Price for item ${i + 1}:`, priceText);
        console.log(`Quantity for item ${i+1}:`, quantityText);
 
        // Convert price and quantity to numbers
        const price = parseFloat(priceText.replace('Rs.', ''));
        const quantity = parseInt(quantityText);
 
        // Calculate item total and add to calculatedTotal
        const itemTotal = price * quantity;
        calculatedTotal += itemTotal;
    }
 
    console.log('Total Calculated before deleting the product:', calculatedTotal);
 
 
    await t.click(Selector('a').withText('Proceed To Checkout'));
 
    //displayedamount at cartpage
    const displayedTotalText = await Selector('.cart_total_price').nth(3).innerText;
    const displayedTotal = parseFloat(displayedTotalText.replace('Rs.', '').replace(',', ''));
 
    console.log('Displayed total on cart page before deleting the product:', displayedTotal);
 
    // Validate total amount btw calculated and displayedtotal amount
    await t.expect(displayedTotal).eql(calculatedTotal, 'The displayed total should match the calculated total');
 
    await t.eval(() => window.history.back())
 
    await t.click(Selector('.cart_delete').nth(1).find('a.cart_quantity_delete'));
    await t.wait(2000);
 
    // Select all cart rows
    const updatecartRows = Selector('tbody tr').withAttribute('id');
    const updateitemCount = await cartRows.count;
    let updatecalculatedTotal = 0;
 
    for (let i = 0; i < updateitemCount; i++) {
        const updatepriceText = await updatecartRows.nth(i).find('.cart_price p').innerText;  
        const updatequantityText = await updatecartRows.nth(i).find('.cart_quantity button').innerText;
        console.log(`Updated price for ${i+1}:`, updatepriceText);
        console.log(`Updated quantity for ${i+1}:`, updatequantityText);
 
        const updateprice = parseFloat(updatepriceText.replace('Rs.', '').replace(',', ''));
        const updatequantity = parseInt(updatequantityText);
 
        const updateitemTotal = updateprice * updatequantity;
        updatecalculatedTotal += updateitemTotal;
    }
 
    console.log('Total Calculated after deleting the product:', updatecalculatedTotal);
    productDeleted = true;
    await t.click(Selector('a').withText('Proceed To Checkout'));
 
   
 
 
    // //Proceed to checkout
    // await t.click('#do_action > div.container > div > div > a');
 
 
 
    // // Verify that the delivery address is the same as filled during registration
    // const deliveryAddress = Selector('#address_delivery');
    // await t
    //     .expect(deliveryAddress.innerText).contains(data.address1)
    //     .expect(deliveryAddress.innerText).contains(data.address2)
    //     .expect(deliveryAddress.innerText).contains(data.city)
    //     .expect(deliveryAddress.innerText).contains(data.state)
    //     .expect(deliveryAddress.innerText).contains(data.zipCode);
 
    // // Verify that the billing address is the same as filled during registration
    // const billingAddress = Selector('#address_invoice');
    // await t
    //     .expect(billingAddress.innerText).contains(data.address1)
    //     .expect(billingAddress.innerText).contains(data.address2)
    //     .expect(billingAddress.innerText).contains(data.city)
    //     .expect(billingAddress.innerText).contains(data.state)
    //     .expect(billingAddress.innerText).contains(data.zipCode);
 
        //displayedamount at cartpage
    // const updatedisplayedTotalText = await Selector('.cart_total_price').nth(1).innerText;
    // const updatedisplayedTotal = parseFloat(updatedisplayedTotalText.replace('Rs.', '').replace(',', ''));
 
    // console.log('Displayed total on cart page:', updatedisplayedTotal);
 
    // // Validate total amount btw calculated and displayedtotal amount
    // await t.expect(updatedisplayedTotal).eql(updatecalculatedTotal, 'The displayed total should match the calculated total');
 
    // await t.expect(updatedisplayedTotal).notEql(displayedTotal,'The displayed total after removal should not equal the previous total');
   
    // Make payment and enter dummy card details
    await t
        .click(Selector('#cart_items > div > div:nth-child(7) > a').withText('Place Order'))
        .typeText('#payment-form > div:nth-child(2) > div > input', `${data.firstName} ${data.lastName}`)
        .typeText('#payment-form > div:nth-child(3) > div > input', data.cardNumber)
        .typeText('#payment-form > div:nth-child(4) > div.col-sm-4.form-group.cvc > input', data.cardCvc)
        .typeText('#payment-form > div:nth-child(4) > div:nth-child(2) > input', data.cardExpMonth)
        .typeText('#payment-form > div:nth-child(4) > div:nth-child(3) > input', data.cardExpYear)
        .click(Selector('#submit').withText('Pay and Confirm Order'));
 
    // Place Order and verify order status
        await t.expect(Selector('#form > div > div > div > h2 > b').withText('ORDER PLACED!').exists).ok();
        await t.click('#form > div > div > div > a');
        await t.click('#form > div > div > div > div > a');
        orderPlaced = true;
   
    // Click 'Delete Account' button
        await t.click(Selector('#header > div > div > div > div.col-sm-8 > div > ul > li:nth-child(5) > a').withText('Delete Account'));
   
    // Verify 'ACCOUNT DELETED!' and click 'Continue' button
        await t
            .expect(Selector('#form > div > div > div > h2 > b').withText('ACCOUNT DELETED!').exists).ok()
            .takeScreenshot(`screenshots/accountDeletd.png`)
            .click(Selector('#form > div > div > div > div > a').withText('Continue'));
        accountDeleted = true;
 
        console.log(`Test Summary:
            1. Account Created: ${accountCreated}
            2. Product Added to the Cart: ${productAdded}
            3. Product Deleted from the Cart: ${productDeleted}
            4. Order Placed: ${orderPlaced}
            5. Account Deleted: ${accountDeleted}`);
})