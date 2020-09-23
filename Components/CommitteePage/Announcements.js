import React, {Component} from 'react';
import { ActivityIndicator, StyleSheet, Text, View, Alert, Image, FlatList, Modal, ScrollView, TouchableHighlight, TextInput, RefreshControl} from 'react-native';
import { ListItem } from 'react-native-elements'
import {Button} from 'native-base';
import ActionSheet from 'react-native-actionsheet';

const firebase = require("../../server/router");
const s = require('../../Style/style')
const styles = s.styles
//const db = firebase.firebaseConnection.firestore();

//Todos();

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

class Announcements extends Component {
  constructor(props) {
      super(props);
      //itemsRef = null;
      this.array = [
        {
          title: 'ONE'
        },
        {
          title: 'TWO'
        },
        
      ];
      this.state = {
        refreshing: false,
        currentAnn: null,
        currAnnTitle: "",
        currAnnMessage: "",
        modalVisible: false,
        arrayHolder: [],
        email: null,
        committee: null,
        admin: false,
        executive: false,
        selectedCommittee: "Board Development",
        isLoading: true,
        annArr: []
      }
      this.firestoreRef = firebase.firebaseConnection.firestore().collection("Announcements").doc(this.state.selectedCommittee).collection(this.state.selectedCommittee + " A")
    }

  updateGroup = (group) => {
      /*if (group == '') {
        this.ActionSheet.hide();
      } else {*/
        this.setState({ selectedCommittee:group })
        this.firestoreRef = firebase.firebaseConnection.firestore().collection("Announcements").doc(this.state.selectedCommittee).collection(this.state.selectedCommittee + " A")
        this.firestoreRef.onSnapshot(this.getCollection)
        //console.log(this.state.annArr)
        //this.setState({ state: this.state });
  }

  componentDidMount() {
    var state = this.props.route.params.state
    Object.keys(state).forEach(key => {
      this.setState({[key]: state[key]})
    });
    //this.setState({selectedCommittee: this.state.committee});
    this.unsubscribe = this.firestoreRef.onSnapshot(this.getCollection);
  }

  componentWillUnmount(){
    this.unsubscribe();
  }

  getCollection = (querySnapshot) => {
    const annArr = [];
    querySnapshot.forEach((res) => {
      const {title, date, message} = res.data();
      annArr.push({
        key: res.id,
        res,
        title,
        date,
        message,
      });
    });
    this.setState({
      annArr,
      //isLoading: false,
   });
  }

  showActionSheet = () => {
		this.ActionSheet.show();
	};

  getTeam() {
    if(this.state.selectedCommittee) {
      return(
        <Text style = {styles2.text}>Announcements for: {this.state.selectedCommittee}</Text>
      )
    }
  }

  addAnnouncement() {
    var navigation = this.props.navigation;
    navigation.navigate('AnnouncementPage', {state: this.state})
  }

  setModalVisible = (visible, currAnn, title, mess) => {
    console.log(title)
    console.log(mess)
    this.setState({ modalVisible: visible });
    this.setState({currentAnn: currAnn});
    // this.setState({currentAnnTitle: title});
    // this.setState({currentAnnMessage: mess});
    this.state.currAnnMessage = mess;
    this.state.currAnnTitle = title;
    console.log(this.state.currAnnTitle)
    console.log(this.state.currAnnMessage)
  }

  FlatListItemSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "#607D8B",
        }}
      />
    );
  }

  activate() {
    this.setState({
      isLoading: false
    })
    //console.log(this.state.annArr)
  }

  GetItem(item) {
 
    Alert.alert(item);
 
  }
  

  render() {
    const { modalVisible } = this.state;
    // if(this.state.isLoading){
    //   return(
    //     <View style={styles.preloader}>
    //       <ActivityIndicator size="large" color="#9E9E9E"/>
    //       <Button onPress = {() => this.activate()}><Text style={styles.text}>Load</Text></Button>
    //     </View>
    //   )
    // } else {
      return (
        <View style={styles.container}>
          <View style={styles.form}>
            {this.getTeam()}
            <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
            }}
          >
            <View style={styles2.centeredView}>
              <View style={styles2.modalView}>
                <Text style={styles2.modalText}> {this.state.currAnnTitle} </Text>
                <Text style={styles2.modalText}> {this.state.currAnnMessage} </Text>

                <TouchableHighlight
                  //style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                  onPress={() => {
                    this.setModalVisible(!modalVisible);
                  }}
                >
                  <Text style={styles2.openButton}>Hide Announcement</Text>
                </TouchableHighlight>
                </View>
              </View>
            </Modal>
            <TextInput style = {styles2.input}
	                autoCorrect={false}
	                onFocus={group => this.showActionSheet()}
	                onKeyPress={group => this.showActionSheet()}
	                placeholder={'Pick a board to post to'}
	                value={"Select a Committee"}
	            />
          <ActionSheet
					ref={o => (this.ActionSheet = o)}
					//Title of the Bottom Sheet
					title={'Pick a board to post to'}
					//Options Array to show in bottom sheet
					options={committeeList}
					//Define cancel button index in the option array. Need this so pressing back works
					cancelButtonIndex={8}
					onPress={index => {
						//Clicking on the option will give you the index of the option clicked
						this.updateGroup(committeeList[index]);
					}}
				/>
          {<Button style = {styles2.button} onPress={() => this.addAnnouncement()} /*onpress="{this._addItem.bind(this)}"*/><Text style={styles.text}>Add Announcement</Text></Button> }
          { <ScrollView>
          {
            this.state.annArr.map((item, i) => {
              return (
                <ListItem
                  key={i}
                  chevron
                  bottomDivider
                  title= {item.title}
                  subtitle={item.date}
                  message = {item.message}
                  onPress={() => {
                    this.setModalVisible(true, this.firestoreRef.doc(item.title), item.title, item.message);
                  }
                }/>
              );
            })
          }
          </ScrollView> }
          </View>
        </View>
      )
  }
//}
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


export default Announcements