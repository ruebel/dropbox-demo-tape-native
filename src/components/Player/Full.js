import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';

import IconButton from '../IconButton';
import Slider from '../Slider';

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

const Title = styled.Text`
  color: ${p => p.theme.color.textExtraLight};
  font-size: 18px;
  margin-bottom: 32px;
  margin-top: 16px;
  text-align: center;
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
  width: 100%;
`;

const Full = ({
  canPlay,
  downloading,
  name,
  onClose,
  onDownload,
  onNext,
  onPause,
  onPrevious,
  onSeek,
  paused,
  position = 0
}) => {
  return (
    <Wrapper>
      <Top>
        <IconButton icon={'close'} onPress={onClose} />
      </Top>
      <Body>
        <Title>{name}</Title>
        <Slider disabled={!canPlay} onChange={onSeek} value={position} />
        <ActionWrapper>
          {!canPlay &&
            !downloading && (
              <IconButton icon="file-download" onPress={onDownload} />
            )}
          {downloading && <IconButton icon="timelapse" onPress={() => 1} />}
          {canPlay && (
            <IconButton
              icon={paused ? 'play-arrow' : 'pause'}
              onPress={onPause}
            />
          )}
          <IconButton icon="skip-previous" onPress={onPrevious} />
          <IconButton icon="skip-next" onPress={onNext} />
        </ActionWrapper>
      </Body>
    </Wrapper>
  );
};

Full.propTypes = {
  canPlay: PropTypes.bool,
  downloading: PropTypes.bool,
  name: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onDownload: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onPause: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
  onSeek: PropTypes.func.isRequired,
  paused: PropTypes.bool,
  position: PropTypes.number
};

export default Full;
