import { Selector, ClientFunction } from 'testcafe';
import xlsx from 'xlsx';
import fs from 'fs';

// Client function to scroll the page
const scrollPage = ClientFunction(() => window.scrollBy(0, window.innerHeight));

// Function to write data to Excel
function writeToExcel(data) {
    const filePath = './python_interview_questions_complex.xlsx';
    
    // Delete the existing file if it exists
    if (fs.existsSync(filePath)) {
        console.log('File exists, deleting...');
        fs.unlinkSync(filePath);
    }
    
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, 'Interview Questions');
    xlsx.writeFile(wb, filePath);
    
    console.log('Data successfully written to:', filePath);
}

// Fixture setup with setNativeDialogHandler applied early
fixture `Complex TestCafe Features: Extract Python Interview Questions`
    .page `https://www.geeksforgeeks.org/python-interview-questions/`
    .beforeEach(async t => {
        // Handle native dialogs (beforeunload or alerts)
        await t.setNativeDialogHandler(() => true);
        console.log('Test started: Navigating to the page...');
    });

// Test to fetch interview questions, validate content, and write to Excel
test('Fetch Python Interview Questions (Advanced)', async t => {
    const questions = Selector('h2, h3');
    
    // Scroll page to ensure all questions load
    await scrollPage();
    
    // Wait until the questions are visible
    await t.expect(questions.exists).ok('The questions section did not load correctly.');
    
    const questionCount = await questions.count;
    console.log('Total questions found:', questionCount);
    
    const questionsList = [];

    for (let i = 0; i < questionCount; i++) {
        const questionText = await questions.nth(i).innerText;

        // Log the extracted question
        console.log(`Extracting question ${i + 1}: ${questionText}`);
        
        questionsList.push({ Question: questionText });

        // Assert that question text is not empty
        await t.expect(questionText.trim().length).gt(0, `Question ${i + 1} is empty.`);
        
        // Scroll to next question to ensure it's in the viewport
        await scrollPage();
    }

    // Write the questions to an Excel file
    writeToExcel(questionsList);

    // Assert that the file was written successfully
    const fileExists = fs.existsSync('./python_interview_questions_complex.xlsx');
    await t.expect(fileExists).ok('Excel file was not created.');
});
