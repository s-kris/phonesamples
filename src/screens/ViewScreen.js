import React from 'react';
import { View, Text, StyleSheet } from 'react-primitives';
import DocumentTitle from 'react-document-title';
import { ScaleLoader } from 'react-spinners';
import Gallery from 'react-grid-gallery';
import { Link } from 'react-router-dom';
import copy from 'copy-to-clipboard';
import alertify from 'alertify.js';
import { ButtonGroup, Button } from 'reactstrap';
import Scrollbars from 'react-custom-scrollbars';

import { getFeedDocumentData, getUserData } from './../helpers/firebaseHelper';
import { primaryColor, descriptionBgColor } from './../config/Colors';
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
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  copyText: {
    cursor: 'pointer',
    color: primaryColor,
  },
  socialContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
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
  buttonContainer: {
    marginTop: 15,
  },
});

class ViewScreen extends React.Component {
  constructor(props) {
    super(props);
    const feedId = this.props.match.params.id.replace(':', '');
    this.state = {
      images: [],
      isLoading: true,
      username: 'abcdefg',
      phoneModel: 'phone',
      description: '',
      feedLink: `${window.location.origin}/view:${feedId}`,
      embedLink: `${window.location.origin}/embed:${feedId}`,
      modal: false,
    };
    getFeedDocumentData(feedId, this._dataCallback, this._errorCallback);
  }

  _dataCallback = res => {
    const imagegalleryData = [];
    const urls = Object.values(res.imageURLs);
    urls.forEach(url => {
      imagegalleryData.push({
        src: url,
        thumbnail: url,
        thumbnailWidth: 320,
        thumbnailHeight: 212,
      });
    });
    getUserData(res.addedBy, this._userDataCallback);
    this.setState({ images: imagegalleryData, phoneModel: res.phoneModel, description: res.description });
  };

  _userDataCallback = res => {
    this.setState({ username: res.username, isLoading: false });
  };

  _errorCallback = () => {
    this.setState({ images: [], isLoading: false });
  };

  _handleCopy() {
    copy(this.state.feedLink);
    alertify.success('Link Copied!');
  }

  _handleEmbed = () => {
    alertify
      .okBtn('Copy Embed Link')
      .cancelBtn('Cancel')
      .confirm('You can embed this feed on your webpage directly.', () => {
        copy(this.state.embedLink);
        alertify.success('Embed Link Copied!');
      });
  };

  _renderFeedItem() {
    if (this.state.images.length === 0) {
      return <NoData message="Not a Valid URL" />;
    }
    return (
      // you'll be tempted to use standard component in this. Do NOT modify it.
      // you customised it for a reason
      <View style={styles.gallery}>
        <View style={styles.textContainer}>
          <Text>
            <Link to={`user:${this.state.username}`}>{this.state.username}</Link>
            &nbsp;added {this.state.images.length} images to&nbsp;
            <Link to={`model:${this.state.phoneModel}`}>{this.state.phoneModel}</Link>
          </Text>
        </View>
        {this.state.description.length > 0 && (
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionText}>{this.state.description}</Text>
          </View>
        )}
        <View style={styles.socialContainer}>
          <SocialShare url={this.state.feedLink} />
          <View style={styles.buttonContainer}>
            <ButtonGroup>
              <Button outline color="primary" onClick={() => this._handleEmbed()}>
                Embed
              </Button>
              <Button outline color="primary" onClick={() => this._handleCopy()}>
                Copy Link
              </Button>
            </ButtonGroup>
          </View>
        </View>
        <Scrollbars style={{ height: 600 }}>
          <Gallery images={this.state.images} backdropClosesModal enableImageSelection={false} margin={2} />
        </Scrollbars>
      </View>
    );
  }

  render() {
    return (
      <DocumentTitle title="View | Phone Samples">
        <View style={styles.container}>
          {this.state.isLoading ? (
            <ScaleLoader loading={this.state.isLoading} color={primaryColor} />
          ) : (
            this._renderFeedItem()
          )}
        </View>
      </DocumentTitle>
    );
  }
}

export default ViewScreen;
