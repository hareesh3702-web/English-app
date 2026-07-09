# English Malayalam Learning Hub

An all-in-one, responsive Progressive Web App (PWA) designed to help Malayalam-speaking users learn English. This project features translation, grammar guides, vocabulary flashcards, speaking practice, and mini-games.

This repository is optimized for **free hosting on GitHub Pages** and can be compiled into a **native Android App (`.apk`)** using Capacitor.

---

## 🚀 Key Modules & Features

1. **Translator (Module 1)**: English $\leftrightarrow$ Malayalam text translations powered by MyMemory API. Includes offline phonetic **Manglish** transliteration (e.g., `Enikku vishakkunnu` $\rightarrow$ `എനിക്ക് വിശക്കുന്നു`).
2. **Grammar Course (Module 2)**: Complete guides covering Parts of Speech, Tenses, Voice, and Speech with explanation overlays in Malayalam, examples, and interactive quizzes.
3. **Daily Vocabulary (Module 3)**: Learn 100 useful words categorized by context (Hospital, Travel, Technology, etc.) with IPA pronunciations, definitions, example sentences, and bookmarking.
4. **Speaking Practice (Module 4)**: Simulated voice conversations for situational settings (Restaurant, Doctor visit, Job Interview) leveraging the HTML5 Web Speech API (`SpeechRecognition`).
5. **Grammar Corrector (Module 5)**: Input incorrect English sentences (e.g. `I going office yesterday`) and receive corrected variants, grammatical rules, and explanations in Malayalam.
6. **Writing Assistant (Module 6)**: Modular templates for emails, resumes, sick leave application letters, and essay drafts with automatic bracket completion checkups.
7. **Learning Games (Module 7)**: Engaging minigames like "Match the Words" and "Sentence Scramble" to test grammatical and vocabulary skills.
8. **User Dashboard (Module 9)**: Visual SVG progress charts, total XP tracker, active streak dials, and digital achievements badges.
9. **AI Teacher Tutor (Module 11)**: Simulated AI chatbot room. You can input your Google Gemini API Key directly inside the tutor settings tab to enable live AI responses natively in your browser.
10. **Global Search (Module 12)**: Instantly search across grammar lessons, vocabulary items, and idioms.
11. **Admin Console (Module 14)**: Perform CRUD (create, read, update, delete) operations on lessons and words list which persist directly inside local storage databases.

---

## 🛠️ Architecture & Technologies

- **Frontend**: Vanilla HTML5, CSS3 variables, glassmorphism, responsive keyframes, ES6+ modules.
- **PWA Capabilities**: native `manifest.json` and a service worker (`sw.js`) caching critical assets for offline support.
- **Speech**: HTML5 Web Speech API (`SpeechSynthesis` for playback, `webkitSpeechRecognition` for microphone recording).
- **Backend / Authentication**: Simulated local storage guest session. Fully structured with stubs to plug in Firebase Authentication / Firestore with minimal configuration.

---

## 💻 Local Installation & Setup

1. Make sure you have **Node.js** installed on your system.
2. Clone or navigate to the project directory:
   ```bash
   cd english-malayalam-learning-hub
   ```
3. Install dependencies (Capacitor tools and dev utilities):
   ```bash
   npm install
   ```
4. Start the local server to run the application in your browser:
   ```bash
   npm start
   ```
5. Open your web browser and navigate to `http://localhost:8080` to experience the app.

---

## 🌐 Free Deployment to GitHub Pages

GitHub Pages is a free hosting service for static websites. Since this application runs entirely client-side, it is a perfect match:

1. Create a public repository on your GitHub account named `english-malayalam-learning-hub`.
2. Initialize Git inside the project directory, commit the files, and push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of English Malayalam Learning Hub PWA"
   git remote add origin https://github.com/YOUR_USERNAME/english-malayalam-learning-hub.git
   git branch -M main
   git push -u origin main
   ```
3. Go to the repository settings page on GitHub.
4. Select **Pages** from the sidebar.
5. Under **Build and deployment**, select **Deploy from a branch** and set the branch to `main` (and folder to `/ (root)`).
6. Click **Save**. Within a few minutes, your site will be live at `https://YOUR_USERNAME.github.io/english-malayalam-learning-hub/`.

---

## 🤖 Creating the Android App (`.apk`)

Yes, you can easily wrap this web application into a fully-functional native Android App. Since the codebase is written as a mobile-first responsive PWA, it behaves like a native app when packaged using **Capacitor**:

### Prerequisites
- Install **Android Studio** on your system.
- Install the Android SDK and command line tools.

### Build Steps

1. Install the Capacitor CLI and Android platform wrapper:
   ```bash
   npm run cap:init
   ```
   *Note: This command configures the Android package identity (e.g. `com.learnenglish.malayalamhub`).*
   
2. Add the Android platform to your workspace:
   ```bash
   npm run cap:add
   ```
   *This creates a native Android project folder named `android/` inside your repository.*

3. Synchronize your web changes into the Android assets:
   ```bash
   npm run cap:sync
   ```

4. Open the Android project in Android Studio:
   ```bash
   npx cap open android
   ```

5. **Generate the APK File**:
   - In Android Studio, wait for the Gradle build to complete successfully.
   - Go to **Build** in the top menu $\rightarrow$ **Build Bundle(s) / APK(s)** $\rightarrow$ **Build APK(s)**.
   - Once compiled, a notification bubble will show "APK(s) generated successfully". Click **Locate** to retrieve the compiled debug `app-debug.apk` file!
   - You can copy this `.apk` file to your Android phone, enable "Install from Unknown Sources", and run the app.

6. **Release signing (Optional)**:
   - To deploy to the Google Play Store, go to **Build** $\rightarrow$ **Generate Signed Bundle / APK**, choose **APK**, generate a keystore signature key, and compile a release-signed APK.
