import firebase from 'firebase';
let firebaseAdmin;

if (process.env.NODE_ENV === 'production') {
  firebaseAdmin = firebase.initializeApp({
    apiKey: process.env.REACT_APP_FIREBASE_CL_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_CL_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_CL_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_CL_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_CL_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_CL_APP_ID,
  });
} else {
  const key = require('./serviceAccountKey');
  firebaseAdmin = firebase.initializeApp(key.default);
}

const auth = firebaseAdmin.auth();
const database = firebaseAdmin.firestore();
export {auth, database};
