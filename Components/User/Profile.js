import React, {Component} from 'react';
import { StyleSheet, Text, View, Modal, TextInput, TouchableHighlight} from 'react-native';
import {Button} from 'native-base';
import ActionSheet from 'react-native-actionsheet';

const firebase = require("../../server/router");
const s = require('../../Style/style')
const styles = s.styles

const committeeList = [
  'Budget, Finance, & Audit',
  'Board Development',
  'Human Resources',
  'Impact',
  'Investment',
  'Resource Development & Marketing',
  'Safety Asset Management',
];

class Profile extends Component {

	constructor(props) {
		super(props);
		this.state = {
			email: null,
			committee: null,
			admin: false,
			executive: false,
		    firstName: '',
	   		lastName: '',
			userInfo: '',
			nickname: '',
			newNickname: '',
			newComm: '',
			newBio: '',
			modalEditVisible: false,
		}
	}

	async componentDidMount() {
		var state = this.props.route.params.state
		await Object.keys(state).forEach(key => {
		    this.setState({[key]: state[key]})
		});

		//Update the right fields in state to show user's info in render()
		this.getUserInfo(this.state.email);
	}

	//Can modify this function for the chat components to find accounts based on different emails
	async getUserInfo(email) {
		//Could make the check more elaborate and make sure the email is in Users although if there's no customer input then 
		// we could probably assume the email we use will be valid.
		if (email) {
			//Pull the user's file from firebase
		    const db = firebase.firebaseConnection.firestore()
		    const user = db.collection('Users').doc(email);

		    //Access the user's properties and assign it to fields in the state
		    user.get().then((doc) => {
			    if (doc.exists) {
			    	//Access the data of this element of the collection with doc.data().x
			    	this.setState({firstName:doc.data().firstName});
					this.setState({lastName:doc.data().lastName});   
					this.setState({userInfo:doc.data().userInfo})	
					this.setState({nickname:doc.data().Nickname})
			    	//this.setState({userInfo:doc.data().userInfo});  
			    } else {
			        // doc.data() will be undefined in this case
			        console.log("No such document!");
			    }
			}).catch(function(error) {
			    console.log("Error getting document:", error);
			});
			//console.log('\nupdated info\n');	
		}		
	}

	showActionSheet = () => {
		this.ActionSheet.show();
	};

	showEditModal() {
		const {modalEditVisible, res} = this.state
		return (<Modal
		  animationType="slide"
		  visible={modalEditVisible}
		  onRequestClose={() => {
			this.setEditModalVisible(!modalEditVisible);
		  }}
		>
			<View style = {styles.container}>
			<View style={{flexDirection: 'row'}}>
			<View>
			  <TextInput style = {[styles.input, {borderWidth: 0,}]} editable = {false}>Nickname:</TextInput>
			  <TextInput style = {[styles.input, {borderWidth: 0,}]} editable = {false}>Committee:</TextInput>
			</View>
			
			<View>
			<TextInput style = {styles.modalInput}
				  autoCorrect={true}
				  onChangeText={newNickname => this.setState({newNickname})}
				  placeholder={'Nickname'}
				  value={this.state.newNickname}
			/>  
			
			<View style={{flexDirection: 'row'}}>
			  <View style={{paddingLeft: 10, width: '80%'}}>
			  <TextInput style = {styles2.input}
	                autoCorrect={false}
	                onFocus={group => this.showActionSheet()}
	                onKeyPress={group => this.showActionSheet()}
	                placeholder={'Select a Committee'}
	                value={this.state.newComm}
	            />
			  <ActionSheet
					ref={o => (this.ActionSheet = o)}
					//Title of the Bottom Sheet
					title={'Pick a committee to join'}
					//Options Array to show in bottom sheet
					options={committeeList}
					//Define cancel button index in the option array. Need this so pressing back works
					cancelButtonIndex={8}
					onPress={index => {
						//Clicking on the option will give you the index of the option clicked
						//this.updateComm(committeeList[index]);
						this.setState({newComm: committeeList[index]})
					}}
				/>     
			  </View>
			  
			</View>
			</View>
			</View>    
			<TextInput style = {[styles.modalInput, {flex : 1, flexDirection : 'row', paddingTop : 2}]}
			  multiline = {true}
			  autoCorrect= {true}
			  textAlignVertical = {'top'}
			  onChangeText={newBio => this.setState({newBio})}
			  placeholder={'Description'}
			  value={this.state.newBio}
			/>  
			
			<View style={[styles.buttonHolder, {paddingTop: 0,}]}>
			<TouchableHighlight
				style={{...styles.register}}
				onPress={() => {
				  this.setState({editing : false})
				  this.setEditModalVisible(false);
				}}
				>
				<Text style={{...styles.delButtonText, width:'100%', fontSize:25}}>Cancel</Text>
			  </TouchableHighlight>
			  <TouchableHighlight
				style={{...styles.cancelRegister}}
				onPress={() => {
				  if (this.state.newNickname) {
					this.updateNickname(this.state.newNickname)
				  } 
				  if (this.state.newComm) {
					this.updateComm(this.state.newComm)
				  }
				  if (this.state.newBio) {
					this.updateBio(this.state.newBio)
				  }
				  this.setEditModalVisible(false);
				}}
				  >
				  <Text style={{...styles.delButtonText, width:'100%', fontSize:25}}>{"Update"}</Text>
				</TouchableHighlight>
			</View>
			</View>
		</Modal>)
	}

	updateComm = (group) => {
		this.setState({newComm:group})
		this.state.firestoreRef = firebase.firebaseConnection.firestore().collection("Users").doc(this.state.email).update({
			Committee: this.state.newComm
		  });
		  this.setState({committee: this.state.newComm})
		  this.setState({newComm:''})
	}

	updateNickname = (name) => {
		this.setState({newNickname:name})
		this.state.firestoreRef = firebase.firebaseConnection.firestore().collection("Users").doc(this.state.email).update({
			Nickname: this.state.newNickname
		  });
		this.setState({nickname: this.state.newNickname})
		this.setState({newNickname: ''})
	}
	
	updateBio = (bio) => {
		this.setState({newBio: bio})
		this.state.firestoreRef = firebase.firebaseConnection.firestore().collection("Users").doc(this.state.email).update({
			userInfo: this.state.newBio
		  });
		  this.setState({userInfo: this.state.newBio})
		  this.setState({newBio: ''})
	}

	// updateProfile = (group, name, bio) => {
	// 	if (bio) {
	// 		this.state.firestoreRef = firebase.firebaseConnection.firestore().collection("Users").doc(this.state.email).set({
	// 			Admin: 
	// 			userInfo: bio
	// 		  });
	// 	}
	// }

	setEditModalVisible(val) {
		this.setState({modalEditVisible: val});
	  }

    render() {
	    return (
	    	<View style={styles.container}>
		    	<View style={styles.form}>
					<TouchableHighlight style={{...styles.editProfile}} onPress={() => {
						this.setEditModalVisible(true)
					}}>
						<Text style={{...styles.delButtonText, width:'100%', fontSize:25}}>Edit Profile</Text>
					</TouchableHighlight>
			        <Text style={styles.profileTitle}>{this.state.firstName}</Text>
			        <Text style={styles.profileTitle}>{this.state.lastName}</Text>
					<Text style={styles.profileText}>({this.state.nickname})</Text>
			        <Text style={styles.profileText}>{}</Text>

			        <Text style={styles.profileText}>{"Committee: "}</Text>
			        <Text style={styles.profileSubtext}>{this.state.committee}</Text>
			        <Text style={styles.profileText}>{"Info: "}</Text>
			        <Text style={styles.profileSubtext}>{this.state.userInfo}</Text>		 
		        </View>
				{this.showEditModal()}
		         
	        </View>
	        
	    );
	}
}

const styles2 = StyleSheet.create({
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
	inputBlue: {
	  padding: 20,
	  width: 400,
	  height: 20,
	  backgroundColor: '#0081c6',
	  borderRadius: 35,
	  textAlign: 'center',
	  marginRight: 10,
	  marginLeft: 10,
	  marginBottom: 15, 
	  marginTop: 0, 
	},
	centeredView: {
	  flex: 1,
	  justifyContent: "center",
	  alignItems: "center",
	  marginTop: 22
	},
	modalView: {
	  margin: 20,
	  backgroundColor: "white",
	  borderRadius: 20,
	  width: 350,
	  height: 600,
	  padding: 35,
	  alignItems: "center",
	  shadowColor: "#000",
	  shadowOffset: {
		width: 0,
		height: 2
	  },
	  shadowOpacity: 0.25,
	  shadowRadius: 3.84,
	  elevation: 5
	},
	openButton: {
	  backgroundColor: "#F194FF",
	  borderRadius: 20,
	  padding: 10,
	  elevation: 2
	},
	textStyle: {
	  color: "white",
	  fontWeight: "bold",
	  textAlign: "center"
	},
	modalText: {
	  color: "black",
	  marginBottom: 15,
	  textAlign: "center"
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
   text: {
	color: 'black',
	fontWeight: '700',
	fontSize: 20,
	marginRight: 'auto',
	marginLeft: 'auto'
  },
  });

export default Profile