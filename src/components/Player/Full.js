import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';

import IconButton from '../IconButton';
import Slider from '../Slider';

import { getMMSSFromMs } from './utils';

const ActionWrapper = styled.View`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const Body = styled.View`
  align-items: center;
  display: flex;
  flex: 1
  flex-direction: column;
  justify-content: center;
`;

const PlaylistTitle = styled.Text`
  color: ${p => p.theme.color.secondary};
  font-size: 22px;
  margin-bottom: 32px;
  text-align: center;
`;

const TimeWrapper = styled.View`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const Title = styled.Text`
  color: ${p => p.theme.color.textExtraLight};
  font-size: 18px;
  margin-bottom: 32px;
  margin-top: 16px;
  text-align: center;
`;

const Time = styled(Title)`
  flex: 1;
  font-size: 16px;
  margin-top: 0;
  text-align: left;
`;

const Top = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  width: 100%;
`;

const Wrapper = styled.View`
  align-items: stretch;
  background: ${p => p.theme.color.primary};
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px;
  width: 100%;
`;

const Full = ({
  canPlay,
  currentTime = 0,
  downloading,
  duration = 0,
  name,
  onClose,
  onDownload,
  onNext,
  onPause,
  onPrevious,
  onSeek,
  onSeekEnd,
  paused,
  position = 0,
  title
}) => {
  return (
    <Wrapper>
      <Top>
        <IconButton icon={'close'} onPress={onClose} />
      </Top>
      <Body>
        <PlaylistTitle>{title}</PlaylistTitle>
        <Title>{name}</Title>
        <Slider
          disabled={!canPlay}
          onChange={onSeek}
          onSlidingComplete={onSeekEnd}
          value={position}
        />
        <TimeWrapper>
          <Time>{getMMSSFromMs(currentTime)}</Time>
          <Time style={{ textAlign: 'right' }}>{getMMSSFromMs(duration)}</Time>
        </TimeWrapper>
        <ActionWrapper>
          <IconButton icon="skip-previous" onPress={onPrevious} />
          {!canPlay &&
            !downloading && (
              <IconButton icon="file-download" onPress={onDownload} />
            )}
          {downloading && <IconButton icon="timelapse" onPress={() => 1} />}
          {canPlay && (
            <IconButton
              icon={paused ? 'play-arrow' : 'pause'}
              onPress={onPause}
              size={54}
            />
          )}
          <IconButton icon="skip-next" onPress={onNext} />
        </ActionWrapper>
      </Body>
    </Wrapper>
  );
};

Full.propTypes = {
  canPlay: PropTypes.bool,
  currentTime: PropTypes.number,
  downloading: PropTypes.bool,
  duration: PropTypes.number,
  name: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onDownload: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onPause: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
  onSeek: PropTypes.func.isRequired,
  onSeekEnd: PropTypes.func.isRequired,
  paused: PropTypes.bool,
  position: PropTypes.number,
  title: PropTypes.string
};

export default Full;
