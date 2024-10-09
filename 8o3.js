import { Selector } from 'testcafe';
import * as XLSX from 'xlsx';

fixture `Apple Store iPad Comparison`
    .page `https://www.apple.com/in/store`;

test('Compare iPad Pro and iPad Air features and export details', async t => {
    const navBar = Selector('#globalnav');

    // Ensure the navigation bar exists
    await t.expect(navBar.exists).ok('Navigation bar is not found');

    // Click on the iPad link
    const ipadNavLink = navBar.find('a.globalnav-link').withText('iPad');
    await t.expect(ipadNavLink.exists).ok('iPad link is not found');
    await t.click(ipadNavLink);

    // Wait for the page to load and check for submenu visibility
    await t.wait(2000); // Slight wait for submenu to be visible
    await t.hover(ipadNavLink);

    // Click on the iPad Pro link
    const ipadProLink = navBar.find('a.globalnav-submenu-link').withText('iPad Pro');
    await t.expect(ipadProLink.exists).ok('iPad Pro link is not found');
    await t.click(ipadProLink);

    // Wait for the iPad Pro page to load
    await t.wait(5000); // Increase wait time to allow page loading

    // Check for specific elements that indicate the iPad Pro page has loaded
    const iPadProHeader = Selector('h1').withText('iPad Pro');
    await t.expect(iPadProHeader.exists).ok('iPad Pro page did not load', { timeout: 10000 });

    // Fetch details of iPad Pro
    const features = await Selector('.feature-class-name').innerText; // Replace with the actual class name for features
    const price = await Selector('.price-class-name').innerText; // Replace with the actual class name for price

    const details = {
        model: 'iPad Pro',
        features: features,
        price: price,
    };

    console.log('iPad Pro Details:', details);

    // Save details to an Excel file
    const worksheet = XLSX.utils.json_to_sheet([details]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'iPad Pro Details');
    XLSX.writeFile(workbook, 'iPad_Pro_Details.xlsx');

    // Navigate back to the iPad page
    await t.navigateTo('https://www.apple.com/in/ipad/');

    // Wait and check for iPad Air page load
    await t.wait(5000);
    const ipadAirPageLoaded = Selector('h1').withText('iPad Air').exists || Selector('.section-hero__title').exists;

    await t.expect(ipadAirPageLoaded).ok('iPad Air page did not load', { timeout: 10000 });
});

//New Changes 
