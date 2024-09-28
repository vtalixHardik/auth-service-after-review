const express = require('express');
const router = express.Router();
const axios = require('axios');
const jwt = require('jsonwebtoken');

const TEAM_ID = 'YOUR_TEAM_ID';
const CLIENT_ID = 'YOUR_CLIENT_ID';
const KEY_ID = 'YOUR_KEY_ID';
const PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----\\nYOUR_PRIVATE_KEY\\n-----END PRIVATE KEY-----`;

// Initiates the Apple Login flow
router.get('/', (req, res) => {
  const scope = 'email name';
  const state = 'YOUR_STATE';
  const redirectUri = 'YOUR_REDIRECT_URI';

  const authorizationUri = `https://appleid.apple.com/auth/authorize?response_type=code id_token&client_id=${CLIENT_ID}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}&response_mode=form_post`;

  res.redirect(authorizationUri);
});

// Callback URL for handling the Apple Login response, User hits this after successfully logging in Apple
router.post('/callback', async (req, res) => {
  const { code, id_token } = req.body;

  try {
    // Verify the id_token
    const applePublicKey = await axios.get(`https://appleid.apple.com/auth/keys`);
    const decoded = jwt.verify(id_token, applePublicKey.data, { algorithms: ['RS256'] });

    // Code to handle user authentication and retrieval using the decoded information

    res.redirect('/');
  } catch (error) {
    console.error('Error:', error.message);
    res.redirect('/login');
  }
});

module.exports = router;