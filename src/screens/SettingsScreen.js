import React from 'react';
import { View, Text, StyleSheet } from 'react-primitives';
import DocumentTitle from 'react-document-title';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 100,
    height: 450,
    backgroundColor: 'grey',
  },
});

class SettingsScreen extends React.Component {
  render() {
    return (
      <DocumentTitle title="Settings | Phone Samples">
        <View style={styles.container}>
          <Text>Settings - Coming Soon</Text>
        </View>
      </DocumentTitle>
    );
  }
}

export default SettingsScreen;
