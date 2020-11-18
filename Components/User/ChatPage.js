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
    chatRooms: [],
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
 
  async getListChatRooms() {
    const db = firebase.firebaseConnection.firestore()
    const chatRef = await db.collection('Chat').get()
    
    return chatRef.docs.map(doc => doc.data());  
  }

  getUserChatRooms() {
    const listChatRooms = this.getListChatRooms(); 
    const chatRooms = []
    var num = 0

    listChatRooms.forEach(function(value, key) {
      if (value === this.state.email) {
        chatRooms.push({
          key: num++, 
          name: key, 
        })
      }
    })

    this.setState({chatRooms : chatRooms});
    console.log(chatRooms);

    return this.state.chatRooms; 
  };

   
  render() {
    return ( 
      <View style={styles.container}>
      	<Text style={styles.title}>Chat</Text>
      	<Text style={styles.title}>{"final id: " + this.state.roomId}</Text>
   	  </View>
    );
  }
}

export default ChatPage