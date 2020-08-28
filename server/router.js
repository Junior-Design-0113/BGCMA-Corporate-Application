import * as firebase from "firebase";
import { Alert } from 'react-native';


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


var created = false
module.exports.createUser = function(username, password) {
    firebase.auth().createUserWithEmailAndPassword(username, password)
    .then(() => {
        created = true
      Alert.alert("test account added")
    }).catch((error) =>{
        created = true
      console.log(error)
      Alert.alert(error.message)
    })
    return created
}


var authenticated = false
module.exports.logIn = function(username, password) {
    firebase.auth().signInWithEmailAndPassword(username, password)
    .then(() => {
        authenticated = true
    }).catch((error) =>{
      console.log(error)
      Alert.alert(error.message)
      authenticated = false
    })
    return authenticated
}

