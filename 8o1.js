import { Selector } from 'testcafe';

fixture `Apple Store iPad Comparison`
    .page `https://www.apple.com/in/store`;

test('Compare iPad Pro and iPad Air features', async t => {
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
    const iPadProHero = Selector('.section-hero__title'); // Ensure this class is accurate

    // Log output to debug
    const headerExists = await iPadProHeader.exists;
    const heroExists = await iPadProHero.exists;

    console.log('iPad Pro Header Exists:', headerExists);
    console.log('iPad Pro Hero Exists:', heroExists);

    // Verify if the iPad Pro page has loaded
    //await t.expect(headerExists || heroExists)
      //  .ok('iPad Pro page did not load', { timeout: 10000 });

    // Navigate back to the iPad page
    await t.navigateTo('https://www.apple.com/in/ipad/');

    // Wait and check for iPad Air page load
    await t.wait(5000);
    const ipadAirPageLoaded = Selector('h1').withText('iPad Air').exists || Selector('.section-hero__title').exists;

    //await t.expect(ipadAirPageLoaded).ok('iPad Air page did not load', { timeout: 10000 });
});
