import React from 'react';
import { View, StyleSheet, Text } from 'react-primitives';
import DocumentTitle from 'react-document-title';
import { BarLoader } from 'react-spinners';

import { primaryColor } from './../config/Colors';
import { getAllData } from './../helpers/firebaseHelper';
import FeedList from './../components/FeedList';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
    height: 650,
    padding: 5,
  },
  info: {
    color: 'grey',
    fontSize: 36,
  },
  feed: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
});

class FeedScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoading: true,
    };
    getAllData(this._dataCallback);
  }

  _dataCallback = res => {
    this.setState({ data: res, isLoading: false });
  };

  _renderFeed() {
    const { data } = this.state;
    if (data.length === 0) {
      return <Text style={styles.info}>Great feed is coming!</Text>;
    }
    return (
      <View style={styles.feed}>
        <FeedList data={data} />
      </View>
    );
  }

  render() {
    return (
      <DocumentTitle title="Feed | Phone Samples">
        <View style={styles.container}>
          {this.state.isLoading ? (
            <BarLoader loading={this.state.isLoading} color={primaryColor} />
          ) : (
            this._renderFeed()
          )}
        </View>
      </DocumentTitle>
    );
  }
}

export default FeedScreen;
