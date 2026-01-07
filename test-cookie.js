const fetch = global.fetch || require('node-fetch');

(async () => {
  try {
    const base = 'http://localhost:4000';

    // Signup (ignore errors if user exists)
    await fetch(base + '/api/v1/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test User', email: 'test@example.com', password: 'pass123', role: 'Student' }),
    }).catch(e => {});

    // Login
    const loginRes = await fetch(base + '/api/v1/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', password: 'pass123' }),
    });

    console.log('Login status:', loginRes.status);
    const setCookie = loginRes.headers.get('set-cookie');
    console.log('Set-Cookie header:', setCookie);

    // Extract cookie value
    let cookie = null;
    if (setCookie) {
      cookie = setCookie.split(';')[0]; // token=...
    }

    // Request protected route with cookie
    const testRes = await fetch(base + '/api/v1/test', {
      method: 'GET',
      headers: {
        ...(cookie ? { Cookie: cookie } : {}),
      },
    });

    console.log('Test status:', testRes.status);
    const data = await testRes.json().catch(() => ({}));
    console.log('Test response:', data);

    // Also call debug route to inspect cookies and headers
    const debugRes = await fetch(base + '/api/v1/debug', {
      method: 'GET',
      headers: {
        ...(cookie ? { Cookie: cookie } : {}),
      },
    });
    console.log('Debug status:', debugRes.status);
    console.log('Debug body:', await debugRes.json());
  } catch (err) {
    console.error('Error during test:', err);
  }
})();