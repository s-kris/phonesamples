import React from 'react';
import { View, StyleSheet } from 'react-primitives';
import DocumentTitle from 'react-document-title';

import FirebaseLogin from './../components/FirebaseLogin';

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    marginBottom: 100,
    height: 500,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

class LoginScreen extends React.Component {
  render() {
    return (
      <DocumentTitle title="Login | Phone Samples">
        <View style={styles.container}>
          <FirebaseLogin />
        </View>
      </DocumentTitle>
    );
  }
}

export default LoginScreen;
