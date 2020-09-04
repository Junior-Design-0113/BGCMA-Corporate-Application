
import React, {Component} from 'react';
import { StyleSheet, Text, View, Alert, Image } from 'react-native';
import {Button} from 'native-base';
import {TextInput} from 'react-native';

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

    var authenticated = false
    const db = firebase.firebaseConnection.firestore()
    const pendingUsers = db.collection('PendingUsers').doc(this.state.user);
    //Checks if user is part of PendingUsers (those that have not yet been appoved)
    pendingUsers.get().then((found) => {
      if (found.exists) {
        Alert.alert("Your account has not yet been approved by an admin")
      } else {
        firebase.firebaseConnection.auth().signInWithEmailAndPassword(this.state.user, this.state.password)
        .then(() => {
          this.setState({authenticated: true}, function() {
          authenticated = true
          var navigation = this.props.navigation;
          navigation.navigate('Home', {user: this.state.user})
          })
        }).catch((error) =>{
          console.log(error)
          Alert.alert(error.message)
          changeAuth(false)
        })
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Image 
          style={{maxHeight: '30%', marginTop: 10}} 
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
          <View style={styles.buttonHolder}>
            <Button  style={styles.button} onPress={() => this.onPressRegister()}><Text style={styles.text}>Register</Text></Button>
            <Button  style={styles.button2} onPress={() => this.onPressLogin()}><Text style={styles.text}>Log In</Text></Button>
          </View>
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
    flexDirection: 'row', 
    padding: 20,
    width: '40%',
    height: '180%',
    backgroundColor: '#0081c6',
    borderRadius: 35,
    alignItems: 'center',
    marginRight: 10,
    marginLeft: 10,
  },
  button2: {
    flexDirection: 'row', 
    padding: 20,
    width: '40%',
    height: '180%',
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
    borderColor: 'black',
    borderWidth: 1,
    paddingLeft: 10
 },
//  imageHolder: {
//   margin: 33%,
// },
});

export default Login