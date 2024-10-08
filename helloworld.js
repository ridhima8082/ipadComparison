//import {Selector} from 'testcafe';

fixture(`Hello world Fixture`)
    .page `https://example.com`;
test('Hello World TestCafe', async t=> {
    await t
        .expect(Selector('hi').innerText).eql('Example Domain');

} );   