import { Selector } from "testcafe";
 
fixture("Getting started with ...")
    .page("https://capgeminibrandstore.printstop.co.in/")
    .skipJsErrors();
 
 
test("Capgemini Branding Store", async t => {
    const username = Selector("#email_signup");
    const loginBtn = Selector("#btnlogin");
    const password = Selector("#password_signup");
    const submit = Selector("#Submit");
    await t
        .maximizeWindow()
        .typeText(username, "ridhima.sharma@capgemini.com")
        .click(loginBtn)
        .wait(45000)
        .typeText(password, "Ridhima@123")
        .click(submit)
 
    let footwearLink = Selector("#category_menu_collapse > li:nth-child(6) > a > span")
    const product = Selector("#product_list_without_category > div > div.col-12.col-md-12.col-lg-3.product-box.p8529 > div > div.card-title > h2 > a");
    const addtoCart = Selector(".fa-angle-right");
 
    await t
        .wait(2000)
        .click(footwearLink)
        .wait(5000)
        .click(product)
        .click(addtoCart)
        .click("#SubmitBtn")
        .setNativeDialogHandler(() => true)
        .click(".carousel__button")
 
 
    const productsInCart = Selector(".mb-0.fw-bold ");
    const productname = "Greensole Khakhi Weave Shoes";
    //const productsInCartCount = await productsInCart.count;
    //let productnamelist = [];
    //for (let i = 0; i < productsInCartCount; i++) {
      //  let productname = await productsInCart.nth(i).innerText;
        //productnamelist.push(productname);
    }
 
 
    //await t
      //  .expect(productnamelist).contains(productname);
 
    
 
    //const priceList = Selector(".price.float-end.datalayer-price");
    //const priceListCount = await priceList.count;
    //let total = 0;
    //
    //for (let i = 0; i < priceListCount; i++) {
      //  const priceText = await priceList.nth(i).innerText;
        //const price = parseFloat((await priceText).replace('₹', '').replace(',', ''));
        //total = total + price;
    //}
 
 
 
    //const IGSTtext = await Selector(".float-end.taxli").innerText;
    //const IGST = parseFloat((await IGSTtext).replace('₹', '').replace(',', ''));
 
    //const totalPriceWithIGST = total + IGST;
 
    //console.log("Total price of all products in the cart with IGST" + totalPriceWithIGST);
    //const finalpriceText = Selector("#detail_final_price").innerText;
    //const finalprice = parseFloat((await finalpriceText).replace('₹', '').replace(',', ''));
    //await t
      //  .expect(finalprice).eql(totalPriceWithIGST);
);