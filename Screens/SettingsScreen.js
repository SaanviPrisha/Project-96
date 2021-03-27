import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';

import MyHeader from '../components/MyHeader';
import db from '../Config';
import firebase from 'firebase';

export default class SettingScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      emailId: firebase.auth().currentUser.email,
      firstName: '',
      lastName: '',
      address: '',
      contact: '',
      docId: '',
    };
  }
  getUserDetails = () => {
    db.collection('Users')
      .where('email_id', '==', this.state.emailId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var data = doc.data();
          this.setState({
            firstName: data.first_name,
            lastName: data.last_name,
            address: data.address,
            contact: data.contact_Info,
            docId: doc.id,
          });
        });
      });
  };
  updateUserDetails = () => {
    db.collection('Users').doc(this.state.docId).update({
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      address: this.state.address,
      contact_Info: this.state.contact,
    });
    alert('Profile was succesfully updated!');
  };
  componentDidMount() {
    this.getUserDetails();
  }
  render() {
    return (
      <View style={styles.container}>
        <MyHeader title={'Settings'} />
        <View style={styles.center}>
          <TextInput
            placeholder={'First Name'}
            value={this.state.firstName}
            style={styles.textInput1}
            onChangeText={(text) => {
              this.setState({
                firstName: text,
              });
            }}></TextInput>
          <TextInput
            placeholder={'Last Name'}
            value={this.state.lastName}
            style={styles.textInput1}
            onChangeText={(text) => {
              this.setState({
                lastName: text,
              });
            }}></TextInput>
          <TextInput
            placeholder={'Address'}
            value={this.state.address}
            multiline={true}
            style={styles.textInput2}
            onChangeText={(text) => {
              this.setState({
                address: text,
              });
            }}></TextInput>
          <TextInput
            placeholder={'Phone Number'}
            value={this.state.contact}
            keyboardType={'numeric'}
            style={styles.textInput1}
            onChangeText={(text) => {
              this.setState({
                contact: text,
              });
            }}></TextInput>
          <TouchableOpacity
            onPress={() => {
              this.updateUserDetails();
            }}
            style={styles.saveButton}>
            <Text style={styles.text}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput1: {
    borderWidth: 2,
    width: '60%',
    height: 50,
    borderRadius: 5,
    fontSize: 20,
    marginTop: 30,
    marginLeft: 30,
    textAlign: 'center',
  },
  textInput2: {
    borderWidth: 2,
    width: '60%',
    height: 70,
    borderRadius: 5,
    fontSize: 20,
    marginTop: 30,
    marginLeft: 30,
    textAlign: 'center',
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
