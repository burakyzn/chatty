import firebase from 'firebase'
import key from './serviceAccountKey.js'
let fire;

if(process.env.NODE_ENV === 'production'){
  fire = firebase.initializeApp({
      "apiKey": process.env.FIREBASE_CL_API_KEY,
      "authDomain": process.env.FIREBASE_CL_AUTH_DOMAIN,
      "projectId": process.env.FIREBASE_CL_PROJECT_ID,
      "storageBucket": process.env.FIREBASE_CL_STORAGE_BUCKET,
      "messagingSenderId": process.env.FIREBASE_CL_MESSAGING_SENDER_ID,
      "appId": process.env.FIREBASE_CL_APP_ID
  });
} else {
  var serviceAccount = key;

  fire =  firebase.initializeApp(serviceAccount);
}

// const db = firebase.auth();
export default fire;