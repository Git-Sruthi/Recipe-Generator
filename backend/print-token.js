const { GoogleAuth } = require('google-auth-library');
(async () => {
  try {
    const auth = new GoogleAuth({ scopes: ['https://www.googleapis.com/auth/cloud-platform'] });
    const client = await auth.getClient();
    const res = await client.getAccessToken();
    console.log('access token:', res);
  } catch (err) {
    console.error('error getting token:', err.message || err);
  }
})();