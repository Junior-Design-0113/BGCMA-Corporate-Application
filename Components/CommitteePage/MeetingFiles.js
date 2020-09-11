import React, {Component} from 'react';
import { ActivityIndicator, StyleSheet, Text, View, Alert, Image } from 'react-native';
import { Button, Row } from 'native-base'
import * as DocumentPicker from 'expo-document-picker';

const fb = require("../../server/router");
const s = require('../../Style/style')
const styles = s.styles

class MeetingFiles extends Component {
  constructor(props) {
      super(props);
      this.state = {
        email: null,
        committee: null,
        admin: false,
        executive: false,
        selectedCommittee: null,
        files: [],
      }
    }
  
  async componentDidMount() {
    var state = this.props.route.params.state
    await Object.keys(state).forEach(key => {
      this.setState({[key]: state[key]})
    })
    this.getFiles()
  }
  
  getTeam() {
    if(this.state.selectedCommittee) {
      return(
        <Text>{this.state.selectedCommittee} Meeting Files</Text>
      )
    }
  }

  pickFile() {
    DocumentPicker.getDocumentAsync().then((res) => {
      if (res.type === 'success') {
        Alert.alert("Confirm File Upload?", res.name,
        [{text: "Cancel", onPress: () => console.log("Cancel")},
        {text: "Upload", onPress: () => this.uploadFile(res)}]) 
        // console.log(res.name)
      } else {
        Alert.alert('No file was selected')
      }
    })
  }

  uploadFile = async(res) => {
    var storageRef = fb.firebaseConnection.storage().ref()
    
    //If greater than 1MB (size is in bytes), cancel
    if (res.size > 1000000) {
      Alert.alert("File is too large to upload")
      return
    }
    const response = await fetch(res.uri);
    const blob = await response.blob();
    var ref = storageRef.child(this.state.selectedCommittee + "/" + res.name);
    // console.log(this.state.selectedCommittee + "/" + res.name)
    
    ref.put(blob).then(() => {Alert.alert("File has been uploaded", res.name)});
  }

  getFiles() {
    var storageRef = fb.firebaseConnection.storage().ref();
    var listRef = storageRef.child(this.state.selectedCommittee + "/");
    console.log(this.state.selectedCommittee + "/")

    listRef.listAll().then((res) => {
      const files = []
      var count = 0
      res.items.forEach((file) => {
        files.push({
          key: count++,
          name: file.name
        })
      })
      console.log(files)
      this.setState({files : files}, (() => this.listFiles()))
    })
  }

  listFiles() {
    const filesView = this.state.files.map(file => (
      <View key={file.key}>
        <Text>{file.name}</Text>
      </View>
    ))
  
    return ( 
    <View>
      {filesView}
    </View>
    )
  }

  render() {
    console.log(this.state.selectedCommittee)
      return (
        <View style={styles.container}>
          <View style={styles.form}>
          {this.getTeam()}
          <View style={styles.pageButtonHolder}>
            <Button  style={styles.pageButton} onPress={() => this.pickFile()}><Text style={styles.text}>+</Text></Button>
          </View>
          {this.listFiles()}
          </View>
        </View>
      )
  }
}



export default MeetingFiles