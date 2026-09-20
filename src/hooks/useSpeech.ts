import { useState, useEffect, useCallback } from 'react';
import { subscribeSpeech, speakText as speakUtil, stopSpeech as stopUtil } from '../utils/speech';

export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeSpeech((state) => {
      setIsSpeaking(state.isSpeaking);
    });
    return () => unsubscribe();
  }, []);

  const speak = useCallback((text: string) => {
    speakUtil(text);
  }, []);

  const stop = useCallback(() => {
    stopUtil();
  }, []);

  return { isSpeaking, speak, stop };
}
