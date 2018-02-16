import React from 'react';
import PropTypes from 'prop-types';
import { Audio } from 'expo';
import { connect } from 'react-redux';

import Control from './Control';

import { trackType } from '../../types';
import { getFilePath } from '../../modules/utils';
import { actions as audioActions } from '../../modules/audio';
import { actions as playlistActions } from '../../modules/playlists';
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
      this.initializeSound(next.track);
    }
    if (
      next.isPlaying !== this.props.isPlaying ||
      next.paused !== this.props.paused
    ) {
      this.handlePause(next.isPlaying && !next.paused);
    }
  }

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
      if (status.didJustFinish) {
        this.props.trackComplete();
      }
    } else if (status.error) {
      console.error(`PLAYER ERROR: ${status.error}`);
    }
  };

  handlePause = shouldPlay => {
    if (this.sound) {
      if (shouldPlay) {
        this.sound.playAsync();
      } else {
        this.sound.pauseAsync();
      }
    } else {
      this.props.stop();
    }
  };

  initializeSound = async trackOverride => {
    if (this.sound != null) {
      await this.sound.unloadAsync();
      this.sound.setOnPlaybackStatusUpdate(null);
      this.sound = null;
    }
    const track = trackOverride || this.props.track;

    if (!track || !track.downloadStatus || track.downloadStatus < 100) {
      return;
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

  render() {
    const { changeTrack, pause, paused, track } = this.props;
    return track && this.props.isPlaying ? (
      <Control
        canPlay={track.downloadStatus === 100}
        downloading={track.downloadStatus > 0 && track.downloadStatus < 100}
        name={track.name}
        onDownload={this.props.downloadTracks}
        onNext={() => changeTrack(true)}
        onPause={pause}
        onPrevious={() => changeTrack(false)}
        paused={paused}
      />
    ) : null;
  }
}

Player.propTypes = {
  changeTrack: PropTypes.func.isRequired,
  downloadTracks: PropTypes.func.isRequired,
  isPlaying: PropTypes.bool,
  pause: PropTypes.func.isRequired,
  paused: PropTypes.bool,
  stop: PropTypes.func.isRequired,
  track: trackType,
  trackComplete: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  isPlaying: state.audio.isPlaying,
  paused: state.audio.paused,
  track: getPlayingTrack(state)
});

export default connect(mapStateToProps, {
  changeTrack: audioActions.changeTrack,
  downloadTracks: playlistActions.downloadTracks,
  pause: audioActions.pause,
  stop: audioActions.stop,
  trackComplete: audioActions.trackComplete
})(Player);
