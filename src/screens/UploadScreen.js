import React from 'react';
import { View, StyleSheet } from 'react-primitives';
import DocumentTitle from 'react-document-title';

import UploadForm from './../components/UploadForm';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 100,
    height: 450,
  },
});

class UploadScreen extends React.Component {
  render() {
    return (
      <DocumentTitle title="Upload | Phone Samples">
        <View style={styles.container}>
          <UploadForm />
        </View>
      </DocumentTitle>
    );
  }
}

export default UploadScreen;
