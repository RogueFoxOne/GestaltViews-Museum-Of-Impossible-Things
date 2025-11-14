// frontend/components/musical-dna/SpotifyIntegration.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Music, Zap, Loader2, AlertCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import MusicalDNAProcessor, { MusicalDNAProfile } from '@/lib/musical-dna-processor';

interface SpotifyIntegrationProps {
  onAnalysisComplete: (profile: MusicalDNAProfile) => void;
}

const SpotifyIntegration: React.FC<SpotifyIntegrationProps> = ({ onAnalysisComplete }) => {
  const [status, setStatus] = useState<'idle' | 'connecting' | 'authenticating' | 'analyzing' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  const handleSpotifyConnect = useCallback(() => {
    // ... (This part is working correctly, no changes needed) ...
    setStatus('connecting');
    setError(null);
    try {
      const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
      if (!clientId) throw new Error('Spotify client ID not configured.');
      const redirectUri = `${window.location.origin}/exhibits/musical-dna/callback`;
      const scopes = 'user-read-private user-read-email user-top-read user-read-recently-played playlist-read-private user-library-read';
      const state = Math.random().toString(36).substring(7);
      localStorage.setItem('spotify_auth_state', state);
      const authUrl = `https://accounts.spotify.com/authorize?${new URLSearchParams({
        response_type: 'code',
        client_id: clientId,
        scope: scopes,
        redirect_uri: redirectUri,
        state: state,
      }).toString()}`;
      window.location.href = authUrl;
    } catch (err: any) {
      setError(err.message || 'Failed to initiate Spotify connection.');
      setStatus('error');
    }
  }, []);

  const handleSpotifyCallback = useCallback(async () => {
    const code = localStorage.getItem('spotify_auth_code');
    if (code) {
      localStorage.removeItem('spotify_auth_code');
      localStorage.removeItem('spotify_auth_state');
      
      setStatus('analyzing');
      setError(null);
      
      try {
        const redirectUri = `${window.location.origin}/exhibits/musical-dna/callback`;

        // ======================= 🔍 LOGGING EVIDENCE 🔍 =======================
        console.log("--- FRONTEND: PREPARING TO REQUEST TOKEN ---");
        console.log("Authorization Code:", code);
        console.log("Redirect URI being sent to backend:", redirectUri);
        // ====================================================================

        const apiResponse = await fetch('/api/spotify/get-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, redirect_uri: redirectUri }),
        });

        if (!apiResponse.ok) {
          // ======================= 🔍 LOGGING EVIDENCE 🔍 =======================
          // THIS IS THE MOST IMPORTANT LOG. IT WILL SHOW US THE RAW HTML ERROR.
          const errorText = await apiResponse.text();
          console.error("--- FRONTEND: FAILED API RESPONSE ---");
          console.error("Status:", apiResponse.status);
          console.error("Raw Error Response:", errorText);
          throw new Error(`The server responded with an error. Raw response: ${errorText.substring(0, 100)}...`);
          // ====================================================================
        }

        const tokenData = await apiResponse.json();
        const processor = new MusicalDNAProcessor(tokenData.access_token);
        const profile = await processor.processMusicalDNA();
        onAnalysisComplete(profile);

      } catch (err: any) {
        console.error('Musical DNA analysis error:', err);
        setError(`Analysis failed: ${err.message}`);
        setStatus('error');
      }
    }
  }, [onAnalysisComplete]);

  useEffect(() => {
    if (searchParams.get('auth') === 'success') {
      handleSpotifyCallback();
    }
  }, [searchParams, handleSpotifyCallback]);

  // ... (rest of the component's JSX is the same) ...
  return (
    <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-purple-500/30">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-purple-300">
          <Music className="h-6 w-6" />
          <span>Spotify Musical DNA Analysis</span>
        </CardTitle>
        <CardDescription className="text-slate-400">
          Connect your Spotify account to analyze your musical consciousness patterns.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="flex w-full flex-col items-center space-y-4">
          <Button
            onClick={handleSpotifyConnect}
            disabled={status !== 'idle' && status !== 'error'}
            size="lg"
            className="w-full max-w-sm bg-green-600 hover:bg-green-700 text-white font-bold"
          >
            {status === 'connecting' ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Music className="mr-2 h-5 w-5" />}
            {status === 'connecting' ? 'Redirecting...' : 'Connect to Spotify'}
          </Button>

          {status === 'analyzing' && (
            <div className="text-center text-slate-300 flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Analyzing your Musical DNA... This may take a moment.</span>
            </div>
          )}

          {status === 'error' && (
            <div className="mt-4 text-center text-red-400 bg-red-500/10 p-3 rounded-md border border-red-500/30 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-1" />
              <p className="text-left text-sm">{error}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SpotifyIntegration;
