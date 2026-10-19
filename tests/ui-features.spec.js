const { test, expect } = require('@playwright/test');
const { setupSupabaseMock } = require('./mocks/supabaseMock');

// Helper to log in a mock user through the UI
async function loginTestUser(page, email = 'monk@scriptorium.io') {
    await setupSupabaseMock(page);
    await page.goto('/');
    const loginForm = page.locator('#landing-login-form');
    await loginForm.waitFor({ state: 'visible' });
    await page.locator('#landing-email').fill(email);
    await page.locator('#landing-password').fill('securepassword123');
    await page.locator('#landing-submit-btn').click();
    await expect(page.locator('#app')).toBeVisible();
    await expect(page.locator('#auth-button')).toBeVisible();
}

test.describe('Landing Page - Screen Proportions & Anti-Cutoff', () => {
    const resolutions = [
        { width: 1280, height: 600, name: '1280x600 (1080p 150% scaling)' },
        { width: 1092, height: 614, name: '1092x614 (1366x768 125% scaling)' },
        { width: 1366, height: 768, name: '1366x768 (Standard HD)' },
        { width: 375, height: 667, name: '375x667 (Mobile iPhone SE)' },
    ];

    for (const res of resolutions) {
        test(`should display all landing elements without cutoff at ${res.name}`, async ({ page }) => {
            await page.setViewportSize({ width: res.width, height: res.height });
            await page.goto('/');

            const landingTitle = page.getByRole('heading', { name: 'SCRIPTORIUM' });
            await expect(landingTitle).toBeVisible();

            const emailInput = page.locator('#landing-email');
            await expect(emailInput).toBeVisible();

            const passwordInput = page.locator('#landing-password');
            await expect(passwordInput).toBeVisible();

            const toggleBtn = page.locator('#toggle-landing-password');
            await expect(toggleBtn).toBeVisible();

            const submitBtn = page.locator('#landing-submit-btn');
            await expect(submitBtn).toBeVisible();
            await expect(submitBtn).toBeEnabled();

            // Ensure button can be scrolled into view and clicked without being cut off
            await submitBtn.scrollIntoViewIfNeeded();
            await expect(submitBtn).toBeInViewport();

            // Check that bounding box has positive dimensions and fits within the viewport width
            const box = await submitBtn.boundingBox();
            expect(box).not.toBeNull();
            expect(box.width).toBeGreaterThan(100);
            expect(box.height).toBeGreaterThan(30);
            expect(box.x + box.width).toBeLessThanOrEqual(res.width);
        });
    }
});

test.describe('Landing Page - Password Visibility Toggle', () => {
    test('should toggle password visibility on clicking #toggle-landing-password', async ({ page }) => {
        await page.goto('/');

        const passwordInput = page.locator('#landing-password');
        const toggleBtn = page.locator('#toggle-landing-password');

        await expect(passwordInput).toHaveAttribute('type', 'password');

        // Click toggle to reveal password
        await toggleBtn.click();
        await expect(passwordInput).toHaveAttribute('type', 'text');

        // Click toggle again to hide password
        await toggleBtn.click();
        await expect(passwordInput).toHaveAttribute('type', 'password');
    });
});

test.describe('Application Features - Focus / Zen Mode', () => {
    test('should toggle Zen Mode via button click and Alt+Z shortcut', async ({ page }) => {
        // Desktop viewport to test lg:hidden classes
        await page.setViewportSize({ width: 1280, height: 800 });
        await loginTestUser(page);

        const zenBtn = page.locator('#zen-mode-toggle');
        const sidebar = page.locator('#sidebar');
        const textList = page.locator('#text-list-section');

        await expect(zenBtn).toBeVisible();
        await expect(sidebar).not.toHaveClass(/lg:hidden/);
        await expect(textList).not.toHaveClass(/lg:hidden/);

        // 1. Activate Zen Mode via button click
        await zenBtn.click();
        await expect(zenBtn).toHaveAttribute('aria-pressed', 'true');
        await expect(sidebar).toHaveClass(/lg:hidden/);
        await expect(textList).toHaveClass(/lg:hidden/);

        // 2. Deactivate Zen Mode via Alt+Z shortcut
        await page.keyboard.press('Alt+z');
        await expect(zenBtn).toHaveAttribute('aria-pressed', 'false');
        await expect(sidebar).not.toHaveClass(/lg:hidden/);
        await expect(textList).not.toHaveClass(/lg:hidden/);

        // 3. Reactivate Zen Mode via Alt+Z shortcut
        await page.keyboard.press('Alt+z');
        await expect(zenBtn).toHaveAttribute('aria-pressed', 'true');
        await expect(sidebar).toHaveClass(/lg:hidden/);

        // 4. Deactivate Zen Mode via Escape key
        await page.keyboard.press('Escape');
        await expect(zenBtn).toHaveAttribute('aria-pressed', 'false');
        await expect(sidebar).not.toHaveClass(/lg:hidden/);
    });
});

test.describe('Application Features - Text Creation, Markdown Toolbar, Metrics & Draft', () => {
    test('should apply markdown bold formatting, update metrics, and auto-save draft to localStorage', async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 800 });
        await loginTestUser(page);

        // Open new text modal
        await page.locator('#new-text-button').click();
        const modal = page.locator('#new-text-modal');
        await expect(modal).toBeVisible();

        const titleInput = modal.locator('[name="new-title"]');
        const contentTextarea = modal.locator('[name="new-content"]');
        const metrics = page.locator('#editor-metrics');
        const draftStatus = page.locator('#draft-status');

        // Check initial metrics
        await expect(metrics).toContainText('0 palavras');

        // Fill Title
        await titleInput.fill('Manuscrito da Iluminação');

        // Type text into content
        await contentTextarea.fill('Palavra um dois três quatro cinco');
        await expect(metrics).toContainText('6 palavras');

        // Use Markdown toolbar: click Bold button
        const boldBtn = page.locator('#markdown-toolbar [data-md="bold"]');
        await expect(boldBtn).toBeVisible();
        await boldBtn.click();

        // Expect bold syntax to be appended/inserted
        const contentVal = await contentTextarea.inputValue();
        expect(contentVal).toContain('**texto**');

        // Expect draft status to show saved locally
        await expect(draftStatus).toBeVisible();
        await expect(draftStatus).toContainText('Rascunho salvo localmente');

        // Verify draft in localStorage
        const savedDraft = await page.evaluate(() => localStorage.getItem('scriptorium_draft_text'));
        expect(savedDraft).not.toBeNull();
        const parsed = JSON.parse(savedDraft);
        expect(parsed.title).toBe('Manuscrito da Iluminação');
        expect(parsed.content).toContain('**texto**');
    });
});

test.describe('Application Features - Text Ordering / Sorting', () => {
    test('should sort texts correctly using #sort-texts-select', async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 800 });
        await setupSupabaseMock(page, {
            texts: [
                { id: 101, title: 'B - Meditação Noturna', content: 'Conteúdo B', collectionId: 1, created_at: '2026-01-01T10:00:00Z' },
                { id: 102, title: 'A - Alvorecer do Pensamento', content: 'Conteúdo A', collectionId: 1, created_at: '2026-01-02T10:00:00Z' },
                { id: 103, title: 'C - Claridade Solene', content: 'Conteúdo C', collectionId: 1, created_at: '2026-01-03T10:00:00Z' }
            ]
        });
        await page.goto('/');
        await page.locator('#landing-email').fill('monk@scriptorium.io');
        await page.locator('#landing-password').fill('pass123');
        await page.locator('#landing-submit-btn').click();
        await expect(page.locator('#app')).toBeVisible();

        const sortSelect = page.locator('#sort-texts-select');
        await expect(sortSelect).toBeVisible();

        // 1. Sort by A-Z (alpha_asc)
        await sortSelect.selectOption('alpha_asc');
        const textTitlesAsc = page.locator('#text-list-container .font-headline');
        await expect(textTitlesAsc.first()).toContainText('A - Alvorecer do Pensamento');

        // 2. Sort by Z-A (alpha_desc)
        await sortSelect.selectOption('alpha_desc');
        const textTitlesDesc = page.locator('#text-list-container .font-headline');
        await expect(textTitlesDesc.first()).toContainText('C - Claridade Solene');

        // 3. Sort by Newest (newest)
        await sortSelect.selectOption('newest');
        const textTitlesNewest = page.locator('#text-list-container .font-headline');
        await expect(textTitlesNewest.first()).toContainText('C - Claridade Solene');

        // 4. Sort by Oldest (oldest)
        await sortSelect.selectOption('oldest');
        const textTitlesOldest = page.locator('#text-list-container .font-headline');
        await expect(textTitlesOldest.first()).toContainText('B - Meditação Noturna');
    });
});

test.describe('Application Features - Modals & Keyboard Shortcuts', () => {
    test('should open help modal, verify shortcuts display, and close with Escape', async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 800 });
        await loginTestUser(page);

        const helpBtn = page.locator('#help-button');
        const helpModal = page.locator('#help-modal');

        // Open Help modal
        await helpBtn.click();
        await expect(helpModal).toBeVisible();

        // Verify keyboard shortcuts list inside Help modal
        await expect(helpModal).toContainText('Atalhos de Teclado');
        await expect(helpModal).toContainText('Esc');
        await expect(helpModal).toContainText('Alt + N');
        await expect(helpModal).toContainText('Alt + Z');
        await expect(helpModal).toContainText('Ctrl + S');

        // Close via Escape key
        await page.keyboard.press('Escape');
        await expect(helpModal).toBeHidden();
    });

    test('should open new text modal with Alt+N and close with Escape', async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 800 });
        await loginTestUser(page);

        const textModal = page.locator('#new-text-modal');

        // Open via Alt+N
        await page.keyboard.press('Alt+n');
        await expect(textModal).toBeVisible();

        // Close via Escape key
        await page.keyboard.press('Escape');
        await expect(textModal).toBeHidden();
    });
});
