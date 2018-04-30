import React from 'react';
import { View, Text, StyleSheet } from 'react-primitives';
import DocumentTitle from 'react-document-title';
import { inject } from 'mobx-react';
import { ScaleLoader } from 'react-spinners';
import Gallery from 'react-grid-gallery';
import copy from 'copy-to-clipboard';
import alertify from 'alertify.js';
import { Button, ButtonGroup, Modal, ModalBody } from 'reactstrap';
import firebase from 'firebase';
import Scrollbars from 'react-custom-scrollbars';

import { getUserSamples, getUserShortId, deleteImageFromFS } from './../helpers/firebaseHelper';
import { primaryColor } from './../config/Colors';
import SocialShare from './../components/SocialShare';
import { removeElementFromArray } from './../helpers/utils';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 50,
    minHeight: 500,
    width: '100%',
    padding: 5,
  },
  info: {
    color: 'grey',
    fontSize: 36,
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
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  loadingContainer: {
    marginTop: 50,
    marginBottom: 50,
    flex: 1,
    alignItems: 'center',
  },
  buttonContainer: {
    marginTop: 15,
  },
});

const tagStyle = {
  color: 'white',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  padding: 3,
  borderRadius: 3,
};

@inject('user')
class MySamplesScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      isLoading: true,
      userUrl: 'loading',
      selectedImages: [],
      modal: false,
      currentImage: 1,
      isAllSelected: false,
      masterImageArray: [],
    };
  }

  componentDidMount() {
    setTimeout(() => {
      getUserSamples(this.props.user.profile.uid, this._dataCallback);
      getUserShortId(this.props.user.profile.uid, this._usernameCallBack);
    }, 1000);
  }

  onSelectImage = index => {
    const { images } = this.state;
    const img = images[index];
    if (img.hasOwnProperty('isSelected')) {
      img.isSelected = !img.isSelected;
    } else {
      img.isSelected = true;
    }

    if (img.isSelected) {
      this.state.selectedImages.push(img.src);
    } else {
      const tempArr = removeElementFromArray(this.state.selectedImages, img.src);
      this.setState({ selectedImages: tempArr });
    }
    this.setState({ images });
  };

  onClickSelectAll = () => {
    const { images } = this.state;
    images.forEach(img => {
      if (!this.state.isAllSelected) {
        img.isSelected = true;
        this.state.selectedImages.push(img.src);
      } else {
        img.isSelected = false;
        this.setState({ selectedImages: [] });
      }
    });
    this.setState({
      images,
      isAllSelected: !this.state.isAllSelected,
    });
  };

  _dataCallback = res => {
    const imagegalleryData = [];
    res.forEach(r => {
      const urls = Object.values(r.imageURLs);
      this.state.masterImageArray.push(r.imageURLs);
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

  _usernameCallBack = res => {
    this.setState({
      userUrl: `${window.location.origin}/user:${res}`,
    });
  };

  _resetUI() {
    const { images, selectedImages } = this.state;
    const tempArr = images.filter(img => !selectedImages.includes(img.src));
    this.setState({
      selectedImages: [],
      modal: false,
      currentImage: 1,
      images: tempArr,
      isLoading: false,
    });
  }

  _confirmDelete = message => {
    alertify
      .okBtn('Delete')
      .cancelBtn('Cancel')
      .confirm(message, () => {
        this._startDeletingImages();
      });
  };

  _deleteItem = (propertyId, storageURL) => {
    const storageRef = firebase.storage().refFromURL(storageURL);
    return storageRef
      .delete()
      .then(() => {
        deleteImageFromFS(propertyId, storageURL);
        this.setState({
          currentImage: this.state.currentImage + 1,
        });
      })
      .catch(error => {
        console.log(error.message);
      });
  };

  _getPropertyId(url) {
    let propertyId;
    const imgArray = this.state.masterImageArray;
    imgArray.forEach(imgURLsObj => {
      Object.keys(imgURLsObj).forEach(key => {
        if (imgURLsObj[key] === url) {
          propertyId = key;
        }
      });
    });
    return propertyId;
  }

  _handleCopy() {
    copy(this.state.userUrl);
    alertify.success('Copied');
  }

  _handleDelete() {
    const selectedCount = this.state.selectedImages.length;
    if (selectedCount === 0) {
      alertify.log('No Images Selected');
    } else {
      this._confirmDelete(`Delete ${selectedCount} images?`);
    }
  }

  _renderGallery() {
    if (this.state.images.length === 0) {
      return <Text style={styles.info}>No Uploads yet!</Text>;
    }
    return (
      <View style={styles.gallery}>
        <View>
          <Text style={styles.text}>My Samples ({this.state.images.length})</Text>
        </View>
        <View style={styles.socialContainer}>
          <SocialShare url={this.state.userUrl} />
          <View style={styles.buttonContainer}>
            <ButtonGroup>
              <Button outline color="primary" onClick={() => this.onClickSelectAll()}>
                {this.state.isAllSelected ? 'Clear' : 'Select All'}
              </Button>
              <Button outline color="primary" onClick={() => this._handleDelete()}>
                Delete
              </Button>
              <Button outline color="primary" onClick={() => this._handleCopy()}>
                Copy Link
              </Button>
            </ButtonGroup>
          </View>
        </View>
        <Scrollbars style={{ height: 600 }}>
          <Gallery
            images={this.state.images}
            backdropClosesModal
            enableImageSelection
            onSelectImage={this.onSelectImage}
            margin={2}
            tagStyle={tagStyle}
          />
        </Scrollbars>
      </View>
    );
  }

  _startDeletingImages() {
    if (this.props.user.profile) {
      this.setState({ modal: true });
      Promise.all(this.state.selectedImages.map(url => this._deleteItem(this._getPropertyId(url), url)))
        .then(() => {
          alertify.success('Deleted');
          this.setState({ isLoading: true }, () => this._resetUI());
        })
        .catch(error => {
          console.log(`Some failed: `, error.message);
        });
    } else {
      alertify.error('Authentication Error');
    }
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
          <Modal isOpen={this.state.modal} backdrop>
            <ModalBody>
              <b>Deleting Images :</b>
              &nbsp; {this.state.currentImage}&nbsp;of&nbsp;{this.state.selectedImages.length}
              <View style={styles.loadingContainer}>
                <ScaleLoader loading color={primaryColor} />
              </View>
            </ModalBody>
          </Modal>
        </View>
      </DocumentTitle>
    );
  }
}

export default MySamplesScreen;
