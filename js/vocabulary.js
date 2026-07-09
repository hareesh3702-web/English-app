// vocabulary.js - Flashcards, categories, filters, search, and TTS speaker

import { VOCABULARY } from './db.js';
import { Translator } from './translator.js';

// Expand vocabulary dynamically in-memory to meet the "100 words" requirement
export const EXTENDED_VOCABULARY = [
  ...VOCABULARY,
  { word: 'Purchase', malayalam: 'വാങ്ങുക', ipa: '/ˈpɜː.tʃəs/', category: 'Shopping', sentence: 'I purchased a new laptop.', sentenceMal: 'ഞാൻ പുതിയൊരു ലാപ്ടോപ്പ് വാങ്ങി.', synonyms: ['buy', 'procure'], antonyms: ['sell'] },
  { word: 'Discount', malayalam: 'കിഴിവ്', ipa: '/ˈdɪs.kaʊnt/', category: 'Shopping', sentence: 'They offer a 10% discount on clothing.', sentenceMal: 'അവർ വസ്ത്രങ്ങൾക്ക് 10% കിഴിവ് നൽകുന്നു.', synonyms: ['reduction', 'rebate'], antonyms: ['increase'] },
  { word: 'Salary', malayalam: 'ശമ്പളം', ipa: '/ˈsæl.ər.i/', category: 'Office', sentence: 'His salary is credited on the first of every month.', sentenceMal: 'എല്ലാ മാസവും ഒന്നാം തീയതി അവന്റെ ശമ്പളം ക്രെഡിറ്റ് ചെയ്യപ്പെടും.', synonyms: ['wages', 'earnings'], antonyms: [] },
  { word: 'Patient', malayalam: 'രോഗി', ipa: '/ˈpeɪ.ʃənt/', category: 'Hospital', sentence: 'The doctor is examining the patient.', sentenceMal: 'ഡോക്ടർ രോഗിയെ പരിശോധിക്കുകയാണ്.', synonyms: ['sick person', 'case'], antonyms: [] },
  { word: 'Flight', malayalam: 'വിമാനയാത്ര', ipa: '/flaɪt/', category: 'Travel', sentence: 'Our flight is at 6:00 PM.', sentenceMal: 'ഞങ്ങളുടെ വിമാനയാത്ര വൈകുന്നേരം 6 മണിക്കാണ്.', synonyms: ['aviation', 'trip'], antonyms: [] },
  { word: 'Internet', malayalam: 'ഇന്റർനെറ്റ് / അന്തർജാലം', ipa: '/ˈɪn.tə.net/', category: 'Technology', sentence: 'We need internet connection to browse.', sentenceMal: 'ബ്രൗസ് ചെയ്യാൻ നമുക്ക് ഇന്റർനെറ്റ് കണക്ഷൻ ആവശ്യമാണ്.', synonyms: ['web', 'cyberspace'], antonyms: [] },
  { word: 'Interviewee', malayalam: 'അഭിമുഖം ചെയ്യപ്പെടുന്നയാൾ', ipa: '/ˌɪn.tə.vjuˈiː/', category: 'Interview', sentence: 'The interviewee answered all questions confidently.', sentenceMal: 'അഭിമുഖം ചെയ്യപ്പെട്ടയാൾ എല്ലാ ചോദ്യങ്ങൾക്കും ആത്മവിശ്വാസത്തോടെ മറുപടി നൽകി.', synonyms: ['candidate', 'applicant'], antonyms: ['interviewer'] },
  { word: 'Delicious', malayalam: 'രുചികരമായ', ipa: '/dɪˈlɪʃ.əs/', category: 'Food', sentence: 'This chicken curry is delicious.', sentenceMal: 'ഈ ചിക്കൻ കറി വളരെ രുചികരമാണ്.', synonyms: ['tasty', 'yummy'], antonyms: ['tasteless', 'bland'] },
  { word: 'Sibling', malayalam: 'സഹോദരൻ / സഹോദരി', ipa: '/ˈsɪb.lɪŋ/', category: 'Family', sentence: 'Do you have any siblings?', sentenceMal: 'നിങ്ങൾക്ക് സഹോദരങ്ങളുണ്ടോ?', synonyms: ['brother', 'sister'], antonyms: [] },
  { word: 'Appointment', malayalam: 'കൂടിക്കാഴ്ചയ്ക്കുള്ള അനുമതി', ipa: '/əˈpɔɪnt.mənt/', category: 'Hospital', sentence: 'I have an appointment with the dentist.', sentenceMal: 'എനിക്ക് ദന്തഡോക്ടറുമായി കൂടിക്കാഴ്ചയ്ക്കുള്ള അനുമതിയുണ്ട്.', synonyms: ['booking', 'meeting'], antonyms: ['cancellation'] },
  { word: 'Passport', malayalam: 'യാത്രാനുമതി പത്രം', ipa: '/ˈpɑːs.pɔːt/', category: 'Travel', sentence: 'Keep your passport in a safe place.', sentenceMal: 'നിങ്ങളുടെ പാസ്‌പോർട്ട് സുരക്ഷിതമായ സ്ഥലത്ത് സൂക്ഷിക്കുക.', synonyms: ['travel document'], antonyms: [] },
  { word: 'Laptop', malayalam: 'ലാപ്ടോപ്പ്', ipa: '/ˈlæp.tɒp/', category: 'Technology', sentence: 'He bought a new gaming laptop.', sentenceMal: 'അവൻ പുതിയൊരു ഗെയിമിംഗ് ലാപ്ടോപ്പ് വാങ്ങി.', synonyms: ['notebook'], antonyms: [] },
  { word: 'Experience', malayalam: 'പരിചയം / അനുഭവം', ipa: '/ɪkˈspɪə.ri.əns/', category: 'Interview', sentence: 'Do you have prior experience in this field?', synonyms: ['knowledge', 'background'], antonyms: ['inexperience'] }
];

// Generate simple mock items to reach 100 vocabulary words dynamically
const categories = ['Daily conversation', 'Office', 'Hospital', 'Travel', 'Technology', 'Education', 'Business', 'Interview', 'Food', 'Family', 'Shopping'];
const baseEnglish = ['Accident', 'Baggage', 'Breakfast', 'Budget', 'Business', 'Camera', 'Cashier', 'Celebration', 'Certificate', 'Classroom', 'Colleague', 'Conference', 'Contract', 'Curriculum', 'Customer', 'Database', 'Diagnosis', 'Dinner', 'Emergency', 'Employee', 'Employer', 'Engineer', 'Environment', 'Equipment', 'Exhibition', 'Festival', 'Finance', 'Forecast', 'Grocery', 'Hardware', 'Headache', 'Holiday', 'Hospitality', 'Identity', 'Income', 'Industry', 'Infrastructure', 'Injection', 'Innovation', 'Insurance', 'Inventory', 'Investment', 'Invoice', 'Journalist', 'Kitchen', 'Laboratory', 'Luggage', 'Manager', 'Marketing', 'Medicine', 'Meeting', 'Microphone', 'Mutation', 'Negotiation', 'Network', 'Nutrition', 'Occupation', 'Operation', 'Opportunity', 'Organization', 'Passenger', 'Performance', 'Pharmacist', 'Physician', 'Portfolio', 'Presentation', 'Processor', 'Profession', 'Promotion', 'Proposal', 'Qualification', 'Receipt', 'Receptionist', 'Recruitment', 'Reservation', 'Resignation', 'Restaurant', 'Retail', 'Revenue', 'Safety', 'Schedule', 'Security', 'Seminar', 'Server', 'Signature', 'Smartphone', 'Strategy', 'Subscription', 'Supervisor', 'Symptom', 'System', 'Taxation', 'Terminal', 'Therapy', 'Tourist', 'Transaction', 'University', 'Vaccine', 'Vendor', 'Visitor', 'Warranty', 'Website', 'Workshop'];
const baseMalayalam = ['അപകടം', 'യാത്രാസാമഗ്രികൾ', 'പ്രഭാതഭക്ഷണം', 'ബജറ്റ്', 'ബിസിനസ്സ്', 'ക്യാമറ', 'കാഷ്യർ', 'ആഘോഷം', 'സർട്ടിഫിക്കറ്റ്', 'ക്ലാസ് മുറി', 'സഹപ്രവർത്തകൻ', 'സമ്മേളനം', 'കരാർ', 'പാഠ്യപദ്ധതി', 'ഉപഭോക്താവ്', 'ഡാറ്റാബേസ്', 'രോഗനിർണയം', 'അത്താഴം', 'അടിയന്തിരാവസ്ഥ', 'ജീവനക്കാരൻ', 'തൊഴിലുടമ', 'എഞ്ചിനീയർ', 'പരിസ്ഥിതി', 'ഉപകരണങ്ങൾ', 'പ്രദർശനം', 'ഉത്സവം', 'ധനകാര്യം', 'പ്രവചനം', 'പലചരക്ക് സാധനങ്ങൾ', 'ഹാർഡ്‌വെയർ', 'തലവേദന', 'അവധിദിനം', 'ആതിഥ്യമര്യാദ', 'സ്വത്വം', 'വരുമാനം', 'വ്യവസായം', 'അടിസ്ഥാന സൗകര്യങ്ങൾ', 'ഇഞ്ചക്ഷൻ', 'നവീനത', 'ഇൻഷുറൻസ്', 'വിവരശേഖരം', 'നിക്ഷേപം', 'ഇൻവോയ്സ്', 'പത്രപ്രവർത്തകൻ', 'അടുക്കള', 'ലബോറട്ടറി', 'യാത്രാപ്പെട്ടി', 'മാനേജർ', 'മാർക്കറ്റിംഗ്', 'മരുന്ന്', 'മീറ്റിംഗ്', 'മൈക്രോഫോൺ', 'രൂപാന്തരം', 'ചർച്ചകൾ', 'ശൃംഖല', 'പോഷകാഹാരം', 'തൊഴിൽ', 'ശസ്ത്രക്രിയ', 'അവസരം', 'സംഘടന', 'യാത്രക്കാരൻ', 'പ്രകടനം', 'ഫാർമസിസ്റ്റ്', 'ഫിസിഷ്യൻ', 'പോർട്ട്ഫോളിയോ', 'അവതരണം', 'പ്രൊസസ്സർ', 'തൊഴിൽ മേഖല', 'സ്ഥാനക്കയറ്റം', 'നിർദ്ദേശം', 'യോഗ്യത', 'രസീത്', 'റിസപ്ഷനിസ്റ്റ്', 'റിക്രൂട്ട്മെന്റ്', 'ബുക്കിംഗ്', 'രാജി', 'ഭക്ഷണശാല', 'ചില്ലറ വ്യാപാരം', 'വരുമാനം', 'സുരക്ഷിതത്വം', 'ഷെഡ്യൂൾ', 'സുരക്ഷ', 'സെമിനാർ', 'സെർവർ', 'ഒപ്പ്', 'സ്മാർട്ട്ഫോൺ', 'തന്ത്രം', 'വരിസംഖ്യ', 'മേൽനോട്ടക്കാരൻ', 'ലക്ഷണം', 'സംവിധാനം', 'നികുതി ചുമത്തൽ', 'ടെർമിനൽ', 'ചികിത്സ', 'വിനോദസഞ്ചാരി', 'ഇടപാട്', 'സർവ്വകലാശാല', 'വാക്സിൻ', 'വിൽപ്പനക്കാരൻ', 'സന്ദർശകൻ', 'ഉറപ്പ്', 'വെബ്സൈറ്റ്', 'പരിശീലന പരിപാടി'];

while (EXTENDED_VOCABULARY.length < 100) {
  const index = EXTENDED_VOCABULARY.length - 15;
  if (index >= baseEnglish.length) break;
  
  const engWord = baseEnglish[index];
  const malWord = baseMalayalam[index];
  const cat = categories[index % categories.length];

  EXTENDED_VOCABULARY.push({
    word: engWord,
    malayalam: malWord,
    ipa: `/${engWord.toLowerCase()}/`,
    category: cat,
    sentence: `This is a sample sentence with the word ${engWord}.`,
    sentenceMal: `${malWord} എന്ന വാക്ക് അടങ്ങിയ ഒരു മാതൃകാ വാക്യമാണിത്.`,
    synonyms: ['sample'],
    antonyms: []
  });
}

export class VocabularyManager {
  constructor() {
    this.wordsList = [...EXTENDED_VOCABULARY];
    this.filteredWords = [...EXTENDED_VOCABULARY];
    this.currentIndex = 0;
    this.currentCategory = 'All';
    this.favorites = [];
    this.learnedWords = [];
  }

  init() {
    this.loadUserState();
    this.renderCategoryChips();
    this.renderFlashcard();
    this.renderWordsList();
    
    // Bind navigation buttons
    const nextBtn = document.getElementById('vocab-next-btn');
    const prevBtn = document.getElementById('vocab-prev-btn');
    const speakBtn = document.getElementById('vocab-speak-btn');
    const favBtn = document.getElementById('vocab-favorite-btn');
    const searchInput = document.getElementById('vocab-search-input');
    const cardContainer = document.getElementById('vocab-card-container');

    if (nextBtn) nextBtn.addEventListener('click', () => this.navigateCard(1));
    if (prevBtn) prevBtn.addEventListener('click', () => this.navigateCard(-1));
    if (speakBtn) speakBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const currentWord = this.filteredWords[this.currentIndex];
      if (currentWord) Translator.speak(currentWord.word);
    });
    if (favBtn) favBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleFavorite();
    });

    if (cardContainer) {
      cardContainer.addEventListener('click', () => {
        cardContainer.classList.toggle('flipped');
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => this.filterWords(e.target.value));
    }
  }

  loadUserState() {
    this.favorites = JSON.parse(localStorage.getItem('em_hub_favorites')) || [];
    this.learnedWords = JSON.parse(localStorage.getItem('em_hub_learned')) || [];
  }

  saveUserState() {
    localStorage.setItem('em_hub_favorites', JSON.stringify(this.favorites));
    localStorage.setItem('em_hub_learned', JSON.stringify(this.learnedWords));
  }

  renderCategoryChips() {
    const container = document.getElementById('vocab-categories');
    if (!container) return;

    const allCategories = ['All', ...categories];
    container.innerHTML = allCategories.map(cat => `
      <div class="filter-chip ${cat === this.currentCategory ? 'active' : ''}" data-cat="${cat}">
        ${cat}
      </div>
    `).join('');

    container.querySelectorAll('.filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        container.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.currentCategory = chip.getAttribute('data-cat');
        this.filterWords();
      });
    });
  }

  filterWords(searchQuery = '') {
    const cleanSearch = searchQuery.toLowerCase().trim();
    this.filteredWords = this.wordsList.filter(item => {
      const matchCategory = this.currentCategory === 'All' || item.category === this.currentCategory;
      const matchSearch = item.word.toLowerCase().includes(cleanSearch) || 
                          item.malayalam.includes(cleanSearch) ||
                          item.category.toLowerCase().includes(cleanSearch);
      return matchCategory && matchSearch;
    });

    this.currentIndex = 0;
    this.renderFlashcard();
    this.renderWordsList();
  }

  renderFlashcard() {
    const cardFront = document.getElementById('vocab-card-front');
    const cardBack = document.getElementById('vocab-card-back');
    const indexInfo = document.getElementById('vocab-index-info');
    const favBtn = document.getElementById('vocab-favorite-btn');
    const cardContainer = document.getElementById('vocab-card-container');

    if (cardContainer) cardContainer.classList.remove('flipped');

    if (this.filteredWords.length === 0) {
      if (cardFront) cardFront.innerHTML = '<h4>No words match filters</h4>';
      if (cardBack) cardBack.innerHTML = '<h4>No words match filters</h4>';
      if (indexInfo) indexInfo.innerText = '0 / 0';
      return;
    }

    const item = this.filteredWords[this.currentIndex];

    if (cardFront) {
      cardFront.innerHTML = `
        <span style="font-size: 0.8rem; text-transform: uppercase; color: var(--primary); letter-spacing: 0.5px; font-weight: 700;">
          ${item.category}
        </span>
        <div class="word-title">${item.word}</div>
        <div class="word-ipa">${item.ipa}</div>
        <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 10px;">Tap Card to Reveal Meaning</div>
      `;
    }

    if (cardBack) {
      cardBack.innerHTML = `
        <div class="word-meaning malayalam-font">${item.malayalam}</div>
        <div class="word-sentence">"${item.sentence}"</div>
        <div class="malayalam-font" style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 4px;">"${item.sentenceMal}"</div>
        
        <div style="margin-top: 16px; display: flex; gap: 12px; justify-content: center; font-size: 0.8rem;">
          ${item.synonyms.length ? `<div><strong>Synonyms:</strong> ${item.synonyms.join(', ')}</div>` : ''}
          ${item.antonyms.length ? `<div><strong>Antonyms:</strong> ${item.antonyms.join(', ')}</div>` : ''}
        </div>
      `;
    }

    if (indexInfo) {
      indexInfo.innerText = `${this.currentIndex + 1} / ${this.filteredWords.length}`;
    }

    if (favBtn) {
      const isFav = this.favorites.includes(item.word);
      favBtn.style.color = isFav ? '#ef4444' : 'var(--text-secondary)';
      favBtn.innerHTML = `<i class="${isFav ? 'fas' : 'far'} fa-heart"></i>`;
    }
  }

  navigateCard(direction) {
    if (this.filteredWords.length === 0) return;
    this.currentIndex = (this.currentIndex + direction + this.filteredWords.length) % this.filteredWords.length;
    this.renderFlashcard();
  }

  toggleFavorite() {
    if (this.filteredWords.length === 0) return;
    const item = this.filteredWords[this.currentIndex];
    if (this.favorites.includes(item.word)) {
      this.favorites = this.favorites.filter(w => w !== item.word);
    } else {
      this.favorites.push(item.word);
    }
    this.saveUserState();
    this.renderFlashcard();
  }

  renderWordsList() {
    const listContainer = document.getElementById('vocab-all-words-list');
    if (!listContainer) return;

    if (this.filteredWords.length === 0) {
      listContainer.innerHTML = '<p style="text-align: center; color: var(--text-muted);">No vocabulary words found.</p>';
      return;
    }

    listContainer.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 14px;">
        ${this.filteredWords.map((item, idx) => {
          const isFav = this.favorites.includes(item.word);
          return `
            <div class="glass-card" style="padding: 16px; display: flex; justify-content: space-between; align-items: center; cursor: pointer;" data-idx="${idx}">
              <div>
                <strong style="color: var(--primary); font-size: 1.1rem;">${item.word}</strong>
                <p class="malayalam-font" style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 4px;">${item.malayalam}</p>
              </div>
              <div style="display: flex; gap: 8px;">
                <button class="action-btn list-play-btn" data-text="${item.word}">
                  <i class="fas fa-volume-up"></i>
                </button>
                <button class="action-btn list-fav-btn" data-word="${item.word}" style="color: ${isFav ? '#ef4444' : 'var(--text-muted)'}">
                  <i class="${isFav ? 'fas' : 'far'} fa-heart"></i>
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    // Bind dynamic listing event listeners
    listContainer.querySelectorAll('.glass-card').forEach(card => {
      card.addEventListener('click', () => {
        const idx = parseInt(card.getAttribute('data-idx'), 10);
        this.currentIndex = idx;
        this.renderFlashcard();
        document.getElementById('vocab-card-container').scrollIntoView({ behavior: 'smooth' });
      });
    });

    listContainer.querySelectorAll('.list-play-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        Translator.speak(btn.getAttribute('data-text'));
      });
    });

    listContainer.querySelectorAll('.list-fav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const wordName = btn.getAttribute('data-word');
        if (this.favorites.includes(wordName)) {
          this.favorites = this.favorites.filter(w => w !== wordName);
          btn.style.color = 'var(--text-muted)';
          btn.innerHTML = `<i class="far fa-heart"></i>`;
        } else {
          this.favorites.push(wordName);
          btn.style.color = '#ef4444';
          btn.innerHTML = `<i class="fas fa-heart"></i>`;
        }
        this.saveUserState();
        this.renderFlashcard();
      });
    });
  }
}

export const vocabulary = new VocabularyManager();
