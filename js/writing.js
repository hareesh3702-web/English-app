// writing.js - Handles document templates, user essays, and writing analysis

import { WRITING_TEMPLATES } from './db.js';

export class WritingPracticeManager {
  constructor() {
    this.currentTemplate = null;
  }

  init() {
    this.renderTemplateList();
    
    // Bind actions
    const analyzeBtn = document.getElementById('writing-analyze-btn');
    if (analyzeBtn) {
      analyzeBtn.addEventListener('click', () => this.analyzeDraft());
    }

    // Select the first template by default
    if (WRITING_TEMPLATES.length > 0) {
      this.selectTemplate(WRITING_TEMPLATES[0].id);
    }
  }

  renderTemplateList() {
    const listContainer = document.getElementById('writing-templates-list');
    if (!listContainer) return;

    listContainer.innerHTML = WRITING_TEMPLATES.map(t => `
      <div class="lesson-card-item" id="write-template-tab-${t.id}" data-id="${t.id}">
        <h4>${t.title}</h4>
        <p style="font-size: 0.8rem; margin-top: 4px;">${t.desc}</p>
      </div>
    `).join('');

    listContainer.querySelectorAll('.lesson-card-item').forEach(card => {
      card.addEventListener('click', () => {
        this.selectTemplate(card.getAttribute('data-id'));
      });
    });
  }

  selectTemplate(id) {
    const template = WRITING_TEMPLATES.find(t => t.id === id);
    if (!template) return;

    this.currentTemplate = template;

    // Highlight card
    document.querySelectorAll('#writing-templates-list .lesson-card-item').forEach(c => c.classList.remove('active'));
    const activeCard = document.getElementById(`write-template-tab-${id}`);
    if (activeCard) activeCard.classList.add('active');

    // Populate Editor
    const editor = document.getElementById('writing-editor');
    if (editor) {
      editor.value = template.outline;
    }

    // Render suggestions list
    const suggestionsList = document.getElementById('writing-template-guidelines');
    if (suggestionsList) {
      suggestionsList.innerHTML = template.suggestions.map(s => `
        <li style="margin-left: 16px; margin-bottom: 8px; font-size: 0.85rem; color: var(--text-secondary);">${s}</li>
      `).join('');
    }

    // Clear feedback
    const feedbackBox = document.getElementById('writing-feedback-panel');
    if (feedbackBox) {
      feedbackBox.innerHTML = '<p style="color: var(--text-muted); font-size: 0.9rem;">Edit the template on the left and tap Analyze Draft to get feedback.</p>';
    }
  }

  analyzeDraft() {
    const editor = document.getElementById('writing-editor');
    const feedbackBox = document.getElementById('writing-feedback-panel');
    
    if (!editor || !feedbackBox) return;
    const content = editor.value.trim();

    if (!content) {
      feedbackBox.innerHTML = '<p style="color: var(--danger);">Please write some text to analyze.</p>';
      return;
    }

    // Verify if placeholders are unresolved
    const unresolvedPlaceholders = [];
    const matches = content.match(/\[[^\]]+\]/g);
    if (matches) {
      matches.forEach(m => {
        if (!unresolvedPlaceholders.includes(m)) {
          unresolvedPlaceholders.push(m);
        }
      });
    }

    // Evaluate stats
    const wordCount = content.split(/\s+/).length;
    let score = 100;
    const recommendations = [];

    if (unresolvedPlaceholders.length > 0) {
      score -= unresolvedPlaceholders.length * 15;
      recommendations.push(`Replace placeholder brackets: ${unresolvedPlaceholders.join(', ')}`);
    }

    if (wordCount < 30) {
      score -= 20;
      recommendations.push('Add more details to expand the length of your document.');
    }

    // Check grammar indicators
    if (content.toLowerCase().includes('i going')) {
      score -= 10;
      recommendations.push('Correct "I going" to "I am going" or "I went".');
    }

    // Format final suggestions
    const finalScore = Math.max(10, score);
    feedbackBox.innerHTML = `
      <div style="animation: viewTransition 0.3s forwards;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <h4 style="font-weight: 700; color: var(--primary);">Writing Score</h4>
          <span style="font-size: 1.5rem; font-weight: 800; color: ${finalScore >= 80 ? 'var(--accent)' : 'var(--warning)'};">${finalScore}/100</span>
        </div>
        <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 12px;">Word Count: <strong>${wordCount} words</strong></p>
        
        ${recommendations.length > 0 ? `
          <h5 style="color: var(--secondary); font-size: 0.9rem; margin-top: 16px; margin-bottom: 8px;">Key Improvements:</h5>
          <ul style="list-style-type: none; display: flex; flex-direction: column; gap: 8px;">
            ${recommendations.map(rec => `
              <li style="padding: 10px; background: rgba(239, 68, 68, 0.05); border-left: 3px solid var(--danger); font-size: 0.85rem; border-radius: 4px;">
                ⚠️ ${rec}
              </li>
            `).join('')}
          </ul>
        ` : `
          <div style="padding: 12px; background: rgba(16, 185, 129, 0.1); border-left: 3px solid var(--accent); border-radius: 4px; font-size: 0.85rem; color: var(--accent);">
            ✨ Excellent draft! All placeholders resolved and document guidelines satisfied.
          </div>
        `}

        <div style="margin-top: 24px; border-top: 1px solid var(--surface-border); padding-top: 16px;">
          <h5 style="font-size: 0.9rem; color: var(--primary);">Malayalam Tip:</h5>
          <p class="malayalam-font" style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 4px;">
            ഔദ്യോഗിക ആവശ്യങ്ങൾക്കായുള്ള കത്തുകൾ അയക്കുമ്പോൾ വ്യക്തമായ തീയതികളും വിവരങ്ങളും ഉൾക്കൊള്ളിക്കാൻ പ്രത്യേകം ശ്രദ്ധിക്കുക.
          </p>
        </div>
      </div>
    `;
  }
}

export const writing = new WritingPracticeManager();
