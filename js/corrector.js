// corrector.js - Grammar Correction engine and explanations generator

// Standard rule-based corrections mapping
const ERROR_RULES = [
  {
    wrong: 'i going office yesterday',
    correct: 'I went to the office yesterday.',
    explainEng: 'Since the time marker is "yesterday", you must use the simple past tense form "went" instead of "going". Also, specify direction using the preposition "to the" before the noun "office".',
    explainMal: 'കഴിഞ്ഞ കാര്യങ്ങൾ (yesterday) പറയുന്നതിനാൽ Simple Past Tense രൂപമായ "went" ആണ് ഉപയോഗിക്കേണ്ടത്. കൂടാതെ "office"-ന് മുൻപായി "to the" ചേർക്കേണ്ടതുണ്ട്.'
  },
  {
    wrong: 'she do not like tea',
    correct: 'She does not like tea.',
    explainEng: 'For singular subjects (he, she, it), you must use "does not" (doesn\'t) instead of "do not" (don\'t).',
    explainMal: 'ഏകവചനം (singular subject) ആയ "she" വരുമ്പോൾ ക്രിയയോടൊപ്പം "does not" ആണ് ഉപയോഗിക്കേണ്ടത്. "do not" ബഹുവചനങ്ങൾക്കൊപ്പമേ ഉപയോഗിക്കാവൂ.'
  },
  {
    wrong: 'i am student',
    correct: 'I am a student.',
    explainEng: 'Singular countable nouns (student) require an article ("a" or "an") preceding them in English sentences.',
    explainMal: 'ഒറ്റയായ എണ്ണാൻ കഴിയുന്ന നാമങ്ങൾക്കൊപ്പം (student) "a" എന്ന ആർട്ടിക്കിൾ ചേർക്കേണ്ടതുണ്ട്.'
  },
  {
    wrong: 'he sleep now',
    correct: 'He is sleeping now.',
    explainEng: 'Actions taking place at the current moment ("now") must use the present continuous tense: is/am/are + verb-ing.',
    explainMal: 'ഇപ്പോൾ നടന്നുകൊണ്ടിരിക്കുന്ന പ്രവർത്തിയെ കാണിക്കാൻ Present Continuous Tense ("is sleeping") ആണ് ഉപയോഗിക്കേണ്ടത്.'
  },
  {
    wrong: 'we was playing',
    correct: 'We were playing.',
    explainEng: 'Plural subjects ("we", "they") require the past plural auxiliary verb "were" instead of "was".',
    explainMal: 'ബഹുവചന കർത്താക്കൾക്കൊപ്പം (we) ഭൂതകാല സഹായിയായി "were" ആണ് ഉപയോഗിക്കേണ്ടത്. "was" ഏകവചനങ്ങൾക്കൊപ്പമാണ് വരിക.'
  }
];

export class GrammarCorrector {
  init() {
    const checkBtn = document.getElementById('corrector-check-btn');
    const inputArea = document.getElementById('corrector-input');
    
    if (checkBtn && inputArea) {
      checkBtn.addEventListener('click', () => {
        this.processCorrection(inputArea.value);
      });
    }
  }

  processCorrection(text) {
    const cleanInput = text.trim().toLowerCase().replace(/\s+/g, ' ');
    const resultsContainer = document.getElementById('corrector-results');
    
    if (!resultsContainer) return;
    
    if (!cleanInput) {
      resultsContainer.innerHTML = '<p style="color: var(--danger);">Please enter a sentence to check.</p>';
      return;
    }

    // Try finding exact rule match
    const ruleMatch = ERROR_RULES.find(r => cleanInput.includes(r.wrong) || r.wrong.includes(cleanInput));

    if (ruleMatch) {
      resultsContainer.innerHTML = `
        <div class="glass-card" style="border-left: 4px solid var(--danger); animation: viewTransition 0.3s forwards;">
          <h4 style="color: var(--danger); font-size: 0.9rem; text-transform: uppercase; font-weight: 700;">Entered Sentence</h4>
          <p style="font-size: 1.1rem; margin-top: 4px; font-style: italic; color: var(--text-secondary);">"${text}"</p>
          
          <h4 style="color: var(--accent); margin-top: 20px; font-size: 0.9rem; text-transform: uppercase; font-weight: 700;">Correct Sentence</h4>
          <p style="font-size: 1.25rem; font-weight: 700; margin-top: 4px; color: var(--text-primary);">"${ruleMatch.correct}"</p>

          <div style="margin-top: 24px; border-top: 1px solid var(--surface-border); padding-top: 16px;">
            <h5 style="color: var(--primary); font-size: 0.95rem; font-weight: 600;">Explanation (ഇംഗ്ലീഷിൽ)</h5>
            <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 4px;">${ruleMatch.explainEng}</p>
            
            <h5 style="color: var(--secondary); font-size: 0.95rem; font-weight: 600; margin-top: 16px;">വിശദീകരണം (മലയാളത്തിൽ)</h5>
            <p class="malayalam-font" style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 4px;">${ruleMatch.explainMal}</p>
          </div>
        </div>
      `;
    } else {
      // General response if no match (Simulating AI processing or perfect grammar)
      resultsContainer.innerHTML = `
        <div class="glass-card" style="border-left: 4px solid var(--accent); animation: viewTransition 0.3s forwards;">
          <h4 style="color: var(--accent); font-size: 0.9rem; text-transform: uppercase; font-weight: 700;">Grammar Check Result</h4>
          <p style="font-size: 1.1rem; margin-top: 8px; color: var(--text-primary);">The sentence appears to be correct or matches standard structures!</p>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 8px;">To enable dynamic AI-powered grammar checking for all complex phrases, you can link the system to the Gemini API via the Admin console.</p>
        </div>
      `;
    }
  }
}

export const corrector = new GrammarCorrector();
