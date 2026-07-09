// dashboard.js - Tracks progress, streaks, badges, and analytics

class DashboardService {
  constructor() {
    this.stats = {
      xp: 0,
      streak: 1,
      lastActive: '',
      completedLessons: [],
      completedGamesCount: 0,
      grammarScore: 0,
      vocabularyScore: 0,
      speakingScore: 0,
      unlockedBadges: []
    };
  }

  // Load stats from localStorage
  loadStats() {
    const cachedStats = localStorage.getItem('em_hub_stats');
    if (cachedStats) {
      this.stats = { ...this.stats, ...JSON.parse(cachedStats) };
    }
    this.checkAndUpdateStreak();
  }

  // Save current stats to localStorage
  saveStats() {
    localStorage.setItem('em_hub_stats', JSON.stringify(this.stats));
    this.updateDashboardUI();
  }

  // Streak validation logic
  checkAndUpdateStreak() {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (!this.stats.lastActive) {
      this.stats.lastActive = today;
      this.stats.streak = 1;
    } else if (this.stats.lastActive === yesterday) {
      this.stats.streak += 1;
      this.stats.lastActive = today;
    } else if (this.stats.lastActive !== today) {
      // Streak broken
      this.stats.streak = 1;
      this.stats.lastActive = today;
    }
    this.saveStats();
  }

  // Add XP points
  addXP(amount) {
    this.stats.xp += amount;
    this.saveStats();
    this.checkBadges();
  }

  // Complete a grammar lesson
  completeLesson(lessonId, score) {
    if (!this.stats.completedLessons.includes(lessonId)) {
      this.stats.completedLessons.push(lessonId);
    }
    this.stats.grammarScore += score;
    this.addXP(100); // 100 XP per lesson completion
  }

  // Complete a game
  completeGame(points) {
    this.stats.completedGamesCount += 1;
    this.stats.vocabularyScore += Math.floor(points / 2);
    this.addXP(points);
  }

  // Speaking completion
  addSpeakingScore(score) {
    this.stats.speakingScore += score;
    this.addXP(50);
  }

  // Check achievements and unlock badges
  checkBadges() {
    const badges = [
      { id: 'first_steps', name: 'First Steps', desc: 'Reach 100 XP', condition: () => this.stats.xp >= 100, icon: '🔥' },
      { id: 'streak_3', name: 'Dedicated', desc: 'Reach 3 days streak', condition: () => this.stats.streak >= 3, icon: '⚡' },
      { id: 'grammar_guru', name: 'Grammar Guru', desc: 'Complete 3 lessons', condition: () => this.stats.completedLessons.length >= 3, icon: '📚' },
      { id: 'gamer', name: 'Game Master', desc: 'Complete 5 games', condition: () => this.stats.completedGamesCount >= 5, icon: '🎮' },
      { id: 'speaker', name: 'Fluent Speaker', desc: 'Earn 150 Speaking Score', condition: () => this.stats.speakingScore >= 150, icon: '🗣️' }
    ];

    let newlyUnlocked = false;
    badges.forEach(b => {
      if (b.condition() && !this.stats.unlockedBadges.includes(b.id)) {
        this.stats.unlockedBadges.push(b.id);
        newlyUnlocked = true;
      }
    });

    if (newlyUnlocked) {
      this.saveStats();
    }
  }

  // Render SVG progress chart showing weekly XP gain simulation
  renderProgressChart() {
    const chartEl = document.getElementById('progress-chart');
    if (!chartEl) return;

    // Generate mock historical data based on current XP
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const currentDay = new Date().getDay(); // 0 is Sun, 1 is Mon...
    const rotatedDays = [...days.slice(currentDay), ...days.slice(0, currentDay)];

    // Spread the total XP across days for rendering
    const baseValue = Math.max(10, Math.floor(this.stats.xp / 4));
    const dataValues = [
      baseValue,
      Math.floor(baseValue * 1.5),
      Math.floor(baseValue * 0.8),
      Math.floor(baseValue * 1.2),
      Math.floor(baseValue * 0.5),
      Math.floor(baseValue * 1.9),
      this.stats.xp % 100 // today's progress
    ];

    const maxVal = Math.max(...dataValues, 100);
    const height = 150;
    const width = 360;
    const padding = 30;

    let points = '';
    let xGrid = '';
    let labels = '';

    dataValues.forEach((val, index) => {
      const x = padding + (index * (width - 2 * padding) / 6);
      const y = height - padding - (val * (height - 2 * padding) / maxVal);
      points += `${x},${y} `;
      
      // Grid lines
      xGrid += `<line x1="${x}" y1="${padding}" x2="${x}" y2="${height - padding}" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>`;
      
      // X labels
      labels += `<text x="${x}" y="${height - 10}" fill="var(--text-secondary)" font-size="10" text-anchor="middle">${rotatedDays[index]}</text>`;
    });

    chartEl.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" width="100%" height="100%">
        <!-- Grid horizontal lines -->
        <line x1="${padding}" y1="${padding}" x2="${width - padding}" y2="${padding}" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
        <line x1="${padding}" y1="${height / 2}" x2="${width - padding}" y2="${height / 2}" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
        <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="var(--surface-border)" stroke-width="2"/>
        
        ${xGrid}
        
        <!-- Gradient Area under curve -->
        <defs>
          <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--primary)" stop-opacity="0.4"/>
            <stop offset="100%" stop-color="var(--primary)" stop-opacity="0"/>
          </linearGradient>
        </defs>
        
        <!-- Area -->
        <path d="M ${padding},${height - padding} L ${points} L ${width - padding},${height - padding} Z" fill="url(#chartGlow)"/>
        
        <!-- Line Chart -->
        <polyline fill="none" stroke="var(--primary)" stroke-width="3" points="${points}"/>
        
        <!-- Nodes -->
        ${dataValues.map((val, index) => {
          const x = padding + (index * (width - 2 * padding) / 6);
          const y = height - padding - (val * (height - 2 * padding) / maxVal);
          return `<circle cx="${x}" cy="${y}" r="4" fill="var(--secondary)" stroke="var(--bg-secondary)" stroke-width="2"/>`;
        }).join('')}
        
        ${labels}
      </svg>
    `;
  }

  // Update DOM components
  updateDashboardUI() {
    // Header Stats
    const headerStreak = document.getElementById('header-streak-count');
    const headerXP = document.getElementById('header-xp-count');
    if (headerStreak) headerStreak.innerText = this.stats.streak;
    if (headerXP) headerXP.innerText = `${this.stats.xp} XP`;

    // Dashboard View Widgets
    const dashStreak = document.getElementById('dash-streak');
    const dashXP = document.getElementById('dash-xp');
    const dashLessons = document.getElementById('dash-lessons');
    const dashGames = document.getElementById('dash-games');
    
    if (dashStreak) dashStreak.innerText = this.stats.streak;
    if (dashXP) dashXP.innerText = this.stats.xp;
    if (dashLessons) dashLessons.innerText = this.stats.completedLessons.length;
    if (dashGames) dashGames.innerText = this.stats.completedGamesCount;

    // Mini Score bars
    const barGrammar = document.getElementById('progress-bar-grammar');
    const barVocab = document.getElementById('progress-bar-vocab');
    const barSpeaking = document.getElementById('progress-bar-speaking');

    if (barGrammar) barGrammar.style.width = `${Math.min(100, this.stats.grammarScore)}%`;
    if (barVocab) barVocab.style.width = `${Math.min(100, this.stats.vocabularyScore)}%`;
    if (barSpeaking) barSpeaking.style.width = `${Math.min(100, this.stats.speakingScore)}%`;

    // Render badges list
    const badgesContainer = document.getElementById('dashboard-badges');
    if (badgesContainer) {
      const allBadges = [
        { id: 'first_steps', name: 'First Steps', icon: '🔥' },
        { id: 'streak_3', name: 'Dedicated', icon: '⚡' },
        { id: 'grammar_guru', name: 'Grammar Guru', icon: '📚' },
        { id: 'gamer', name: 'Game Master', icon: '🎮' },
        { id: 'speaker', name: 'Fluent Speaker', icon: '🗣️' }
      ];

      badgesContainer.innerHTML = allBadges.map(b => {
        const isUnlocked = this.stats.unlockedBadges.includes(b.id);
        return `
          <div class="badge-item ${isUnlocked ? 'unlocked' : ''}">
            <div class="badge-icon" title="${isUnlocked ? 'Unlocked!' : 'Locked'}">${b.icon}</div>
            <div class="badge-name">${b.name}</div>
          </div>
        `;
      }).join('');
    }

    this.renderProgressChart();
  }
}

export const dashboard = new DashboardService();
