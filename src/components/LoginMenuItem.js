import React from 'react';
import { NavLink, NavItem, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { primaryColor } from './../config/Colors';

const ProfileItem = props => (
  <UncontrolledDropdown nav inNavbar>
    <DropdownToggle nav caret style={props.style}>
      {props.profile && props.profile.displayName.split(' ')[0].substring(0, 10)}
    </DropdownToggle>
    <DropdownMenu right>
      <DropdownItem tag={Link} to="/mysamples" onClick={props.toggle}>
        My Samples
      </DropdownItem>
      <DropdownItem tag={Link} to="/profile" onClick={props.toggle}>
        Profile
      </DropdownItem>
      <DropdownItem tag={Link} to="/login" onClick={props.logout}>
        Logout
      </DropdownItem>
    </DropdownMenu>
  </UncontrolledDropdown>
);

@inject('routing', 'user')
@observer
class LoginMenuItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      profileItemStyle: {},
    };
  }

  user = this.props.user;

  componentDidMount() {
    this._getStyle();
  }

  _getStyle() {
    const currentLocation = this.props.routing.location.pathname.split(':')[0];
    const paths = ['/login', '/mysamples', '/settings', '/profile'];
    paths.forEach(p => {
      if (currentLocation === p) {
        this.setState({ profileItemStyle: { color: primaryColor } });
        return {};
      }
    });
    return {};
  }

  _logout() {
    this.user.logOut();
  }

  render() {
    return !this.user.loggedIn ? (
      <NavItem>
        <NavLink tag={Link} to="/login" style={this.state.profileItemStyle} onClick={this.props.onclick}>
          Login
        </NavLink>
      </NavItem>
    ) : (
      <ProfileItem
        profile={this.user.profile}
        toggle={this.props.onclick}
        logout={() => this._logout()}
        style={this.state.profileItemStyle}
      />
    );
  }
}

export default LoginMenuItem;
