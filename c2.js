import { Selector } from 'testcafe';

fixture ("Capgemini Talent Page Edit Profile").page`https://talent.capgemini.com/in`;

test('Search for Capgemini Employees', async t => {
    await t.maximizeWindow();
    await t.click('#editprofile > span > a');
    await t.wait(1000);
});