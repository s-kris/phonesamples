import React from 'react';
import { View, Text, StyleSheet } from 'react-primitives';
import DocumentTitle from 'react-document-title';
import { inject } from 'mobx-react';
import { ScaleLoader } from 'react-spinners';
import Gallery from 'react-grid-gallery';
import copy from 'copy-to-clipboard';
import alertify from 'alertify.js';
import { Button } from 'reactstrap';
import Scrollbars from 'react-custom-scrollbars';

import { getUserSamples, getUserId } from './../helpers/firebaseHelper';
import { primaryColor } from './../config/Colors';
import SocialShare from './../components/SocialShare';
import NoData from './../components/NoData';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 50,
    minHeight: 500,
    width: '100%',
    padding: 5,
  },

  gallery: {
    flex: 1,
    width: '100%',
    maxWidth: 800,
  },
  text: {
    color: 'grey',
    fontSize: 18,
  },
  socialContainer: {
    marginTop: 15,
    marginBottom: 15,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

const tagStyle = {
  color: 'white',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  padding: 3,
  borderRadius: 3,
};

@inject('user')
class UserScreen extends React.Component {
  constructor(props) {
    super(props);
    const username = this.props.match.params.id.replace(':', '');
    this.state = {
      images: [],
      isLoading: true,
      userUrl: `${window.location.origin}/user:${username}`,
      username,
    };
    getUserId(username, this._userIdCallback, this._errorCallback);
  }

  _dataCallback = res => {
    const imagegalleryData = [];
    res.forEach(r => {
      const urls = Object.values(r.imageURLs);
      urls.forEach(url => {
        imagegalleryData.push({
          src: url,
          thumbnail: url,
          thumbnailWidth: 320,
          thumbnailHeight: 212,
          tags: [
            {
              value: r.phoneModel,
              title: r.phoneModel,
            },
          ],
        });
      });
    });
    this.setState({ images: imagegalleryData, isLoading: false });
  };

  _errorCallback = () => {
    this.setState({ images: [], isLoading: false });
  };

  _userIdCallback = res => {
    getUserSamples(res, this._dataCallback);
  };

  _handleCopy() {
    copy(this.state.userUrl);
    alertify.success('Copied!');
  }

  _renderGallery() {
    if (this.state.images.length === 0) {
      return <NoData message="Not a Valid User Id" />;
    }
    return (
      <View style={styles.gallery}>
        <Text style={styles.text}>
          {this.state.username}'s samples ({this.state.images.length})
        </Text>
        <View style={styles.socialContainer}>
          <SocialShare url={this.state.userUrl} />
          <Button outline color="primary" onClick={() => this._handleCopy()}>
            Copy Link
          </Button>
        </View>
        <Scrollbars style={{ height: 600 }}>
          <Gallery
            images={this.state.images}
            backdropClosesModal
            enableImageSelection={false}
            margin={2}
            tagStyle={tagStyle}
          />
        </Scrollbars>
      </View>
    );
  }

  render() {
    return (
      <DocumentTitle title="My Samples | Phone Samples">
        <View style={styles.container}>
          {this.state.isLoading ? (
            <ScaleLoader loading={this.state.isLoading} color={primaryColor} />
          ) : (
            this._renderGallery()
          )}
        </View>
      </DocumentTitle>
    );
  }
}

export default UserScreen;
