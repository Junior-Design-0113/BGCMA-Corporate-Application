import React, {Component, useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image, Platform} from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import { render } from 'react-dom';


class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
          imageURL: '',
          URL: []
        }
      }

    pickImage = async () => {
        global.imageURL = 'https://reactnativecode.com/wp-content/uploads/2017/05/react_thumb_install.png'; 
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        console.log(result);
    
        if (!result.cancelled) {
            this.setState({imageURL: (result.uri)});
        }
    };

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


