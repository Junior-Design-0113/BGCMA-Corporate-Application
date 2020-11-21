import React, {Component} from 'react';
import {Text, StyleSheet, TextInput, View, Alert, Switch} from 'react-native';


const firebase = require("../../server/router");
const s = require('../../Style/style')
const styles = s.styles

class ChatPage extends Component {

  constructor(props) {
    super(props);
  	this.state = {
  	  email: null,
  	  committee: null,
  	  admin: false,
  	  executive: false,
  	  users: [],
      selectedCommittee: null,
      roomId: "roomId",
    }
    // const db = fb.firebaseConnection.firestore()
    // this.ref = db.collection('PendingUsers')
  }

  componentDidMount() {
    var state = this.props.route.params.state
    Object.keys(state).forEach(key => {
        this.setState({[key]: state[key]})
    });

    //const room = this.props.route.params.roomId;
    //this.setState({roomId: this.props.route.params.roomId})
  }

  render() {
    return ( 
      <View style={styles.container}>
      	<Text style={styles.title}>Chatt</Text>
      	<Text style={styles.title}>{"final id: " + this.state.roomId}</Text>
   	  </View>
    );
  }
}

export default ChatPage