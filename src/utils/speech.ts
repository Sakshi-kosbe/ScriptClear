export interface SpeechState {
  isSpeaking: boolean;
  activeText: string | null;
}

type SpeechCallback = (state: SpeechState) => void;

let listeners: SpeechCallback[] = [];
let currentState: SpeechState = {
  isSpeaking: false,
  activeText: null,
};

function notifyListeners() {
  listeners.forEach((cb) => cb(currentState));
}

export function subscribeSpeech(cb: SpeechCallback): () => void {
  listeners.push(cb);
  cb(currentState);
  return () => {
    listeners = listeners.filter((l) => l !== cb);
  };
}

export function speakText(text: string, lang = 'en-US'): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser.');
    return;
  }

  // Cancel any current utterance
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.88; // Gentle, distinct pacing for seniors
  utterance.pitch = 1.0;

  utterance.onstart = () => {
    currentState = { isSpeaking: true, activeText: text };
    notifyListeners();
  };

  utterance.onend = () => {
    currentState = { isSpeaking: false, activeText: null };
    notifyListeners();
  };

  utterance.onerror = (e) => {
    console.warn('Speech synthesis error:', e);
    currentState = { isSpeaking: false, activeText: null };
    notifyListeners();
  };

  window.speechSynthesis.speak(utterance);
}

export function stopSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  currentState = { isSpeaking: false, activeText: null };
  notifyListeners();
}
