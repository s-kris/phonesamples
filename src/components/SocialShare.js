import React from 'react';
import { View, StyleSheet } from 'react-primitives';
import {
  TwitterShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  RedditShareButton,
  TwitterIcon,
  TelegramIcon,
  WhatsappIcon,
  RedditIcon,
} from 'react-share';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 175,
    flexDirection: 'row',
    justifyContent: 'space-between',
    cursor: 'pointer',
  },
});

const propTypes = {
  url: PropTypes.string.isRequired,
};

class SocialShare extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <TwitterShareButton url={this.props.url}>
          <TwitterIcon size={32} round />
        </TwitterShareButton>
        <RedditShareButton url={this.props.url}>
          <RedditIcon size={32} round />
        </RedditShareButton>
        <WhatsappShareButton url={this.props.url}>
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>
        <TelegramShareButton url={this.props.url}>
          <TelegramIcon size={32} round />
        </TelegramShareButton>
      </View>
    );
  }
}

SocialShare.propTypes = propTypes;

export default SocialShare;
