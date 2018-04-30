import { observable, action } from 'mobx';

class commonStore {
  @observable phoneModel = "";

  @action setPhoneModel( model ) {
    this.phoneModel = model;
  }
}

export default new commonStore();
