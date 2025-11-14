/**
 * Start PKCE Authorization Code flow (client-side will redirect to this endpoint)
 */
import crypto from 'crypto';

export default async function handler(req, res) {
  const state = crypto.randomBytes(16).toString('hex');
  const codeVerifier = crypto.randomBytes(64).toString('hex');
  // NOTE: compute code_challenge = base64url(SHA256(codeVerifier)) in production and store verifier server-side
  const params = new URLSearchParams({
    client_id: process.env.SPOTIFY_CLIENT_ID,
    response_type: 'code',
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
    scope: 'playlist-read-private user-read-private',
    state
  });
  res.redirect('https://accounts.spotify.com/authorize?' + params.toString());
}
