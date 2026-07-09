// grammar.js - Grammar syllabus viewer and interactive quiz processor

import { GRAMMAR_LESSONS } from './db.js';
import { Translator } from './translator.js';
import { dashboard } from './dashboard.js';

export class GrammarManager {
  constructor() {
    this.currentLesson = null;
    this.currentQuizIndex = 0;
    this.selectedOption = null;
    this.hasAnswered = false;
  }

  // Initialize view events
  init() {
    this.renderSyllabusList();
    
    // Select the first lesson by default
    if (GRAMMAR_LESSONS.length > 0) {
      this.selectLesson(GRAMMAR_LESSONS[0].id);
    }
  }

  // Render sidebar syllabus
  renderSyllabusList() {
    const listContainer = document.getElementById('grammar-lessons-list');
    if (!listContainer) return;

    listContainer.innerHTML = GRAMMAR_LESSONS.map(lesson => {
      let icon = 'fa-book';
      if (lesson.category === 'tenses') icon = 'fa-clock';
      if (lesson.category === 'voice') icon = 'fa-exchange-alt';

      return `
        <div class="lesson-card-item" id="lesson-tab-${lesson.id}" data-id="${lesson.id}">
          <div style="display: flex; align-items: center; gap: 12px;">
            <i class="fas ${icon}" style="color: var(--primary); font-size: 1.1rem;"></i>
            <div>
              <h4>${lesson.title}</h4>
              <p>${lesson.subtitle}</p>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach click events
    listContainer.querySelectorAll('.lesson-card-item').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-id');
        this.selectLesson(id);
      });
    });
  }

  // Load and render lesson details
  selectLesson(lessonId) {
    const lesson = GRAMMAR_LESSONS.find(l => l.id === lessonId);
    if (!lesson) return;

    this.currentLesson = lesson;
    this.currentQuizIndex = 0;
    this.hasAnswered = false;

    // Highlight active card
    document.querySelectorAll('.lesson-card-item').forEach(c => c.classList.remove('active'));
    const activeCard = document.getElementById(`lesson-tab-${lessonId}`);
    if (activeCard) activeCard.classList.add('active');

    // Populate DOM elements
    const titleEl = document.getElementById('lesson-title');
    const descMalEl = document.getElementById('lesson-desc-malayalam');
    const descEngEl = document.getElementById('lesson-desc-english');
    const examplesEl = document.getElementById('lesson-examples-list');

    if (titleEl) titleEl.innerText = lesson.title;
    if (descMalEl) descMalEl.innerText = lesson.malayalamDesc;
    if (descEngEl) descEngEl.innerText = lesson.englishDesc;

    // Render examples with audio synth play buttons
    if (examplesEl) {
      examplesEl.innerHTML = lesson.examples.map(ex => `
        <div class="lesson-example-box" style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <strong style="color: var(--text-primary); font-size: 1.05rem;">${ex.eng}</strong>
            <p class="malayalam-font" style="color: var(--text-secondary); margin-top: 4px;">${ex.mal}</p>
          </div>
          <button class="action-btn play-audio-btn" data-text="${ex.eng}">
            <i class="fas fa-volume-up"></i>
          </button>
        </div>
      `).join('');

      // Add audio playback events
      examplesEl.querySelectorAll('.play-audio-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const text = btn.getAttribute('data-text');
          Translator.speak(text);
        });
      });
    }

    this.renderQuiz();
  }

  // Render Lesson Interactive Quiz
  renderQuiz() {
    const quizBox = document.getElementById('lesson-quiz-container');
    if (!quizBox || !this.currentLesson || !this.currentLesson.quiz) return;

    const quizData = this.currentLesson.quiz[this.currentQuizIndex];
    if (!quizData) {
      quizBox.innerHTML = `
        <div style="text-align: center; padding: 12px 0;">
          <h4 style="color: var(--accent);">🎉 Lesson Completed!</h4>
          <p style="color: var(--text-secondary); margin-top: 6px;">You have studied this grammar chapter successfully.</p>
        </div>
      `;
      // Complete lesson progress
      dashboard.completeLesson(this.currentLesson.id, 10); // add completion XP
      return;
    }

    quizBox.innerHTML = `
      <div style="margin-bottom: 16px;">
        <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--primary); font-weight: 700;">
          Exercise ${this.currentQuizIndex + 1} of ${this.currentLesson.quiz.length}
        </span>
        <h4 style="font-size: 1.05rem; font-weight: 600; margin-top: 6px;">${quizData.question}</h4>
      </div>
      <div id="quiz-options-list">
        ${quizData.options.map((opt, index) => `
          <div class="quiz-option" data-index="${index}">${opt}</div>
        `).join('')}
      </div>
      <div id="quiz-feedback" style="display: none; margin-top: 20px; padding: 16px; border-radius: var(--radius-md); background: rgba(255,255,255,0.03); border: 1px solid var(--surface-border);">
        <strong id="feedback-title" style="display: block; font-size: 1rem; margin-bottom: 6px;"></strong>
        <p id="feedback-desc" style="font-size: 0.85rem; color: var(--text-secondary);"></p>
        <button class="btn btn-primary" id="next-quiz-btn" style="margin-top: 14px; padding: 8px 16px; font-size: 0.85rem;">Next Question</button>
      </div>
    `;

    // Hook click options
    quizBox.querySelectorAll('.quiz-option').forEach(option => {
      option.addEventListener('click', () => {
        if (this.hasAnswered) return;
        const index = parseInt(option.getAttribute('data-index'), 10);
        this.checkAnswer(index, option);
      });
    });
  }

  // Answer checking
  checkAnswer(selectedIndex, optionElement) {
    this.hasAnswered = true;
    const quizData = this.currentLesson.quiz[this.currentQuizIndex];
    const isCorrect = selectedIndex === quizData.answerIndex;

    const feedbackBox = document.getElementById('quiz-feedback');
    const feedbackTitle = document.getElementById('feedback-title');
    const feedbackDesc = document.getElementById('feedback-desc');
    const nextBtn = document.getElementById('next-quiz-btn');

    // Style option cards
    const options = document.querySelectorAll('.quiz-option');
    options.forEach((opt, idx) => {
      if (idx === quizData.answerIndex) {
        opt.classList.add('correct');
      } else if (idx === selectedIndex) {
        opt.classList.add('incorrect');
      }
    });

    if (feedbackBox && feedbackTitle && feedbackDesc) {
      feedbackBox.style.display = 'block';
      if (isCorrect) {
        feedbackTitle.innerText = '✨ Correct Answer!';
        feedbackTitle.style.color = '#10b981';
        feedbackDesc.innerText = quizData.explanation;
        dashboard.addXP(20); // 20 XP for correct answer
      } else {
        feedbackTitle.innerText = '❌ Incorrect Answer';
        feedbackTitle.style.color = '#ef4444';
        feedbackDesc.innerText = quizData.explanation;
      }
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.currentQuizIndex++;
        this.hasAnswered = false;
        this.renderQuiz();
      });
    }
  }
}
export const grammar = new GrammarManager();
