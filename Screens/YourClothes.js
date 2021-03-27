import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { ListItem } from 'react-native-elements'

import MyHeader from '../components/MyHeader'
import db from '../Config';
import firebase from 'firebase';

export default class YourClothes extends React.Component {
  constructor() {
    super();
    this.state = {
      outfits: [],
      userId: firebase.auth().currentUser.email,
      userDetails: []
    };
  }
  getAllOutfits = () => {
    db.collection('Rented-Outfits')
      .where('dress_carrier_email_id', '==', this.state.userId)
      .onSnapshot((snapshot) => {
        var clothes = []
        snapshot.docs.map((doc) => {
          var data = doc.data()
          data["DocID"] = doc.id
          clothes.push(data)
        });
        this.setState({
          outfits: clothes,
        });
      });
  };
  getUserDetails = () => {
    db
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
  }
  sentOutfit = (item) => {
    if(item.status == "Requested") {
      db.collection("Rented-Outfits").doc(item.DocID).update({
        status: "Sent"
      })
      db.collection("Notifications").add({
        user_Id: this.state.userId,
        target_id: item.user_id,
        date: firebase.firestore.FieldValue.serverTimestamp(),
        status: 'unread',
        message: this.state.userDetails.first_name + " " + this.state.userDetails.last_name + " has sent you the outfit."
      })
      alert("Outfit was succesfully sent!")
    }
  }
  componentDidMount() {
    this.getAllOutfits();
    this.getUserDetails()
  }
  renderItem = ({item}) => {
    return(
      <ListItem 
        title={item.status}
        subtitle={item.username}
        titleStyle= {{fontSize: 20, fontFamily: "Courier New"}}
        leftElement={
          <Image 
            source={{uri: item.image}}
            style={styles.image}
          />}
        rightElement={
        <TouchableOpacity onPress={() => {
          this.sentOutfit(item)
        }}>
          <Text>{item.status == "Sent" ? "Outfit Sent!" : "Sent Outfit"}</Text>
        </TouchableOpacity>}
        bottomDivider
    />
    )
  }
  render() {
    return (
      <View style={styles.container}>
        <MyHeader title={"Outfits for Rent"}/>
        <View style={{flex: 1}}>
        {this.state.outfits.length == 0 ? (
          <View style={{flex: 1}}>
            <Text>No outfits have been requested for rent!</Text>
          </View>
        ): (
          <FlatList 
            data={this.state.outfits}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
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
  }
});
