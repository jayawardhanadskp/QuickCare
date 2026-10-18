// Small helper for the PayPal REST API (sandbox by default)
const BASE = process.env.PAYPAL_API || 'https://api-m.sandbox.paypal.com';

// PayPal does not support LKR, so fees are charged in USD
const toUsd = (lkr) => Math.max(0.01, lkr / (Number(process.env.LKR_PER_USD) || 300)).toFixed(2);

// Ask PayPal for a short lived access token
const getToken = async () => {
  const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64');
  const res = await fetch(`${BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials',
  });
  const data = await res.json();
  if (!res.ok) throw new Error('PayPal login failed. Check PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET');
  return data.access_token;
};

// Call a PayPal endpoint with the token
const paypalRequest = async (path, body) => {
  const token = await getToken();
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'PayPal request failed');
  return data;
};

module.exports = { toUsd, paypalRequest };
