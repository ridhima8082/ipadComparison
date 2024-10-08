import { Selector } from 'testcafe';

fixture `Udemy Course Search`
    .page `https://www.udemy.com`;

test('Search for a course on Udemy and validate results', async t => {
    // Search for a course
    const searchBox = Selector('input[data-purpose="search-input"]');
    const searchButton = Selector('button[type="submit"]').withAttribute('data-purpose', 'search-submit');
    const courseKeyword = 'JavaScript';

    await t
        .typeText(searchBox, courseKeyword)
        .click(searchButton);

    // Wait for search results
    const courseList = Selector('div.udlite-focus-visible-target.udlite-heading-md.course-card--course-title--vVEjC');

    // Validate that there are search results and the first result contains the search keyword
    await t
        .expect(courseList.count).gt(0, 'No courses found in the search results')
        .expect(courseList.nth(0).innerText).contains(courseKeyword, `First result does not contain ${courseKeyword}`);

    // Validate that there are at least 10 courses in the search results
    await t
        .expect(courseList.count).gte(10, 'Less than 10 courses in the search results');
});