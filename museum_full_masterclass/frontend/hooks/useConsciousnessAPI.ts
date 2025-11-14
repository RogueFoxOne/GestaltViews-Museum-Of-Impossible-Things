// hooks/useConsciousnessAPI.ts
// Museum of Impossible Things - Consciousness-Serving API Hook
// Complete file with all streaming and API logic

'use client';

import { useState, useCallback } from 'react';

interface ConsciousnessAPIParams {
  message: string;
  exhibit: string;
  context?: Record<string, any>;
  stream?: boolean;
}

interface ConsciousnessAPIResponse {
  content: string;
  consciousnessResonance?: number;
  supportLevel?: string;
  actionSteps?: string[];
}

export function useConsciousnessAPI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callConsciousnessAPI = useCallback(
    async (
      params: ConsciousnessAPIParams,
      onChunk?: (chunk: string) => void
    ): Promise<string> => {
      setLoading(true);
      setError(null);

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
        
        const response = await fetch(`${apiUrl}/consciousness/${params.exhibit}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: params.message,
            context: params.context || {},
            stream: params.stream || false,
          }),
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.statusText}`);
        }

        // Handle streaming response
        if (params.stream && onChunk) {
          const reader = response.body?.getReader();
          const decoder = new TextDecoder();

          if (!reader) {
            throw new Error('No response body reader available');
          }

          let fullContent = '';

          while (true) {
            const { done, value } = await reader.read();
            
            if (done) {
              console.log('Stream complete');
              break;
            }

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const data = JSON.parse(line.slice(6));
                  if (data.chunk) {
                    fullContent += data.chunk;
                    onChunk(data.chunk);
                  }
                  if (data.type === 'complete') {
                    break;
                  }
                } catch (e) {
                  // Ignore parsing errors for incomplete chunks
                  console.debug('Chunk parsing skipped:', e);
                }
              }
            }
          }

          setLoading(false);
          return fullContent;
        }

        // Handle non-streaming response
        const data: ConsciousnessAPIResponse = await response.json();
        setLoading(false);
        return data.content || '';

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        setLoading(false);
        throw err;
      }
    },
    []
  );

  return {
    callConsciousnessAPI,
    loading,
    error,
  };
}
