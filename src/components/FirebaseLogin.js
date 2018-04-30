import React from 'react';
import { View, Text } from 'react-primitives';
import { FirebaseAuth } from 'react-firebaseui';
import firebase from 'firebase';
import { BarLoader } from 'react-spinners';
import { Link } from 'react-router-dom';
import { inject } from 'mobx-react';

import { primaryColor } from './../config/Colors';
import { addUserProfile, getUsername } from './../helpers/firebaseHelper';

const InfoComponent = () => (
  <View>
    <BarLoader loading color={primaryColor} />
    <Text>Please wait...</Text>
  </View>
);

@inject('routing')
class FirebaseLogin extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showFirebaseUI: true,
    };
  }
  uiConfig = {
    callbacks: {
      // eslint-disable-next-line
        signInSuccess: (currentUser, credential, redirectUrl) => {
        this.setState({ showFirebaseUI: false });
        getUsername(currentUser.uid, res => {
          const userData = {
            userId: currentUser.uid,
            displayName: currentUser.displayName,
            email: currentUser.email,
            profilePicURL: currentUser.photoURL,
            username: this._genUsername(res, currentUser.displayName),
            signedInWith: credential.providerId,
          };
          addUserProfile(currentUser.uid, userData, () => {
            // eslint-disable-next-line
            this.props.routing.history.push('/upload');
          });
        });
        return true;
      },
    },
    signInFlow: 'popup',
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    ],
  };

  _genUsername = (username, displayName) => {
    if (username) {
      return username;
    }
    return displayName
      .replace(/ /g, '')
      .substring(0, 10)
      .toLowerCase();
  };

  render() {
    return (
      <View>
        {this.state.showFirebaseUI ? (
          <View>
            <FirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()} />
            <Text>
              By signing in, your agree to our <Link to="/terms">Terms & Conditions</Link>.
            </Text>
          </View>
        ) : (
          <InfoComponent />
        )}
      </View>
    );
  }
}

export default FirebaseLogin;
