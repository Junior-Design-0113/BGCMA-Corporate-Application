import React, {Component} from 'react';
import { TextInput, FlatList, TouchableHighlight, Text, View, Alert, Image, Modal } from 'react-native';
import { Container, Header, Item, Input, Icon, Button } from 'native-base'
import * as DocumentPicker from 'expo-document-picker';
import { ScrollView } from 'react-native-gesture-handler';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Permissions from 'expo-permissions';
import { SearchBar } from 'react-native-elements';

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
      modalVisible: false,
      fileName: '',
      res: null,
      fileSelected: false,
    }
    this.arrayholder = [];
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
        <Text style={styles.committeeTitle}>{this.state.selectedCommittee} Meeting Files</Text>
      )
    }
  }

  pickFile() {
    DocumentPicker.getDocumentAsync().then((res) => {
      if (res.type === 'success') {
        this.setState({res})
        this.setState({fileSelected: true})
        // Alert.alert("Confirm File Upload?", res.name,
        // [{text: "Cancel", onPress: () => console.log("Cancel")},
        // {text: "Upload", onPress: () => this.uploadFile(res)}]) 
        // console.log(res.name)
      } else {
        Alert.alert('No file was selected')
      }
    })
  }

  uploadFile = async(res) => {
    var storageRef = fb.firebaseConnection.storage().ref()
    
    if(res == null) {
      Alert.alert("Please select a file")
      return
    }
    //If greater than 10MB (size is in bytes), cancel. Can adjust the size here
    if (res.size > 10000000) {
      Alert.alert("File is too large to upload")
      return
    }
    if (this.state.fileName == '') {
      Alert.alert("Please input a file name")
      return
    }

    const dotIndex = (res.name).lastIndexOf(".")
    const fileType = res.name.slice(dotIndex)
    var fileName = this.state.fileName.replace(/\s/g , "-");
    const response = await fetch(res.uri);
    const blob = await response.blob();
    var ref = storageRef.child(this.state.selectedCommittee + "/" + fileName+fileType);
    
    await ref.put(blob).then(() => {Alert.alert("File has been uploaded", fileName+fileType)});
    
    this.setState({modalVisible : false})
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
      this.arrayholder = files; 
      this.setState({files : files}, (() => this.listFiles()))
    })
  }

  listFiles() {
    const filesView = this.state.files.map(file => (
      <View key={file.key} style={{flexDirection: 'row', paddingVertical: 10, borderBottomColor: 'gray', 
        borderBottomWidth: 1,  justifyContent: 'space-between'}}
      >
        <Text style={styles.listFiles} numberOfLines= {3} ellipsizeMode = 'middle'>{file.name}</Text>
        <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
          <Button style={styles.downloadButton} onPress={() => this.downloadFile(file)}>
            <Text style={styles.downButtonText}>Download</Text>
          </Button>
          <Button style={styles.deleteButton} onPress={() => 
            Alert.alert("Delete File?", file.name,
            [{text: "Cancel", onPress: () => console.log("Cancel")},
            {text: "Delete", onPress: () => this.deleteFile(file)}]) 
          }>
            <Text style={styles.delButtonText}>X</Text>
          </Button>
        </View>
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

  saveFile = async (fileUri) => {
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
      //Download the file from that url onto phone. Can specify file path here, will be placed 
      //  in a BGMCA folder
      FileSystem.downloadAsync(
        url,
        FileSystem.documentDirectory + file.name
      )
      .then(({ uri }) => {
        //Call local method to save the downloaded file to a proper folder
        this.saveFile(uri);
      })
      .catch(error => {
        console.error(error);
      });

    });
  }

  updateScreen() {
    this.getFiles(); 
  }

  searchFiles(text) {
    const newData = this.arrayholder.filter(function(item) {
      const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      dataSource: newData,
      text: text,
      files: newData,
    });
  }

  setModalVisible(val) {
    this.setState({modalVisible: val});
  }

  showModal() {
    const {modalVisible, res} = this.state
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          this.setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput style = {styles.modalInput}
              autoCorrect={false}
              onChangeText={fileName => this.setState({fileName})}
              placeholder={'File Name'}
              value={this.state.fileName}
            />  

            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: this.state.fileSelected ? '#0081c6': "#a1a1a1", marginTop: 10}}
              onPress={() => {
                this.pickFile();
              }}
            >
              <Text style={{...styles.text, color: this.state.fileSelected ? 'white': "#4a4a4a"}}>
                {this.state.fileSelected ? 'File Selected': 'Select a File'}
              </Text>
            </TouchableHighlight>

            <View style={styles.buttonHolder}>
              <Button  style={{...styles.uploadCancelButton, backgroundColor: "#84BD00"}} onPress={() => {this.uploadFile(res)}}>
                <Text style={styles.text}>Upload</Text>
              </Button>
              <Button  style={{...styles.uploadCancelButton, backgroundColor: "#FF8200"}} onPress={() => {this.setModalVisible(!modalVisible)}}>
                <Text style={styles.text}>Cancel</Text>
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    )
  }
  
  render() {
    return (
      <View style={styles.container}>
        <View style={{...styles.form, width: '100%', marginTop: 0}}>
          <View style={{flexDirection: 'row'}}>
            <View style={{width: '80%'}}>
              <SearchBar
                containerStyle={{backgroundColor: 'default'}}
                style={styles.searchBarText}
                onChangeText={text => this.searchFiles(text)}
                value={this.state.text}
                placeholder="Search Files"
                round
                lightTheme
                searchIcon={{ size:30 }}
              />
            </View>

            {this.showModal()}
            
            <TouchableHighlight
              style={styles.uploadButton}
              onPress={() => {
                this.setModalVisible(true);
              }}
            >
              <Text style={styles.delButtonText}>+</Text>
            </TouchableHighlight>
          </View>

          <ScrollView>{this.listFiles()}</ScrollView>      
        </View>

        {/* <Image 
        style={{maxHeight: '30%', marginTop: 10}} 
        source={this.state.url} /> */}
      </View>
    )
  }
}

export default MeetingFiles