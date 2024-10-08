fixture('Getting Started')
    .page('https://www.google.co.in/');
 
test('1st Test', async t=>{
    await t.typeText('#APjFqb','Learning Testcafe')
    await t.click('.gNO89b')
    await t.wait(3000)
});
 