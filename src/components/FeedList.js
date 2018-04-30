import React from 'react';
import { View, StyleSheet } from 'react-primitives';
import { Scrollbars } from 'react-custom-scrollbars';
import PropTypes from 'prop-types';

import FeedItem from './../components/FeedItem';
import { deleteFeed } from './../helpers/firebaseHelper';

const styles = StyleSheet.create({
  feedList: {
    alignItems: 'center',
  },
});

const propTypes = {
  data: PropTypes.array.isRequired,
};

class FeedList extends React.Component {
  _renderFeedItems() {
    const { data } = this.props;
    return data.map(d => {
      const imageURLsCount = Object.keys(d.imageURLs).length;
      if (imageURLsCount > 0) {
        return <FeedItem data={d} key={d.added} />;
      }
      deleteFeed(d.feedId);
      return <View />;
    });
  }

  render() {
    return (
      <Scrollbars>
        <View style={styles.feedList}>{this._renderFeedItems()}</View>
      </Scrollbars>
    );
  }
}

FeedList.propTypes = propTypes;

export default FeedList;
