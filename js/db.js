// db.js - Complete static database of English-Malayalam Learning resources

export const GRAMMAR_LESSONS = [
  {
    id: 'nouns',
    category: 'parts_of_speech',
    title: 'Nouns (നാമങ്ങൾ)',
    subtitle: 'Learn about naming words in English',
    malayalamDesc: 'ആളുകൾ, സ്ഥലങ്ങൾ, വസ്തുക്കൾ, ആശയങ്ങൾ എന്നിവയുടെ പേരിനെയാണ് Noun (നാമം) എന്ന് വിളിക്കുന്നത്. ഉദാഹരണത്തിന്: Ramu, Kochi, Book, Love.',
    englishDesc: 'A noun is a word that names a person, place, thing, or idea. Examples include Ramu, Kochi, Book, and Love.',
    examples: [
      { eng: 'John is playing football.', mal: 'ജോൺ ഫുട്ബോൾ കളിക്കുന്നു.' },
      { eng: 'Kochi is a beautiful city.', mal: 'കൊച്ചി ഒരു മനോഹരമായ നഗരമാണ്.' },
      { eng: 'The table is made of wood.', mal: 'മേശ തടികൊണ്ടാണ് നിർമ്മിച്ചിരിക്കുന്നത്.' }
    ],
    quiz: [
      {
        question: 'Identify the noun in the sentence: "The cat slept on the bed."',
        options: ['slept', 'cat', 'on', 'the'],
        answerIndex: 1,
        explanation: '"Cat" is a noun because it names an animal. "Slept" is a verb, "on" is a preposition, and "the" is an article.'
      },
      {
        question: 'Which of the following is a proper noun (വ്യക്തിഗത നാമം)?',
        options: ['City', 'Kerala', 'Book', 'Happiness'],
        answerIndex: 1,
        explanation: '"Kerala" is a proper noun because it names a specific place. Others are common or abstract nouns.'
      }
    ]
  },
  {
    id: 'verbs',
    category: 'parts_of_speech',
    title: 'Verbs (ക്രിയകൾ)',
    subtitle: 'Learn about action words',
    malayalamDesc: 'ഒരു പ്രവർത്തി അല്ലെങ്കിൽ അവസ്ഥയെ സൂചിപ്പിക്കുന്ന വാക്കുകളെയാണ് Verb (ക്രിയ) എന്ന് പറയുന്നത്. ഇംഗ്ലീഷ് വാക്യങ്ങളിൽ ക്രിയകൾ അത്യാവശ്യമാണ്. ഉദാഹരണത്തിന്: run, write, sleep, is, have.',
    englishDesc: 'A verb is a word that expresses an action, occurrence, or state of being. It is the heart of every English sentence. Examples: run, write, sleep, is, have.',
    examples: [
      { eng: 'She sings beautifully.', mal: 'അവൾ മനോഹരമായി പാടുന്നു.' },
      { eng: 'They are reading books.', mal: 'അവർ പുസ്തകങ്ങൾ വായിക്കുകയാണ്.' },
      { eng: 'I have a car.', mal: 'എനിക്ക് ഒരു കാറുണ്ട്.' }
    ],
    quiz: [
      {
        question: 'Choose the verb in the sentence: "We walked to the park yesterday."',
        options: ['We', 'walked', 'park', 'yesterday'],
        answerIndex: 1,
        explanation: '"Walked" represents the physical action performed in the past, hence it is the verb.'
      }
    ]
  },
  {
    id: 'tenses_present_simple',
    category: 'tenses',
    title: 'Simple Present Tense (സാധാരണ വർത്തമാനകാലം)',
    subtitle: 'For habits and general truths',
    malayalamDesc: 'സ്ഥിരമായി ചെയ്യുന്ന കാര്യങ്ങൾ (habits), സാർവത്രിക സത്യങ്ങൾ (general truths) എന്നിവ പറയാൻ Simple Present Tense ഉപയോഗിക്കുന്നു. ഇതിൽ സബ്ജക്റ്റ് ഏകവചനം (singular) ആണെങ്കിൽ ക്രിയയുടെ കൂടെ -s അല്ലെങ്കിൽ -es ചേർക്കണം.',
    englishDesc: 'Simple Present Tense is used to describe habits, unchanging situations, general truths, and fixed arrangements. Add -s or -es to the verb for singular subjects (he, she, it).',
    examples: [
      { eng: 'The sun rises in the east.', mal: 'സൂര്യൻ കിഴക്ക് ഉദിക്കുന്നു.' },
      { eng: 'I drink tea every morning.', mal: 'ഞാൻ എല്ലാ ദിവസവും രാവിലെ ചായ കുടിക്കുന്നു.' },
      { eng: 'He plays tennis on Sundays.', mal: 'അവൻ ഞായറാഴ്ചകളിൽ ടെന്നീസ് കളിക്കുന്നു.' }
    ],
    quiz: [
      {
        question: 'Fill in the blank: "She ___ to school by bus every day."',
        options: ['go', 'goes', 'going', 'went'],
        answerIndex: 1,
        explanation: 'Since "She" is a singular subject, we add "-es" to the base verb "go", making it "goes".'
      }
    ]
  },
  {
    id: 'tenses_past_simple',
    category: 'tenses',
    title: 'Simple Past Tense (സാധാരണ ഭൂതകാലം)',
    subtitle: 'For completed past actions',
    malayalamDesc: 'ഭൂതകാലത്തിൽ നടന്നു കഴിഞ്ഞ ഒരു പ്രവർത്തി കാണിക്കുന്നതിനാണ് Simple Past Tense ഉപയോഗിക്കുന്നത്. ഇതിൽ ക്രിയയുടെ രണ്ടാമത്തെ രൂപം (V2 form) ആണ് ഉപയോഗിക്കുക. ഉദാഹരണത്തിന്: went, played, wrote.',
    englishDesc: 'Simple Past Tense is used to talk about actions that were completed in the past. We use the second form of the verb (V2). Example: went, played, wrote.',
    examples: [
      { eng: 'I visited Chennai last week.', mal: 'ഞാൻ കഴിഞ്ഞ ആഴ്ച ചെന്നൈ സന്ദർശിച്ചു.' },
      { eng: 'They completed the project.', mal: 'അവർ പ്രോജക്റ്റ് പൂർത്തിയാക്കി.' },
      { eng: 'He sold his old bike.', mal: 'അവൻ തന്റെ പഴയ ബൈക്ക് വിറ്റു.' }
    ],
    quiz: [
      {
        question: 'Select the correct simple past form: "They ___ a new house last month."',
        options: ['buy', 'bought', 'buys', 'buying'],
        answerIndex: 1,
        explanation: '"Bought" is the V2 past tense form of the verb "buy".'
      }
    ]
  },
  {
    id: 'active_passive',
    category: 'voice',
    title: 'Active & Passive Voice (കർത്തരി, കർമ്മണി പ്രയോഗങ്ങൾ)',
    subtitle: 'Changing sentence focus',
    malayalamDesc: 'Active Voice-ൽ പ്രവർത്തി ചെയ്യുന്ന ആൾക്കാണ് (Subject) പ്രാധാന്യം. Passive Voice-ൽ പ്രവർത്തിക്ക് അല്ലെങ്കിൽ കർമ്മത്തിനാണ് (Object) മുൻഗണന നൽകുന്നത്. ഉദാഹരണത്തിന്: "Ramu wrote the letter" (Active) -> "The letter was written by Ramu" (Passive).',
    englishDesc: 'In Active Voice, the subject performs the action. In Passive Voice, the object becomes the subject, emphasizing the action itself. Formula: Subject + Verb vs. Object + auxiliary verb + V3 participle + (by + subject).',
    examples: [
      { eng: 'Active: The chef cooked the meal.', mal: 'പാചകക്കാരൻ ഭക്ഷണം പാകം ചെയ്തു.' },
      { eng: 'Passive: The meal was cooked by the chef.', mal: 'ഭക്ഷണം പാചകക്കാരനാൽ പാകം ചെയ്യപ്പെട്ടു.' }
    ],
    quiz: [
      {
        question: 'Change this sentence to Passive Voice: "The boy broke the window."',
        options: [
          'The window broke the boy.',
          'The window is broken by the boy.',
          'The window was broken by the boy.',
          'The boy was broken by the window.'
        ],
        answerIndex: 2,
        explanation: '"Broke" is past tense, so we use "was broken" in the passive voice.'
      }
    ]
  }
];

export const VOCABULARY = [
  // Daily conversation
  {
    word: 'Greet',
    malayalam: 'അഭിവാദ്യം ചെയ്യുക',
    ipa: '/ɡriːt/',
    category: 'Daily conversation',
    sentence: 'He greeted his friends with a warm smile.',
    sentenceMal: 'അവൻ തന്റെ കൂട്ടുകാരെ സ്നേഹത്തോടെ ചിരിച്ചുകൊണ്ട് അഭിവാദ്യം ചെയ്തു.',
    synonyms: ['welcome', 'salute'],
    antonyms: ['ignore', 'neglect']
  },
  {
    word: 'Apologize',
    malayalam: 'ക്ഷമ ചോദിക്കുക',
    ipa: '/əˈpɒl.ə.dʒaɪz/',
    category: 'Daily conversation',
    sentence: 'You should apologize for your behavior.',
    sentenceMal: 'നിന്റെ പെരുമാറ്റത്തിന് നീ ക്ഷമ ചോദിക്കണം.',
    synonyms: ['regret', 'atone'],
    antonyms: ['accuse', 'defend']
  },
  // Office
  {
    word: 'Colleague',
    malayalam: 'സഹപ്രവർത്തകൻ / സഹപ്രവർത്തക',
    ipa: '/ˈkɒl.iːɡ/',
    category: 'Office',
    sentence: 'She discussed the plan with her colleague.',
    sentenceMal: 'അവൾ തന്റെ സഹപ്രവർത്തകനുമായി പദ്ധതി ചർച്ച ചെയ്തു.',
    synonyms: ['coworker', 'peer'],
    antonyms: ['opponent', 'competitor']
  },
  {
    word: 'Deadline',
    malayalam: 'അവസാന സമയം',
    ipa: '/ˈded.laɪn/',
    category: 'Office',
    sentence: 'We must submit the report before the deadline.',
    sentenceMal: 'നമ്മൾ അവസാന സമയത്തിന് മുൻപായി റിപ്പോർട്ട് സമർപ്പിക്കണം.',
    synonyms: ['cutoff', 'limit'],
    antonyms: ['extension']
  },
  // Hospital
  {
    word: 'Prescription',
    malayalam: 'മരുന്ന് കുറിപ്പ്',
    ipa: '/prɪˈskrɪp.ʃən/',
    category: 'Hospital',
    sentence: 'The doctor wrote a prescription for the medicine.',
    sentenceMal: 'ഡോക്ടർ മരുന്നിനുള്ള ഒരു കുറിപ്പ് എഴുതിത്തന്നു.',
    synonyms: ['instruction', 'recipe'],
    antonyms: []
  },
  // Travel
  {
    word: 'Destination',
    malayalam: 'ലക്ഷ്യസ്ഥാനം / എത്തുന്ന സ്ഥലം',
    ipa: '/ˌdes.tɪˈneɪ.ʃən/',
    category: 'Travel',
    sentence: 'It took six hours to reach our destination.',
    sentenceMal: 'ഞങ്ങളുടെ ലക്ഷ്യസ്ഥാനത്ത് എത്തിച്ചേരാൻ ആറ് മണിക്കൂർ എടുത്തു.',
    synonyms: ['goal', 'journey end'],
    antonyms: ['start point']
  },
  // Technology
  {
    word: 'Software',
    malayalam: 'കമ്പ്യൂട്ടർ പ്രോഗ്രാമുകൾ',
    ipa: '/ˈsɒft.weər/',
    category: 'Technology',
    sentence: 'They installed a new security software.',
    sentenceMal: 'അവർ പുതിയൊരു സുരക്ഷാ പ്രോഗ്രാം ഇൻസ്റ്റാൾ ചെയ്തു.',
    synonyms: ['program', 'application'],
    antonyms: ['hardware']
  },
  // Interview
  {
    word: 'Strengths',
    malayalam: 'കഴിവുകൾ / കരുത്തുകൾ',
    ipa: '/streŋkθs/',
    category: 'Interview',
    sentence: 'Focus on your strengths during the interview.',
    sentenceMal: 'അഭിമുഖത്തിൽ നിങ്ങളുടെ കഴിവുകളിൽ ശ്രദ്ധ കേന്ദ്രീകരിക്കുക.',
    synonyms: ['abilities', 'merits'],
    antonyms: ['weaknesses']
  }
  // (We will dynamically expand this database inside code or storage for full 100 word experience)
];

export const SCENARIOS = [
  {
    id: 'restaurant',
    title: 'Restaurant (ഭക്ഷണശാല)',
    description: 'Practice ordering food and talking to the waiter in English.',
    icon: 'fa-utensils',
    starter: 'Hello, welcome to Antigravity Diner. Are you ready to order now?',
    systemPrompt: 'You are a polite waiter at a restaurant. Keep replies short. Ask what food they want or if they need the bill. Help them correct sentences if wrong. Write a small Malayalam explanation inside parentheses if they ask.',
    suggestedReplies: [
      'Yes, I want to order a chicken biryani.',
      'Could you show me the menu card, please?',
      'Can I get some water first?',
      'What is special today?'
    ]
  },
  {
    id: 'interview',
    title: 'Job Interview (അഭിമുഖം)',
    description: 'Practice answering job interview questions professionally.',
    icon: 'fa-briefcase',
    starter: 'Welcome. Thank you for coming today. To start, could you tell me a little about yourself?',
    systemPrompt: 'You are a professional HR interviewer. Ask the user about their career history, strengths, and goals. Give gentle grammar tips and speaking confidence evaluations. Provide translation support in Malayalam if requested.',
    suggestedReplies: [
      'Sure. I am a software developer with two years of experience.',
      'I completed my graduation recently and am looking for my first job.',
      'I am very hard working and I love coding.',
      'Could you explain the job role again?'
    ]
  },
  {
    id: 'hospital',
    title: 'Hospital / Clinic (ആശുപത്രി)',
    description: 'Practice explaining symptoms to a doctor.',
    icon: 'fa-user-md',
    starter: 'Hello, what seems to be the problem today?',
    systemPrompt: 'You are a caring doctor. Ask the patient about their symptoms, temperature, pain scale, or duration. Provide advice and grammar/translation corrections. Keep conversation simple.',
    suggestedReplies: [
      'Doctor, I have a severe headache and fever since yesterday.',
      'I feel dizzy and weak today.',
      'Do I need to take medicines?',
      'How much is the consultation fee?'
    ]
  }
];

export const WRITING_TEMPLATES = [
  {
    id: 'leave_letter',
    title: 'Sick Leave Application (അവധി അപേക്ഷ)',
    desc: 'Useful for applying for school/college/office sick leave.',
    outline: 'Subject: Application for Leave of Absence due to Sickness\n\nDear Sir/Madam,\n\nI am writing to inform you that I am suffering from [Fever/Cold/Headache] and the doctor has advised me to rest for [number] days. Therefore, I will not be able to attend the [office/school] from [start date] to [end date].\n\nKindly grant me leave for these days. I have attached the medical certificate for your reference.\n\nThank you,\n\nYours faithfully,\n[Your Name]',
    suggestions: [
      'Use formal terms like "requesting leave" instead of "I will not come".',
      'Mention exact dates clearly.',
      'Keep the tone respectful.'
    ]
  },
  {
    id: 'email_job',
    title: 'Job Application Email (തൊഴിൽ അപേക്ഷ)',
    desc: 'Formally write to HR applying for a vacant position.',
    outline: 'Subject: Application for the post of [Job Title] - [Your Name]\n\nDear Hiring Manager,\n\nI am writing to express my interest in the [Job Title] position advertised on [Source]. With [number] years of experience in this field, I believe my skills match your requirements.\n\nI have attached my resume for your review. I look forward to the possibility of discussing this opportunity in an interview.\n\nSincerely,\n\n[Your Name]\n[Contact details]',
    suggestions: [
      'Tailor the job title and source.',
      'Do not write long text, keep it direct.',
      'Always double-check contact information.'
    ]
  }
];

export const IDIOMS = [
  { phrase: 'Piece of cake', meaning: 'വളരെ എളുപ്പമുള്ള കാര്യം', engMeaning: 'Very easy task', example: 'The English exam was a piece of cake.' },
  { phrase: 'Bite the bullet', meaning: 'ബുദ്ധിമുട്ടുള്ള ഒരു കാര്യം ധൈര്യപൂർവ്വം ചെയ്യുക', engMeaning: 'Face a difficult situation with courage', example: 'I decided to bite the bullet and go to the dentist.' },
  { phrase: 'Break a leg', meaning: 'ആശംസകൾ നേരുന്നു', engMeaning: 'Good luck (used in performing arts)', example: 'Go on stage and break a leg!' }
];

export const PHRASAL_VERBS = [
  { phrase: 'Call off', meaning: 'റദ്ദാക്കുക', engMeaning: 'Cancel', example: 'The match was called off due to heavy rain.' },
  { phrase: 'Give up', meaning: 'പരാജയം സമ്മതിക്കുക / ഉപേക്ഷിക്കുക', engMeaning: 'Stop trying', example: 'Never give up on your dreams.' },
  { phrase: 'Look after', meaning: 'പരിപാലിക്കുക', engMeaning: 'Take care of', example: 'She looks after her elderly parents.' }
];
