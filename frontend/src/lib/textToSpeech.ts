class TextToSpeechService {
  private synth: SpeechSynthesis;
  private voices: SpeechSynthesisVoice[] = [];
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    this.synth = window.speechSynthesis;
    this.loadVoices();
    
    // Load voices when they become available
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = () => this.loadVoices();
    }
  }

  private loadVoices() {
    this.voices = this.synth.getVoices();
  }

  private getPreferredVoice(): SpeechSynthesisVoice | null {
    // Try to find a female voice first (more soothing for mental health context)
    const femaleVoices = this.voices.filter(voice => 
      voice.name.toLowerCase().includes('female') || 
      voice.name.toLowerCase().includes('woman') ||
      voice.name.toLowerCase().includes('samantha') ||
      voice.name.toLowerCase().includes('karen') ||
      voice.name.toLowerCase().includes('susan')
    );

    if (femaleVoices.length > 0) {
      return femaleVoices[0];
    }

    // Fallback to English voices
    const englishVoices = this.voices.filter(voice => 
      voice.lang.startsWith('en-')
    );

    if (englishVoices.length > 0) {
      return englishVoices[0];
    }

    // Last resort - any voice
    return this.voices.length > 0 ? this.voices[0] : null;
  }

  speak(text: string, onStart?: () => void, onEnd?: () => void): Promise<void> {
    return new Promise((resolve, reject) => {
      // Stop any current speech
      this.stop();

      // Clean the text for better speech
      const cleanText = this.cleanTextForSpeech(text);
      
      if (!cleanText.trim()) {
        resolve();
        return;
      }

      this.currentUtterance = new SpeechSynthesisUtterance(cleanText);
      
      // Configure voice settings
      const preferredVoice = this.getPreferredVoice();
      if (preferredVoice) {
        this.currentUtterance.voice = preferredVoice;
      }

      // Voice settings for a calm, therapeutic tone
      this.currentUtterance.rate = 0.9; // Slightly slower for clarity
      this.currentUtterance.pitch = 1.0; // Normal pitch
      this.currentUtterance.volume = 0.8; // Slightly softer

      // Event handlers
      this.currentUtterance.onstart = () => {
        onStart?.();
      };

      this.currentUtterance.onend = () => {
        onEnd?.();
        this.currentUtterance = null;
        resolve();
      };

      this.currentUtterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        onEnd?.();
        this.currentUtterance = null;
        reject(new Error('Speech synthesis failed'));
      };

      // Start speaking
      this.synth.speak(this.currentUtterance);
    });
  }

  private cleanTextForSpeech(text: string): string {
    return text
      // Remove markdown-style formatting
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/`(.*?)`/g, '$1')
      // Remove bullet points and replace with pauses
      .replace(/^[•\-\*]\s*/gm, '. ')
      // Add pauses for better flow
      .replace(/\n\n/g, '. ')
      .replace(/\n/g, '. ')
      // Clean up multiple periods
      .replace(/\.{2,}/g, '.')
      // Remove extra whitespace
      .replace(/\s+/g, ' ')
      .trim();
  }

  stop() {
    if (this.synth.speaking) {
      this.synth.cancel();
    }
    this.currentUtterance = null;
  }

  isSpeaking(): boolean {
    return this.synth.speaking;
  }

  getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }
}

export const textToSpeechService = new TextToSpeechService();