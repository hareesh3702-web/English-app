// auth.js - Authentication System supporting Guest Mode and ready for Firebase Auth

class AuthService {
  constructor() {
    this.currentUser = null;
    this.listeners = [];
  }

  // Initialize Auth status (loads cached Guest or User data)
  init() {
    const cachedUser = localStorage.getItem('em_hub_user');
    if (cachedUser) {
      this.currentUser = JSON.parse(cachedUser);
    } else {
      // Auto register as Guest if no session
      this.loginAsGuest();
    }
    this.notifyListeners();
  }

  // Subscribe to auth state changes
  onAuthStateChanged(callback) {
    this.listeners.push(callback);
    callback(this.currentUser); // immediate initial invoke
    return () => {
      this.listeners = this.listeners.filter(c => c !== callback);
    };
  }

  notifyListeners() {
    this.listeners.forEach(callback => callback(this.currentUser));
  }

  loginAsGuest() {
    this.currentUser = {
      uid: 'guest_' + Math.random().toString(36).substr(2, 9),
      displayName: 'Guest Learner',
      email: 'guest@learninghub.com',
      isAnonymous: true,
      avatarChar: 'G'
    };
    localStorage.setItem('em_hub_user', JSON.stringify(this.currentUser));
    this.notifyListeners();
  }

  loginWithEmail(email, password) {
    // Stub for standard login. Currently falls back to local user caching.
    this.currentUser = {
      uid: 'user_' + Math.random().toString(36).substr(2, 9),
      displayName: email.split('@')[0],
      email: email,
      isAnonymous: false,
      avatarChar: email.charAt(0).toUpperCase()
    };
    localStorage.setItem('em_hub_user', JSON.stringify(this.currentUser));
    this.notifyListeners();
    return Promise.resolve(this.currentUser);
  }

  signupWithEmail(email, password, displayName) {
    this.currentUser = {
      uid: 'user_' + Math.random().toString(36).substr(2, 9),
      displayName: displayName || email.split('@')[0],
      email: email,
      isAnonymous: false,
      avatarChar: (displayName || email).charAt(0).toUpperCase()
    };
    localStorage.setItem('em_hub_user', JSON.stringify(this.currentUser));
    this.notifyListeners();
    return Promise.resolve(this.currentUser);
  }

  loginWithGoogle() {
    console.log('[Auth] Google Login clicked. To enable, configure Firebase Auth.');
    return this.loginWithEmail('google.user@gmail.com', 'dummy_password');
  }

  loginWithGitHub() {
    console.log('[Auth] GitHub Login clicked. To enable, configure Firebase Auth.');
    return this.loginWithEmail('github.user@github.com', 'dummy_password');
  }

  logout() {
    localStorage.removeItem('em_hub_user');
    // Clear user progress items from storage if desired, or keep them
    this.currentUser = null;
    this.loginAsGuest();
  }
}

export const auth = new AuthService();

/**
 * =========================================================================
 * FIREBASE INTEGRATION GUIDE
 * =========================================================================
 * To switch from Guest Mode to Real Firebase Authentication, follow these steps:
 * 
 * 1. Add Firebase script CDN in index.html:
 *    <script src="https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js"></script>
 *    <script src="https://www.gstatic.com/firebasejs/10.0.0/firebase-auth-compat.js"></script>
 * 
 * 2. Replace the implementation in this file with:
 * 
 *    const firebaseConfig = {
 *       apiKey: "YOUR_API_KEY",
 *       authDomain: "YOUR_AUTH_DOMAIN",
 *       projectId: "YOUR_PROJECT_ID",
 *       storageBucket: "YOUR_STORAGE_BUCKET",
 *       messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
 *       appId: "YOUR_APP_ID"
 *    };
 *    firebase.initializeApp(firebaseConfig);
 * 
 *    class AuthService {
 *      init() {
 *        firebase.auth().onAuthStateChanged((user) => {
 *          if (user) {
 *            this.currentUser = {
 *              uid: user.uid,
 *              displayName: user.displayName || 'Learner',
 *              email: user.email,
 *              isAnonymous: user.isAnonymous,
 *              avatarChar: (user.displayName || user.email || 'U').charAt(0).toUpperCase()
 *            };
 *          } else {
 *            firebase.auth().signInAnonymously();
 *          }
 *          this.notifyListeners();
 *        });
 *      }
 *      // Implement other methods utilizing firebase.auth()...
 *    }
 */
