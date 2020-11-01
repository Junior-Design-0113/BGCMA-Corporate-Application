import React, {Component, useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image, Platform} from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import { render } from 'react-dom';

import * as firebase from 'firebase';
const fb = require("../../server/router");

class Profile extends Component {

  constructor(props) {
      super(props);
      this.state = {
        email: null,
        imageURL: '',
        //url: null
      }
    }

  async componentDidMount() {
    var state = this.props.route.params.state
    await Object.keys(state).forEach(key => {
      this.setState({[key]: state[key]})
    })
    this.downloadImage(); 
  }
      
  pickImage = async () => {
      //this.imageURL = 'https://reactnativecode.com/wp-content/uploads/2017/05/react_thumb_install.png'; 
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      console.log(result);
      
      if (!result.cancelled) {
          const response = await fetch(result.uri);
          const blob = await response.blob();
          var ref = fb.firebaseConnection.storage().ref("Profiles/" + this.state.email);
          //this.setState({imageURL: this.downloadImage()});
          this.downloadImage(); 
          return ref.put(blob);
      }
  };


  downloadImage = async () => {
    const storage = fb.firebaseConnection.storage();

    storage.ref("Profiles/" + this.state.email).getDownloadURL()
    .then((url) => {
      // Do something with the URL ...
      this.setState({imageURL: url});
    })
  }


  render() {
      
      return (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Button title="Edit Image" onPress={this.pickImage} />
              <Image source={ {uri: this.state.imageURL} } style={{ width: 200, height: 200 }} />   
          </View>
        );
  }


}
export default Profile


