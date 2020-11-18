import React, {Component} from 'react';
import {Text, StyleSheet, TextInput, View, Alert, Switch} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

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

    listChatRooms.forEach(function(value) {
      if (value.getString("email1") === this.state.email) {
        chatRooms.push({
          key: num++, 
          name: value.getString("email2"), //other user
        })
      } else if (value.getString("email2") === this.state.email) {
        chatRooms.push({
          key: num++, 
          name: value.getString("email1"), //other user
        })
      }
    })

    this.setState({chatRooms : chatRooms});
    console.log(chatRooms);

    return this.state.chatRooms; 
  };

  listChats() {
    const chatView = this.state.chatRooms.map(chatRoom => (
      <View key={chatRooms.key} style={{flexDirection: 'row', paddingVertical: 10, borderBottomColor: 'gray', borderBottomWidth: 1,  justifyContent: 'space-between'}}>
        <Text style={styles.listFiles} numberOfLines= {3} ellipsizeMode = 'middle'>{chatRooms.name}</Text>
        <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}></View>
      </View>
    ))
  
    return (
    <View>
      {chatView}
    </View>
    )
  }

  
  render() {
    return ( 
      <View style={styles.container}>
      	<Text style={styles.title}>Chat</Text>
      	<Text style={styles.title}>{"final id: " + this.state.roomId}</Text>
        <ScrollView>{this.listChats()}</ScrollView>
   	  </View>
    );
  }
}

export default ChatPage