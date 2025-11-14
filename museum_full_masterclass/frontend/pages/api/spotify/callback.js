/**
 * Spotify callback handler (server exchanges code for tokens)
 * Keep secrets server-side and store refresh tokens securely (Supabase or encrypted store)
 */
import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { code, state, error } = req.query;
  if (error) return res.status(400).send('Error: ' + error);
  const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI
    })
  });
  const tokenJson = await tokenRes.json();
  // Persist tokenJson.refresh_token securely (Supabase or server DB)
  res.status(200).json(tokenJson);
}
