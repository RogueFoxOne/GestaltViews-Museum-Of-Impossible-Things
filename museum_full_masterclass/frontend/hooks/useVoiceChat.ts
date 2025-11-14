// hooks/useVoiceChat.ts
// Museum of Impossible Things - Voice Chat Hook
// Complete implementation with proper TypeScript types

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

interface UseVoiceChatReturn {
  // Recording properties
  isRecording: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  currentTranscript: string;
  transcript: string;
  isSupported: boolean;
  
  // Recording methods
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  startListening: () => Promise<void>;
  stopListening: () => void;
  toggleListening: () => void;
  
  // Speech synthesis
  speakText: (text: string, options?: SpeechSynthesisOptions) => void;
  stopSpeaking: () => void;
  getVoices: () => SpeechSynthesisVoice[];
}

interface SpeechSynthesisOptions {
  voice?: SpeechSynthesisVoice;
  rate?: number;
  pitch?: number;
  volume?: number;
}

export function useVoiceChat(): UseVoiceChatReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Check browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPiece = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPiece + ' ';
          } else {
            interimTranscript += transcriptPiece;
          }
        }

        setCurrentTranscript(interimTranscript);
        if (finalTranscript) {
          setTranscript(prev => prev + finalTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    // Speech synthesis setup
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const startRecording = useCallback(async () => {
    if (!recognitionRef.current || !isSupported) {
      console.error('Speech recognition not supported');
      return;
    }

    try {
      setTranscript('');
      setCurrentTranscript('');
      recognitionRef.current.start();
      setIsRecording(true);
      setIsListening(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  }, [isSupported]);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      setIsListening(false);
    }
  }, []);

  const startListening = startRecording;
  const stopListening = stopRecording;

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  const speakText = useCallback((text: string, options: SpeechSynthesisOptions = {}) => {
    if (!synthRef.current) {
      console.error('Speech synthesis not supported');
      return;
    }

    // Cancel any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    if (options.voice) utterance.voice = options.voice;
    if (options.rate) utterance.rate = options.rate;
    if (options.pitch) utterance.pitch = options.pitch;
    if (options.volume) utterance.volume = options.volume;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  }, []);

  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const getVoices = useCallback(() => {
    if (synthRef.current) {
      return synthRef.current.getVoices();
    }
    return [];
  }, []);

  return {
    isRecording,
    isListening,
    isSpeaking,
    currentTranscript,
    transcript,
    isSupported,
    startRecording,
    stopRecording,
    startListening,
    stopListening,
    toggleListening,
    speakText,
    stopSpeaking,
    getVoices,
  };
}
