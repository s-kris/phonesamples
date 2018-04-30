import React from 'react';
import { View, Text, StyleSheet } from 'react-primitives';
import { Link } from 'react-router-dom';

import WhatAShame from './../components/WhatAShame';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    height: 600,
    justifyContent: 'center',
  },
  info: {
    color: 'grey',
    fontSize: 18,
    padding: 5,
  },
});

class NotFoundScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.info}>Oops! We din't find the page you are looking for!</Text>
        <Text style={styles.info}>
          <Link to="/feed">Browse Samples </Link>
        </Text>
        <WhatAShame />
      </View>
    );
  }
}

export default NotFoundScreen;
