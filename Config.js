import firebase from 'firebase'
require('@firebase/firestore')

var firebaseConfig = {
    apiKey: "AIzaSyCf-gkRN7lFjpcncOKxWv6QjzuN4wohyqs",
    authDomain: "rent-a-dress-64198.firebaseapp.com",
    projectId: "rent-a-dress-64198",
    storageBucket: "rent-a-dress-64198.appspot.com",
    messagingSenderId: "236923336888",
    appId: "1:236923336888:web:a7aa07dfb8255ad3025c4d"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

export default firebase.firestore()