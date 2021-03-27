import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import SwipeableFlatlist from '../components/SwipeableFlatlist'
import MyHeader from '../components/MyHeader'
import db from '../Config'
import firebase from 'firebase'

export default class NotificationScreen extends React.Component {
    constructor() {
        super()
        this.state = {
          notifications: [],
          userId: firebase.auth().currentUser.email
        }
    }
    getAllNotification = () => {
      db.collection("Notifications").where("status","==","unread").where("target_id","==",this.state.userId)
      .onSnapshot(snapshot => {
      var count = []
      snapshot.docs.map(doc => {
        var data = doc.data()
        data["doc_id"] = doc.id
        count.push(data)
      })
      this.setState({
        notifications: count
      })
    })
    }
    componentDidMount() {
      this.getAllNotification()
    }
    render() {
        return (
        <View style={styles.container}>
            <MyHeader title="Notifications"/>
            {this.state.notifications.length == 0 ? (<Text>You Have No Notifications.</Text>) : (
              <SwipeableFlatlist allNotifications={this.state.notifications}/>
            )}
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
