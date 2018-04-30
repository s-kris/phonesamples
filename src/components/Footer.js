import React from 'react';
import { View, Text, StyleSheet } from 'react-primitives';

import { primaryColor } from './../config/Colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  hr: {
    width: 100,
    height: 3,
    marginBottom: 10,
    backgroundColor: primaryColor,
  },
  footerText: {
    color: 'grey',
  },
});

class Footer extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.hr} />
        <View>
          <Text style={styles.footerText}>Open-Source Project. Crowdsourced Samples.</Text>
        </View>
      </View>
    );
  }
}

export default Footer;
