import React from 'react';
import { View, StyleSheet } from 'react-primitives';
import { Form, Col, FormGroup, Label, Input, FormText, Button, Alert, Modal, ModalBody } from 'reactstrap';
import { inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import EXIF from 'exif-js';
import firebase from 'firebase';
import { ScaleLoader } from 'react-spinners';
import moment from 'moment';
import shortid from 'shortid';

import { primaryLightColor, primaryColor } from './../config/Colors';
import SearchBar from './../components/SearchBar';
import { addData } from './../helpers/firebaseHelper';

const styles = StyleSheet.create({
  container: {
    padding: 15,
    width: '100%',
    maxWidth: 600,
  },
  loadingContainer: {
    marginTop: 50,
    marginBottom: 50,
    flex: 1,
    alignItems: 'center',
  },
});

const autoSuggestTheme = {
  container: {
    position: 'inherit',
    width: '100%',
  },
  input: {
    width: '100%',
    height: 36,
    padding: '10px 20px',
    fontWeight: 300,
    fontSize: 16,
    border: '1px solid #D6D6D6',
    borderRadius: 5,
  },
  inputFocused: {
    outline: 'none',
    borderRadius: 5,
  },
  inputOpen: {
    borderRadius: 5,
  },
  suggestionsContainer: {
    display: 'none',
  },
  suggestionsContainerOpen: {
    display: 'block',
    position: 'relative',
    top: 0,
    width: '100%',
    border: '1px solid #D6D6D6',
    backgroundColor: '#fff',
    fontFamily: 'Helvetica, sans-serif',
    fontWeight: 300,
    fontSize: 16,
    borderRadius: 5,
    zIndex: 2,
    maxHeight: 300,
    overflowY: 'auto',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  suggestion: {
    cursor: 'pointer',
    padding: '10px 20px',
  },
  suggestionHighlighted: {
    backgroundColor: primaryLightColor,
  },
};

@inject('routing', 'user', 'common')
class UploadForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      alertColor: 'danger',
      alertVisible: false,
      alertMessage: 'Alert Message',
      modal: false,
      totalImages: 0,
      currentImage: 1,
      description: '',
    };
  }

  _isValid = true;
  _imageURLS = [];

  _handleDescInput = e => {
    const text = e.target.value;
    this._alert(false);
    if (text.length > 140) {
      this._alert(true, 'danger', 'Description can not exceed 140 chars');
    } else {
      this.setState({ description: text });
    }
  };

  _handleImage() {
    this._isValid = true;
    const images = [...document.getElementById('filesInput').files];
    images.forEach(img => this._processEXIFData(img));
  }

  _alert(show, color, message) {
    this.setState({ alertVisible: show, alertColor: color, alertMessage: message });
  }

  _cancelUpload() {
    this.setState({ modal: false });
  }

  _processEXIFData = img => {
    EXIF.getData(img, function() {
      const model = EXIF.getTag(this, 'Model');
      if (!model && this._isValid) {
        this._isValid = false;
      }
    });
  };

  _processUpload() {
    if (this.props.common.phoneModel.length === 0) {
      this._alert(true, 'danger', 'Select a Phone Model');
    } else if (document.getElementById('filesInput').files.length === 0) {
      this._alert(true, 'danger', 'No images are selected');
    } else if (!this._isValid) {
      this._alert(true, 'danger', 'Invalid images. For authenticity, we auto verify the EXIF data');
    } else {
      this._resetUI();
      this._startUploadImages();
    }
  }

  _putStorageItem(item) {
    const userId = this.props.user.profile.uid;
    const { phoneModel } = this.props.common;
    const path = `${userId}/${phoneModel}/${item.size}_${moment().format()}_${item.name}`;
    return firebase
      .storage()
      .ref(path)
      .put(item)
      .then(snapshot => {
        this._imageURLS.push(snapshot.downloadURL);
        if (this.state.totalImages >= this._imageURLS.length + 1) {
          this.setState({ currentImage: this._imageURLS.length + 1 });
        }
      })
      .catch(error => {
        this._alert(true, 'error', error.message);
      });
  }

  _resetUI() {
    this._imageURLS = [];
    this._alert(false);
    this.setState({ currentImage: 1, totalImages: 0, modal: false });
  }

  _startUploadImages() {
    const { user } = this.props;
    if (user.profile) {
      this.setState({ modal: true });
      const imagesArray = [...document.getElementById('filesInput').files];
      this.setState({ totalImages: imagesArray.length });
      Promise.all(imagesArray.map(image => this._putStorageItem(image)))
        .then(() => {
          const imageURLsObj = {};
          this._imageURLS.forEach((imgUrl, index) => {
            imageURLsObj[`image${index}`] = imgUrl;
          });
          const uploadData = {
            added: moment().format(),
            addedBy: user.profile.uid,
            phoneModel: this.props.common.phoneModel,
            imageURLs: imageURLsObj,
            feedId: shortid.generate(),
            sampleType: 'camera',
            description: this.state.description,
          };
          addData(uploadData, () => {
            this._resetUI();
            document.getElementById('filesInput').value = '';
            this._alert(true, 'success', 'Upload Complete');
            this.setState({ description: '' });
          });
        })
        .catch(error => {
          console.log(`Some failed: `, error.message);
        });
    } else {
      this._alert(true, 'danger', 'Authentication Error');
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Form>
          <FormGroup row>
            <Label sm={2}>Phone Model</Label>
            <Col sm={10}>
              <SearchBar theme={autoSuggestTheme} />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="filesInput" sm={2}>
              Images
            </Label>
            <Col sm={10}>
              <Input
                type="file"
                name="file"
                id="filesInput"
                multiple
                onChange={() => this._handleImage()}
                accept="image/png, image/jpeg"
              />
              <FormText color="muted">
                By uploading images, you agree to our&nbsp;
                <Link to="/terms">Terms & Conditions</Link>
              </FormText>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label sm={2}>Description</Label>
            <Col sm={10}>
              <Input
                value={this.state.description}
                type="textarea"
                name="text"
                placeholder="(Optional) 140 chars"
                onChange={this._handleDescInput}
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label sm={2} />
            <Col sm={10}>
              <Button outline color="primary" onClick={() => this._processUpload()}>
                Upload
              </Button>
              &nbsp; &nbsp;
              <Button outline color="primary" tag={Link} to="/feed">
                Cancel
              </Button>
            </Col>
          </FormGroup>
        </Form>
        <Alert color={this.state.alertColor} isOpen={this.state.alertVisible}>
          {this.state.alertMessage}
        </Alert>
        <Modal isOpen={this.state.modal} backdrop>
          <ModalBody>
            <b>Uploading Images :</b>
            &nbsp; {this.state.currentImage}&nbsp;of&nbsp;{this.state.totalImages}
            <View style={styles.loadingContainer}>
              <ScaleLoader loading color={primaryColor} />
            </View>
          </ModalBody>
        </Modal>
      </View>
    );
  }
}

export default UploadForm;
