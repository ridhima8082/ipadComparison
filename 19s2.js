import xlsx from 'xlsx';
import { Selector } from 'testcafe';

const workbook = xlsx.readFile('./data/form_data.xlsx');
const sheet_name = workbook.SheetNames[0]; // 1st sheet in the excel file
const worksheet = workbook.Sheets[sheet_name];  // Contents in 1st sheet

const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

const formData = jsonData.slice(1).map(row => {
    return {
        FirstName: row[0],   
        LastName: row[1],    
        Email: row[2],       
        Gender: row[3],      
        Mobile: String(row[4]), 
        Hobbies: row[5],     
        FileName: row[6],   
        Subject: row[7]     
    };
});

fixture `Form Submission Tests`
    .page `https://demoqa.com/automation-practice-form`
    .skipJsErrors();

formData.forEach(data => {
    test(`Submit form with data: ${data.FirstName} ${data.LastName}`, async t => {
        console.log(data);  

        const firstNameInput = Selector('#firstName');
        const lastNameInput = Selector('#lastName');
        const emailInput = Selector('#userEmail');
        const genderRadioButton = Selector('label').withText(data.Gender);
        const mobileInput = Selector('#userNumber');
        const hobbiesCheckbox = hobby => Selector('label').withText(hobby);
        const fileUpload = Selector('#uploadPicture');
        const subjectInput = Selector('#subjectsInput');  
        const submitButton = Selector('#submit');
        const successMessage = Selector('.modal-title').withText('Thanks for submitting the form');
        const modalSelector = Selector('.modal-dialog'); 

        await t
            .typeText(firstNameInput, data.FirstName)
            .typeText(lastNameInput, data.LastName)
            .typeText(emailInput, data.Email)
            .click(genderRadioButton)
            .typeText(mobileInput, data.Mobile);

        if (data.Subject) {
            const subjects = data.Subject.split(', ');
            for (const subject of subjects) {
                await t.typeText(subjectInput, subject)
                       .pressKey('enter');  
            }
        }

        if (data.Hobbies) {
            const hobbies = data.Hobbies.split(', ');
            for (const hobby of hobbies) {
                await t
                    .expect(modalSelector.exists).notOk('Modal should not be visible before clicking')
                    .click(hobbiesCheckbox(hobby));
            }
        }

        if (data.FileName) {
            await t.setFilesToUpload(fileUpload, `./data/${data.FileName}`);
        }

        if (await modalSelector.exists) {
            await t.click(modalSelector.find('.close'));
        }

        await t
            .expect(modalSelector.exists).notOk('Modal should not be visible before submitting')
            .click(submitButton);

        await t.expect(successMessage.exists).ok();
        const timestamp = new Date().toISOString().replace(/[-:.]/g, '');

        await t.takeScreenshot({
            path: `screenshots/${data.FirstName}_${data.LastName}_${timestamp}.png`,
            fullPage: true
        });
    });
});
