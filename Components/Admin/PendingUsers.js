import React, {Component} from 'react';
import {Text, StyleSheet, TextInput, View, Alert, Switch, ScrollView, SafeAreaView } from 'react-native';
import {Button} from 'native-base'
import ActionSheet from 'react-native-actionsheet';
import Constants from 'expo-constants';
import 'firebase/firestore';

const fb = require("../../server/router")

const committeeList = [
  'Budget, Finance, & Audit',
  'Board Development',
  'Human Resources',
  'Impact',
  'Investment',
  'Resource Development & Marketing',
  'Safety Asset Management',
  ''
];

class PendingUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pendingUsers: [],
      editable: 0,
      currentUser: null,
    }
    const db = fb.firebaseConnection.firestore()
    this.ref = db.collection('PendingUsers')
  }

  componentDidMount() {
    this.ref.onSnapshot((querySnapshot) => {
      const pendingUsers = [];
      var editable = -2
      querySnapshot.forEach((doc) => {
        var id = doc.id
        var pendingUser = doc.data()
        editable = editable + 2
        pendingUsers.push( {
          id: id,
          Admin: pendingUser.Admin,
          Committee: pendingUser.Committee,
          Executive: pendingUser.Executive,
          firstName: pendingUser.firstName,
          lastName: pendingUser.lastName,
          password: pendingUser.password,
          editable: editable
        })
      })
      this.setState({pendingUsers: pendingUsers}, function() {
        this.populatePendingUsers()
      })
    })
  }
  
  approve(pendingUser) {
    fb.firebaseConnection.firestore().collection('Users').doc(pendingUser.id).set({
      Admin: pendingUser.Admin,
      Committee: pendingUser.Committee,
      Executive: pendingUser.Executive,
      firstName: pendingUser.firstName,
      lastName: pendingUser.lastName,
      password: pendingUser.password
    }).then((data) => {
      fb.firebaseConnection.firestore().collection('PendingUsers').doc(pendingUser.id).delete()
      console.log("approved user")
      Alert.alert("User has succesfully been approved");
      // var navigation = this.props.navigation;
      // navigation.navigate('Home')	
    }).catch((error) => {
        console.log(error)
        Alert.alert(error.message)
    })
  }

  delete(pendingUser) {
    fb.firebaseConnection.firestore().collection('PendingUsers').doc(pendingUser.id).delete()
    console.log("deleted user")
    Alert.alert("User has succesfully been deleted");
  }
  
  async edit(pendingUser) {
    this.setState({
      editable: !!(this.state.editable % 2) ? pendingUser.editable : pendingUser.editable + 1,
      currentUser: pendingUser,
      currentCommittee: pendingUser.Committee
    })
    Alert.alert("You may now edit the user")
  }

  async submit(pendingUser) {
    this.setState({
      editable: !!(this.state.editable % 2) ? pendingUser.editable : pendingUser.editable + 1
    })
    // console.log(pendingUser.id + " Committee: " +  pendingUser.Committee)

    await fb.firebaseConnection.firestore().collection('PendingUsers').doc(pendingUser.id).update({
			Admin: pendingUser.Admin,
			Committee: pendingUser.Committee,
			Executive: pendingUser.Executive,
			firstName: pendingUser.firstName,
			lastName: pendingUser.lastName,
		}).catch((error) => {
      console.log(error)
      Alert.alert(error.message)
		})

    Alert.alert("Your changes have been submitted")
  }

  showActionSheet = () => {
		this.ActionSheet.show();
  }
  
  populatePendingUsers() {
    const pendingUsers = this.state.pendingUsers.map(pendingUser => (
      <View key={pendingUser.id}>
        <TextInput style={styles.title} 
          editable = {false}
        >{pendingUser.id} </TextInput>

        <View style={{flexDirection: 'row'}}>
          <View>
            <TextInput style={styles.text} editable = {false} > Name:  </TextInput>
            <TextInput style={styles.text} editable = {false} ></TextInput>
            <TextInput style={styles.text} editable = {false} > Committee:  </TextInput>
            <TextInput style={styles.text} editable = {false} > Admin:  </TextInput>
            <TextInput style={styles.text} editable = {false} > Executive:  </TextInput>
          </View>
        
          <View>
            <TextInput style={styles.text2} 
              editable = {(pendingUser.editable + 1) == this.state.editable}
              autoCorrect={false}
  	          onChangeText={firstName => {pendingUser.firstName = firstName}}
            >{pendingUser.firstName}</TextInput>
            
            <TextInput style={styles.text2} 
              editable = {(pendingUser.editable + 1) == this.state.editable}
              onChangeText={lastName => {pendingUser.lastName = lastName}}
            >{pendingUser.lastName}</TextInput>
            
            <TextInput style={styles.text2} 
              editable = {(pendingUser.editable + 1) == this.state.editable}
              onFocus={nul => this.showActionSheet()}
              onKeyPress={nul => this.showActionSheet()}
              caretHidden={true}
            >{pendingUser.Committee}</TextInput>
            
            <ActionSheet
              ref={o => (this.ActionSheet = o)}
              //Title of the Bottom Sheet
              title={'Select a board'}
              //Options Array to show in bottom sheet
              options={committeeList}
              //Define cancel button index in the option array. Need this so pressing back works
              cancelButtonIndex={8}
              onPress={index => {
                //Clicking on the option will give you the index of the option clicked
                this.state.currentUser.Committee = committeeList[index];
                this.forceUpdate()
              }}
            />
            
            <View style={{flexDirection: 'row'}}>
              <Switch thumbColor={pendingUser.Admin ? "#84BD00" : "#FF8200"}
                onValueChange = {(toggle) => {pendingUser.Admin = toggle
                this.forceUpdate()}}
                value={pendingUser.Admin} 
                disabled={!(pendingUser.editable + 1 == this.state.editable)}
              />
            </View>
           
            <View style={{flexDirection: 'row'}}>
              <Switch thumbColor={pendingUser.Executive ? "#84BD00" : "#FF8200"}
                onValueChange = {(toggle) => {pendingUser.Executive = toggle
                  this.forceUpdate()}}
                value={pendingUser.Executive} 
                disabled={!(pendingUser.editable + 1 == this.state.editable)}
              />
            </View>
          </View>
        </View>
        
        <View style={styles.buttonHolder}>
	        <Button  style={styles.button} onPress={() => this.delete(pendingUser)}
            // if we want to still be able to Delete/Accept users not being edited 
            disabled={(!!this.state.editable)}>
	        	<Text style={styles.buttonText}>Delete</Text>
        	</Button>

          <Button  style={styles.button2} onPress={() => (this.state.editable % 2) ? this.submit(pendingUser) : this.edit(pendingUser)}>
	        	<Text style={styles.buttonText}>{((pendingUser.editable + 1) == this.state.editable) ? "Save" : "Edit"}</Text>
        	</Button>

          <Button  style={styles.button3} onPress={() => this.approve(pendingUser)}
            // if we want to still be able to Delete/Accept users not being edited 
            disabled={(!!this.state.editable)}>
            <Text style={styles.buttonText}>Approve</Text>
          </Button>
    		</View>
      </View>
    ));

    return(
      <View>
        {pendingUsers}
      </View>
    )
  }
  
  render() {
    return (
      <SafeAreaView style={{flex: 1, marginTop: Constants.statusBarHeight}}>
        <ScrollView>
            {this.populatePendingUsers()}
        </ScrollView>
    </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  buttonHolder: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 15,
    marginRight: '3%',
    marginLeft: '3%',
  },
  toggle: {
    marginTop: 4,
    marginBottom: 5,
    width: 50,
    height: 20,
    backgroundColor: '#FF8200',
  },
  button: {
    flexDirection: 'row', 
    padding: 15,
    width: '30%',
    height: '100%',
    backgroundColor: '#FF8200',
    borderRadius: 35,
    alignItems: 'center',
    marginRight: 10,
    marginLeft: 10,
  },
  button2: {
    flexDirection: 'row', 
    padding: 15,
    width: '30%',
    height: '100%',
    backgroundColor: '#0081c6',
    borderRadius: 35,
    alignItems: 'center',
    marginRight: 10,
    marginLeft: 10,
  },
  button3: {
    flexDirection: 'row', 
    padding: 15,
    width: '30%',
    height: '100%',
    backgroundColor: '#84BD00',
    borderRadius: 35,
    alignItems: 'center',
    marginRight: 10,
    marginLeft: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 19,
    marginRight: 'auto',
    marginLeft: 'auto'
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    alignSelf: 'stretch',
    fontWeight: '700',
  },
  text: {
    fontSize: 16,
    textAlign: 'left',
    alignSelf: 'stretch',
    marginLeft: '12%',
  },
  text2: {
    fontSize: 16,
    textAlign: 'left',
    alignSelf: 'stretch',
  },
});


export default PendingUsers