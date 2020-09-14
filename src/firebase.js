import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyCxCjXVetZwvh3hotJ6JwAhKrVL2UbQuiE",
    authDomain: "fantasy-obs-overlay.firebaseapp.com",
    databaseURL: "https://fantasy-obs-overlay.firebaseio.com",
    projectId: "fantasy-obs-overlay",
    storageBucket: "fantasy-obs-overlay.appspot.com",
    messagingSenderId: "1037849112199",
    appId: "1:1037849112199:web:0e267f8ed8d4bd6273d222"
};

firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();