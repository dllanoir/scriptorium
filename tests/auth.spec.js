const { test, expect } = require('@playwright/test');

test.describe('Authentication', () => {
  test('should login successfully', async ({ page }) => {
    await page.goto('/');

    // Wait for the landing login form to be visible
    const loginForm = page.locator('#landing-login-form');
    await expect(loginForm).toBeVisible();

    // Fill in credentials. 
    // IMPORTANT: In a real test, we should use test credentials via env vars.
    // For this example, we assume valid credentials.
    await page.locator('#landing-email').fill(process.env.TEST_EMAIL || 'test@example.com');
    await page.locator('#landing-password').fill(process.env.TEST_PASSWORD || 'password123');

    // Submit
    await loginForm.locator('button[type="submit"]').click();

    // Wait for auth to complete and UI to update
    await expect(page.locator('#app')).toBeVisible();
    await expect(page.locator('#user-email')).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    // Assuming we are already logged in or we login first
    await page.goto('/');
    
    // Fill in credentials and login
    const loginForm = page.locator('#landing-login-form');
    await loginForm.waitFor({ state: 'visible' });
    await page.locator('#landing-email').fill(process.env.TEST_EMAIL || 'test@example.com');
    await page.locator('#landing-password').fill(process.env.TEST_PASSWORD || 'password123');
    await loginForm.locator('button[type="submit"]').click();
    
    // Wait for the app to be ready
    await expect(page.locator('#auth-button')).toBeVisible();
    
    // Click logout
    await page.locator('#auth-button').click();
    
    // Expect the login form to reappear
    await expect(loginForm).toBeVisible();
  });
});
