import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Card } from 'react-native-elements';

import db from '../Config';
import firebase from 'firebase';

export default class DetailsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      info: this.props.navigation.getParam('Data'),
      carrierDetails: [],
      userId: firebase.auth().currentUser.email,
      userDetails: [],
    };
  }
  getCarrierDetails = async () => {
    await db
      .collection('Users')
      .where('email_id', '==', this.state.info.user_id)
      .get()
      .then((doc) => {
        doc.docs.map((data) => {
          this.setState({
            carrierDetails: data.data(),
          });
        });
      });
  };
  getUserDetails = async () => {
    await db
      .collection('Users')
      .where('email_id', '==', this.state.userId)
      .get()
      .then((doc) => {
        doc.docs.map((data) => {
          this.setState({
            userDetails: data.data(),
          });
        });
      });
  };
  rentOutfit = async () => {
    await db.collection('Rented-Outfits').add({
      dress_price: this.state.info.price,
      dress_carrier_email_id: this.state.info.user_id,
      user_id: this.state.userId,
      status: 'Requested',
      username: this.state.userDetails.first_name  + " " + this.state.userDetails.last_name,
      image: this.state.info.image_uri
    });
    db.collection('Notifications').add({
      date: firebase.firestore.FieldValue.serverTimestamp(),
      target_id: this.state.info.user_id,
      staus: 'unread',
      message: this.state.userDetails.first_name + ' wants to rent an outfit.',
      user_id: this.state.userId,
    });
    alert('Request was made succesfully!');
  };
  componentDidMount() {
    this.getCarrierDetails();
    this.getUserDetails();
  }
  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <Image
            source={{ uri: this.state.info.image_uri }}
            style={styles.image}
          />
          <Card title={'Dress Details'}>
            <Card>
              <Text>Type: {this.state.info.type}</Text>
            </Card>
            <Card>
              <Text>Rent Price: {this.state.info.price}</Text>
            </Card>
            <Card>
              <Text>Size: {this.state.info.size}</Text>
            </Card>
          </Card>
          <Card title={'User Details'}>
            <Card>
              <Text>
                Name: {this.state.carrierDetails.first_name}{' '}
                {this.state.userDetails.last_name}
              </Text>
            </Card>
            <Card>
              <Text>
                Contact Information: {this.state.carrierDetails.contact_Info}
              </Text>
            </Card>
          </Card>
            {this.state.info.user_id == this.state.userId ? null : (
              <TouchableOpacity
              style={styles.rentButton}
              onPress={() => {
                this.rentOutfit();
                this.props.navigation.navigate('Outfits for Rent');
              }}>
              <Text style={styles.text}>I want to rent the outfit.</Text>
            </TouchableOpacity>
            )}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: 400,
    height: 400,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  rentButton: {
    backgroundColor: '#c1e0b4',
    width: 300,
    height: 50,
    alignText: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 20,
  },
  text: {
    fontSize: 20,
    alignSelf: 'center',
  }
});
