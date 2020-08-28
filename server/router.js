import * as firebase from "firebase";


module.exports.initializeFirebase = function() {
    firebaseConfig = {
        apiKey: "AIzaSyBxdS6aapWbOthR72uEFe_sJmn4vaQeN08",
        authDomain: "bgcma-corporate-portal.firebaseapp.com",
        databaseURL: "https://bgcma-corporate-portal.firebaseio.com",
        projectId: "bgcma-corporate-portal",
        storageBucket: "bgcma-corporate-portal.appspot.com",
        messagingSenderId: "195535537984",
        appId: "1:195535537984:web:5138ec640e9be03ead5ca5",
        measurementId: "G-5J9ZZWT81S"
    }
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
      }
}


module.exports.firebaseConnection = firebase;

