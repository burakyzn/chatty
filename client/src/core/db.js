import firebase from 'firebase';
let fire;

if (process.env.NODE_ENV === 'production') {
  fire = firebase.initializeApp({
    apiKey: process.env.REACT_APP_FIREBASE_CL_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_CL_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_CL_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_CL_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_CL_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_CL_APP_ID,
  });
} else {
  const key = require('./serviceAccountKey');
  fire = firebase.initializeApp(key.default);
}

export default fire;
