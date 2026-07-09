// ai-teacher.js - AI Tutor Chat Room supporting simulated replies and direct Gemini API configuration

import { Translator } from './translator.js';

export class AITeacherManager {
  constructor() {
    this.geminiApiKey = localStorage.getItem('em_hub_gemini_key') || '';
    this.chatHistory = [];
  }

  init() {
    this.renderInitialState();
    
    // Bind buttons
    const sendBtn = document.getElementById('teacher-send-btn');
    const inputArea = document.getElementById('teacher-input');
    const saveKeyBtn = document.getElementById('save-gemini-key-btn');
    const apiKeyInput = document.getElementById('gemini-api-key-input');

    if (sendBtn && inputArea) {
      sendBtn.addEventListener('click', () => this.handleSendMessage(inputArea.value));
      inputArea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.handleSendMessage(inputArea.value);
        }
      });
    }

    if (apiKeyInput && saveKeyBtn) {
      apiKeyInput.value = this.geminiApiKey;
      saveKeyBtn.addEventListener('click', () => {
        const key = apiKeyInput.value.trim();
        this.geminiApiKey = key;
        localStorage.setItem('em_hub_gemini_key', key);
        alert('Gemini API Key saved successfully!');
      });
    }
  }

  renderInitialState() {
    const historyContainer = document.getElementById('teacher-chat-history');
    if (!historyContainer) return;

    historyContainer.innerHTML = '';
    this.appendChatBubble('assistant', 'Hello! I am your AI Teacher. Ask me anything about English grammar, vocabulary, spellings, or translations to Malayalam. (നിങ്ങൾക്ക് ചോദിക്കേണ്ട കാര്യങ്ങൾ താഴെ ടൈപ്പ് ചെയ്യുക)');
  }

  appendChatBubble(sender, text) {
    const historyContainer = document.getElementById('teacher-chat-history');
    if (!historyContainer) return;

    const bubbleId = 'tutor-bubble-' + Math.random().toString(36).substr(2, 9);
    const bubbleHTML = `
      <div class="chat-bubble ${sender === 'user' ? 'user' : 'bot'}" id="${bubbleId}">
        <div>${text}</div>
        ${sender === 'assistant' ? `
          <div style="margin-top: 6px; text-align: right;">
            <button class="action-btn play-tutor-btn" style="width: 24px; height: 24px; font-size: 0.75rem;" data-text="${text}">
              <i class="fas fa-volume-up"></i>
            </button>
          </div>
        ` : ''}
      </div>
    `;

    historyContainer.insertAdjacentHTML('beforeend', bubbleHTML);
    historyContainer.scrollTop = historyContainer.scrollHeight;

    if (sender === 'assistant') {
      const bubble = document.getElementById(bubbleId);
      const playBtn = bubble.querySelector('.play-tutor-btn');
      playBtn.addEventListener('click', () => {
        Translator.speak(text);
      });
    }
  }

  async handleSendMessage(text) {
    const inputArea = document.getElementById('teacher-input');
    if (!text.trim()) return;

    if (inputArea) inputArea.value = '';

    // Append user message
    this.appendChatBubble('user', text);
    this.chatHistory.push({ role: 'user', content: text });

    // Append loading bubble
    this.appendChatBubble('assistant', 'Thinking / ചിന്തിക്കുന്നു...');
    
    // Simulate API query delay
    setTimeout(async () => {
      // Remove the loading bubble (which is the last bubble in container)
      const historyContainer = document.getElementById('teacher-chat-history');
      if (historyContainer && historyContainer.lastElementChild) {
        historyContainer.lastElementChild.remove();
      }

      let reply = '';
      if (this.geminiApiKey) {
        reply = await this.queryGeminiAPI(text);
      } else {
        reply = this.generateSimulatedReply(text);
      }

      this.appendChatBubble('assistant', reply);
      this.chatHistory.push({ role: 'assistant', content: reply });
      Translator.speak(reply);
    }, 1200);
  }

  // Live Gemini API client-side query
  async queryGeminiAPI(prompt) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.geminiApiKey}`;
    
    // Format system commands inside the prompt to ensure responses include Malayalam translation tips
    const body = {
      contents: [
        {
          parts: [{
            text: `You are a helpful, professional English tutor. Explain grammar rules simply, provide correct sentence formats, and write translation helper notes in Malayalam for the user's queries. User input: "${prompt}"`
          }]
        }
      ]
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) throw new Error('API Request Failed');
      const data = await response.json();
      
      if (data.candidates && data.candidates[0].content.parts[0].text) {
        return data.candidates[0].content.parts[0].text;
      }
      return 'I received an empty response. Please review your API settings.';
    } catch (error) {
      console.error('[Gemini API] Error fetching:', error);
      return 'Failed to reach Gemini API. Please make sure your internet is working and the API key is active. (Simulated Mode: ' + this.generateSimulatedReply(prompt) + ')';
    }
  }

  // Local fallback smart tutor simulation
  generateSimulatedReply(prompt) {
    const clean = prompt.toLowerCase();

    if (clean.includes('hello') || clean.includes('hi')) {
      return 'Hello there! How can I support your English learning journey today? (ഹലോ! ഇന്ന് നിങ്ങളെ എങ്ങനെ സഹായിക്കണം?)';
    }
    if (clean.includes('tense') || clean.includes('past') || clean.includes('present')) {
      return 'Tenses tell us when an action occurs. In English, we have Present, Past, and Future. (സമയത്തെ അടിസ്ഥാനമാക്കി ക്രിയകളെ സൂചിപ്പിക്കുന്നതാണ് കാലങ്ങൾ (Tenses). പ്രധാനമായും 3 കാലങ്ങൾ ഉണ്ട് - വർത്തമാനകാലം, ഭൂതകാലം, ഭാവികാലം). Ask me to detail a specific tense!';
    }
    if (clean.includes('pronoun') || clean.includes('noun')) {
      return 'A pronoun replaces a noun, like: He, She, It, They. (നാമങ്ങൾക്ക് പകരമായി ഉപയോഗിക്കുന്ന വാക്കുകളെയാണ് Pronoun എന്ന് വിളിക്കുന്നത്. ഉദാഹരണത്തിന്: He, She, It, They).';
    }
    if (clean.includes('translate') || clean.includes('malayalam')) {
      return 'To translate sentences dynamically, click on the "Translator" tab in the navigation menu. (വാക്യങ്ങൾ എളുപ്പത്തിൽ തർജ്ജമ ചെയ്യാൻ മെനുവിലെ Translator ഓപ്ഷൻ ഉപയോഗിക്കുക.)';
    }

    return `Interesting question! English grammar follows strict Subject-Verb-Object structures. For advanced assistance on "${prompt}", save a free Google Gemini API Key in the chat settings tab.`;
  }
}

export const aiTeacher = new AITeacherManager();
