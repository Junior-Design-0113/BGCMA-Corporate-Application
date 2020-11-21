import React, {Component} from 'react';
import {Alert, StyleSheet, Text, View, TouchableOpacity, Modal, TouchableHighlight, 
  TextInput, YellowBox } from 'react-native';
import {Agenda} from 'react-native-calendars';
import { FloatingAction } from "react-native-floating-action";
import DateTimePickerModal from "react-native-modal-datetime-picker";

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
    // There are uh.. a lot of Timers. This ignores timer warnings on this page when running the app in expo
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
      item: null,
    }
  }

  async componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      var state = this.props.route.params.state
    Object.keys(state).forEach(key => {
      this.setState({[key]: state[key]})
    });
    this.setState({markedDates : null}, function() {this.getDateQuery()})
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  async getDateQuery() {
    if (this.state.committee) {
      await firebase.firebaseConnection.firestore().collection("Meetings").doc(this.state.committee)
        .collection("Dates").onSnapshot(this.getMarkedDates)
    }
  }
  
  getMarkedDates = (querySnapshot) => {
    const dates = {};
    querySnapshot.forEach((res) => {
      // dates[res.id] = {marked: true, selected: true, selectedColor: 'blue'}
      // old way ^. chose to use default behaviour instead
      dates[res.id] = {marked: true}
    });

    this.setState({
      markedDates: dates
    });
    this.getMeetingQuery()
  }

  getMeetingQuery() {
    if (this.state.committee) {
      Object.keys(this.state.markedDates).forEach(async markedDate => {
        await firebase.firebaseConnection.firestore().collection("Meetings").doc(this.state.committee)
          .collection("Dates").doc(markedDate)
          .collection("Meetings").orderBy('StartDate').onSnapshot(this.getMeetings)
      })
    }
  }
  
  getMeetings = (querySnapshot) => {
    const meetings = this.state.meetings;
    querySnapshot.forEach((res) => {
      var {date, Title, Agenda, StartDate, EndDate} = res.data()
      //these dates are objects with nanoseconds and seconds when the date consturctor wants milliseconds
      //the result is also a combination of the two?
      StartDate = new Date (StartDate.seconds * 1000 + Math.round(StartDate.nanoseconds / 1000000))
      EndDate = new Date (EndDate.seconds * 1000 + Math.round(EndDate.nanoseconds / 1000000))
      if (!meetings[date]) {
        meetings[date] = []
      }

      var meeting = {
        id: res.id,
        title: Title,
        agenda: Agenda,
        startDate: StartDate,
        endDate: EndDate,
        date: date,
      }

      if (!meetings[date].some(meet => meet.id === meeting.id)) {
        meetings[date].push(meeting)
      }
    });
    this.setState({meetings})
  }
  
  setMeetingModalVisible(val) {
    this.setState({modalMeetingVisible: val});
  }

  showMeetingModal() {
    const {modalMeetingVisible, res} = this.state
    return (
      <Modal
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
                <TouchableOpacity style={{paddingLeft: 10, width: '45%'}}
                  onPress={nul => {this.setState({startPickerVisible : true})
                  this.showDatepicker(true)}}
                >
                  <TextInput style = {styles.input}
                        editable={false}
                        placeholder={this.state.startDate.toLocaleDateString('en-US')}
                  />       
                </TouchableOpacity>
                
                <TouchableOpacity style={{width: '35%'}}
                  onPress={nul => {this.setState({startPickerVisible : true})
                  this.showTimepicker(true)}}
                >
                  <TextInput style = {styles.input}
                        editable={false}
                        placeholder={this.state.startDate.getFormattedTime()}
                  />
                </TouchableOpacity>
              </View>
                
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity style={{paddingLeft: 10, width: '45%'}}
                  onPress={nul => {this.setState({endPickerVisible : true})
                  this.showDatepicker(true)}}
                >
                  <TextInput style = {styles.input}
                        editable={false}
                        placeholder={this.state.endDate.toLocaleDateString('en-US')}
                  />
                </TouchableOpacity>

                <TouchableOpacity style={{width: '35%'}}
                  onPress={nul => {this.setState({endPickerVisible : true})
                  this.showTimepicker(true)}}
                >
                  <TextInput style = {styles.input}
                        editable={false}
                        placeholder={this.state.endDate.getFormattedTime()}
                  />  
                </TouchableOpacity> 
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
                  this.editMeeting();
                }
              }}
            >
              <Text style={{...styles.delButtonText, width:'100%', fontSize:25}}>{this.state.editing ? "Save" : "Create"}</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
    )
  }
  
  async createMeeting() {
    const day = (`${this.state.startDate.getFullYear()}-${this.state.startDate.toLocaleDateString()
      .replace(/\//g, '-').slice(0, 5)}`)
    const db = firebase.firebaseConnection.firestore();
    // neccesary so the document exists and is iterable
    db.collection("Meetings").doc(this.state.committee).collection("Dates").doc(day).set(
      {date : null}
    )

    const meeting = await db.collection("Meetings").doc(this.state.committee).collection("Dates")
      .doc(day).collection("Meetings").add({
        date : day,
        Title: this.state.meetingTitle,
        Agenda: this.state.meetingAgenda,
        StartDate: this.state.startDate,
        EndDate: this.state.endDate,
    })
    
    if (!this.state.editing) {
      const itemDay = {timestamp : this.state.startDate.valueOf()}
      this.setState({items : {}}, this.loadItems(itemDay))
    }
  }

  async editMeeting() {
    const day = (`${this.state.startDate.getFullYear()}-${this.state.startDate.toLocaleDateString()
      .replace(/\//g, '-').slice(0, 5)}`)
    const db = firebase.firebaseConnection.firestore();
    if (day == this.state.item.date) {
      await db.collection("Meetings").doc(this.state.committee).collection("Dates").doc(day)
        .collection("Meetings").doc(this.state.item.id).update({
          date : day,
          Title: this.state.meetingTitle,
          Agenda: this.state.meetingAgenda,
          StartDate: this.state.startDate,
          EndDate: this.state.endDate,
      }) 

      var indx = this.state.meetings[day].map(function(meeting) { return meeting.id})
        .indexOf(this.state.item.id)
      this.state.meetings[day][indx] = {
        id : this.state.item.id,
        date : day,
        title: this.state.meetingTitle,
        agenda: this.state.meetingAgenda,
        startDate: this.state.startDate,
        endDate: this.state.endDate,
      }
      
      const newItems = {}
      Object.keys(this.state.meetings).forEach(key => {newItems[key] = this.state.meetings[key];});
      this.setState({
        meetings: newItems
      })

      const itemDay = {timestamp : this.state.startDate.valueOf()}
      this.setState({items : {}}, this.loadItems(itemDay))

    } else {
      this.createMeeting()
      this.deleteMeeting(this.state.item)
    }

    this.setState({editing : false})
  }

  async deleteMeeting(item) {
    const db = firebase.firebaseConnection.firestore();
    const querySnapshot = await db.collection("Meetings").doc(this.state.committee)
      .collection("Dates").doc(item.date).collection("Meetings").get()
    await db.collection("Meetings").doc(this.state.committee).collection("Dates").doc(item.date)
      .collection("Meetings").doc(item.id).delete();    

    // if last item, remove date
    if (querySnapshot.size == 1) {
      await db.collection("Meetings").doc(this.state.committee).collection("Dates").doc(item.date).delete()
      // this.state.meetings[item.date] = []
    }
    
    var indx = this.state.meetings[item.date].map(function(meeting) { return meeting.id}).indexOf(item.id)
    this.state.meetings[item.date].splice(indx, 1)

    const newMeetings = {}
    Object.keys(this.state.meetings).forEach(key => {newMeetings[key] = this.state.meetings[key];});
    this.setState({
      meetings: newMeetings
    })
    
    const itemDay = {timestamp : this.state.startDate.valueOf()}
    this.setState({items : {}}, this.loadItems(itemDay))
  }

  //loads items every 30 days from selected day
  loadItems(day) {
    setTimeout(() => {
      for (let i = 0; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = this.timeToString(time);
        if (!this.state.items[strTime]) {
          this.state.items[strTime] = [];
          if (this.state.meetings[strTime]) {
            for (let i = 0; i < this.state.meetings[strTime].length; i++) {
              this.state.items[strTime].push({
                id : this.state.meetings[strTime][i].id,
                date : this.state.meetings[strTime][i].date,
                title: this.state.meetings[strTime][i].title,
                agenda: this.state.meetings[strTime][i].agenda,
                startDate: this.state.meetings[strTime][i].startDate,
                endDate: this.state.meetings[strTime][i].endDate,
              });
            }
          }
        }
      }

      const newItems = {};
      Object.keys(this.state.items).forEach(key => {newItems[key] = this.state.items[key];});
      this.setState({
        items: newItems
      });
    }, 1000);
  }
  
  renderItem(item) {
    return (
      <TouchableOpacity
        style={styles.item} 
        onPress={() => 
          Alert.alert(item.title, item.startDate.getFormattedTime() + ' - ' + item.endDate.getFormattedTime()
             + "\n" + item.agenda,
          [{text: "Delete", onPress: () => this.deleteMeeting(item)},
          {text: "Edit", onPress: () => {this.setMeetingModalVisible(true)
                                        this.setState({editing : true,
                                          meetingTitle: item.title,
                                          meetingAgenda: item.agenda,
                                          startDate: item.startDate,
                                          endDate: item.endDate,
                                          item: item
                                        })}},
          {text: "OK", onPress: () => console.log("Cancel")}]) }
      >
        <Text style = {{fontWeight: '700', fontSize: 20,}}>{item.title}</Text>
        <Text>{`${item.startDate.getFormattedTime()} - ${item.endDate.getFormattedTime()}`}</Text>
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
          // markingType={'custom'}
          items={this.state.items}
          loadItemsForMonth={(day) => this.loadItems(day)}
          renderItem={this.renderItem.bind(this)}
          rowHasChanged={this.rowHasChanged.bind(this)}
          markedDates={this.state.markedDates}
          onDayChange={(day) => {
            day = new Date(day.timestamp + 5 * 60 * 60 * 1000)
            day.setHours(this.state.startDate.getHours(), this.state.startDate.getMinutes())
            //i think this is required so the agenda doesn't update the date while a datePicker is loaded
            if (!this.state.endPickerVisible && !this.state.startPickerVisible) {
            //change to date object in the eastern timezone
            this.setState({startDate : day,
                        endDate : day})
          }}}
          onDayPress={(day) => {
            day = new Date(day.timestamp + 5 * 60 * 60 * 1000)
            day.setHours(this.state.startDate.getHours(), this.state.startDate.getMinutes())
            this.setState({startDate : day,
              endDate : day})         
          }}
        />

        <FloatingAction
          ref={(ref) => { this.floatingAction = ref; }}
          onOpen = {() => {
            this.setMeetingModalVisible(true)
            this.floatingAction.animateButton();
          }}
         />
         
        <DateTimePickerModal
          isVisible={this.state.endPickerVisible}
          date={this.state.endDate}
          mode={this.state.datePickerMode}
          onConfirm={(currentDate) => this.setState({endDate : currentDate,
            endPickerVisible : false})}
          onCancel={() => this.setState({endPickerVisible : false})}
        />
        
        <DateTimePickerModal
          isVisible={this.state.startPickerVisible}
          date={this.state.startDate}
          mode={this.state.datePickerMode}
          onConfirm={(currentDate) => this.setState({startDate : currentDate,
            startPickerVisible : false})}
          onCancel={() => this.setState({startPickerVisible : false})}
        />

        {this.showMeetingModal()}
      </View>
    );
  }
}