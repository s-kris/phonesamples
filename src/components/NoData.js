import React from 'react';
import { View, Text, StyleSheet } from 'react-primitives';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: 400,
    maxHeight: 200,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  info: {
    color: 'grey',
    fontSize: 27,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

const propTypes = {
  message: PropTypes.string.isRequired,
};

class NoData extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.info}>{this.props.message}</Text>
        <View style={styles.buttonContainer}>
          <Link to="/">
            <Button outline color="primary">
              Go to Home
            </Button>
          </Link>
          <Link to="/feed">
            <Button outline color="primary">
              Browse Feed
            </Button>
          </Link>
        </View>
      </View>
    );
  }
}

NoData.propTypes = propTypes;

export default NoData;
