import { observable, action } from 'mobx';
import firebase from 'firebase';

class userStore {
  @observable loggedIn = false;
  @observable profile = null;

  constructor() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.loggedIn = true;
        this.profile = firebase.auth().currentUser;
      } else {
        this.loggedIn = false;
        this.profile = null;
      }
    });
  }

  @action
  logOut = () => {
    firebase.auth().signOut();
  };
}

export default new userStore();
