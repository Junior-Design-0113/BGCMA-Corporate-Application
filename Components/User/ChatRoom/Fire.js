import firebase from 'firebase'; 
class Fire {
  constructor() {
    this.init();
    this.observeAuth();
    this.id = 'test'
  }
  
  init = () =>
    firebase.initializeApp({
        apiKey: "AIzaSyBxdS6aapWbOthR72uEFe_sJmn4vaQeN08",
        authDomain: "bgcma-corporate-portal.firebaseapp.com",
        databaseURL: "https://bgcma-corporate-portal.firebaseio.com",
        projectId: "bgcma-corporate-portal",
        storageBucket: "bgcma-corporate-portal.appspot.com",
        messagingSenderId: "195535537984",
        appId: "1:195535537984:web:5138ec640e9be03ead5ca5",
        measurementId: "G-5J9ZZWT81S"
    });

    observeAuth = () => firebase.auth().onAuthStateChanged(this.onAuthStateChanged);

    onAuthStateChanged = user => {
        if (!user) {
          try {
            // 4.
            firebase.auth().signInAnonymously();
          } catch ({ message }) {
            alert(message);
          }
        }
      };
    get ref() {
        return firebase.database().ref(this.id);
    }
    set ref(t) {
        firebase.database().ref(this.id);
    }

    chatID (id) {
        
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
          }    
        this.id = id
    }

    // 2.
    // 1.

    
    on = (callback) => {

        this.ref
            .limitToLast(20)
            .on('child_added', snapshot => callback(this.parse(snapshot)));
    }
    
    // 3.
    parse = snapshot => {
        // 1.
        const { timestamp: numberStamp, text, user } = snapshot.val();
        const { key: _id } = snapshot;
        // 2.
        const timestamp = new Date(numberStamp);
        // 3.
        const message = {
            _id,
            timestamp,
            text,
            user,
        };
        return message;
    }
    // 1.
    get uid() {
        return (firebase.auth().currentUser || {}).uid;
    }
    // 2.
    get timestamp() {
        return firebase.database.ServerValue.TIMESTAMP;
    }
    
    // 3.
    send = messages => {
        for (let i = 0; i < messages.length; i++) {
        const { text, user } = messages[i];
        // 4.
        const message = {
            text,
            user,
            timestamp: this.timestamp,
        };
        this.append(message);
        }
        console.log(messages)
    };
    // 5.
    append = message => this.ref.push(message);
    // 4.
    off() {
        this.ref.off();
    }

}
Fire.shared = new Fire()
export default Fire