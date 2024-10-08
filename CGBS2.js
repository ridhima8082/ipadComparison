import { T } from "testcafe-safe-storage/lib/utils/template";

fixture("Getting Started with..")
    .page("https://capgeminibrandstore.printstop.co.in/");

test("Capgemini Branding Store", async t=>{
    const username = Selector("#email_signup");
    const password = Selector('#password_signup');
    const loginButton = Selector('#btnlogin');
    const submit = Selector("#Submit");
    await t
    .typeText(username,"ridhima.sharma@capgemini.com")
    .click(loginBtn)
    .wait(45000)
    .typeText(password,"Ridhima@123")
    .click(submit)
    
    const AllProductsLink = Selector(".nav-link.text-dark").withText("All Products");
    let footwearLink = Selector("#category_meny_collapse>li:nth-child(6) > a > span");
    const product = Selector("#product_list_without_category > div > div.col-l2.col-md-12.col-lg-3.product-box.p8529>div")
    const addtoCart = Selector(".fa-angle-right");

    await t
        .wait(2000)
        .click(footwearLink)
        .wait(5000)
        .click(product)
        .click(addtoCart)
        .click("#SubmmitBtn")
        .setNativeDialogHandler(() => true)
        .click(".carousel__button")

    const productsInCart = Selector(".mb-0.fw-bold");
    const productname = "Greensole Khakhi Weave Shoes";
    const productsInCartCount = await productsInCart.count;
    let productnamelist=[];
    for(let i =0; i< productsInCartCount;i++){
        let productname=await productsInCart.nth(i).innerText;
        productnamelist.push(ptoductname);
    }    

    if(productnamelist.includes(productname)){
        await t
            .expect(productnamelist).contains(productname);
    }   else{
        console.log('Th Product was not found in the cart.');
    }
     
    const priceList = Selector(".price.float-end.datalayer-price");
    const priceListCount=await priceList.count;
    let total =0;

    for(let i=0;i<priceListCount;i++){
        const priceText = await priceList.nth(i).innerText;
        const price=parsefloat((await priceText).replace('₹','').replace(',',''));
        total = total + price;
    }
    console.log("Total price of all products in the cart without IGST" + total);

    const IGSTtext = await Selector(".float-end.taxli").innerText;
    const IGST = parseFloat((await IGSTtext).replace('₹','I').replace(',',''));

    const totalPriceWithIGST = total + IGST;

    console.log("Total Price of all products in the cart with IGST" + totalPriceWithIGST);
    const finalpriceText = Selector("#detail_final_price").innerText;
    const finalprice=parseFloat((await finalpriceText).replace('₹','').replace(',',''));
    console.log("Final Price of dispaying in the cart : " + finalprice);
    await t
    .expect(finalprice).equal(totalPriceWithIGST);
});    
