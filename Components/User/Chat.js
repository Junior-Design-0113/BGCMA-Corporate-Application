import React, {Component} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {Button} from 'native-base'
import { SearchBar } from 'react-native-elements';

const firebase = require("../../server/router");
const s = require('../../Style/style')
const styles = s.styles


class Chat extends Component {

  constructor(props) {
		super(props);
		this.state = {
			email: null,
			committee: null,
			admin: false,
			executive: false,
      selectedCommittee: null,
      users: []
    }
    
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
        this.setState({users: users}, function() {
          this.showUsers()
        })
    })
  }

  showUsers() {
      if (this.state.selectedCommittee) {
        console.log("filter users")
      }
      
      const users = this.state.users.map(user => (
        <View key={user.email}>
          <View style={{flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 1, justifyContent: 'space-between'}}>
            <Text >{`${user.firstName} ${user.lastName}`}</Text>
            <Button  style={styles.messageButton} onPress={() => console.log(user)}>
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
  searchProfiles(text) {
    const newData = this.arrayholder.filter(function(item) {
      const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      dataSource: newData,
      text: text,
      profiles: newData,
    });
  }


  render() {
    return (
      <View style={styles.container}>
        <View style={{width: '80%', marginTop: 10}}>
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


export default Chat