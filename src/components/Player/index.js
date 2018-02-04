import React from 'react';
import PropTypes from 'prop-types';
import { Audio } from 'expo';
import { connect } from 'react-redux';

import { trackType } from '../../types';
import { getFilePath } from '../../modules/utils';
import { actions as audioActions } from '../../modules/audio';
import { getPlayingTrack } from '../../modules/playlists/selectors';

class Player extends React.Component {
  componentDidMount() {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true
    });
    this.initializeSound();
  }

  componentWillReceiveProps(next) {
    if (next.track !== this.props.track) {
      this.initializeSound();
    }
  }

  initializeSound = async () => {
    if (!this.props.track) {
      return;
    }
    if (this.sound != null) {
      await this.sound.unloadAsync();
      this.sound.setOnPlaybackStatusUpdate(null);
      this.sound = null;
    }

    const source = { uri: getFilePath(this.props.track) };

    const initialStatus = {
      rate: 1.0,
      shouldPlay: this.props.isPlaying,
      volume: 1.0
    };

    const { sound } = await Audio.Sound.create(
      source,
      initialStatus,
      this.handleAudioUpdate
    );
    this.sound = sound;
  };

  handleAudioUpdate = status => {
    if (status.isLoaded) {
      this.setState({
        duration: status.durationMillis,
        isBuffering: status.isBuffering,
        isPlaying: status.isPlaying,
        position: status.positionMillis,
        rate: status.rate,
        shouldPlay: status.shouldPlay,
        volume: status.volume
      });
      // this.props.onStatusUpdate(status);
      if (status.didJustFinish) {
        this.props.trackComplete();
      }
    } else if (status.error) {
      console.error(`PLAYER ERROR: ${status.error}`);
    }
  };

  render() {
    return null;
  }
}

Player.propTypes = {
  isPlaying: PropTypes.bool,
  // onStatusUpdate: PropTypes.func.isRequired,
  track: trackType,
  trackComplete: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  isPlaying: state.audio.isPlaying,
  track: getPlayingTrack(state)
});

export default connect(mapStateToProps, {
  trackComplete: audioActions.trackComplete
})(Player);
