import React from 'react';
import { View, StyleSheet, Text } from 'react-primitives';
import DocumentTitle from 'react-document-title';
import { ScaleLoader } from 'react-spinners';
import { Button } from 'reactstrap';
import { inject } from 'mobx-react';
import alertify from 'alertify.js';
import { Link } from 'react-router-dom';

import SearchBar from './../components/SearchBar';
import { primaryColor, primaryLightColor } from './../config/Colors';
import bg1 from './../assets/images/bg1.jpg';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 100,
    height: 500,
  },
  searchBarContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: `url(${bg1})`,
    boxShadow: 'inset 0 0 0 1000px rgba(0,0,0,.7)',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
  },
  descriptionText: {
    width: '85%',
    color: '#FFF',
    fontSize: 18,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '55%',
    maxWidth: 200,
    padding: 15,
  },
});

const autoSuggestTheme = {
  container: {
    width: '85%',
    maxWidth: 900,
  },
  input: {
    width: '100%',
    height: 50,
    padding: '10px 20px',
    fontWeight: 300,
    fontSize: 16,
    border: '2px solid #FFF',
    borderRadius: 0,
    color: '#FFF',
  },
  inputFocused: {
    outline: 'none',
  },
  inputOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  suggestionsContainer: {
    display: 'none',
  },
  suggestionsContainerOpen: {
    display: 'block',
    position: 'relative',
    top: 0,
    width: '100%',
    border: '1px solid #aaa',
    backgroundColor: '#fff',
    fontFamily: 'Helvetica, sans-serif',
    fontWeight: 300,
    fontSize: 16,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    zIndex: 2,
    maxHeight: 300,
    overflowY: 'auto',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  suggestion: {
    cursor: 'pointer',
    padding: '10px 20px',
  },
  suggestionHighlighted: {
    backgroundColor: primaryLightColor,
  },
};

@inject('common')
class MainScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    };
  }

  componentWillMount() {
    const img = new Image();
    img.onload = () => {
      this.setState({ isLoading: false });
    };
    img.src = bg1;
    if (img.complete) img.onload();
  }

  _handleSearch = () => {
    const { phoneModel } = this.props.common;
    if (phoneModel.length === 0) {
      alertify.error('Select a Phone Model');
    } else {
      this.props.history.push(`/model:${phoneModel}`);
    }
  };

  render() {
    return (
      <DocumentTitle title="Phone Samples">
        <View style={styles.container}>
          {this.state.isLoading ? (
            <ScaleLoader loading={this.state.isLoading} color={primaryColor} />
          ) : (
            <View style={styles.searchBarContainer}>
              <SearchBar theme={autoSuggestTheme} />
              <View style={styles.buttonContainer}>
                <Button onClick={() => this._handleSearch()} outline={false} color="primary">
                  Search
                </Button>
                <Button outline={false} tag={Link} to="/feed" color="primary">
                  Browse
                </Button>
              </View>
              <Text style={styles.descriptionText}>Search, Browse & Upload Camera Samples of Mobile Phones</Text>
            </View>
          )}
        </View>
      </DocumentTitle>
    );
  }
}

export default MainScreen;
