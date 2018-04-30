import React from 'react';
import { View, Text, StyleSheet } from 'react-primitives';
import DocumentTitle from 'react-document-title';
import { ScaleLoader } from 'react-spinners';
import Gallery from 'react-grid-gallery';
import { Link } from 'react-router-dom';

import { getFeedDocumentData } from './../helpers/firebaseHelper';
import { primaryColor } from './../config/Colors';
import NoData from './../components/NoData';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: 2,
    minHeight: 300,
  },
  gallery: {
    flex: 1,
    width: '100%',
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  descriptionText: {
    color: 'grey',
  },
});

class EmbedScreen extends React.Component {
  constructor(props) {
    super(props);
    const feedId = this.props.match.params.id.replace(':', '');
    this.state = {
      images: [],
      isLoading: true,
      feedLink: `${window.location.origin}/view:${feedId}`,
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
    this.setState({ images: imagegalleryData, isLoading: false });
  };

  _errorCallback = () => {
    this.setState({ images: [], isLoading: false });
  };

  _renderFeedItem() {
    if (this.state.images.length === 0) {
      return <NoData message="Not a Valid URL" />;
    }
    return (
      <View style={styles.gallery}>
        <Gallery images={this.state.images} backdropClosesModal enableImageSelection={false} margin={2} />
        <View style={styles.textContainer}>
          <Text style={styles.descriptionText}>
            via:{' '}
            <Link target="_blank" to={this.state.feedLink}>
              phonesamples.org
            </Link>
          </Text>
        </View>
      </View>
    );
  }

  render() {
    return (
      <DocumentTitle title="Embed | Phone Samples">
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

export default EmbedScreen;
