'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle, AlertCircle, Music, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Separate component to handle the callback logic with useSearchParams
function CallbackHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing Spotify authorization...');

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const state = searchParams.get('state');

    if (error) {
      setStatus('error');
      setMessage(`Authorization failed: ${error}`);
      return;
    }

    if (!code) {
      setStatus('error');
      setMessage('No authorization code received from Spotify');
      return;
    }

    // Store the authorization code for the Musical DNA page to use
    try {
      localStorage.setItem('spotify_auth_code', code);
      localStorage.setItem('spotify_auth_state', state || '');
      
      setStatus('success');
      setMessage('Spotify authorization successful! Redirecting to Musical DNA analysis...');
      
      // Redirect back to Musical DNA page after 3 seconds
      setTimeout(() => {
        router.push('/exhibits/musical-dna?auth=success');
      }, 3000);

    } catch (error) {
      console.error('Failed to process Spotify callback:', error);
      setStatus('error');
      setMessage('Failed to process authorization. Please try again.');
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full"
      >
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-purple-500/30 backdrop-blur-sm">
          <CardHeader className="text-center">
            <motion.div
              animate={{ rotate: status === 'loading' ? 360 : 0 }}
              transition={{ duration: 2, repeat: status === 'loading' ? Infinity : 0, ease: "linear" }}
              className="mx-auto mb-4"
            >
              {status === 'loading' && <Loader2 className="w-16 h-16 text-purple-400" />}
              {status === 'success' && <CheckCircle className="w-16 h-16 text-green-400" />}
              {status === 'error' && <AlertCircle className="w-16 h-16 text-red-400" />}
            </motion.div>
            
            <CardTitle className="text-2xl font-bold text-white mb-2">
              {status === 'loading' && 'Processing Authorization'}
              {status === 'success' && 'Authorization Successful!'}
              {status === 'error' && 'Authorization Failed'}
            </CardTitle>
            
            <CardDescription className="text-slate-400">
              Spotify Musical DNA Integration
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-slate-300 mb-4">{message}</p>
              
              {status === 'loading' && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 3, ease: "easeInOut" }}
                  className="h-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full overflow-hidden"
                >
                  <motion.div
                    animate={{ x: ['0%', '100%'] }}
                    transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                    className="h-full w-1/3 bg-white/30 rounded-full"
                  />
                </motion.div>
              )}
              
              {status === 'success' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-green-600/20 border border-green-500/30 rounded-lg p-4"
                >
                  <Music className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-green-300 font-medium">
                    Your musical consciousness awaits analysis!
                  </p>
                </motion.div>
              )}
              
              {status === 'error' && (
                <div className="space-y-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-red-600/20 border border-red-500/30 rounded-lg p-4"
                  >
                    <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                    <p className="text-red-300 font-medium">
                      Something went wrong during authorization
                    </p>
                  </motion.div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link href="/exhibits/musical-dna" className="flex-1">
                      <Button 
                        variant="outline" 
                        className="w-full border-purple-500/50 text-purple-300 hover:bg-purple-500/10"
                      >
                        Try Again
                      </Button>
                    </Link>
                    
                    <Link href="/exhibits" className="flex-1">
                      <Button 
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      >
                        Back to Exhibits
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Background Effects */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
      </motion.div>
    </div>
  );
}

// Main component with Suspense boundary
export default function SpotifyCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-300 text-lg">Loading Spotify callback...</p>
        </div>
      </div>
    }>
      <CallbackHandler />
    </Suspense>
  );
}
