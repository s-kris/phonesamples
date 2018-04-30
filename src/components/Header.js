import React from 'react';
import { View, Image, StyleSheet } from 'react-primitives';
import { Navbar, NavbarBrand, NavbarToggler, Collapse } from 'reactstrap';
import { Link } from 'react-router-dom';

import { primaryColor } from './../config/Colors';
import LogoImage from './../assets/images/logo.jpg';
import MenuItems from './../components/MenuItems';

const styles = StyleSheet.create({
  container: {
    zIndex: 1,
  },
  topBar: {
    width: '100%',
    height: 3,
    backgroundColor: primaryColor,
  },
  logo: {
    width: 150,
    height: 55,
  },
});

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }

  _toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topBar} />
        <Navbar color="faded" light expand="md">
          <NavbarBrand tag={Link} to="/">
            <Image style={styles.logo} source={LogoImage} />
          </NavbarBrand>
          <NavbarToggler
            style={{
              border: 0,
            }}
            onClick={() => this._toggle()}
          />
          <Collapse isOpen={this.state.isOpen} navbar>
            <MenuItems onclick={() => this._toggle()} />
          </Collapse>
        </Navbar>
      </View>
    );
  }
}

export default Header;
