import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const firebaseConfig = {
  apiKey: "AIzaSyC2ujS1NnJMNFIbXdGsd0TccjQbvhPKAM4",
  authDomain: "giphy-search-4f6f5.firebaseapp.com",
  projectId: "giphy-search-4f6f5",
  storageBucket: "giphy-search-4f6f5.appspot.com",
  messagingSenderId: "263678956829",
  appId: "1:263678956829:web:91db7b99a28ee58093fdf4",
  measurementId: "G-CH727BVY46"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();

export { auth };
