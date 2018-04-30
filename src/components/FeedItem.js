import React from 'react';
import { View, Text, StyleSheet } from 'react-primitives';
import Gallery from 'react-grid-gallery';
import { inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { ScaleLoader } from 'react-spinners';
import { Button } from 'reactstrap';
import PropTypes from 'prop-types';

import SocialShare from './SocialShare';
import { getUserData } from './../helpers/firebaseHelper';
import { primaryColor, descriptionBgColor } from './../config/Colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    minHeight: 300,
    maxWidth: 800,
    margin: 30,
  },
  loaderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  galleryContainer: {},
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  copyText: {
    cursor: 'pointer',
    color: primaryColor,
  },
  socialWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  descriptionContainer: {
    marginTop: 10,
    marginLeft: 2,
    paddingLeft: 15,
    borderLeftColor: primaryColor,
    borderLeftWidth: 3,
    borderLeftStyle: 'solid',
    backgroundColor: descriptionBgColor,
    padding: 10,
  },
  descriptionText: {
    color: 'grey',
  },
});

const propTypes = {
  data: PropTypes.object.isRequired,
};

@inject('user')
class FeedItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      username: 'abcdefg',
      feedLink: `${window.location.origin}/view:${this.props.data.feedId}`,
    };
    this._formatImageData();
    getUserData(this.props.data.addedBy, this._dataCallback);
  }

  _imageData = [];

  _dataCallback = res => {
    this.setState({ username: res.username, isLoading: false });
  };

  _formatImageData() {
    const { imageURLs } = this.props.data;
    const urls = Object.values(imageURLs);
    urls.forEach(url => {
      this._imageData.push({
        src: url,
        thumbnail: url,
        thumbnailWidth: 200,
        thumbnailHeight: 150,
      });
    });
  }

  _renderFeedItem() {
    return (
      <View>
        <View style={styles.textContainer}>
          <Text>
            <Link to={`user:${this.state.username}`}>{this.state.username}</Link>
            &nbsp;added {this._imageData.length} images to&nbsp;
            <Link to={`model:${this.props.data.phoneModel}`}>{this.props.data.phoneModel}</Link>
          </Text>
        </View>
        <View style={styles.socialWrapper}>
          <SocialShare url={this.state.feedLink} />
          <Link to={`/view:${this.props.data.feedId}`}>
            <Button outline color="primary">
              View All
            </Button>
          </Link>
        </View>
        <View style={styles.galleryContainer}>
          <Gallery images={this._imageData} backdropClosesModal enableImageSelection={false} margin={2} maxRows={1} />
        </View>
        {this.props.data.description.length > 0 && (
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionText}>{this.props.data.description}</Text>
          </View>
        )}
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.isLoading ? (
          <View style={styles.loaderContainer}>
            <ScaleLoader loading={this.state.isLoading} color={primaryColor} />
          </View>
        ) : (
          this._renderFeedItem()
        )}
      </View>
    );
  }
}

FeedItem.propTypes = propTypes;

export default FeedItem;
