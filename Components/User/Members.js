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
      users: []

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
      const filtered = this.state.users.filter(data => data.Committee == this.state.selectedCommittee);
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