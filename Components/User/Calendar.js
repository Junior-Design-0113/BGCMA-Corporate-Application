import React, {Component} from 'react';
import { StyleSheet, Text, View, Modal, ScrollView, TouchableHighlight, TextInput, TouchableOpacity } from 'react-native';
import {Calendar as RNCalendar} from 'react-native-calendars';
import { ListItem } from 'react-native-elements'


const firebase = require("../../server/router");
const s = require('../../Style/style')
const styles = s.styles

class Calendar extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      email: null,
      committee: null,
      admin: false,
      executive: false,
      markedDates: null,
      modalVisible: false,
      modalMeetingVisible: false,
      meetings: [],
      meetingTitle: '',
      meetingAgenda: '',
      day: null,

    }
  }

  componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      var state = this.props.route.params.state
    Object.keys(state).forEach(key => {
      this.setState({[key]: state[key]})
    });
    this.setState({markedDates:null}, function() {this.getDates()})
    }
    
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getDates() {
    var dates = {}
    if (this.state.committee) {
      this.state.firestoreRef = firebase.firebaseConnection.firestore().collection("Meetings").doc(this.state.committee).collection("Dates").onSnapshot(this.getMarkedDates)
    }
    
    this.setState({markedDates:dates})
  }

  getMarkedDates = (querySnapshot) => {
    const dates = {};
    querySnapshot.forEach((res) => {
      dates[res.id] = {selected: true, marked: true, selectedColor: 'blue'}
    });
    this.setState({
      markedDates: dates
   });
  }
  dateClick = (day) => {
    this.setState({day:day.dateString})
    if (this.state.committee && day.dateString in this.state.markedDates) {
      this.state.firestoreRef = firebase.firebaseConnection.firestore().collection("Meetings").doc(this.state.committee).collection("Dates").doc(day.dateString).collection("Meetings").onSnapshot(this.getMeetings)
    }
  }
  getMeetings = (querySnapshot) => {
    const meetings = [];
    querySnapshot.forEach((res) => {
      const {Title, Agenda} = res.data()
      meetings.push({
        id: res.id,
        title: Title,
        agenda: Agenda,
      })
    });
    this.setState({meetings})
    this.setModalVisible(true)

  }

  setModalVisible(val) {
    this.setState({modalVisible: val});
  }
  setMeetingModalVisible(val) {
    this.setState({modalMeetingVisible: val});
  }

  showModal() {
    const {modalVisible, res} = this.state
    return (<Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        this.setModalVisible(!modalVisible);
      }}
    >
      <TouchableOpacity 
            style={styles.container} 
            activeOpacity={1} 
            onPressOut={() => {this.setModalVisible(false)}}
          >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableHighlight
              style={{...styles.uploadButton, width:'80%', height:'20%'}}
              onPress={() => {
                this.setMeetingModalVisible(true);
                this.setModalVisible(false);
              }}>
              <Text style={styles.delButtonText}>Create Meeting</Text>
            </TouchableHighlight>
          <Text>Meetings Scheduled</Text>
          {this.populateModal()}
        </View>
      </View>
      </TouchableOpacity>
    </Modal>)
  }
  showMeetingModal() {
    const {modalMeetingVisible, res} = this.state
    return (<Modal
      animationType="slide"
      transparent={true}
      visible={modalMeetingVisible}
      onRequestClose={() => {
        this.setModalVisible(!modalMeetingVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableHighlight
              style={{...styles.uploadButton, width:'50%'}}
              onPress={() => {
                this.setMeetingModalVisible(false);
                this.createMeeting();
              }}
              >
              <Text style={{...styles.delButtonText, width:'100%', fontSize:25}}>Create</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={{...styles.uploadButton, width:'50%', backgroundColor:"red"}}
              onPress={() => {
                this.setMeetingModalVisible(false);
              }}
              >
              <Text style={{...styles.delButtonText, width:'100%', fontSize:25}}>Cancel</Text>
            </TouchableHighlight>
            <TextInput style = {styles.modalInput}
              autoCorrect={false}
              onChangeText={meetingTitle => this.setState({meetingTitle})}
              placeholder={'Meeting Title'}
              value={this.state.meetingTitle}
            />  
            <TextInput style = {styles.modalInput}
              autoCorrect={false}
              onChangeText={meetingAgenda => this.setState({meetingAgenda})}
              placeholder={'Meeting Title'}
              value={this.state.meetingAgenda}
            />  
        </View>
      </View>
    </Modal>)
  }
  createMeeting() {
    console.log(this.state)
    const db = firebase.firebaseConnection.firestore();
    const res = db.collection("Meetings").doc(this.state.committee).collection("Dates").doc(this.state.day).collection("Meetings").add({
      Title: this.state.meetingTitle,
      Agenda: this.state.meetingAgenda
    }) 
  }


  populateModal() {
    if (this.state.meetings) {
      const m = this.state.meetings.map((me) =>
        <View>
          <Text>{me.title}: {me.agenda}</Text>
        </View>
        
      );
      return (
        <ScrollView>
          {m}
        </ScrollView>
      )
    }
  }



  render() {
    return (
      <View style={styles.container}>  
        <RNCalendar style={styles.calendar} 
        style={{
          width: 400,
          borderColor: 'gray',
          height: 700
        }}
          // The big list of changeable properties is here: https://github.com/wix/react-native-calendars
          // It defaults to the current date. The calendar changes in size according to how many weeks there are, 
          //    the length of the month name, and more. Not sure how to fix that. Turning off day names will make 
          //    the calendar compress and make numbers unreadable.

          // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
          monthFormat={'yyyy MMM'}
          // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
          firstDay={1}
          // Handler which gets executed when visible month changes in calendar. Default = undefined
          //onMonthChange={(month) => {console.log('month changed', month)}}
          // If hideArrows=false and hideExtraDays=false (which they are by default) do not switch month when tapping on 
          // greyed out day from another month that is visible in calendar page. Default = false
          disableMonthChange={true}
          onDayPress={(day) => {this.dateClick(day)}}

          markedDates={this.state.markedDates}

          // Good for adding announcements
          // Handler which gets executed on day press. Default = undefined.
          //onDayPress={(day) => {console.log('selected day', day)}}
          // Handler which gets executed on day long press. `Default = undefined
          //onDayLongPress={(day) => {console.log('selected day', day)}}
      />
      {this.showModal()}
      {this.showMeetingModal()}
      </View>
    );
  }
  
}

export default Calendar