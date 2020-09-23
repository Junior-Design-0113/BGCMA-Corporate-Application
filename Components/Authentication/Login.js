
import React, {Component} from 'react';
import { StyleSheet, Text, View, Alert, Image, Dimensions } from 'react-native';
import {Button} from 'native-base';
import {TextInput} from 'react-native';
import * as Crypto from 'expo-crypto';

const firebase = require("../../server/router");

class Login extends Component {
  
  state={
    user:"",
    password:""
  }
  
  onPressRegister() {
    var navigation = this.props.navigation;
    navigation.navigate('Register')
    }
  onPressLogin() {
    if(!this.state.user || !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.state.user)) {
			Alert.alert("Please enter a valid email address");
      return;
    }
    if(!this.state.password) {
			Alert.alert("Please enter a password");
      return;
    }
    
    this.state.user = this.state.user.toLowerCase()
    const db = firebase.firebaseConnection.firestore()
    const pendingUser = db.collection('PendingUsers').doc(this.state.user);

    firebase.firebaseConnection.auth().signInWithEmailAndPassword(this.state.user, this.state.password)
    .then(() => {
      var navigation = this.props.navigation;
      navigation.navigate('Home', {user: this.state.user})
    }).catch((error) => {
      pendingUser.get().then(found => {
        if (found.exists) {
          Alert.alert('This account has not yet been approved')
        } else {
          this.checkUsers(error)
        }
      })
    })
  }

  // login() {
  //   firebase.firebaseConnection.auth().signInWithEmailAndPassword(this.state.user, this.state.password)
  //   .then(() => {
  //     var navigation = this.props.navigation;
  //     navigation.navigate('Home', {user: this.state.user})
  //   })
  // }
  
  async checkUsers(error) {
    const db = firebase.firebaseConnection.firestore()
    const user = db.collection('Users').doc(this.state.user);
    const self = this

    user.get().then(async function(doc) {
      if (doc.exists) {
        const hash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, self.state.password)
        if (hash === doc.data().password) {
          await firebase.firebaseConnection.firestore().collection('Users').doc(self.state.user).update({
            password: null})
          .then(() => {
          firebase.firebaseConnection.auth().createUserWithEmailAndPassword(self.state.user, self.state.password)
          .then(() => {
            firebase.firebaseConnection.auth().signInWithEmailAndPassword(self.state.user, self.state.password)
          .then(() => {
            var navigation = self.props.navigation;
            navigation.navigate('Home', {user: self.state.user})
          })
          })
        })
        } else {
          Alert.alert(error.message)
        }
      } else {
          Alert.alert(error.message)
      }
    })
}

  render() {
    return ( 
      <View style={styles.container}>
        <Image 
          style={{maxHeight: Dimensions.get('window').height * .28, marginTop: 10}} 
          source={require('./../../assets/BGCMA.png')} 
          resizeMode = 'contain'/>

        <View style={styles.form}>
          <Text style={styles.title}>Portal</Text>
          
          <TextInput
          keyboardType = "email-address"
          placeholder =  "Email"
          style={styles.input}
          onChangeText={(text) => this.setState({user:text})}
          value = {this.state.text} />
          <TextInput
          secureTextEntry
          style={styles.input}
          placeholder = "Password"
          onChangeText={(text) => this.setState({password:text})}
          value = {this.state.text} />
          
          <Button  style={styles.button} onPress={() => this.onPressLogin()}><Text style={styles.text}>Log In</Text></Button>
          <Button  style={styles.button2} onPress={() => this.onPressRegister()}><Text style={styles.text}>Register</Text></Button>
        </View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    flex: 3,
    marginTop: '10%',
  },
  buttonHolder: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 15,
    // paddingBottom: 45,
  },
  title: {
    marginLeft: 'auto',
    marginRight: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    fontSize: 35,
  },
  button: {
    padding: 20,
    width: '50%',
    height: '12%',
    backgroundColor: '#0081c6',
    borderRadius: 35,
    alignItems: 'center',
    marginRight: 10,
    marginLeft: 10,
    marginBottom: 20, 
    marginTop: 20, 
  },
  button2: {
    padding: 20,
    width: '50%',
    height: '12%',
    backgroundColor: '#84BD00',
    borderRadius: 35,
    alignItems: 'center',
    marginRight: 10,
    marginLeft: 10,
  },
  text: {
    color: 'white',
    fontWeight: '700',
    fontSize: 20,
    marginRight: 'auto',
    marginLeft: 'auto'
  },
  // text2: {
  //   color: 'black',
  //   fontWeight: '700',
  //   fontSize: 35,
  //   marginRight: 'auto',
  //   marginLeft: 'auto',
  //   marginTop: 20,
  //   marginBottom: 50,
  // },
  input: {
    margin: 15,
    marginLeft: 2,
    height: 40,
    //width: 250,
    borderColor: 'black',
    borderWidth: 1,
    paddingLeft: 10,
    alignItems: 'center',
 },
//  imageHolder: {
//   margin: 33%,
// },
});

export default Login