import React, {Component} from 'react';
import { StyleSheet, Text, View, Modal, Image, TextInput, TouchableHighlight} from 'react-native';
import {Button} from 'native-base';
import ActionSheet from 'react-native-actionsheet';
import * as ImagePicker from 'expo-image-picker';

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
			newFirst: '',
			newLast: '',
			newNickname: '',
			newBio: '',
      modalEditVisible: false,
	  imageURL: '',
	  border: 0,
	  editable: false,
		}
	}

	async componentDidMount() {
		var state = this.props.route.params.state
		await Object.keys(state).forEach(key => {
		    this.setState({[key]: state[key]})
		});

		//Update the right fields in state to show user's info in render()
    this.getUserInfo(this.state.email);
    
    this.downloadImage(); 
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
					this.setState({firstName:doc.data().firstName,
						newFirst:doc.data().firstName});
					this.setState({lastName:doc.data().lastName,
						newLast:doc.data().lastName});   
					this.setState({userInfo:doc.data().userInfo || '',
						newBio:doc.data().userInfo || ''})	
					this.setState({nickname:doc.data().Nickname, 
						newNickname:doc.data().Nickname})
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
  
  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log(result);
    
    if (!result.cancelled) {
        const response = await fetch(result.uri);
        const blob = await response.blob();
        var ref = firebase.firebaseConnection.storage().ref("Profiles/" + this.state.email);
		ref.put(blob);
		this.downloadImage(); 
    }
};


	downloadImage = async () => {
	const storage = firebase.firebaseConnection.storage();

	storage.ref("Profiles/" + this.state.email).getDownloadURL()
	.then((url) => {
		// Do something with the URL ...
		this.setState({imageURL: url});
	}).catch(() => {
		console.log("error")
	})
	}

	displayImage() {
		if (this.state.imageURL) {
			return (<Image source={ {uri: this.state.imageURL} } style={{ width: 200, height: 200 }} />) 
		} else {
			return (<Image source={ require('../../assets/defaultProfile.png') } style={{ width: 200, height: 200 }} />)
		}
	}

	edit() {
		var user = firebase.firebaseConnection.auth().currentUser.email;
		if (this.state.email == user) {
			this.setState({editable : !(this.state.editable),
			border : !!(this.state.border) ? 0 : 1,})
		}
	}

	cancel() {
		this.setState({
			newFirst: this.state.firstName,
			newLast: this.state.lastName,
			newNickname: this.state.nickname,
			newBio: this.state.userInfo,
			editable : !(this.state.editable),
			border : !!(this.state.border) ? 0 : 1,
		})
	}

	save() {
		this.setState({
			firstName: this.state.newFirst,
			lastName: this.state.newLast,
			nickname: this.state.newNickname,
			userInfo: this.state.newBio,
			editable : !(this.state.editable),
			border : !!(this.state.border) ? 0 : 1,
		})
		
		this.state.firestoreRef = firebase.firebaseConnection.firestore().collection("Users").doc(this.state.email).update({
			firstName: this.state.newFirst,
			lastName: this.state.newLast,
			Nickname: this.state.newNickname,
			userInfo: this.state.newBio
		})
	}
	
	setEditModalVisible(val) {
		this.setState({modalEditVisible: val});
	  }

    render() {
	    return (
	    	<View style={{...styles.container, justifyContent : 'flex-start', paddingTop: 10 }}>
				<TouchableHighlight style={{ borderColor: '#0081c6', borderWidth: 5}} onPress={() => {
					if (this.state.editable) {this.pickImage()}}}> 
					{this.displayImage()}
				</TouchableHighlight>
  
					{!this.state.editable && <TouchableHighlight style={{...styles.editProfile}} onPress={() => {
						this.edit()
					}}>
						
						<Text style={{...styles.delButtonText, width:'100%', fontSize:16}}>{(this.state.editable) ? "Save" : "Edit Profile"}</Text>
					</TouchableHighlight>
					}
					
					{this.state.editable && <View style={{flexDirection : 'row'}}>
					<TouchableHighlight style={{...styles.editProfile, backgroundColor: '#84BD00' }} onPress={() => {
						this.save()
					}}>
						
						<Text style={{...styles.delButtonText, width:'100%', fontSize:16}}>{"Save"}</Text>
					</TouchableHighlight>
					
					<TouchableHighlight style={{...styles.editProfile, backgroundColor: '#FF8200' }} onPress={() => {
						this.cancel()
					}}>
						
						<Text style={{...styles.delButtonText, width:'100%', fontSize:16}}>{"Cancel"}</Text>
					</TouchableHighlight>
					</View>
					}
					
					<View style={{flexDirection : 'row'}}>
						<TextInput style={{...styles.profileTitle, marginRight: 2, borderWidth: this.state.border}} 
						onChangeText={newFirst => this.setState({newFirst})}
						editable = {this.state.editable}>
							{this.state.newFirst}</TextInput>
						<TextInput style={{...styles.profileTitle, borderWidth: this.state.border}}
						onChangeText={newLast => this.setState({newLast})}
						editable = {this.state.editable}>
							{this.state.newLast}</TextInput>
					</View>
					<TextInput style={{...styles.profileText, fontStyle: 'italic', borderWidth: this.state.border}}
					onChangeText={newNickname => this.setState({newNickname})}
					editable = {this.state.editable}
					value = {this.state.newNickname}></TextInput>
			        <Text></Text>
					<View style={{alignSelf: 'flex-start', paddingLeft: 15}}>
			        	<Text style={styles.profileText}>{"Committee: "}</Text>
					</View>
					<TextInput style={{...styles.profileSubtext}}
					editable = {false}>
						{this.state.committee}</TextInput>
					
					<View style={{alignSelf: 'flex-start', paddingLeft: 15}}>
			        	<TextInput style={styles.profileText}>{"Info: "}</TextInput>
					</View>
					<View style={{alignSelf: 'flex-start', paddingLeft: 30}}>
						<TextInput style={{...styles.profileSubtext, borderWidth: this.state.border}}
						onChangeText={newBio => this.setState({newBio})}
						editable = {this.state.editable}>
							{this.state.newBio}</TextInput>
					</View>		  
	        </View>
	        
	    );
	}
}
export default Profile

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

