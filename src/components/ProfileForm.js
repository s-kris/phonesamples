import React from 'react';
import { View, StyleSheet } from 'react-primitives';
import {
  Form,
  Col,
  FormGroup,
  FormText,
  Label,
  Input,
  FormFeedback,
  Button,
  Alert,
  Modal,
  ModalBody,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { ScaleLoader } from 'react-spinners';
import PropTypes from 'prop-types';
import isValidUsername from 'is-valid-username';
import alertify from 'alertify.js';

import { primaryColor } from './../config/Colors';
import { checkUsernameExists, updateUsername, deleteUserProfile, deleteUserUploads } from '../helpers/firebaseHelper';

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

const propTypes = {
  displayName: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  signedInWith: PropTypes.string.isRequired,
  logout: PropTypes.func.isRequired,
};

class ProfileForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      alertColor: 'danger',
      alertVisible: false,
      alertMessage: 'Alert Message',
      modal: false,
      username: this.props.username,
      usernameFeedback: '',
      validFlag: false,
      inValidFlag: false,
      saveFlag: false,
    };
  }

  _isValid = true;
  _imageURLS = [];

  _saveCallback = () => {
    this._resetUI();
    this.setState({ validFlag: false, inValidFlag: false });
    this._alert(true, 'success', 'Username updated');
  };

  _usernameCallback = exists => {
    if (exists) {
      this.setState({
        validFlag: false,
        inValidFlag: true,
        usernameFeedback: 'Username is unavailable',
        saveFlag: false,
      });
    } else {
      this.setState({
        validFlag: true,
        inValidFlag: false,
        usernameFeedback: 'Username is available',
        saveFlag: true,
      });
    }
  };

  _handleTextInput = e => {
    this._resetUI();
    const text = e.target.value;
    this.setState({ username: text }, this._validateUsername(text));
  };

  _onClickDelete = () => {
    this.props.logout();
    this.setState({ modal: true });
    deleteUserUploads(this.props.userId, () =>
      deleteUserProfile(this.props.userId, () => {
        this.setState({ modal: false });
        window.location.href = window.location.origin;
      })
    );
  };

  _onClickSave() {
    this._resetUI();
    const { username } = this.state;
    if (username.length < 5 || username.length > 15) {
      this._validateUsername(username);
      this._alert(true, 'danger', 'Invalid Username');
    } else if (username === this.props.username) {
      this.setState({ validFlag: false, inValidFlag: false });
      this._alert(true, 'success', 'Username updated');
    } else if (this.state.saveFlag) {
      this.setState({ modal: true });
      updateUsername(this.props.userId, this.state.username, this._saveCallback);
    } else {
      this._alert(true, 'danger', 'Invalid Username');
    }
  }
  _alert(show, color, message) {
    this.setState({ alertVisible: show, alertColor: color, alertMessage: message });
  }

  _confirmDelete() {
    const message = `All your uploads and profile will be deleted. You can't retrieve them. Are you sure? `;
    alertify
      .okBtn('Delete')
      .cancelBtn('Cancel')
      .confirm(message, () => this._onClickDelete());
  }

  _resetUI() {
    this._alert(false);
    this.setState({ modal: false });
  }

  _validateUsername = text => {
    if (text === this.props.username) {
      this.setState({
        validFlag: true,
        inValidFlag: false,
        usernameFeedback: 'Current Username',
        saveFlag: false,
      });
    } else if (text.length < 5 || text.length > 15) {
      this.setState({
        validFlag: false,
        inValidFlag: true,
        usernameFeedback: 'Username should be between 5 to 15 characters',
        saveFlag: false,
      });
    } else if (!isValidUsername(text)) {
      this.setState({
        validFlag: false,
        inValidFlag: true,
        usernameFeedback: 'Usernames can only contain alphabet and numbers',
        saveFlag: false,
      });
    } else {
      checkUsernameExists(text, this._usernameCallback);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Form>
          <FormGroup row>
            <Label sm={2}>Name</Label>
            <Col sm={10}>
              <Input type="text" value={this.props.displayName} readOnly />
              <FormText>
                Linked from your
                <span style={{ color: primaryColor }}> {this.props.signedInWith} </span>
                account
              </FormText>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label sm={2}>Email</Label>
            <Col sm={10}>
              <Input type="email" value={this.props.email} readOnly />
              <FormText>
                Linked from your
                <span style={{ color: primaryColor }}> {this.props.signedInWith} </span>
                account
              </FormText>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label sm={2}>Username</Label>
            <Col sm={10}>
              <Input
                invalid={this.state.inValidFlag}
                valid={this.state.validFlag}
                type="text"
                value={this.state.username}
                autoComplete="off"
                onChange={this._handleTextInput}
              />
              <FormFeedback invalid={this.state.inValidFlag.toString()} valid={this.state.validFlag}>
                {this.state.usernameFeedback}
              </FormFeedback>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label sm={2} />
            <Col sm={10}>
              <Button outline color="primary" onClick={() => this._onClickSave()}>
                Save
              </Button>
              &nbsp; &nbsp;
              <Button outline color="primary" tag={Link} to="/">
                Go to Home
              </Button>{' '}
              &nbsp; &nbsp;
              <Button outline color="danger" onClick={() => this._confirmDelete()}>
                Delete Profile
              </Button>
            </Col>
          </FormGroup>
        </Form>
        <Alert color={this.state.alertColor} isOpen={this.state.alertVisible}>
          {this.state.alertMessage}
        </Alert>
        <Modal isOpen={this.state.modal} backdrop>
          <ModalBody>
            <b>Please wait..</b>
            <View style={styles.loadingContainer}>
              <ScaleLoader loading color={primaryColor} />
            </View>
          </ModalBody>
        </Modal>
      </View>
    );
  }
}

ProfileForm.propTypes = propTypes;

export default ProfileForm;
