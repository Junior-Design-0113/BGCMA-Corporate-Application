import React, {Component} from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';


const firebase = require("../../server/router");


class Login extends Component {

  constructor(props) {
		super(props);
    this.state = {
    };
  }
  componentDidMount() {
    // var authenticated = firebase.logIn("loll@gmail.com", "password")

    // if(authenticated) {
    //   console.log("true")
    // } else {
    //   console.log("false")
    // }

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