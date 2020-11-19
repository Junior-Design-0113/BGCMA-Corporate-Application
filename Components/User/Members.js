import React, {Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {Button} from 'native-base'
import { SearchBar } from 'react-native-elements';

const firebase = require("../../server/router");
const s = require('../../Style/style')
const styles = s.styles

class Members extends Component {

  constructor(props) {
		super(props);
		this.state = {
			email: null,
			committee: null,
			admin: false,
			executive: false,
      selectedCommittee: null,
      users: [],
      roomId: "roomId",
      roomFound: false

    }
    this.arrayholder = [];
    const db = firebase.firebaseConnection.firestore()

  }

  componentDidMount() {
    var state = this.props.route.params.state
    Object.keys(state).forEach(key => {
        this.setState({[key]: state[key]})
    });

    this.getUsers()
  }

  getUsers() {
    const db = firebase.firebaseConnection.firestore();
    db.collection('Users').onSnapshot((querySnapshot) => {
        const users = [];
        querySnapshot.forEach((doc) => {
          var user = doc.data()
          users.push( {
            email: doc.id,
            Committee: user.Committee,
            Executive: user.Executive,
            firstName: user.firstName,
            lastName: user.lastName,
          })
        })
        this.arrayholder = users;
        this.setState({users: users}, function() {
          this.filterUsers();
          this.showUsers()
        })
    })
  }

  filterUsers() {
    if (this.state.selectedCommittee) {
      var filtered = null
      if (this.state.selectedCommittee === 'Executive Committee') {
        filtered = this.state.users.filter(data => data.Executive);
      } else {
        filtered = this.state.users.filter(data => data.Committee == this.state.selectedCommittee);
      }
      //console.log(filtered);
      this.setState({
        users: filtered
      })
    }
  }

  showUsers() {
      const users = this.state.users.map(user => (
        <View key={user.email}>
          <View style={{flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 1, justifyContent: 'space-between'}}>
            <TouchableOpacity
              onPress={() => {
                var navigation = this.props.navigation;
                navigation.navigate('Profile', {state: user})}}>
              <Text >{`${user.firstName} ${user.lastName}`}</Text>
            </TouchableOpacity>

            <Button  style={styles.messageButton} onPress={() => {
              //Get or make a room, should set roomId value into the state
              this.checkCreateRoom(user);  

              //Sometimes the check method is called a bunch of times, usually if you manually delete a conversation in firebase
              // or make a new coversation. I wanted to put navigation to the next page outside the function but I couldn't
              // get the roomId to pass on either through state or as an extra navigation parameter. So I put the navigation 
              // call at the end of checkRoom. 
              //this.navigateToChat();
            }}>
              <Text style={styles.downButtonText}>Chat</Text>
            </Button>
          </View>
        </View>
      ))
      
      return(
        <View>
          {users}
        </View>
      )
  }

  //Navigate the screen to an individual chat page
  navigateToChat() {   
      var navigation = this.props.navigation;
      navigation.navigate('ChatPage', {state: this.state}); 
  }

  //The better/"updater" way to set state. Didn't help with updating roomId quickly.
  updateRoomState = (room) => {
    this.setState((prevState) => {
      return {roomId: room} 
    })
  };

  //Look through all chat rooms to see if one exists, if not make one. Set the roomId into state so it can be passed on.
  checkCreateRoom(user) {
    const db = firebase.firebaseConnection.firestore();
    db.collection('Chat').onSnapshot((querySnapshot) => {
      this.setState({roomFound: false});
      //console.log("\n\n Beginning Search \n For room with " + this.state.email + " and " + user.email);

      //Check against all chat rooms in database when chat button clicked; code inside here executed many times
      querySnapshot.forEach((doc) => {
        var r = doc.data();
        //Check both email combinations. It's possible to make a chat with yourself/the same two emails.
        if ((r.email1 == this.state.email && r.email2 == user.email) 
          || (r.email2 == this.state.email && r.email1 == user.email)) {
          this.setState({roomFound: true});
          this.updateRoomState(doc.id);
          //console.log('\nFound the right room');
        }
      });

      //If the right room wasn't present then create it. Doesn't make a 'messages' collection
      if (this.state.roomFound == false) {
        const docName = this.state.email + "_" + user.email; //Should be unique
        db.collection('Chat').doc(docName).set({
          email1: this.state.email,
          email2: user.email
        });
        //set new roomId
        this.updateRoomState(docName);

        //console.log('\nMade a new room with id ' + docName);
      }

      //console.log("\nEnd of search. RoomID " + this.state.roomId + " \n\n")
      //Go to chat page
      this.navigateToChat(); 
    })
  }

  searchProfiles(text) {
    const newData = this.arrayholder.filter(function(item) {
      const name = `${item.firstName} ${item.lastName}`
      const itemData = name ? name.toUpperCase() : ''.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      dataSource: newData,
      text: text,
      users: newData,
    });
  }


  render() {
    return (
      <View style={styles.container}>
        <View style={{width: '100%', marginTop: 10}}>
          <SearchBar
            containerStyle={{backgroundColor: 'default'}}
            style={styles.searchBarText}
            onChangeText={text => this.searchProfiles(text)}
            value={this.state.text}
            placeholder="Search Profiles"
            round
            lightTheme
            searchIcon={{ size:30 }}
          />
        </View>
        <ScrollView>
          {this.showUsers()}
        </ScrollView>
      </View>
    );
  }
  
}

export default Members