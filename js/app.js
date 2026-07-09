// app.js - Main router, navigation manager, search controller, and core shell initializer

import { auth } from './auth.js';
import { dashboard } from './dashboard.js';
import { grammar } from './grammar.js';
import { vocabulary } from './vocabulary.js';
import { speaking } from './speaking.js';
import { corrector } from './corrector.js';
import { writing } from './writing.js';
import { games } from './games.js';
import { aiTeacher } from './ai-teacher.js';
import { admin } from './admin.js';

import { Translator } from './translator.js';
import { GRAMMAR_LESSONS, IDIOMS, PHRASAL_VERBS } from './db.js';

class AppShell {
  constructor() {
    this.currentTheme = localStorage.getItem('em_hub_theme') || 'dark';
  }

  // Core boot method
  init() {
    this.registerServiceWorker();
    this.setupTheme();
    this.setupMobileMenu();
    this.setupGlobalSearch();

    // Boot subsystems
    auth.init();
    dashboard.loadStats();
    grammar.init();
    vocabulary.init();
    speaking.init();
    corrector.init();
    writing.init();
    games.init();
    aiTeacher.init();
    admin.init();

    // Listen to Auth State Changes to update User Profile in Sidebar
    auth.onAuthStateChanged(user => this.updateUserWidget(user));

    // Handle initial routing and hook hash changes
    this.handleRoute();
    window.addEventListener('hashchange', () => this.handleRoute());

    // Bind translator interface events directly here
    this.bindTranslatorUI();
    this.renderWordOfTheDay();
  }

  // Register Service worker for PWA support
  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
          .then(reg => console.log('[PWA] Service Worker registered with scope:', reg.scope))
          .catch(err => console.warn('[PWA] Service Worker registration failed:', err));
      });
    }
  }

  // Theme loader and switcher
  setupTheme() {
    document.documentElement.setAttribute('data-theme', this.currentTheme);
    const themeBtn = document.getElementById('theme-toggle-btn');
    
    if (themeBtn) {
      const updateButtonLabel = () => {
        themeBtn.innerHTML = this.currentTheme === 'dark' 
          ? '<i class="fas fa-sun"></i> Light Mode' 
          : '<i class="fas fa-moon"></i> Dark Mode';
      };
      
      updateButtonLabel();
      
      themeBtn.addEventListener('click', () => {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('em_hub_theme', this.currentTheme);
        updateButtonLabel();
        
        // Re-draw chart on theme change to adjust text/grid colors
        dashboard.renderProgressChart();
      });
    }
  }

  // Responsive Sidebar Toggle for mobile screens
  setupMobileMenu() {
    const toggleBtn = document.getElementById('mobile-nav-toggle');
    const sidebar = document.getElementById('sidebar-menu');

    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.toggle('open');
        toggleBtn.innerHTML = sidebar.classList.contains('open') 
          ? '<i class="fas fa-times"></i>' 
          : '<i class="fas fa-bars"></i>';
      });

      // Close menu if clicking outside
      document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && e.target !== toggleBtn) {
          sidebar.classList.remove('open');
          toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
      });

      // Close sidebar when clicking any menu link
      sidebar.querySelectorAll('.nav-item a').forEach(link => {
        link.addEventListener('click', () => {
          sidebar.classList.remove('open');
          toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
        });
      });
    }
  }

  // Router listener
  handleRoute() {
    const hash = window.location.hash || '#dashboard';
    const targetSectionId = hash.substring(1) + '-section';
    const targetSection = document.getElementById(targetSectionId);

    if (targetSection) {
      // Hide all sections
      document.querySelectorAll('.app-section').forEach(sec => {
        sec.classList.remove('active');
      });

      // Show target
      targetSection.classList.add('active');

      // Highlight corresponding Nav Menu item
      document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        const link = item.querySelector('a');
        if (link && link.getAttribute('href') === hash) {
          item.classList.add('active');
        }
      });

      // Special initializers per section
      if (hash === '#dashboard') {
        dashboard.loadStats();
        dashboard.updateDashboardUI();
      } else if (hash === '#speaking') {
        speaking.resetStatsView();
      } else if (hash === '#admin') {
        admin.renderAdminData();
      }
    }
  }

  // Update user name/level card in sidebar
  updateUserWidget(user) {
    const avatarEl = document.getElementById('user-widget-avatar');
    const nameEl = document.getElementById('user-widget-name');
    const levelEl = document.getElementById('user-widget-level');

    if (user) {
      if (avatarEl) avatarEl.innerText = user.avatarChar;
      if (nameEl) nameEl.innerText = user.displayName;
      if (levelEl) {
        levelEl.innerText = user.isAnonymous ? 'Guest Mode (Level 1)' : 'Registered Learner';
      }
    }
  }

  // Translate Screen UI Event Handlers
  bindTranslatorUI() {
    const translateInput = document.getElementById('translator-input');
    const translateOutput = document.getElementById('translator-output');
    const translateBtn = document.getElementById('translator-submit-btn');
    const swapBtn = document.getElementById('translator-swap-btn');
    const manglishToggle = document.getElementById('translator-manglish-checkbox');

    const speakInputBtn = document.getElementById('translator-speak-input');
    const speakOutputBtn = document.getElementById('translator-speak-output');

    let currentSrcLang = 'en';
    let currentTargLang = 'ml';

    if (swapBtn) {
      swapBtn.addEventListener('click', () => {
        const srcLabel = document.getElementById('translator-src-label');
        const targLabel = document.getElementById('translator-targ-label');
        
        // Swap values
        const tempLang = currentSrcLang;
        currentSrcLang = currentTargLang;
        currentTargLang = tempLang;

        if (srcLabel && targLabel) {
          const tempText = srcLabel.innerText;
          srcLabel.innerText = targLabel.innerText;
          targLabel.innerText = tempText;
        }

        // Swap texts
        const tempText = translateInput.value;
        translateInput.value = translateOutput.innerText === 'Translation output will appear here...' ? '' : translateOutput.innerText;
        translateOutput.innerText = tempText || 'Translation output will appear here...';
      });
    }

    if (translateBtn && translateInput && translateOutput) {
      translateBtn.addEventListener('click', async () => {
        const text = translateInput.value.trim();
        if (!text) return;

        translateOutput.innerText = 'Translating / തർജ്ജമ ചെയ്യുന്നു...';

        // Check if Manglish checked and converting to Malayalam
        if (manglishToggle && manglishToggle.checked && currentSrcLang === 'en') {
          const result = Translator.transliterateManglish(text);
          translateOutput.innerHTML = `
            <div style="font-weight: 700; color: var(--primary); font-size:1.25rem;">${result.mal}</div>
            <div style="font-size:0.95rem; color: var(--text-secondary); margin-top: 10px; border-top: 1px dashed var(--surface-border); padding-top: 10px;">
              <strong>English:</strong> ${result.eng}
            </div>
          `;
          return;
        }

        // Fetch MyMemory API translation
        const res = await Translator.translateText(text, currentSrcLang, currentTargLang);
        translateOutput.innerText = res.translatedText;
      });
    }

    // TTS bindings
    if (speakInputBtn) {
      speakInputBtn.addEventListener('click', () => {
        if (translateInput.value.trim()) {
          Translator.speak(translateInput.value, currentSrcLang === 'en' ? 'en-US' : 'ml-IN');
        }
      });
    }

    if (speakOutputBtn) {
      speakOutputBtn.addEventListener('click', () => {
        if (translateOutput.innerText && translateOutput.innerText !== 'Translation output will appear here...') {
          Translator.speak(translateOutput.innerText, currentTargLang === 'en' ? 'en-US' : 'ml-IN');
        }
      });
    }
  }

  // Global Search bar logic
  setupGlobalSearch() {
    const searchInput = document.getElementById('global-search-input');
    
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim().toLowerCase();
        const searchSection = document.getElementById('search-results-section');
        const resultsGrid = document.getElementById('search-results-grid');

        if (!query) {
          // If query cleared, route back to last hash
          const hash = window.location.hash || '#dashboard';
          if (hash !== '#search-results') {
            this.handleRoute();
          }
          return;
        }

        // Navigate to search panel
        window.location.hash = '#search-results';
        
        // Query lessons and idioms
        const lessonMatches = GRAMMAR_LESSONS.filter(l => 
          l.title.toLowerCase().includes(query) || 
          l.subtitle.toLowerCase().includes(query)
        );

        const idiomMatches = IDIOMS.filter(id => 
          id.phrase.toLowerCase().includes(query) || 
          id.engMeaning.toLowerCase().includes(query)
        );

        if (resultsGrid) {
          if (lessonMatches.length === 0 && idiomMatches.length === 0) {
            resultsGrid.innerHTML = '<p style="color:var(--text-secondary); text-align:center; grid-column: 1/-1;">No search results matches. Try typing Nouns, Tenses, or Idioms.</p>';
            return;
          }

          let html = '';
          lessonMatches.forEach(l => {
            html += `
              <div class="glass-card" style="cursor:pointer;" onclick="location.hash='#grammar';">
                <span style="font-size:0.75rem; text-transform:uppercase; color:var(--primary); font-weight:700;">Grammar Lesson</span>
                <h4 style="margin-top:6px;">${l.title}</h4>
                <p style="font-size:0.85rem; color:var(--text-secondary); margin-top:4px;">${l.subtitle}</p>
              </div>
            `;
          });

          idiomMatches.forEach(i => {
            html += `
              <div class="glass-card">
                <span style="font-size:0.75rem; text-transform:uppercase; color:var(--secondary); font-weight:700;">Idiom / ശൈലി</span>
                <h4 style="margin-top:6px; color:var(--text-primary); font-size: 1.15rem;">"${i.phrase}"</h4>
                <p class="malayalam-font" style="font-size:0.95rem; color:var(--secondary); margin-top:4px;">അർത്ഥം: ${i.meaning}</p>
                <p style="font-size:0.85rem; color:var(--text-secondary); margin-top:4px;">Meaning: ${i.engMeaning}</p>
              </div>
            `;
          });

          resultsGrid.innerHTML = html;
        }
      });
    }
  }

  // Render Daily "Word of the Day" and Idioms in dashboard
  renderWordOfTheDay() {
    const wordTitle = document.getElementById('word-day-title');
    const wordMeaning = document.getElementById('word-day-meaning');
    const wordSentence = document.getElementById('word-day-sentence');
    
    const idiomPhrase = document.getElementById('idiom-day-phrase');
    const idiomMeaning = document.getElementById('idiom-day-meaning');

    const phrasalPhrase = document.getElementById('phrasal-day-phrase');
    const phrasalMeaning = document.getElementById('phrasal-day-meaning');

    if (wordTitle && wordMeaning && wordSentence) {
      wordTitle.innerText = 'Persist';
      wordMeaning.innerText = 'സ്ഥിരമായി തുടരുക / പിടിവാശി കാണിക്കുക';
      wordSentence.innerText = '"You must persist in your studies to master English."';
    }

    if (idiomPhrase && idiomMeaning) {
      idiomPhrase.innerText = 'Piece of cake';
      idiomMeaning.innerText = 'വളരെ എളുപ്പമുള്ള കാര്യം (Very easy task)';
    }

    if (phrasalPhrase && phrasalMeaning) {
      phrasalPhrase.innerText = 'Call off';
      phrasalMeaning.innerText = 'റദ്ദാക്കുക (Cancel)';
    }
  }
}

// Instantiate and start app shell on load
const appShell = new AppShell();
window.addEventListener('DOMContentLoaded', () => appShell.init());
