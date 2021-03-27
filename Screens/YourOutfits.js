import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  Image,
  ScrollView,
} from 'react-native';
import { Icon, Card } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import * as Permissons from 'expo-permissions';

import MyHeader from '../components/MyHeader';
import db from '../Config';
import firebase from 'firebase';

export default class YourOutfits extends React.Component {
  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      userDetails: [],
      imageURI: '',
      style: '',
      size: '',
      imageId: '',
      modalVisibility: false,
      outfits: [],
    };
  }
  addOutfits = async () => {
    const { cancel, uri } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!cancel) {
      this.uploadImage(uri);
      this.setState({
        modalVisibility: true,
      });
    }
  };
  uploadImage = async (uri) => {
    var response = await fetch(uri);
    var blob = await response.blob();
    var imageID = Math.random().toString(36).substring(6);
    this.setState({
      imageId: imageID,
    });
    var ref = firebase
      .storage()
      .ref()
      .child('user_profiles/' + imageID);
    return ref.put(blob).then((response) => {
      this.fetchImage(imageID);
    });
  };
  fetchImage = (imageID) => {
    var ref = firebase
      .storage()
      .ref()
      .child('user_profiles/' + imageID);
    ref
      .getDownloadURL()
      .then((uri) => {
        this.setState({
          imageURI: uri,
        });
      })
      .catch((error) => {
        this.setState({
          imageURI: '#',
        });
      });
  };
  getUserDetails = () => {
    db.collection("Users").where("email_id","==",this.state.userId).get().then((doc) => {
      doc.docs.map((data) => {
        this.setState({
          userDetails: data.data()
        });
      });
    });
  }
  addToDB = () => {
    db.collection('Outfits').add({
      image_uri: this.state.imageURI,
      user_id: this.state.userId,
      image_id: this.state.imageId,
      date: firebase.firestore.FieldValue.serverTimestamp(),
      type: this.state.style,
      forRent: false,
      wore_text: 'Wore',
      price: 0,
      size: this.state.size, 
      country: this.state.userDetails.country
    });
    alert('The outfit was succesfully added to the database.');
    this.setState({
      modalVisibility: false,
    });
  };
  getAllOutfits = () => {
    db.collection('Outfits')
      .where('user_id', '==', this.state.userId)
      .onSnapshot((snapshot) => {
        var clothes = snapshot.docs.map((doc) => doc.data());
        this.setState({
          outfits: clothes,
        });
      });
  };
  componentDidMount() {
    this.getUserDetails()
    this.getAllOutfits();
  }
  showModal = () => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.modalVisibility}>
        <View>
          <TextInput
            placeholder={'Style of Clothing'}
            onChangeText={(text) => {
              this.setState({
                style: text,
              });
            }}
            style={styles.textInput}
          />
          <TextInput
            placeholder={'Size'}
            onChangeText={(text) => {
              this.setState({
                size: text,
              });
            }}
            style={styles.textInput}
          />
          <TouchableOpacity
            style={styles.save}
            onPress={() => {
              this.addToDB();
            }}>
            <Text>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancel}
            onPress={() => {
              this.setState({
                modalVisibility: false,
              });
            }}>
            <Text>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  };
  renderItem = ({ item, i }) => {
    return (
      <View>
        <Card title={item.type} containerStyle={styles.cardStyle}>
          <Image source={{ uri: item.image_uri }} style={styles.image}></Image>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => {
              this.props.navigation.navigate('Details', { Data: item });
            }}>
            <Text style={styles.text}>Details</Text>
          </TouchableOpacity>
        </Card>
      </View>
    );
  };
  render() {
    if (this.state.modalVisibility == true) {
      return <View style={styles.center1}>{this.showModal()}</View>;
    } else {
      return (
        <View style={styles.container}>
          <ScrollView>
            <MyHeader title={'Your Outfits'} />
            <View>
              {this.state.outfits.length == 0 ? (
                <Text>Upload your outfits!</Text>
              ) : (
                <FlatList
                  data={this.state.outfits}
                  renderItem={this.renderItem}
                  keyExtractor={(item, index) => index.toString()}></FlatList>
              )}
            </View>
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                  this.addOutfits();
                }}>
                <Icon name="plus" type="font-awesome" />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  center1: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  addButton: {
    backgroundColor: '#c1e0b4',
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '90%',
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 15,
    alignSelf: 'center',
  },
  cardStyle: {
    width: 300,
    height: 350,
    borderRadius: 20,
  },
  textInput: {
    borderWidth: 2,
    width: '100%',
    height: 50,
    borderRadius: 5,
    fontSize: 20,
    marginTop: 30,
    textAlign: 'center',
  },
  save: {
    marginTop: 10,
    marginLeft: -100,
    backgroundColor: '#c1e0b4',
    width: 60,
    height: 40,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  cancel: {
    marginTop: -40,
    marginLeft: 100,
    backgroundColor: '#c1e0b4',
    width: 60,
    height: 40,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: '#c1e0b4',
    width: 100,
    height: 50,
    alignText: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 20,
  },
  text: {
    fontSize: 15,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
});
