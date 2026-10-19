/**
 * Supabase route mocking helper for deterministic Playwright E2E tests.
 */
async function setupSupabaseMock(page, options = {}) {
    let mockCollections = options.collections || [
        { id: 1, name: 'Geral', icon: 'folder', created_at: '2026-01-01T00:00:00Z' },
        { id: 2, name: 'Filosofia', icon: 'auto_stories', created_at: '2026-01-01T01:00:00Z' }
    ];

    let mockTexts = options.texts || [
        { id: 101, title: 'B - O Silêncio da Mente', content: 'Texto sobre meditação e silêncio no santuário.', collectionId: 1, created_at: '2026-01-01T10:00:00Z' },
        { id: 102, title: 'A - Arte da Caligrafia', content: 'Primeiro manuscrito iluminado.', collectionId: 1, created_at: '2026-01-02T10:00:00Z' },
        { id: 103, title: 'C - Tratado da Luz', content: 'Estudo sobre claridade e foco.', collectionId: 1, created_at: '2026-01-03T10:00:00Z' }
    ];

    let nextTextId = 200;
    let nextColId = 10;

    const baseCorsHeaders = {
        'access-control-allow-origin': '*',
        'access-control-allow-methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS, HEAD',
        'access-control-allow-headers': '*',
        'access-control-expose-headers': '*'
    };

    await page.route('**/auth/v1/**', async (route) => {
        const url = route.request().url();
        const method = route.request().method();

        if (method === 'OPTIONS') {
            return route.fulfill({
                status: 200,
                headers: baseCorsHeaders
            });
        }

        if (url.includes('/token') && method === 'POST') {
            const postData = route.request().postDataJSON() || {};
            const email = postData.email || 'test@example.com';
            return route.fulfill({
                status: 200,
                contentType: 'application/json',
                headers: baseCorsHeaders,
                body: JSON.stringify({
                    access_token: 'mock-access-token-123',
                    token_type: 'bearer',
                    expires_in: 3600,
                    refresh_token: 'mock-refresh-token-123',
                    user: {
                        id: 'mock-user-uuid-1234',
                        aud: 'authenticated',
                        role: 'authenticated',
                        email: email,
                        app_metadata: { provider: 'email' },
                        user_metadata: {},
                        created_at: '2026-01-01T00:00:00.000Z',
                        updated_at: '2026-01-01T00:00:00.000Z'
                    }
                })
            });
        }

        if (url.includes('/logout') && method === 'POST') {
            return route.fulfill({
                status: 200,
                contentType: 'application/json',
                headers: baseCorsHeaders,
                body: '{}'
            });
        }

        if (url.includes('/user') && method === 'GET') {
            return route.fulfill({
                status: 200,
                contentType: 'application/json',
                headers: baseCorsHeaders,
                body: JSON.stringify({
                    id: 'mock-user-uuid-1234',
                    aud: 'authenticated',
                    role: 'authenticated',
                    email: 'test@example.com',
                    app_metadata: { provider: 'email' },
                    user_metadata: {},
                    created_at: '2026-01-01T00:00:00.000Z',
                    updated_at: '2026-01-01T00:00:00.000Z'
                })
            });
        }

        return route.continue();
    });

    await page.route(/\/rest\/v1\//, async (route) => {
        try {
            const url = route.request().url();
            const method = route.request().method();
            const acceptHeader = route.request().headers()['accept'] || '';

            if (method === 'OPTIONS') {
                return route.fulfill({
                    status: 200,
                    headers: baseCorsHeaders
                });
            }

        if (url.includes('/collections')) {
            if (method === 'GET') {
                return route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    headers: baseCorsHeaders,
                    body: JSON.stringify(mockCollections)
                });
            }
            if (method === 'POST') {
                const body = route.request().postDataJSON();
                const item = Array.isArray(body) ? body[0] : body;
                const created = { id: nextColId++, ...item, created_at: new Date().toISOString() };
                mockCollections.push(created);
                const resp = acceptHeader.includes('vnd.pgrst.object+json') ? created : [created];
                return route.fulfill({
                    status: 201,
                    contentType: 'application/json',
                    headers: {
                        ...baseCorsHeaders,
                        'preference-applied': 'return=representation'
                    },
                    body: JSON.stringify(resp)
                });
            }
            if (method === 'PATCH') {
                const body = route.request().postDataJSON();
                const item = Array.isArray(body) ? body[0] : body;
                const idMatch = url.match(/id=eq\.([^&]+)/);
                const id = idMatch ? idMatch[1] : null;
                const existing = mockCollections.find(c => String(c.id) === String(id));
                const updated = existing ? Object.assign(existing, item) : item;
                const resp = acceptHeader.includes('vnd.pgrst.object+json') ? updated : [updated];
                return route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    headers: {
                        ...baseCorsHeaders,
                        'preference-applied': 'return=representation'
                    },
                    body: JSON.stringify(resp)
                });
            }
            if (method === 'DELETE') {
                const idMatch = url.match(/id=eq\.([^&]+)/);
                if (idMatch) {
                    mockCollections = mockCollections.filter(c => String(c.id) !== String(idMatch[1]));
                }
                return route.fulfill({
                    status: 204,
                    headers: baseCorsHeaders
                });
            }
        }

        if (url.includes('/texts')) {
            if (method === 'GET') {
                return route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    headers: baseCorsHeaders,
                    body: JSON.stringify(mockTexts)
                });
            }
            if (method === 'POST') {
                const body = route.request().postDataJSON();
                const item = Array.isArray(body) ? body[0] : body;
                const created = { id: nextTextId++, ...item, created_at: new Date().toISOString() };
                mockTexts.unshift(created);
                const resp = acceptHeader.includes('vnd.pgrst.object+json') ? created : [created];
                return route.fulfill({
                    status: 201,
                    contentType: 'application/json',
                    headers: {
                        ...baseCorsHeaders,
                        'preference-applied': 'return=representation'
                    },
                    body: JSON.stringify(resp)
                });
            }
            if (method === 'PATCH') {
                const body = route.request().postDataJSON();
                const item = Array.isArray(body) ? body[0] : body;
                const idMatch = url.match(/id=eq\.([^&]+)/);
                const id = idMatch ? idMatch[1] : null;
                const existing = mockTexts.find(t => String(t.id) === String(id));
                const updated = existing ? Object.assign(existing, item) : item;
                const resp = acceptHeader.includes('vnd.pgrst.object+json') ? updated : [updated];
                return route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    headers: {
                        ...baseCorsHeaders,
                        'preference-applied': 'return=representation'
                    },
                    body: JSON.stringify(resp)
                });
            }
            if (method === 'DELETE') {
                const idMatch = url.match(/id=eq\.([^&]+)/);
                if (idMatch) {
                    mockTexts = mockTexts.filter(t => String(t.id) !== String(idMatch[1]));
                }
                return route.fulfill({
                    status: 204,
                    headers: baseCorsHeaders
                });
            }
        }

            return route.continue();
        } catch (err) {
            console.error('ERROR IN MOCK REST ROUTE:', err);
            return route.abort();
        }
    });

    return {
        getCollections: () => mockCollections,
        getTexts: () => mockTexts
    };
}

module.exports = { setupSupabaseMock };
