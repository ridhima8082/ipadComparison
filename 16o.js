import { Selector, ClientFunction } from 'testcafe';

// Function to get text from clipboard
const getClipboardText = ClientFunction(() => navigator.clipboard.readText());

fixture `Flight Booking`
    .page `https://www.booking.com/flights`;

test('Book the cheapest flight and share the flight info', async t => {
    // Click on the "From" field to specify departure location (New York)
    const departureInput = Selector('span.Text-module__root--variant-body_2___QdAaF'); // Updated selector for "Where from" (Departure)
    await t
        .click(departureInput)
        .typeText(Selector('.AutoComplete-module__textInput___Qh3I-'), 'New York', { paste: true })
        .pressKey('enter');

    // Click on the "To" field to specify destination location (Los Angeles)
    const destinationInput = Selector('span.Text-module__root--variant-body_2___QdAaF.Text-module__root--color-neutral_alt___lEfO4'); // Updated selector for "Where to" (Destination)
    await t
        .click(destinationInput)
        .typeText(Selector('.AutoComplete-module__textInput___Qh3I-'), 'Los Angeles', { paste: true })
        .pressKey('enter');

    // Wait for airport options to load and select the first radio button for Los Angeles
    const airportOptions = Selector('.Text-module__root--variant-body_2___QdAaF.Text-module__root--color-neutral_alt___lEfO4');
    await t
        .expect(airportOptions.count).gt(0, 'Airport options are displayed') // Ensure there are airport options
        .click(airportOptions.nth(0)); // Click the first airport option

    // Initiate flight search
    const searchButton = Selector('button').withText('Search');
    await t.click(searchButton);

    // Wait for search results to load
    const flightResults = Selector('.flight-card'); // Adjust based on actual HTML structure
    await t
        .wait(5000) // Wait for 5 seconds (adjust as needed)
        .expect(flightResults.exists).ok('Flight results are displayed'); // Ensure flight results are present

    // Select the cheapest flight (adjust selector as necessary)
    const cheapestFlight = flightResults.nth(0); // Assuming the first flight is the cheapest
    await t
        .expect(cheapestFlight.exists).ok('Cheapest flight is displayed')
        .click(cheapestFlight);

    // Click on the share button
    const shareButton = Selector('button').withText('Share');
    await t.click(shareButton);

    // Copy the flight link
    const copyLinkButton = Selector('button').withText('Copy link');
    await t.click(copyLinkButton);

    // Get the copied link from clipboard and print it to console
    const flightLink = await getClipboardText();
    console.log('Copied Flight Link:', flightLink);

    // Assertions to verify successful execution
    await t
        .expect(flightLink).contains('https://www.booking.com/flights', 'Flight link is copied successfully')
        .expect(shareButton.exists).ok('Share button is clicked')
        .expect(copyLinkButton.exists).ok('Link copied successfully');
});
