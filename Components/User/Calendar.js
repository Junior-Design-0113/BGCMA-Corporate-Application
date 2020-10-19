import React, {Component} from 'react';
import {Alert, StyleSheet, Text, View, TouchableOpacity, Modal, TouchableHighlight, TextInput, YellowBox } from 'react-native';
import {Agenda} from 'react-native-calendars';
import { FloatingAction } from "react-native-floating-action";
import DateTimePickerModal from "react-native-modal-datetime-picker";
// import DateTimePicker from '@react-native-community/datetimepicker';

const firebase = require("../../server/router");
const s = require('../../Style/style')
const styles = s.styles

Date.prototype.getFormattedTime = function () {
  var hours = this.getHours() == 0 ? "12" : this.getHours() > 12 ? this.getHours() - 12 : this.getHours();
  var minutes = (this.getMinutes() < 10 ? "0" : "") + this.getMinutes();
  var ampm = this.getHours() < 12 ? "AM" : "PM";
  var formattedTime = hours + ":" + minutes + " " + ampm;
  return formattedTime;
}

export default class Calendar extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    // There are uh.. a lot of Timers
    YellowBox.ignoreWarnings(['Setting a timer']);
    this.state = {
      items : {},
      email: null,
      committee: null,
      admin: false,
      executive: false,
      markedDates: {},
      modalMeetingVisible: false,
      meetings: {},
      meetingTitle: null,
      meetingAgenda: '',
      startDate: new Date(),
      endDate: new Date(),
      endPickerVisible: false,
      startPickerVisible: false,
      datePickerMode: 'date',
      editing: false,
      id: null,
    }
  }

  async componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      var state = this.props.route.params.state
    Object.keys(state).forEach(key => {
      this.setState({[key]: state[key]})
    });
    this.setState({markedDates:null}, function() {this.getDateQuery()})
    }
    
  }

  // componentWillUnmount() {
  //   this._isMounted = false;
  // }

  async getDateQuery() {
    if (this.state.committee) {
      await firebase.firebaseConnection.firestore().collection("Meetings").doc(this.state.committee).collection("Dates").onSnapshot(this.getMarkedDates)
    }
  }
  
  getMarkedDates = (querySnapshot) => {
    // console.log("size: " + querySnapshot.size)
    const dates = {};
    querySnapshot.forEach((res) => {
      // dates[res.id] = {marked: true, selected: true, selectedColor: 'blue'}
      dates[res.id] = {marked: true, 
        customStyles: {
        container: {
          backgroundColor: 'blue'
        },
        text: {
          color: 'white',
        }}}
    });

    this.setState({
      markedDates: dates
   });
   this.setState({meetings: []}, function() {this.getMeetingQuery()})
  }

  getMeetingQuery() {
    this.setState({meetings : []})
    if (this.state.committee) {
      Object.keys(this.state.markedDates).forEach(async markedDate => {
        const snapshot = await firebase.firebaseConnection.firestore().collection("Meetings").doc(this.state.committee).collection("Dates").
        doc(markedDate).collection("Meetings").orderBy('StartDate').get()
        this.getMeetings(snapshot)
      })
    }
  }
  
  getMeetings = (querySnapshot) => {
    const meetings = this.state.meetings;
    querySnapshot.forEach((res) => {
      var {date, Title, Agenda, StartDate, EndDate} = res.data()
      //these dates are objects with nanoseconds and seconds when the date consturctor wants milliseconds... THE PAIN
      //the result is also a combination of the two?
      StartDate = new Date (StartDate.seconds * 1000 + Math.round(StartDate.nanoseconds / 1000000))
      EndDate = new Date (EndDate.seconds * 1000 + Math.round(EndDate.nanoseconds / 1000000))
      // console.log(StartDate.toLocaleDateString())
      if (!meetings[date]) {
        meetings[date] = []
      }

      meetings[date].push({
        id: res.id,
        title: Title,
        agenda: Agenda,
        startDate: StartDate,
        endDate: EndDate,
        date: date,
      })
    });
    this.setState({meetings})
  }
  
  setMeetingModalVisible(val) {
    this.setState({modalMeetingVisible: val});
  }

  showMeetingModal() {
    const {modalMeetingVisible, res} = this.state
    return (<Modal
      animationType="slide"
      visible={modalMeetingVisible}
      onRequestClose={() => {
        this.setMeetingModalVisible(!modalMeetingVisible);
      }}
    >
        <View style = {styles.container}>
        <View style={{flexDirection: 'row'}}>
        <View>
          <TextInput style = {[styles.input, {borderWidth: 0,}]} editable = {false}>Title:</TextInput>
          <TextInput style = {[styles.input, {borderWidth: 0,}]} editable = {false}>Start:</TextInput>
          <TextInput style = {[styles.input, {borderWidth: 0,}]} editable = {false}>End:  </TextInput>
        </View>
        
        <View>
        <TextInput style = {styles.modalInput}
              autoCorrect={true}
              onChangeText={meetingTitle => this.setState({meetingTitle})}
              placeholder={'Meeting Title'}
              value={this.state.meetingTitle}
        />  
        
        <View style={{flexDirection: 'row'}}>
          <View style={{paddingLeft: 10, width: '45%'}}>
          <TextInput style = {styles.input}
                onFocus={nul => {this.setState({startPickerVisible : true})
                this.showDatepicker(true)}}
                caretHidden={true}
                placeholder={this.state.startDate.toLocaleDateString('en-US')}
          />       
          </View>
          
          <View style={{width: '35%'}}>
          <TextInput style = {styles.input}
                onFocus={nul => {this.setState({startPickerVisible : true})
                                this.showTimepicker(true)}}
                caretHidden={true}
                placeholder={this.state.startDate.getFormattedTime()}
          />
          </View>
        </View>
        
        <View style={{flexDirection: 'row'}}>
          <View style={{paddingLeft: 10, width: '45%'}}>
          <TextInput style = {styles.input}
                onFocus={nul => {this.setState({endPickerVisible : true})
                                this.showDatepicker(true)}}
                caretHidden={true}
                placeholder={this.state.endDate.toLocaleDateString('en-US')}
          />
          </View>

          <View style={{width: '35%'}}>
          <TextInput style = {styles.input}
                onFocus={nul => {this.setState({endPickerVisible : true})
                                this.showTimepicker(true)}}
                caretHidden={true}
                placeholder={this.state.endDate.getFormattedTime()}
          />  
          </View> 
        </View>
        </View>
        </View>    
        <TextInput style = {[styles.modalInput, {flex : 1, flexDirection : 'row', paddingTop : 10}]}
          multiline = {true}
          autoCorrect= {true}
          textAlignVertical = {'top'}
          onChangeText={meetingAgenda => this.setState({meetingAgenda})}
          placeholder={'Description'}
          value={this.state.meetingAgenda}
        />  
        
        <View style={[styles.buttonHolder, {paddingTop: 0,}]}>
        <TouchableHighlight
            style={{...styles.register}}
            onPress={() => {
              this.setState({editing : false})
              this.setMeetingModalVisible(false);
            }}
            >
            <Text style={{...styles.delButtonText, width:'100%', fontSize:25}}>Cancel</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={{...styles.cancelRegister}}
            onPress={() => {
              if (!this.state.meetingTitle) {
                Alert.alert("Please specify a meeting title")
              } else if (!this.state.editing) {
                this.setMeetingModalVisible(false);
                this.createMeeting();
              } else {
                this.setMeetingModalVisible(false);
                this.setState({editing : false})
                this.editMeeting();
              }
            }}
              >
              <Text style={{...styles.delButtonText, width:'100%', fontSize:25}}>{this.state.editing ? "Submit" : "Create"}</Text>
            </TouchableHighlight>
        </View>
        </View>
    </Modal>)
  }
  
  async createMeeting() {
    const day = (`${this.state.startDate.getFullYear()}-${this.state.startDate.toLocaleDateString().replace(/\//g, '-').slice(0, 5)}`)
    const db = firebase.firebaseConnection.firestore();
    // neccesary so the document exists and is iterable
    db.collection("Meetings").doc(this.state.committee).collection("Dates").doc(day).set(
      {date : null}
    )
    db.collection("Meetings").doc(this.state.committee).collection("Dates").doc(day).collection("Meetings").add({
      date : day,
      Title: this.state.meetingTitle,
      Agenda: this.state.meetingAgenda,
      StartDate: this.state.startDate,
      EndDate: this.state.endDate,
    }) 

    // if meeting is added to an existing data, this forces an update to occur
    if (day in this.state.markedDates) {
      this.setState({meetings: []}, function() {this.getMeetingQuery()})
    } 
  }

  async editMeeting() {
    const day = (`${this.state.startDate.getFullYear()}-${this.state.startDate.toLocaleDateString().replace(/\//g, '-').slice(0, 5)}`)
    const db = firebase.firebaseConnection.firestore();

    await db.collection("Meetings").doc(this.state.committee).collection("Dates").doc(day).collection("Meetings").doc(this.state.id).update({
      date : day,
      Title: this.state.meetingTitle,
      Agenda: this.state.meetingAgenda,
      StartDate: this.state.startDate,
      EndDate: this.state.endDate,
    }) 
    this.setState({meetings: []}, function() {this.getMeetingQuery()})
  }

  async deleteMeeting(item) {
    const db = firebase.firebaseConnection.firestore();
    const querySnapshot = await db.collection("Meetings").doc(this.state.committee).collection("Dates").doc(item.date).collection("Meetings").get()
    await db.collection("Meetings").doc(this.state.committee).collection("Dates").doc(item.date).collection("Meetings").doc(item.id).delete();    

    if (querySnapshot.size == 1) {
      await db.collection("Meetings").doc(this.state.committee).collection("Dates").doc(item.date).delete()
      //only way I could figure out how to hide last item
      this.state.meetings[item.date] = []
      
      const newItems = {};
      Object.keys(this.state.meetings).forEach(key => {newItems[key] = this.state.meetings[key];});
      this.setState({
        meetings: newItems
      })
    } else {
      this.setState({meetings: []}, function() {this.getMeetingQuery()})
    }
  }


  loadItems(day) {
    setTimeout(() => {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = this.timeToString(time);
        if (!this.state.meetings[strTime]) {
          this.state.meetings[strTime] = [];
        }
      }

      const newItems = {};
      Object.keys(this.state.meetings).forEach(key => {newItems[key] = this.state.meetings[key];});
      this.setState({
        meetings: newItems
      });
    }, 1000);
  }
  
  renderItem(item) {
    return (
      <TouchableOpacity
        style={styles.item} 
        onPress={() => 
          Alert.alert(item.title, item.startDate.getFormattedTime() + "\n" + item.agenda,
          [{text: "Delete", onPress: () => this.deleteMeeting(item)},
          {text: "Edit", onPress: () => {this.setMeetingModalVisible(true)
                                        this.setState({editing : true,
                                          meetingTitle: item.title,
                                          meetingAgenda: item.agenda,
                                          startDate: item.startDate,
                                          endDate: item.endDate,
                                          id: item.id
                                        })}},
          {text: "OK", onPress: () => console.log("Cancel")}]) }
      >
        <Text style = {{fontWeight: '700', fontSize: 20,}}>{item.title}</Text>
        <Text>{`${item.startDate.getFormattedTime()} - ${item.endDate.getFormattedTime()}`}</Text>
        {/* <Text>Details: {item.agenda}</Text> */}
      </TouchableOpacity>
    );
  }

  renderEmptyDate() {
    return
  }

  rowHasChanged(r1, r2) {
    return r1.name !== r2.name;
  }

  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }
  
  showDatepicker = () => {
    this.setState({datePickerMode : 'date'});
  };

  showTimepicker = () => {
    this.setState({datePickerMode : 'time'})
  };
  
  
  render() {
    return (
      <View style={{flex: 1}}>
      <Agenda
        selected={`${new Date(new Date() - 24 * 60 * 60 * 1000).getFullYear()}-${new Date(new Date() - 24 * 60 * 60 * 1000).toLocaleDateString().replace(/\//g, '-').slice(0, 5)}`}
        markingType={'custom'}
        items={this.state.meetings}
        loadItemsForMonth={this.loadItems.bind(this)}
        renderItem={this.renderItem.bind(this)}
        rowHasChanged={this.rowHasChanged.bind(this)}
        markedDates={this.state.markedDates}
        onDayChange={(day) => {
          //i think this is required so the agenda doesn't update the date while a datePicker is loaded
          if (!this.state.endPickerVisible && !this.state.startPickerVisible) {
          //change to date object in the eastern timezone
          this.setState({startDate : new Date(day.timestamp + 4 * 60 * 60 * 1000),
                        endDate : new Date(day.timestamp + 4 * 60 * 60 * 1000)})
        }}}
        onDayPress={(day) => {
          this.setState({startDate : new Date(day.timestamp + 4 * 60 * 60 * 1000),
                        endDate : new Date(day.timestamp + 4 * 60 * 60 * 1000)})
        }}
    />

      <FloatingAction
            ref={(ref) => { this.floatingAction = ref; }}
            onOpen = {() => {
              this.setMeetingModalVisible(true)
              this.floatingAction.animateButton();
            }}
         />
         
         {this.showMeetingModal()}
         {this.state.endPickerVisible && (
        <DateTimePickerModal
          // I LOVE PICKERS YES I DO
          // value={this.state.endDate}
          mode={this.state.datePickerMode}
          onConfirm={(currentDate) => this.setState({endDate : currentDate,
                            endPickerVisible : false})}
          onCancel={() => this.setState({endPickerVisible : false})}
          // display="default"
          // onChange={(event, selectedDate) => {
          //   const currentDate = selectedDate || this.state.endDate
          //   this.setState({endDate : currentDate,
          //                 endPickerVisible : false})
          // }}
        />
      )}
      {this.state.startPickerVisible && (
        <DateTimePickerModal
          // value={this.state.startDate}
          mode={this.state.datePickerMode}
          onConfirm={(currentDate) => this.setState({startDate : currentDate,
            startPickerVisible : false})}
          onCancel={() => this.setState({startPickerVisible : false})}
          // display="default"
          // onChange={(event, selectedDate) => {
          //   const currentDate = selectedDate || this.state.startDate
          //   this.setState({startDate : currentDate,
          //                 startPickerVisible : false})
          // }}
        />
      )}
      </View>
    );
  }
}