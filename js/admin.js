// admin.js - Admin panel for managing lessons, vocabulary, and simulated databases

import { GRAMMAR_LESSONS, VOCABULARY } from './db.js';

export class AdminManager {
  constructor() {
    this.currentTab = 'vocab';
  }

  init() {
    this.setupAdminTabs();
    this.renderAdminData();
    this.bindFormSubmissions();
  }

  setupAdminTabs() {
    const tabs = document.querySelectorAll('.admin-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.currentTab = tab.getAttribute('data-tab');
        
        // Show/hide subpanels
        const vocabForm = document.getElementById('admin-vocab-form-panel');
        const lessonForm = document.getElementById('admin-lesson-form-panel');

        if (this.currentTab === 'vocab') {
          if (vocabForm) vocabForm.style.display = 'block';
          if (lessonForm) lessonForm.style.display = 'none';
        } else {
          if (vocabForm) vocabForm.style.display = 'none';
          if (lessonForm) lessonForm.style.display = 'block';
        }

        this.renderAdminData();
      });
    });
  }

  renderAdminData() {
    const tableBody = document.getElementById('admin-data-table-body');
    const tableHeader = document.getElementById('admin-data-table-header');
    if (!tableBody || !tableHeader) return;

    if (this.currentTab === 'vocab') {
      tableHeader.innerHTML = `
        <tr>
          <th style="padding: 12px; text-align: left; border-bottom: 2px solid var(--surface-border);">Word</th>
          <th style="padding: 12px; text-align: left; border-bottom: 2px solid var(--surface-border);">Malayalam Meaning</th>
          <th style="padding: 12px; text-align: left; border-bottom: 2px solid var(--surface-border);">Category</th>
          <th style="padding: 12px; text-align: center; border-bottom: 2px solid var(--surface-border);">Actions</th>
        </tr>
      `;

      // Read custom vocab from storage
      const customVocab = JSON.parse(localStorage.getItem('em_hub_custom_vocab')) || [];
      const allVocab = [...VOCABULARY, ...customVocab];

      tableBody.innerHTML = allVocab.map((v, index) => `
        <tr style="border-bottom: 1px solid var(--surface-border);">
          <td style="padding: 12px; font-weight: 600; color: var(--primary);">${v.word}</td>
          <td style="padding: 12px;" class="malayalam-font">${v.malayalam}</td>
          <td style="padding: 12px;"><span class="filter-chip active" style="padding: 4px 8px; font-size: 0.75rem;">${v.category}</span></td>
          <td style="padding: 12px; text-align: center;">
            <button class="action-btn delete-vocab-btn" data-word="${v.word}" style="display: inline-flex; color: var(--danger);">
              <i class="fas fa-trash-alt"></i>
            </button>
          </td>
        </tr>
      `).join('');

      tableBody.querySelectorAll('.delete-vocab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          this.deleteVocabItem(btn.getAttribute('data-word'));
        });
      });

    } else {
      tableHeader.innerHTML = `
        <tr>
          <th style="padding: 12px; text-align: left; border-bottom: 2px solid var(--surface-border);">Lesson Title</th>
          <th style="padding: 12px; text-align: left; border-bottom: 2px solid var(--surface-border);">Category</th>
          <th style="padding: 12px; text-align: center; border-bottom: 2px solid var(--surface-border);">Actions</th>
        </tr>
      `;

      const customLessons = JSON.parse(localStorage.getItem('em_hub_custom_lessons')) || [];
      const allLessons = [...GRAMMAR_LESSONS, ...customLessons];

      tableBody.innerHTML = allLessons.map((l, index) => `
        <tr style="border-bottom: 1px solid var(--surface-border);">
          <td style="padding: 12px; font-weight: 600; color: var(--primary);">${l.title}</td>
          <td style="padding: 12px; text-transform: capitalize;">${l.category.replace('_', ' ')}</td>
          <td style="padding: 12px; text-align: center;">
            <button class="action-btn delete-lesson-btn" data-id="${l.id}" style="display: inline-flex; color: var(--danger);">
              <i class="fas fa-trash-alt"></i>
            </button>
          </td>
        </tr>
      `).join('');

      tableBody.querySelectorAll('.delete-lesson-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          this.deleteLessonItem(btn.getAttribute('data-id'));
        });
      });
    }
  }

  bindFormSubmissions() {
    const vocabForm = document.getElementById('admin-vocab-form');
    const lessonForm = document.getElementById('admin-lesson-form');

    if (vocabForm) {
      vocabForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const word = document.getElementById('admin-vocab-word').value.trim();
        const meaning = document.getElementById('admin-vocab-meaning').value.trim();
        const category = document.getElementById('admin-vocab-category').value;
        const sentence = document.getElementById('admin-vocab-sentence').value.trim();

        if (!word || !meaning || !sentence) {
          alert('Please fill out all fields.');
          return;
        }

        const customVocab = JSON.parse(localStorage.getItem('em_hub_custom_vocab')) || [];
        
        customVocab.push({
          word,
          malayalam: meaning,
          ipa: `/${word.toLowerCase()}/`,
          category,
          sentence,
          sentenceMal: 'Custom added item',
          synonyms: [],
          antonyms: []
        });

        localStorage.setItem('em_hub_custom_vocab', JSON.stringify(customVocab));
        vocabForm.reset();
        this.renderAdminData();
        alert('Vocabulary word added successfully! Updates will reflect in the cards.');
      });
    }

    if (lessonForm) {
      lessonForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = document.getElementById('admin-lesson-title').value.trim();
        const category = document.getElementById('admin-lesson-category').value;
        const engDesc = document.getElementById('admin-lesson-desc-eng').value.trim();
        const malDesc = document.getElementById('admin-lesson-desc-mal').value.trim();

        if (!title || !engDesc || !malDesc) {
          alert('Please fill out all fields.');
          return;
        }

        const customLessons = JSON.parse(localStorage.getItem('em_hub_custom_lessons')) || [];
        const lessonId = 'custom_' + Date.now();

        customLessons.push({
          id: lessonId,
          category,
          title,
          subtitle: 'Custom Lesson',
          malayalamDesc: malDesc,
          englishDesc: engDesc,
          examples: [
            { eng: 'This is a sample sentence.', mal: 'ഇതൊരു മാതൃകാ വാക്യമാണ്.' }
          ],
          quiz: [
            {
              question: 'Complete this lesson review quiz by selecting the first option.',
              options: ['Correct Option', 'Incorrect Option'],
              answerIndex: 0,
              explanation: 'Simulated correct option.'
            }
          ]
        });

        localStorage.setItem('em_hub_custom_lessons', JSON.stringify(customLessons));
        lessonForm.reset();
        this.renderAdminData();
        alert('Lesson added successfully! Updates will reflect in the syllabus.');
      });
    }
  }

  deleteVocabItem(word) {
    let customVocab = JSON.parse(localStorage.getItem('em_hub_custom_vocab')) || [];
    const isCustom = customVocab.some(v => v.word === word);

    if (!isCustom) {
      alert('Default static vocabulary words cannot be deleted.');
      return;
    }

    if (confirm(`Are you sure you want to delete "${word}"?`)) {
      customVocab = customVocab.filter(v => v.word !== word);
      localStorage.setItem('em_hub_custom_vocab', JSON.stringify(customVocab));
      this.renderAdminData();
    }
  }

  deleteLessonItem(id) {
    if (!id.startsWith('custom_')) {
      alert('Default static lessons cannot be deleted.');
      return;
    }

    if (confirm('Are you sure you want to delete this lesson?')) {
      let customLessons = JSON.parse(localStorage.getItem('em_hub_custom_lessons')) || [];
      customLessons = customLessons.filter(l => l.id !== id);
      localStorage.setItem('em_hub_custom_lessons', JSON.stringify(customLessons));
      this.renderAdminData();
    }
  }
}

export const admin = new AdminManager();
