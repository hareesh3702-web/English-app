// speaking.js - Voice conversation assistant & pronunciation score checker

import { SCENARIOS } from './db.js';
import { Translator } from './translator.js';
import { dashboard } from './dashboard.js';

export class SpeakingManager {
  constructor() {
    this.recognition = null;
    this.isRecording = false;
    this.currentScenario = null;
    this.chatHistory = [];
    this.suggestedRepliesIndex = 0;
  }

  init() {
    this.setupSpeechRecognition();
    this.renderScenarioList();
    
    // Bind buttons
    const micBtn = document.getElementById('speak-mic-btn');
    const resetBtn = document.getElementById('speak-reset-btn');
    if (micBtn) micBtn.addEventListener('click', () => this.toggleSpeechRecording());
    if (resetBtn) resetBtn.addEventListener('click', () => this.resetConversation());

    // Select restaurant scenario by default
    if (SCENARIOS.length > 0) {
      this.selectScenario(SCENARIOS[0].id);
    }
  }

  setupSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('[Speaking] Web Speech Recognition is not supported in this browser.');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.lang = 'en-US';
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;

    this.recognition.onstart = () => {
      this.isRecording = true;
      this.updateMicButton();
    };

    this.recognition.onend = () => {
      this.isRecording = false;
      this.updateMicButton();
    };

    this.recognition.onerror = (event) => {
      console.error('[Speaking] Speech recognition error:', event.error);
      this.isRecording = false;
      this.updateMicButton();
      alert('Speech input error: ' + event.error);
    };

    this.recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      const confidence = event.results[0][0].confidence;
      this.handleUserSpeechInput(speechToText, confidence);
    };
  }

  renderScenarioList() {
    const container = document.getElementById('speaking-scenarios-list');
    if (!container) return;

    container.innerHTML = SCENARIOS.map(s => `
      <div class="lesson-card-item" id="scenario-tab-${s.id}" data-id="${s.id}">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div class="stat-icon" style="width:36px; height:36px; font-size:1rem; background: var(--primary-glow); color:var(--primary);">
            <i class="fas ${s.icon}"></i>
          </div>
          <div>
            <h4>${s.title}</h4>
            <p>${s.description}</p>
          </div>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.lesson-card-item').forEach(card => {
      card.addEventListener('click', () => {
        this.selectScenario(card.getAttribute('data-id'));
      });
    });
  }

  selectScenario(id) {
    const scenario = SCENARIOS.find(s => s.id === id);
    if (!scenario) return;

    this.currentScenario = scenario;
    this.chatHistory = [];
    this.suggestedRepliesIndex = 0;

    // Highlight active card
    document.querySelectorAll('#speaking-scenarios-list .lesson-card-item').forEach(c => c.classList.remove('active'));
    const activeCard = document.getElementById(`scenario-tab-${id}`);
    if (activeCard) activeCard.classList.add('active');

    // Populate bot initial response
    this.appendChatBubble('bot', scenario.starter);
    this.renderSuggestedReplies();
    this.resetStatsView();

    // Text to Speech voice play for starter
    Translator.speak(scenario.starter);
  }

  appendChatBubble(sender, text) {
    const historyContainer = document.getElementById('speaking-chat-history');
    if (!historyContainer) return;

    const bubbleId = 'bubble-' + Math.random().toString(36).substr(2, 9);
    const bubbleHTML = `
      <div class="chat-bubble ${sender}" id="${bubbleId}">
        <div>${text}</div>
        ${sender === 'bot' ? `
          <div style="margin-top: 6px; text-align: right;">
            <button class="action-btn translate-bubble-btn" style="width: 24px; height: 24px; font-size: 0.75rem;" data-text="${text}">
              <i class="fas fa-language"></i>
            </button>
            <button class="action-btn play-bubble-btn" style="width: 24px; height: 24px; font-size: 0.75rem;" data-text="${text}">
              <i class="fas fa-volume-up"></i>
            </button>
          </div>
          <div class="bubble-translation malayalam-font" style="display: none;">Translating...</div>
        ` : ''}
      </div>
    `;

    historyContainer.insertAdjacentHTML('beforeend', bubbleHTML);
    historyContainer.scrollTop = historyContainer.scrollHeight;

    // Bind triggers in the bubble
    const bubble = document.getElementById(bubbleId);
    if (sender === 'bot') {
      const transBtn = bubble.querySelector('.translate-bubble-btn');
      const playBtn = bubble.querySelector('.play-bubble-btn');
      const transText = bubble.querySelector('.bubble-translation');

      transBtn.addEventListener('click', async () => {
        if (transText.style.display === 'block') {
          transText.style.display = 'none';
          return;
        }
        transText.style.display = 'block';
        if (transText.innerText === 'Translating...') {
          const res = await Translator.translateText(text, 'en', 'ml');
          transText.innerText = res.translatedText;
        }
      });

      playBtn.addEventListener('click', () => {
        Translator.speak(text);
      });
    }
  }

  renderSuggestedReplies() {
    const listContainer = document.getElementById('speaking-suggestions');
    if (!listContainer || !this.currentScenario) return;

    const suggestions = this.currentScenario.suggestedReplies;
    listContainer.innerHTML = suggestions.map(rep => `
      <button class="btn btn-secondary speak-suggest-chip" style="padding: 6px 12px; font-size: 0.8rem; font-weight: 500;">
        ${rep}
      </button>
    `).join('');

    listContainer.querySelectorAll('.speak-suggest-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const text = chip.innerText.trim();
        this.handleUserSpeechInput(text, 0.95); // Simulated high confidence
      });
    });
  }

  toggleSpeechRecording() {
    if (!this.recognition) {
      alert('Speech Recognition is not supported by your browser. Please type or use suggestions.');
      return;
    }

    if (this.isRecording) {
      this.recognition.stop();
    } else {
      this.recognition.start();
    }
  }

  updateMicButton() {
    const micBtn = document.getElementById('speak-mic-btn');
    if (!micBtn) return;

    if (this.isRecording) {
      micBtn.classList.add('recording');
      micBtn.innerHTML = '<i class="fas fa-stop"></i>';
    } else {
      micBtn.classList.remove('recording');
      micBtn.innerHTML = '<i class="fas fa-microphone"></i>';
    }
  }

  handleUserSpeechInput(text, confidence) {
    this.appendChatBubble('user', text);
    
    // Evaluate pronunciation & confidence score
    const pronunciationScore = Math.round(confidence * 100);
    this.updateEvaluationStats(text, pronunciationScore);

    // Simulate AI response delay
    setTimeout(() => {
      this.generateTutorReply(text);
    }, 1000);
  }

  updateEvaluationStats(text, score) {
    const scoreDial = document.getElementById('speaking-accuracy-dial');
    const wordCount = document.getElementById('speaking-word-count');
    const feedbackText = document.getElementById('speaking-text-feedback');

    if (scoreDial) {
      scoreDial.style.setProperty('--score-pct', score);
      scoreDial.innerText = score + '%';
    }
    
    if (wordCount) {
      const count = text.split(/\s+/).length;
      wordCount.innerText = count + ' words';
    }

    if (feedbackText) {
      if (score >= 85) {
        feedbackText.innerText = 'Excellent pronunciation! Fluent flow.';
        feedbackText.style.color = '#10b981';
      } else if (score >= 60) {
        feedbackText.innerText = 'Good attempt. Try pronouncing vowels clearer.';
        feedbackText.style.color = '#f59e0b';
      } else {
        feedbackText.innerText = 'Needs practice. Listen to native speech pronunciation.';
        feedbackText.style.color = '#ef4444';
      }
    }

    dashboard.addSpeakingScore(score);
  }

  // Smart simulated HR/Waiter chatbot response
  generateTutorReply(userMsg) {
    let reply = '';
    const cleanMsg = userMsg.toLowerCase().trim();

    if (this.currentScenario.id === 'restaurant') {
      if (cleanMsg.includes('menu')) {
        reply = 'Of course, here is the menu. Today we have grilled steak, chicken biryani, and chocolate brownie. What would you like?';
      } else if (cleanMsg.includes('water')) {
        reply = 'Sure! Here is a cold glass of water. Are you ready to order your main meal now?';
      } else if (cleanMsg.includes('biryani') || cleanMsg.includes('chicken') || cleanMsg.includes('food')) {
        reply = 'Excellent choice! It will take about 15 minutes to cook. Would you like a beverage with that?';
      } else if (cleanMsg.includes('bill') || cleanMsg.includes('check')) {
        reply = 'No problem, I will bring the bill. How was your dining experience with us today?';
      } else {
        reply = 'Alright. Would you like anything else to drink or eat?';
      }
    } else if (this.currentScenario.id === 'interview') {
      if (cleanMsg.includes('experience') || cleanMsg.includes('developer') || cleanMsg.includes('years')) {
        reply = 'That sounds impressive. Can you describe a challenging project you successfully completed?';
      } else if (cleanMsg.includes('graduation') || cleanMsg.includes('college')) {
        reply = 'Great. Why do you want to work for our company specifically?';
      } else if (cleanMsg.includes('hard') || cleanMsg.includes('coding')) {
        reply = 'Excellent. What are your salary expectations for this position?';
      } else {
        reply = 'Thank you for sharing that. What do you consider to be your biggest strength?';
      }
    } else {
      reply = 'I understand. Please tell me more details so I can assist you better.';
    }

    this.appendChatBubble('bot', reply);
    Translator.speak(reply);
  }

  resetConversation() {
    if (this.currentScenario) {
      this.selectScenario(this.currentScenario.id);
    }
  }

  resetStatsView() {
    const scoreDial = document.getElementById('speaking-accuracy-dial');
    const wordCount = document.getElementById('speaking-word-count');
    const feedbackText = document.getElementById('speaking-text-feedback');

    if (scoreDial) {
      scoreDial.style.setProperty('--score-pct', 0);
      scoreDial.innerText = '0%';
    }
    if (wordCount) wordCount.innerText = '0 words';
    if (feedbackText) feedbackText.innerText = 'Start speaking to evaluate.';
  }
}

export const speaking = new SpeakingManager();
