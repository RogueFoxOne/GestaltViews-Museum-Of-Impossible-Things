// /components/VoiceInput-Universal.tsx
'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// ✅ NO GLOBAL DECLARATIONS - FIXED!

interface VoiceInputUniversalProps {
  onTranscriptReceived?: (transcript: string) => void;
  onStartListening?: () => void;
  onStopListening?: () => void;
  placeholder?: string;
  autoSubmit?: boolean;
  className?: string;
  disabled?: boolean;
  showVisualFeedback?: boolean;
}

const VoiceInputUniversal: React.FC<VoiceInputUniversalProps> = ({
  onTranscriptReceived,
  onStartListening,
  onStopListening,
  placeholder = "Click to start voice input...",
  autoSubmit = false,
  className = "",
  disabled = false,
  showVisualFeedback = true
}) => {
  // State management
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Refs - ALL USING 'any' TO AVOID CONFLICTS!
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();
  const recognitionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Check browser support
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      setIsSupported(!!SpeechRecognitionClass);
    }
  }, []);

  // Initialize audio visualization
  const initializeAudioVisualization = useCallback(async () => {
    if (!showVisualFeedback) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      audioContextRef.current = new ((window as any).AudioContext || (window as any).webkitAudioContext)();
      
      if (!audioContextRef.current) return;
      
      const source = audioContextRef.current.createMediaStreamSource(stream);
      
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);

      const updateAudioLevel = () => {
        if (analyserRef.current && isListening) {
          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
          analyserRef.current.getByteFrequencyData(dataArray);
          
          const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
          setAudioLevel(average / 255);
          
          animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
        }
      };
      
      updateAudioLevel();
    } catch (error) {
      console.error('Failed to initialize audio visualization:', error);
    }
  }, [isListening, showVisualFeedback]);

  // Cleanup audio resources
  const cleanupAudio = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    analyserRef.current = null;
    setAudioLevel(0);
  }, []);

  // Start listening
  const startListening = useCallback(() => {
    if (!isSupported || disabled || isListening) return;

    try {
      const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognitionClass();
      
      if (!recognitionRef.current) {
        throw new Error('Speech recognition not available');
      }

      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setError(null);
        setTranscript('');
        setInterimTranscript('');
        onStartListening?.();
        initializeAudioVisualization();
      };

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        let interimText = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const text = result[0].transcript;
          
          if (result.isFinal) {
            finalTranscript += text;
            setConfidence(result[0].confidence);
          } else {
            interimText += text;
          }
        }

        if (finalTranscript) {
          setTranscript(prev => prev + finalTranscript);
          setInterimTranscript('');
          
          if (autoSubmit && finalTranscript.trim()) {
            onTranscriptReceived?.(finalTranscript.trim());
            if (!recognitionRef.current?.continuous) {
              stopListening();
            }
          }
        } else {
          setInterimTranscript(interimText);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setError(event.error);
        setIsListening(false);
        cleanupAudio();
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        cleanupAudio();
        onStopListening?.();
      };

      recognitionRef.current.start();

    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      setError('Failed to start voice recognition');
      setIsListening(false);
    }
  }, [isSupported, disabled, isListening, autoSubmit, onStartListening, onStopListening, onTranscriptReceived, initializeAudioVisualization, cleanupAudio]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  // Handle manual submit
  const handleSubmit = useCallback(() => {
    if (transcript.trim()) {
      setIsProcessing(true);
      onTranscriptReceived?.(transcript.trim());
      setTranscript('');
      setInterimTranscript('');
      setTimeout(() => setIsProcessing(false), 500);
    }
  }, [transcript, onTranscriptReceived]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      cleanupAudio();
    };
  }, [cleanupAudio]);

  // Don't render if not supported
  if (!isSupported) {
    return (
      <Card className={`bg-slate-800/50 border-slate-700 ${className}`}>
        <CardContent className="pt-6">
          <p className="text-slate-400 text-center">
            Voice recognition not supported in this browser
          </p>
        </CardContent>
      </Card>
    );
  }

  const displayText = transcript + interimTranscript;
  const hasContent = displayText.trim().length > 0;

  return (
    <Card className={`bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700 ${className}`}>
      <CardContent className="pt-6">
        <div className="space-y-4">
          
          {/* Status Indicators */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {isListening && (
                <Badge className="bg-green-600/20 text-green-300 border-green-500/30">
                  <Mic className="w-3 h-3 mr-1" />
                  Listening...
                </Badge>
              )}
              
              {confidence > 0 && (
                <Badge className="bg-blue-600/20 text-blue-300 border-blue-500/30">
                  {Math.round(confidence * 100)}% confidence
                </Badge>
              )}
              
              {error && (
                <Badge className="bg-red-600/20 text-red-300 border-red-500/30">
                  Error: {error}
                </Badge>
              )}
            </div>

            {/* Audio Level Indicator */}
            {showVisualFeedback && isListening && (
              <motion.div 
                className="flex items-center space-x-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-green-400 rounded-full"
                    style={{ height: '12px' }}
                    animate={{ 
                      height: audioLevel > (i * 0.2) ? `${12 + (audioLevel * 20)}px` : '4px',
                      backgroundColor: audioLevel > (i * 0.2) ? '#22c55e' : '#64748b'
                    }}
                    transition={{ duration: 0.1 }}
                  />
                ))}
              </motion.div>
            )}
          </div>

          {/* Transcript Display */}
          <div className="min-h-[100px] p-4 bg-slate-900/50 rounded-lg border border-slate-600">
            {hasContent ? (
              <div className="text-slate-200">
                <span className="text-slate-100">{transcript}</span>
                <span className="text-slate-400 italic">{interimTranscript}</span>
                {isListening && <span className="animate-pulse">|</span>}
              </div>
            ) : (
              <p className="text-slate-500 italic">{placeholder}</p>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center space-x-3">
            <Button
              onClick={isListening ? stopListening : startListening}
              disabled={disabled}
              className={`${
                isListening 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              } transition-all duration-200`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4 mr-2" />
                  Stop
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 mr-2" />
                  Start
                </>
              )}
            </Button>

            {!autoSubmit && hasContent && (
              <Button
                onClick={handleSubmit}
                disabled={isProcessing}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                Send
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceInputUniversal;
