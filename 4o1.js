import { Selector } from 'testcafe';
import * as xlsx from 'xlsx';
import fs from 'fs';

// Function to generate the HTML report
function generateHtmlReport(excelData) {
    const htmlContent = `
        <html>
            <head>
                <title>Top 10 Universities Report</title>
            </head>
            <body>
                <h1>Top 10 Universities in the United States</h1>
                <table border="1">
                    <tr>
                        <th>Name</th>
                        <th>Country</th>
                        <th>Website</th>
                    </tr>
                    ${excelData.map(university => `
                    <tr>
                        <td>${university.Name}</td>
                        <td>${university.Country}</td>
                        <td><a href="${university.Website}">${university.Website}</a></td>
                    </tr>`).join('')}
                </table>
            </body>
        </html>
    `;

    const reportPath = 'top_10_universities_report.html';
    fs.writeFileSync(reportPath, htmlContent);
    console.log('HTML report created:', reportPath);
}

fixture `Fetch Top 10 Universities Data`
    .page `http://universities.hipolabs.com/search?country=United+States`;

test('Fetch and save top 10 university data to Excel', async t => {
    const response = await t.request({
        url: 'http://universities.hipolabs.com/search?country=United+States',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const universities = response.body;
    const top10Universities = universities.slice(0, 10);
    const excelData = top10Universities.map(university => ({
        Name: university.name,
        Country: university.country,
        Website: university.web_pages[0],
    }));

    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(excelData);
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Top 10 Universities');
    xlsx.writeFile(workbook, 'top_10_universities.xlsx');
    console.log('Excel file created: top_10_universities.xlsx');

    generateHtmlReport(excelData);
});
