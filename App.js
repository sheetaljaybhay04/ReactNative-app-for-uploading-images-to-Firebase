import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  Button,
  Image,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';

import * as firebase from 'firebase';
import ImagePicker from 'react-native-image-crop-picker';
import RNFetchBlob from 'react-native-fetch-blob';
import Toast from 'react-native-easy-toast';

const config = {
 apiKey: 'AIzaSyAI16Z63-SqJGnkg6E_bnLoZSSE3uBQkNI',
 authDomain: 'authentication-20445.firebaseapp.com',
 databaseURL: 'https://authentication-20445.firebaseio.com',
 projectId: 'authentication-20445',
 storageBucket: 'authentication-20445.appspot.com',
 messagingSenderId: '301374231448'
};

firebase.initializeApp(config);

export default class RNF extends Component {
 constructor(props) {
  super(props);
  console.disableYellowBox = true;
  this.state = {
    loading: false,
    dp: null
  };
 }
 openPicker() {
   this.setState({ loading: true });
   const Blob = RNFetchBlob.polyfill.Blob;
   const fs = RNFetchBlob.fs;
   window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
   window.Blob = Blob;
   const uid = 'Images';
   ImagePicker.openPicker({
     width: 300,
     height: 300,
     cropping: true,
     mediaType: 'photo'
   }).then(image => {
     const imagePath = image.path;
     const imageName = imagePath.substring(imagePath.lastIndexOf("/")+1);
     let uploadBlob = null;
     const imageRef = firebase.storage().ref(uid).child(imageName);
     const mime = 'image/jpg';
     fs.readFile(imagePath, 'base64')
       .then((data) => Blob.build(data, { type: `${mime};BASE64` })
     )
     .then((blob) => {
         uploadBlob = blob;
         return imageRef.put(blob, { contentType: mime });
       })
       .then(() => {
         uploadBlob.close();
         return imageRef.getDownloadURL();
       })
       .then((url) => {
         const obj = {};
         obj.loading = false;
         obj.dp = url;

         this.setState(obj);

          this.refs.toast.show('Image Uploaded');
       })
       .catch((error) => {
         console.log(error);
       });
   })
   .catch((error) => {
     console.log(error);
   });
 }
 render() {
   const dpr = this.state.dp ? (<TouchableOpacity onPress={() => this.openPicker() }>

   <Button
     onPress={() => this.openPicker()}
     title={'Upload Image'}
   />
   </TouchableOpacity>
   ) : (<Button
     onPress={() => this.openPicker()}
     title={'Upload Image'}
   />);

   const dps = this.state.loading ? <ActivityIndicator animating={this.state.loading} />
   : (<View style={styles.container}>
     <View style={{ flexDirection: 'row' }}>
       { dpr }

     </View>
   </View>);

   return (
     <View style={styles.container}>
       { dps }
       <Toast ref="toast"/>
     </View>
   );
 }
}

const styles = StyleSheet.create({
 container: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center',
   backgroundColor: '#F5FCFF',
 },
 welcome: {
   fontSize: 20,
   textAlign: 'center',
   margin: 10,
 },
 instructions: {
   textAlign: 'center',
   color: '#333333',
   marginBottom: 5,
 },
});

//const userData = {};
AppRegistry.registerComponent('img3', () => RNF);

/*<Image
     style={{ width: 100, height: 100, margin: 5 }}
     source={{ uri: this.state.dp }}
/>

*/
