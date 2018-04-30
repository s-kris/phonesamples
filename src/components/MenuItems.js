import React from 'react';
import { Nav, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import shortid from 'shortid';

import { primaryColor } from './../config/Colors';
import LoginMenuItem from './../components/LoginMenuItem';

const propTypes = {
  onclick: PropTypes.func.isRequired,
};

const MenuItemsData = [
  {
    title: 'Home',
    path: '/',
  },
  {
    title: 'Feed',
    path: '/feed',
  },
  {
    title: 'Upload',
    path: '/upload',
  },
];

@inject('routing')
@observer
class MenuItems extends React.Component {
  _getStyle(itemPath) {
    const currentLocation = this.props.routing.location.pathname.split(':')[0];
    if (currentLocation === itemPath) {
      return { color: primaryColor };
    }
    return {};
  }

  render() {
    const currentLocation = this.props.routing.location.pathname.split(':')[0];
    return (
      <Nav className="ml-auto" navbar key={currentLocation}>
        {MenuItemsData.map(item => (
          <NavItem key={shortid.generate()}>
            <NavLink tag={Link} to={item.path} style={this._getStyle(item.path)} onClick={this.props.onclick}>
              {item.title}
            </NavLink>
          </NavItem>
        ))}
        <LoginMenuItem onclick={this.props.onclick} />
      </Nav>
    );
  }
}

MenuItems.propTypes = propTypes;

export default MenuItems;
