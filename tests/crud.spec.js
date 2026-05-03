const { test, expect } = require('@playwright/test');

test.describe('CRUD Operations', () => {
  // Before each test, we need to login
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    const loginForm = page.locator('#landing-login-form');
    await loginForm.waitFor({ state: 'visible' });
    await page.locator('#landing-email').fill(process.env.TEST_EMAIL || 'test@example.com');
    await page.locator('#landing-password').fill(process.env.TEST_PASSWORD || 'password123');
    await loginForm.locator('button[type="submit"]').click();
    await expect(page.locator('#app')).toBeVisible();
  });

  test('should create a new collection', async ({ page }) => {
    // Click Add Collection
    await page.locator('#add-collection-button').click();
    
    // Wait for Modal
    const modal = page.locator('#collection-modal');
    await expect(modal).toBeVisible();
    
    // Fill form
    await page.locator('#collection-name').fill('Test Collection');
    
    // Select Icon
    await page.locator('.icon-pick[data-icon="star"]').click();
    
    // Submit
    await modal.locator('button[type="submit"]').click();
    
    // Assert modal closed
    await expect(modal).toBeHidden();
    
    // Verify collection appears in the list
    await expect(page.locator('#collections-list').getByText('Test Collection')).toBeVisible();
  });

  test('should create a new text', async ({ page }) => {
    // Click New Text
    await page.locator('#new-text-button').click();
    
    // Wait for Modal
    const modal = page.locator('#new-text-modal');
    await expect(modal).toBeVisible();
    
    // Fill form
    await modal.locator('[name="new-title"]').fill('My Test Text');
    await modal.locator('[name="new-content"]').fill('This is a test content block.');
    
    // Submit
    await modal.locator('button[type="submit"]').click();
    
    // Assert modal closed
    await expect(modal).toBeHidden();
    
    // Verify text appears in the list
    await expect(page.locator('#text-list-container').getByText('My Test Text')).toBeVisible();
  });

  test('should edit an existing text', async ({ page }) => {
    // Assuming there is at least one text to edit
    // Click edit button on the reading pane
    await page.locator('#edit-text-button').click();
    
    // Wait for Modal
    const modal = page.locator('#new-text-modal');
    await expect(modal).toBeVisible();
    
    // Modify content
    await modal.locator('[name="new-title"]').fill('Edited Title');
    
    // Submit
    await modal.locator('button[type="submit"]').click();
    
    // Assert modal closed
    await expect(modal).toBeHidden();
    
    // Verify changes
    await expect(page.locator('#text-title')).toHaveText('Edited Title');
  });
});
