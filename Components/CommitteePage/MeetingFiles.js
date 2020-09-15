import React, {Component} from 'react';
import { ActivityIndicator, StyleSheet, Text, View, Alert, Image } from 'react-native';
import { Button, Row } from 'native-base'
import * as DocumentPicker from 'expo-document-picker';
import { ScrollView } from 'react-native-gesture-handler';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Permissions from 'expo-permissions';

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
        url: null,
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
    
    await ref.put(blob).then(() => {Alert.alert("File has been uploaded", res.name)});
    
    this.updateScreen();
  }

  getFiles() {
    var storageRef = fb.firebaseConnection.storage().ref();
    var listRef = storageRef.child(this.state.selectedCommittee + "/");
    //console.log(this.state.selectedCommittee + "/")

    listRef.listAll().then((res) => {
      const files = []
      var count = 0
      res.items.forEach((file) => {
        files.push({
          key: count++,
          name: file.name
        })
      })
      //console.log(files)
      this.setState({files : files}, (() => this.listFiles()))
    })
  }

  listFiles() {
    const filesView = this.state.files.map(file => (
      <View key={file.key}>
        <Text style={styles.listFiles}>{file.name}</Text>
        <Button style={styles.downloadButton} onPress={() => this.downloadFile(file)}>
          <Text>Download</Text>
        </Button>
        <Button style={styles.deleteButton} onPress={() => this.deleteFile(file)}>
          <Text>Delete</Text>
        </Button>
      </View>
    ))
  
    return (
    <View>
      {filesView}
    </View>
    )
  }

  async deleteFile(file) {
    var storageRef = fb.firebaseConnection.storage().ref();
    var deleteRef = storageRef.child(this.state.selectedCommittee + '/' + file.name);

    await deleteRef.delete()
      Alert.alert(file.name + " has been deleted.");

    this.updateScreen();
  }

  saveFile = async (fileUri: string) => {
    //Need to get camera permissions first
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === "granted") {
      //Puts the downloaded file into the correct local storage space
      const asset = await MediaLibrary.createAssetAsync(fileUri)
      //Creates a BGCMA folder in the phone's internal storage home folder. Need this for android to work
      await MediaLibrary.createAlbumAsync("BGCMA", asset, false)
      Alert.alert("File has been downloaded");
    }
  }

  async downloadFile(file) {
    var storageRef = fb.firebaseConnection.storage().ref();
    var viewRef = storageRef.child(this.state.selectedCommittee + '/' + file.name);
    var url = viewRef.getDownloadURL().then((url) => {
      //Gets the url for the file in firebase storage
      //console.log(url);

      //Download the file from that url onto phone. Can specify file path here, will be 
      //  placed in a BGMCA folder
      FileSystem.downloadAsync(
        url,
        FileSystem.documentDirectory + file.name
      )
      .then(({ uri }) => {
        //Call local method to save the downloaded file to a proper folder
        this.saveFile(uri);
        //console.log('Finished downloading ', uri);
      })
      .catch(error => {
        console.error(error);
      });

    });
  }

  updateScreen() {
    this.getFiles(); 
    // console.log('screen update');
  }

  render() {
    //console.log(this.state.selectedCommittee)
      return (
        <View style={styles.container}>
          <View style={styles.form}>
          {this.getTeam()}
            <View style={styles.pageButtonHolder}>
              <Button  style={styles.pageButton} onPress={() => this.pickFile()}><Text style={styles.text}>+</Text></Button>
            </View>
            <ScrollView>{this.listFiles()}</ScrollView>
          </View>

          <Image 
          style={{maxHeight: '30%', marginTop: 10}} 
          source={this.state.url} />
        </View>
      )
  }
}



export default MeetingFiles