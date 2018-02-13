import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import IconButton from '../IconButton';

const Wrapper = styled.View`
  align-items: center;
  background: ${p => p.theme.color.primary};
  display: flex;
  flex-direction: row;
  height: 50;
  justify-content: center;
  width: 100%;
`;

const Title = styled.Text`
  color: ${p => p.theme.color.textExtraLight};
  flex: 1;
  font-size: 14px;
  text-align: center;
`;

const Control = ({
  canPlay,
  downloading,
  name,
  onDownload,
  onNext,
  onPause,
  onPrevious,
  paused
}) => {
  return (
    <Wrapper>
      {!canPlay &&
        !downloading && (
          <IconButton icon="file-download" onPress={onDownload} />
        )}
      {downloading && <IconButton icon="timelapse" onPress={() => 1} />}
      {canPlay && (
        <IconButton icon={paused ? 'play-arrow' : 'pause'} onPress={onPause} />
      )}
      <Title numberOfLines={1}>{name}</Title>
      <IconButton icon="skip-previous" onPress={onPrevious} />
      <IconButton icon="skip-next" onPress={onNext} />
    </Wrapper>
  );
};

Control.propTypes = {
  canPlay: PropTypes.bool,
  downloading: PropTypes.bool,
  name: PropTypes.string,
  onDownload: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onPause: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
  paused: PropTypes.bool
};

export default Control;
