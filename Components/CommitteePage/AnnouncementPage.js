import React, {Component} from 'react';
import { ActivityIndicator, StyleSheet, Text, View, Alert, Image, FlatList, TextInput } from 'react-native';
import {Button} from 'native-base';
import ActionSheet from 'react-native-actionsheet';

const firebase = require("../../server/router");

const committeeList = [
    'Budget, Finance, & Audit',
    'Board Development',
    'Human Resources',
    'Impact',
    'Investment',
    'Resource Development & Marketing',
    'Safety Asset Management',
    //''
  ];

class AnnouncementPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: null,
            committee: null,
            admin: false,
            executive: false,
            selectedCommittee: null,
            title: null,
            message: null,
            date: new Date()
        }
    }
    componentDidMount() {
        var state = this.props.route.params.state
        Object.keys(state).forEach(key => {
          this.setState({[key]: state[key]})
        });
      }
    
    onPressAdd() {
		//Empty field handling
		if(!this.state.title) {
			Alert.alert("Please enter a title");
			return;
		}
		if(!this.state.message){
			Alert.alert("Please enter a message");
			return;
        }
        
		// const db = firebase.firebaseConnection.firestore()
		// const pendingUsers = db.collection('PendingUsers').doc(this.state.email);
		// const users = db.collection('Users').doc(this.state.email);
		const self = this

        self.addAnnouncement(self)
        Alert.alert("Announcement added to " + this.state.committee)
        var navigation = this.props.navigation;
        navigation.navigate('Announcements')
		//Checks if present in Users
		/*users.get().then((found) => {
			if (found.exists) {
				Alert.alert("This email is already associated with an account")
			} else {
				//Checks if present in pendingUsers
				pendingUsers.get().then((found) => {
					if (found.exists) {
						Alert.alert("This email is pending approval")
					} else {
						//.this is dynamic so a variable has to be used 
						// self.hashPassword(self)
						self.addToPendingUser(self)
					}
				})
			}
		})*/	
	}
    async addAnnouncement(self) {
        const db = firebase.firebaseConnection.firestore();
        await db.collection("Announcements").doc(self.state.committee).collection(self.state.committee + " A").doc(self.state.title).set({
            //message = this.state.message,
            title: self.state.title,
            date: "" + new Date(),
            message: self.state.message
	 	}).catch((error) => {
	        console.log(error)
	        Alert.alert(error.message)
	 	}) 
    }

    updateGroup = (group) => {
        this.setState({ selectedCommittee:group })
    }

    showActionSheet = () => {
		this.ActionSheet.show();
    };
    
      render() {
        return (
          <View style={styles.container}>
            <View style={styles.form}>
                <Text style={styles.text}>Add New Announcement</Text>
                {<Button style = {styles.button} onPress={() => this.onPressAdd()} /*onpress="{this._addItem.bind(this)}"*/><Text style={styles.text2}>Add Announcement</Text></Button> }
                {/* <TextInput style = {styles.input}
	                autoCorrect={false}
	                onFocus={group => this.showActionSheet()}
	                onKeyPress={group => this.showActionSheet()}
	                placeholder={'Pick a committee to post to'}
	                value={"Select a committee to post to"}
	            /> */}
                {/* <ActionSheet
					ref={o => (this.ActionSheet = o)}
					//Title of the Bottom Sheet
					title={'Pick a board to join'}
					//Options Array to show in bottom sheet
					options={committeeList}
					//Define cancel button index in the option array. Need this so pressing back works
					cancelButtonIndex={8}
					onPress={index => {
						//Clicking on the option will give you the index of the option clicked
						this.updateGroup(committeeList[index]);
					}}
				/> */}
                <TextInput style = {styles.input1}
	                autoCorrect={false}
	                //onFocus={group => this.showActionSheet()}
                    //onKeyPress={group => this.showActionSheet()}
                    onChangeText={(text) => this.setState({title:text})}
	                placeholder={'Announcement Title'}
	                value={this.state.title}
	            />
                <TextInput style = {styles.input2}
                    multiline={true}
                    numberOfLines={5}
	                autoCorrect={false}
	                //onFocus={group => this.showActionSheet()}
                    //onKeyPress={group => this.showActionSheet()}
                    onChangeText={(text) => this.setState({message:text})}
	                placeholder={'Type your announcement here'}
	                value={this.state.message}
	            />
            </View>
          </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1, 
      alignItems: 'center', 
      justifyContent: 'center',
    },
    form: {
	  flex: 1,
	  marginTop: '10%',
	},
    buttonHolder: {
      flex: 0,
      flexDirection: 'row',
      justifyContent: 'center',
	  alignItems: 'center',
	  paddingTop: 15,
    //   paddingBottom: 45,
    },
    button: {
        padding: 20,
        width: '95%',
        height: '6%',
        backgroundColor: '#0081c6',
        borderRadius: 35,
        alignItems: 'center',
        marginRight: 10,
        marginLeft: 10,
        marginBottom: 15, 
        marginTop: 0, 
    },
    button2: {
      flexDirection: 'row', 
      padding: 20,
      width: '40%',
      height: '180%',
      backgroundColor: '#FF8200',
      borderRadius: 35,
      alignItems: 'center',
      marginRight: 10,
      marginLeft: 10,
    },
    text: {
      color: 'black',
      fontWeight: '700',
      fontSize: 20,
      marginRight: 'auto',
      marginLeft: 'auto'
    },
    text2: {
        color: 'white',
        fontWeight: '700',
        fontSize: 20,
        marginRight: 'auto',
        marginLeft: 'auto'
      },
    // picker: {
    //   height: 50, 
    //   borderColor: '#7a42f4',
    //   borderWidth: 1,
    //   marginBottom: 15
    // },
    input1: {
       margin: 0,
       marginLeft: 0,
       height: 30,
       borderColor: 'black',
       borderWidth: 1,
       paddingLeft: 10
    },
    input2: {
        margin: 0,
        marginLeft: 0,
        height: 500,
        borderColor: 'black',
        borderWidth: 1,
        paddingLeft: 10
     },
     input: {
        textAlign: 'center',
        margin: 15,
        marginLeft: 2,
        height: 40,
        borderColor: 'black',
        borderWidth: 1,
        paddingLeft: 10
     },
});

export default AnnouncementPage