const { GoogleAuth } = require('google-auth-library');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
(async () => {
  try {
    const auth = new GoogleAuth({ scopes: ['https://www.googleapis.com/auth/cloud-platform'] });
    const client = await auth.getClient();
    const res = await client.getAccessToken();
    const token = (res && res.token) ? res.token : res;
    if (!token) return console.error('No token obtained');
    // Query Google's tokeninfo endpoint
    const resp = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`);
    const info = await resp.json();
    // Show only useful fields
    const output = {
      scope: info.scope,
      expires_in: info.exp,
      audience: info.aud,
      issued_to: info.issued_to || info.aud,
    };
    console.log('Token info:', output);
  } catch (err) {
    console.error('Error inspecting token:', err.message || err);
  }
})();