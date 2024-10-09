import { Selector } from 'testcafe';
import xlsx from 'xlsx';
import fs from 'fs';

// Function to write data to an Excel sheet
function writeToExcel(data) {
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, 'Interview Questions');
    xlsx.writeFile(wb, './python_interview_questions.xlsx');
}

fixture `Extract Python Interview Questions`
    .page `https://www.geeksforgeeks.org/python-interview-questions/`;

test('Fetch interview questions from GeeksforGeeks', async t => {
    // Select the interview questions - they are in h2 or h3 tags typically
    const questions = Selector('h2, h3');
    
    const questionCount = await questions.count;
    const questionsList = [];

    for (let i = 0; i < questionCount; i++) {
        const questionText = await questions.nth(i).innerText;
        questionsList.push({ Question: questionText });
    }

    // Write the questions to an Excel file
    writeToExcel(questionsList);
});
