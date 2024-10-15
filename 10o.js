import { Selector, t } from 'testcafe';
import xlsx from 'xlsx';
import fs from 'fs';
import { ClientFunction } from 'testcafe';

function writeToExcel(data) {
    const filePath = './python_interview_questions.xlsx';
    
    if (fs.existsSync(filePath)) {
        console.log('File exists, deleting existing file...');
        fs.unlinkSync(filePath);
    }
    
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, 'Interview Questions');
    xlsx.writeFile(wb, filePath);
    
    console.log('Data written to Excel file:', filePath);
}

fixture `Extract Python Interview Questions`
    .page `https://www.geeksforgeeks.org/python-interview-questions/`
    .beforeEach(async t => {
        console.log('Starting test - Navigating to page...');
    })
    .afterEach(async t => {
        console.log('Test completed.');
    });

test('Fetch and validate interview questions from GeeksforGeeks', async t => {
    
    const questions = Selector('h2, h3');
    
    await t.expect(questions.exists).ok('The questions section did not load as expected.');
    
    const questionCount = await questions.count;
    console.log('Number of questions found:', questionCount);
    
    await t.expect(questionCount).gte(10, 'Less than 10 questions found.');
    
    const questionsList = [];

    for (let i = 0; i < questionCount; i++) {
        const questionText = await questions.nth(i).innerText;
        console.log(`Extracting Question ${i + 1}: ${questionText}`);
        questionsList.push({ Question: questionText });
        await t.expect(questionText.trim().length).gt(0, `Question ${i + 1} is empty.`);
    }
    console.log(`Total questions extracted: ${questionsList.length}`);
    
    writeToExcel(questionsList);

    const fileExists = fs.existsSync('./python_interview_questions.xlsx');
    await t.expect(fileExists).ok('Excel file was not created.');

}).after(async t => {
    if (t.ctx.err) {
        console.error('Test failed, taking a screenshot...');
        await t.takeScreenshot('./screenshots/failure.png');
    }
});

 