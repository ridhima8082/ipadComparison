fixture `Google Shopping Test`
    .page `https://www.google.com/shopping`;

test('Sample test', async t => {
    await t
        .expect(true).ok();
});