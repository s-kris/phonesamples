import React from 'react';
import Autosuggest from 'react-autosuggest';
import fonoApi from 'fonoapi-nodejs';
import { inject } from 'mobx-react';
import PropTypes from 'prop-types';

import { fonoapiToken } from './../config/Constants';

const propTypes = {
  theme: PropTypes.object.isRequired,
};

function getSuggestionValue(suggestion) {
  return suggestion.DeviceName;
}

function renderSuggestion(suggestion) {
  return <span>{suggestion.DeviceName}</span>;
}

@inject('common')
class SearchBar extends React.Component {
  constructor() {
    super();

    this.state = {
      value: '',
      suggestions: [],
    };
  }

  onChange = (event, { newValue }) => {
    this.props.common.setPhoneModel(newValue);
    this.setState({ value: newValue });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this._loadSuggestions(value);
  };

  onSuggestionsClearRequested = () => {
    this.setState({ suggestions: [] });
  };

  _fonoApiCallback = (queryString, data) => {
    if (data.status === 'error') {
      this.setState({
        suggestions: [
          {
            DeviceName: 'No device found',
          },
        ],
      });
    } else if (data.length) {
      this.setState({ suggestions: data });
    } else {
      this.setState({ suggestions: [] });
    }
  };

  _loadSuggestions(value) {
    fonoApi.token = fonoapiToken;
    fonoApi.getDevices(this._fonoApiCallback, value);
  }

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: 'Galaxy S7, iPhone X, ...',
      value,
      onChange: this.onChange,
    };

    return (
      <Autosuggest
        theme={this.props.theme}
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
      />
    );
  }
}

SearchBar.propTypes = propTypes;

export default SearchBar;
