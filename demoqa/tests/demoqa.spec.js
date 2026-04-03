const { test, expect } = require('@playwright/test');

test.describe('DEMOQA Practice Form', () => {

  test('should submit the student registration form successfully', async ({ page }) => {
    await page.goto('https://demoqa.com/automation-practice-form');

    // Fill in personal info
    await page.getByPlaceholder('First Name').fill('Shane');
    await page.getByPlaceholder('Last Name').fill('Wilkey');
    await page.getByPlaceholder('name@example.com').fill('shane@example.com');
    await page.getByPlaceholder('Mobile Number').fill('5551234567');

    // Select gender
    await page.locator('label', { hasText: /^Male$/ }).click();

    // Set date of birth
    await page.locator('#dateOfBirthInput').click();
    // Month and year dropdowns appear in the calendar header
    await page.locator('.react-datepicker__month-select').selectOption('1'); // February = 1
    await page.locator('.react-datepicker__year-select').selectOption('1982');
    await page.locator('.react-datepicker__day--025:not(.react-datepicker__day--outside-month)').click();

    // Select subject
    await page.locator('#subjectsInput').fill('Math');
    await page.getByText('Maths', { exact: true }).click();

    // Select hobbies
    await page.locator('label', { hasText: 'Sports' }).click();
    await page.locator('label', { hasText: 'Reading' }).click();


    // Upload picture
    await page.locator('input[type="file"]').setInputFiles('tests/fixtures/photo.png');

    // Fill address
    await page.getByPlaceholder('Current Address').fill('123 Main St, Springfield MO');

    // Select state and city
    await page.locator('#state').click();
    await page.getByText('NCR', { exact: true }).click();
    await page.locator('#city').click();
    await page.getByText('Delhi', { exact: true }).click();

    // Submit
    await page.getByRole('button', { name: 'Submit' }).click();

    // Assertions
    await expect(page.getByRole('table')).toBeVisible();
    await expect(page.getByText('Shane Wilkey')).toBeVisible();
    await expect(page.getByText('Thanks for submitting the form')).toBeVisible();
  });

});