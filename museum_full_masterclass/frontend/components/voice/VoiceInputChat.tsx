// /frontend/components/voice/VoiceInputChat.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { VoiceProcessor } from '@/lib/voice-processor';
import VoiceInputUniversal from '@/components/VoiceInput-Universal';

interface VoiceInputChatProps {
  onTranscriptReceived?: (transcript: string) => void;
  placeholder?: string;
  autoSubmit?: boolean;
  className?: string;
  disabled?: boolean;
  showVisualFeedback?: boolean;
}

const VoiceInputChat: React.FC<VoiceInputChatProps> = (props) => {
  return <VoiceInputUniversal {...props} />;
};

export default VoiceInputChat;
