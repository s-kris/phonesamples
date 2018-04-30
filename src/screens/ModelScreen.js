import React from 'react';
import { View, StyleSheet } from 'react-primitives';
import DocumentTitle from 'react-document-title';
import { BarLoader } from 'react-spinners';

import { primaryColor } from './../config/Colors';
import { getModelData } from './../helpers/firebaseHelper';
import FeedList from './../components/FeedList';
import NoData from './../components/NoData';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    height: 650,
    padding: 5,
  },
  feed: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
});

class ModelScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoading: true,
    };
    getModelData(this.props.match.params.id.replace(':', ''), this._dataCallback);
  }

  _dataCallback = res => {
    this.setState({ data: res, isLoading: false });
  };

  _renderFeed() {
    const { data } = this.state;
    if (data.length === 0) {
      return <NoData message="No samples yet!" />;
    }
    return (
      <View style={styles.feed}>
        <FeedList data={data} />
      </View>
    );
  }

  render() {
    return (
      <DocumentTitle title="Model | Phone Samples">
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

export default ModelScreen;
