import React, {Component} from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';


const firebaseData = require("../../server/router");


class Login extends Component {

  constructor(props) {
		super(props);
    this.state = {
    };
  }
  componentDidMount() {
    firebaseData.firebaseConnection.auth().createUserWithEmailAndPassword("tchoi52@gmail.com", "password")
    .then(() => {
      Alert.alert("test account added")
    }).catch((error) =>{
      console.log(error)
      Alert.alert(error.message)
    })
  }

  render() {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Log In</Text>
      </View>
    );
  }
  
}


export default Login