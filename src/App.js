import React from 'react';
import 'sanitize.css';
import 'bootstrap/dist/css/bootstrap.css';
import createBrowserHistory from 'history/createBrowserHistory';
import { Provider } from 'mobx-react';
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';
import { Router } from 'react-router-dom';

import './startup/firebase-init';
import './helpers/chrome-button-fix';
import Routes from './config/Routes';
import userStore from './stores/userStore';
import commonStore from './stores/commonStore';
import './styles/common.css';

const browserHistory = createBrowserHistory();
const routingStore = new RouterStore();
const stores = {
  routing: routingStore,
  user: userStore,
  common: commonStore,
};
// eslint-disable-next-line
const history = syncHistoryWithStore( browserHistory, routingStore );

export default class App extends React.Component {
  render() {
    return (
      <Provider {...stores}>
        <Router history={history}>
          <Routes history={history} />
        </Router>
      </Provider>
    );
  }
}
