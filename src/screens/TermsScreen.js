import React from 'react';
import { View, StyleSheet } from 'react-primitives';
import DocumentTitle from 'react-document-title';
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col } from 'reactstrap';

import TermsOfUse from './../components/TermsOfUse';
import PrivacyPolicy from './../components/PrivacyPolicy';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 100,
  },
});

class TermsScreen extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: '1',
    };
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  render() {
    const { activeTab } = this.state;
    return (
      <DocumentTitle title="Terms & Conditions | Phone Samples">
        <View style={styles.container}>
          <Nav tabs>
            <NavItem>
              <NavLink active={activeTab === '1'} onClick={() => this.toggle('1')}>
                Terms
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink active={activeTab === '2'} onClick={() => this.toggle('2')}>
                Privacy Policy
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={this.state.activeTab} style={{ width: '90%', maxWidth: 900, marginTop: 25 }}>
            <TabPane tabId="1">
              <Row>
                <Col sm="12">
                  <TermsOfUse />
                </Col>
              </Row>
            </TabPane>
            <TabPane tabId="2">
              <Row>
                <Col sm="12">
                  <PrivacyPolicy />
                </Col>
              </Row>
            </TabPane>
          </TabContent>
        </View>
      </DocumentTitle>
    );
  }
}

export default TermsScreen;
