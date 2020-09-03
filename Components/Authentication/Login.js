
import React, {Component} from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
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
        var authenticated = false
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

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text2}>Log In</Text>
        <TextInput
        placeholder =  "Username"
        style={styles.textInput}
        onChangeText={(text) => this.setState({user:text})}
        value = {this.state.text} />
        <TextInput
        secureTextEntry
        style={styles.textInput}
        placeholder = "Password"
        onChangeText={(text) => this.setState({password:text})}
        value = {this.state.text} />
        <View style={styles.form2}>
          <Button  style={styles.button} onPress={() => this.onPressRegister()}><Text style={styles.text}>Register</Text></Button>
          <Button  style={styles.button} onPress={() => this.onPressLogin()}><Text style={styles.text}>Log In</Text></Button>
        </View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    padding: 20,
    marginTop: 100,
    marginLeft: 'auto',
    marginRight: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    width: '90%',
  },
  form1: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  form2: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: '20%',
  },
  title: {
    marginLeft: 'auto',
    marginRight: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    fontWeight: '800',
    fontSize: 30,
  },
  button: {
    flexDirection: 'row', 
    padding: 20,
    width: '40%',
    height: '180%',
    backgroundColor: 'dodgerblue',
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
  text2: {
    color: 'black',
    fontWeight: '700',
    fontSize: 35,
    marginRight: 'auto',
    marginLeft: 'auto',
    marginTop: 20,
    marginBottom: 50,
  },
  textInput: {
    height: 30,
    width: 300, 
    borderColor: 'gray', 
    borderWidth: 1,
  },
  image: {
    marginTop: 0, 
    width: 360,
    height: 206,
  }
});

export default Login