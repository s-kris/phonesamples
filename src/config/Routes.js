import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import ReactGA from 'react-ga';
import { inject } from 'mobx-react';

import ScrollToTop from './../helpers/ScrollToTop';
import MainScreen from './../screens/MainScreen';
import LoginScreen from './../screens/LoginScreen';
import FeedScreen from './../screens/FeedScreen';
import ViewScreen from './../screens/ViewScreen';
import ModelScreen from './../screens/ModelScreen';
import UserScreen from './../screens/UserScreen';
import UploadScreen from './../screens/UploadScreen';
import MySamplesScreen from './../screens/MySamplesScreen';
import SettingsScreen from './../screens/SettingsScreen';
import ProfileScreen from './../screens/ProfileScreen';
import Header from './../components/Header';
import Footer from './../components/Footer';
import NotFoundScreen from './../screens/NotFoundScreen';
import TermsScreen from './../screens/TermsScreen';
import { googleAnalyticsId } from './Constants';
import EmbedScreen from '../screens/EmbedScreen';

ReactGA.initialize(googleAnalyticsId);

const PrivateRoute = params => {
  if (params.auth) {
    return <Route {...params} />;
  }
  return <Redirect to={{ pathname: '/login' }} />;
};

@inject('user')
class Routes extends React.Component {
  _onChangeSwitch = () => {
    ReactGA.pageview(decodeURI(window.location.pathname));
  };

  render() {
    const auth = this.props.user.loggedIn;
    const pathname = this.props.history.location.pathname.split(':')[0];
    return (
      <ScrollToTop>
        {pathname !== '/embed' && <Header />}
        <Switch onChange={this._onChangeSwitch()}>
          <Route path="/" exact component={MainScreen} />
          <Route path="/login" exact component={LoginScreen} />
          <Route path="/feed" exact component={FeedScreen} />
          <Route path="/view:id" exact component={ViewScreen} />
          <Route path="/embed:id" exact component={EmbedScreen} />
          <Route path="/model:id" exact component={ModelScreen} />
          <Route path="/user:id" exact component={UserScreen} />
          <Route path="/terms" exact component={TermsScreen} />
          <PrivateRoute auth={auth} path="/upload" exact component={UploadScreen} />
          <PrivateRoute auth={auth} path="/mysamples" exact component={MySamplesScreen} />
          <PrivateRoute auth={auth} path="/settings" exact component={SettingsScreen} />
          <PrivateRoute auth={auth} path="/profile" exact component={ProfileScreen} />
          <Route component={NotFoundScreen} />
        </Switch>
        {pathname !== '/embed' && <Footer />}
      </ScrollToTop>
    );
  }
}
export default Routes;
