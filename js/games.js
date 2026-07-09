// games.js - Play interactive educational language games

import { EXTENDED_VOCABULARY } from './vocabulary.js';
import { dashboard } from './dashboard.js';

export class GamesManager {
  constructor() {
    this.score = 0;
    this.level = 1;
    this.selectedGame = null;
    
    // Match the Words State
    this.matchSelected = null;
    this.matchedPairsCount = 0;

    // Sentence Scramble State
    this.targetSentence = '';
    this.scrambleWords = [];
    this.orderedWords = [];
  }

  init() {
    this.renderGamesDeck();
    
    // Bind back button
    const backBtn = document.getElementById('game-back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => this.exitToDeck());
    }
  }

  // Render game options list
  renderGamesDeck() {
    const deck = document.getElementById('games-deck-container');
    const playground = document.getElementById('game-playground-container');
    if (!deck || !playground) return;

    deck.style.display = 'grid';
    playground.style.display = 'none';

    deck.innerHTML = `
      <div class="game-card" data-game="match">
        <div class="game-icon"><i class="fas fa-th-large"></i></div>
        <h3>Match the Words</h3>
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 6px;">
          Match English words with their correct Malayalam translations.
        </p>
      </div>
      <div class="game-card" data-game="scramble">
        <div class="game-icon"><i class="fas fa-sort-amount-down"></i></div>
        <h3>Sentence Scramble</h3>
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 6px;">
          Rearrange the jumbled words into the correct English sentence order.
        </p>
      </div>
    `;

    // Hook card clicks
    deck.querySelectorAll('.game-card').forEach(card => {
      card.addEventListener('click', () => {
        const gameType = card.getAttribute('data-game');
        this.launchGame(gameType);
      });
    });
  }

  launchGame(gameType) {
    this.selectedGame = gameType;
    this.score = 0;
    
    const deck = document.getElementById('games-deck-container');
    const playground = document.getElementById('game-playground-container');
    if (!deck || !playground) return;

    deck.style.display = 'none';
    playground.style.display = 'flex';

    this.playLevel();
  }

  playLevel() {
    const playArea = document.getElementById('game-interactive-area');
    if (!playArea) return;

    // Display level headers
    document.getElementById('game-title-header').innerText = 
      this.selectedGame === 'match' ? 'Match the Words' : 'Sentence Scramble';
    document.getElementById('game-stat-level').innerText = `Level: ${this.level}`;
    document.getElementById('game-stat-score').innerText = `Score: ${this.score}`;

    if (this.selectedGame === 'match') {
      this.initMatchGame(playArea);
    } else {
      this.initScrambleGame(playArea);
    }
  }

  // =========================================================================
  // MATCH THE WORDS GAME
  // =========================================================================
  initMatchGame(container) {
    this.matchedPairsCount = 0;
    this.matchSelected = null;

    // Select 4 random words
    const randomWords = [...EXTENDED_VOCABULARY]
      .sort(() => 0.5 - Math.random())
      .slice(0, 4);

    // Create cards list (English & Malayalam)
    const englishCards = randomWords.map(item => ({ text: item.word, pairId: item.word, type: 'eng' }));
    const malayalamCards = randomWords.map(item => ({ text: item.malayalam, pairId: item.word, type: 'mal' }));
    
    // Jumble cards
    const allCards = [...englishCards, ...malayalamCards].sort(() => 0.5 - Math.random());

    container.innerHTML = `
      <div class="matching-grid" style="margin-bottom: 20px;">
        ${allCards.map((c, idx) => `
          <div class="matching-card" id="match-card-${idx}" data-pair="${c.pairId}" data-type="${c.type}">
            ${c.text}
          </div>
        `).join('')}
      </div>
      <div id="match-feedback" style="height: 30px; font-weight: 600;"></div>
    `;

    // Hook matching click actions
    container.querySelectorAll('.matching-card').forEach(card => {
      card.addEventListener('click', () => {
        this.handleMatchClick(card);
      });
    });
  }

  handleMatchClick(card) {
    if (card.classList.contains('matched') || card.classList.contains('selected')) return;

    const feedback = document.getElementById('match-feedback');
    if (feedback) feedback.innerText = '';

    card.classList.add('selected');

    if (!this.matchSelected) {
      this.matchSelected = card;
    } else {
      const cardA = this.matchSelected;
      const cardB = card;

      const pairA = cardA.getAttribute('data-pair');
      const pairB = cardB.getAttribute('data-pair');
      const typeA = cardA.getAttribute('data-type');
      const typeB = cardB.getAttribute('data-type');

      // Check if matching pair but from different types (Eng/Mal)
      if (pairA === pairB && typeA !== typeB) {
        // Success match!
        cardA.classList.remove('selected');
        cardB.classList.remove('selected');
        cardA.classList.add('matched');
        cardB.classList.add('matched');
        
        this.matchedPairsCount++;
        this.score += 20;
        document.getElementById('game-stat-score').innerText = `Score: ${this.score}`;
        
        if (feedback) {
          feedback.innerText = 'Correct Match! +20 XP';
          feedback.style.color = '#10b981';
        }

        if (this.matchedPairsCount === 4) {
          setTimeout(() => this.completeLevel(), 1200);
        }
      } else {
        // Failure match
        if (feedback) {
          feedback.innerText = 'Incorrect match. Try again!';
          feedback.style.color = '#ef4444';
        }
        
        setTimeout(() => {
          cardA.classList.remove('selected');
          cardB.classList.remove('selected');
        }, 800);
      }

      this.matchSelected = null;
    }
  }

  // =========================================================================
  // SENTENCE SCRAMBLE GAME
  // =========================================================================
  initScrambleGame(container) {
    this.orderedWords = [];

    // Predefined sentence library
    const sentenceList = [
      'The book is on the table',
      'I am studying English grammar',
      'He goes to the office',
      'We are going on a trip',
      'She sings a beautiful song'
    ];

    const sentence = sentenceList[(this.level - 1) % sentenceList.length];
    this.targetSentence = sentence;
    
    // Split and jumble
    const words = sentence.split(/\s+/);
    this.scrambleWords = [...words].sort(() => 0.5 - Math.random());

    container.innerHTML = `
      <p style="text-align: center; color: var(--text-secondary); margin-bottom: 12px;">Click words in order to form a correct sentence:</p>
      
      <div class="sentence-scramble-dropzone" id="scramble-dropzone">
        <!-- User ordered words will slide in here -->
        <span style="color: var(--text-muted); font-size: 0.9rem;">Click words below...</span>
      </div>

      <div class="sentence-scramble-words" id="scramble-choices">
        ${this.scrambleWords.map((w, idx) => `
          <div class="scramble-word" id="scramble-choice-${idx}" data-word="${w}">
            ${w}
          </div>
        `).join('')}
      </div>

      <div style="display: flex; gap: 12px; margin-top: 20px;">
        <button class="btn btn-secondary" id="scramble-reset-btn">Reset</button>
        <button class="btn btn-primary" id="scramble-check-btn">Check Sentence</button>
      </div>
      <div id="scramble-feedback" style="margin-top: 14px; font-weight: 600; height: 24px;"></div>
    `;

    // Hook choice elements
    const choicesContainer = document.getElementById('scramble-choices');
    choicesContainer.querySelectorAll('.scramble-word').forEach(card => {
      card.addEventListener('click', () => {
        this.addWordToDropzone(card);
      });
    });

    document.getElementById('scramble-reset-btn').addEventListener('click', () => {
      this.initScrambleGame(container);
    });

    document.getElementById('scramble-check-btn').addEventListener('click', () => {
      this.checkScrambleResult();
    });
  }

  addWordToDropzone(card) {
    if (card.style.visibility === 'hidden') return;
    
    const word = card.getAttribute('data-word');
    this.orderedWords.push(word);
    
    card.style.visibility = 'hidden';
    
    const dropzone = document.getElementById('scramble-dropzone');
    if (this.orderedWords.length === 1) {
      dropzone.innerHTML = '';
    }
    
    const wordBadge = document.createElement('div');
    wordBadge.className = 'scramble-word';
    wordBadge.innerText = word;
    
    // Click word in dropzone to put it back
    wordBadge.addEventListener('click', () => {
      card.style.visibility = 'visible';
      this.orderedWords = this.orderedWords.filter(w => w !== word);
      wordBadge.remove();
      if (this.orderedWords.length === 0) {
        dropzone.innerHTML = '<span style="color: var(--text-muted); font-size: 0.9rem;">Click words below...</span>';
      }
    });

    dropzone.appendChild(wordBadge);
  }

  checkScrambleResult() {
    const feedback = document.getElementById('scramble-feedback');
    if (!feedback) return;

    const currentSentence = this.orderedWords.join(' ');
    if (currentSentence === this.targetSentence) {
      this.score += 50;
      document.getElementById('game-stat-score').innerText = `Score: ${this.score}`;
      feedback.innerText = 'Splendid! Correct Sentence. +50 XP';
      feedback.style.color = '#10b981';
      
      setTimeout(() => this.completeLevel(), 1200);
    } else {
      feedback.innerText = 'Wrong sentence order. Reset and try again!';
      feedback.style.color = '#ef4444';
    }
  }

  completeLevel() {
    dashboard.completeGame(this.score);
    this.level++;
    this.playLevel();
  }

  exitToDeck() {
    this.selectedGame = null;
    this.level = 1;
    this.renderGamesDeck();
  }
}

export const games = new GamesManager();
