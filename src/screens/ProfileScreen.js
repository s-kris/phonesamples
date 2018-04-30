import React from 'react';
import { View, StyleSheet } from 'react-primitives';
import DocumentTitle from 'react-document-title';
import { ScaleLoader } from 'react-spinners';
import { inject } from 'mobx-react';

import ProfileForm from './../components/ProfileForm';
import { primaryColor } from '../config/Colors';
import { getUserData } from '../helpers/firebaseHelper';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 100,
    height: 450,
  },
});

@inject('user')
class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      username: '',
      displayName: '',
      email: '',
      logout: null,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      getUserData(this.props.user.profile.uid, this._dataCallback);
    }, 1000);
  }

  _dataCallback = res => {
    this.setState({
      isLoading: false,
      username: res.username,
      email: res.email,
      displayName: res.displayName,
      userId: res.userId,
      signedInWith: res.signedInWith,
      logout: this.props.user.logOut,
    });
  };

  _renderProfileForm = () => {
    const { displayName, email, username, userId, signedInWith, logout } = this.state;
    return (
      <ProfileForm
        displayName={displayName}
        email={email}
        username={username}
        userId={userId}
        signedInWith={signedInWith}
        logout={logout}
      />
    );
  };

  render() {
    return (
      <DocumentTitle title="Profile | Phone Samples">
        <View style={styles.container}>
          {this.state.isLoading ? (
            <ScaleLoader loading={this.state.isLoading} color={primaryColor} />
          ) : (
            this._renderProfileForm()
          )}
        </View>
      </DocumentTitle>
    );
  }
}

export default ProfileScreen;
