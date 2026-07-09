// translator.js - Handles English-Malayalam translations and Manglish transliterations

// Local dictionary for Manglish transliteration and offline fallback
const MANGLISH_DICTIONARY = {
  'enikku sukham aanu': { mal: 'എനിക്ക് സുഖമാണ്', eng: 'I am fine.' },
  'enikku sugam aanu': { mal: 'എനിക്ക് സുഖമാണ്', eng: 'I am fine.' },
  'ningal evide aanu': { mal: 'നിങ്ങൾ എവിടെയാണ്?', eng: 'Where are you?' },
  'ningal evideya': { mal: 'നിങ്ങൾ എവിടെയാണ്?', eng: 'Where are you?' },
  'njan schoolil pokunnu': { mal: 'ഞാൻ സ്കൂളിൽ പോകുന്നു.', eng: 'I am going to school.' },
  'enikku vishakkunnu': { mal: 'എനിക്ക് വിശക്കുന്നു.', eng: 'I am hungry.' },
  'enthundu vishesham': { mal: 'എന്തുണ്ട് വിശേഷം?', eng: 'What is new? / How are you?' },
  'njan oonu kazhichu': { mal: 'ഞാൻ ഊണ് കഴിച്ചു.', eng: 'I had my lunch.' },
  'kazhicho': { mal: 'കഴിച്ചോ?', eng: 'Did you eat?' },
  'ethra samayam aayi': { mal: 'എത്ര സമയമായി?', eng: 'What time is it?' },
  'nanni': { mal: 'നന്ദി.', eng: 'Thank you.' },
  'poda': { mal: 'പോടാ.', eng: 'Go away.' },
  'varoo': { mal: 'വരൂ.', eng: 'Come in.' },
  'pokaam': { mal: 'പോകാം.', eng: 'Let\'s go.' }
};

// Heuristic rule-based Manglish-to-Malayalam character map for offline transliteration
const CHAR_MAP = [
  ['njan', 'ഞാൻ'],
  ['nj', 'ഞ്ഞ'],
  ['zh', 'ഴ'],
  ['th', 'ത'],
  ['ch', 'ച്ച'],
  ['sh', 'ശ'],
  ['aa', 'ാ'],
  ['ee', 'ീ'],
  ['oo', 'ൂ'],
  ['ou', 'ൗ'],
  ['ei', 'ൈ'],
  ['ae', 'േ'],
  ['u', 'ു'],
  ['i', 'ി'],
  ['a', 'അ'],
  ['e', 'എ'],
  ['o', 'ഒ'],
  ['k', 'ക'],
  ['g', 'ഗ'],
  ['j', 'ജ'],
  ['t', 'റ്റ'],
  ['d', 'ഡ'],
  ['n', 'ന'],
  ['p', 'പ'],
  ['b', 'ബ'],
  ['m', 'മ'],
  ['y', 'യ'],
  ['r', 'ര'],
  ['l', 'ല'],
  ['v', 'വ'],
  ['s', 'സ'],
  ['h', 'ഹ']
];

export class Translator {
  // Transliterate Manglish to Malayalam script
  static transliterateManglish(text) {
    const cleaned = text.trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g,"");
    
    // Check direct dictionary first
    if (MANGLISH_DICTIONARY[cleaned]) {
      return MANGLISH_DICTIONARY[cleaned];
    }

    // Otherwise, perform heuristic transliteration word by word
    const words = text.split(/\s+/);
    const convertedWords = words.map(word => {
      let temp = word.toLowerCase();
      // Apply phonetic replacement rules
      CHAR_MAP.forEach(([eng, mal]) => {
        temp = temp.replace(new RegExp(eng, 'g'), mal);
      });
      return temp;
    });

    return {
      mal: convertedWords.join(' '),
      eng: 'Transliterated text. Tap translate to fetch English translation.'
    };
  }

  // Translate text via MyMemory API
  static async translateText(text, fromLang, toLang) {
    const query = encodeURIComponent(text.trim());
    const langPair = `${fromLang}|${toLang}`;
    const apiUrl = `https://api.mymemory.translated.net/get?q=${query}&langpair=${langPair}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error('API request failed');
      const data = await response.json();
      
      if (data.responseData && data.responseData.translatedText) {
        return {
          success: true,
          translatedText: data.responseData.translatedText,
          match: data.responseData.match
        };
      } else {
        throw new Error('Invalid data format');
      }
    } catch (error) {
      console.warn('[Translator] API failed, falling back to local simulation:', error);
      return this.translateOffline(text, langPair);
    }
  }

  // Local fallback dictionary translator
  static translateOffline(text, langPair) {
    const cleanText = text.trim().toLowerCase();
    
    // Static local dictionary for offline translation
    const offlineDict = {
      'hello': 'ഹലോ',
      'how are you?': 'സുഖമാണോ?',
      'what is your name?': 'നിങ്ങളുടെ പേര് എന്താണ്?',
      'i am hungry': 'എനിക്ക് വിശക്കുന്നു',
      'thank you': 'നന്ദി',
      'where are you going?': 'നീ എങ്ങോട്ടാണ് പോകുന്നത്?',
      'ഹലോ': 'Hello',
      'സുഖമാണോ?': 'How are you?',
      'നിങ്ങളുടെ പേര് എന്താണ്?': 'What is your name?',
      'എനിക്ക് വിശക്കുന്നു': 'I am hungry',
      'നന്ദി': 'Thank you'
    };

    if (offlineDict[cleanText]) {
      return { success: true, translatedText: offlineDict[cleanText], match: 1.0 };
    }

    return {
      success: false,
      translatedText: langPair.includes('ml') 
        ? '[തർജ്ജമ പരാജയപ്പെട്ടു - ഓഫ്ലൈൻ]' 
        : '[Translation failed - Offline mode]',
      match: 0
    };
  }

  // Speech Synthesizer Playback
  static speak(text, lang = 'en-US') {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in this browser.');
      return;
    }

    // Cancel ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;

    // Fetch voices and assign
    const voices = window.speechSynthesis.getVoices();
    if (lang.startsWith('en')) {
      const preferredVoice = voices.find(v => v.lang.includes('en-US') || v.lang.includes('en-GB'));
      if (preferredVoice) utterance.voice = preferredVoice;
    } else if (lang.startsWith('ml')) {
      const preferredVoice = voices.find(v => v.lang.includes('ml-IN'));
      if (preferredVoice) utterance.voice = preferredVoice;
    }

    window.speechSynthesis.speak(utterance);
  }
}
// Trigger voice listing load (safari/chrome load voices asynchronously)
if ('speechSynthesis' in window) {
  window.speechSynthesis.getVoices();
}
