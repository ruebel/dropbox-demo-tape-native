import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import IconButton from '../IconButton';

const Wrapper = styled.View`
  align-items: center;
  background: ${p => p.theme.color.primary};
  bottom: 0;
  display: flex;
  flex: 1;
  flex-direction: row;
  height: 50;
  justify-content: center;
  left: 0;
  position: absolute;
  width: 100%;
`;

const Title = styled.Text`
  color: ${p => p.theme.color.textExtraLight};
  font-size: 14px;
  flex: 1;
`;

const Control = ({
  canPlay,
  name,
  onDownload,
  onNext,
  onPause,
  onPrevious,
  paused
}) => {
  return (
    <Wrapper>
      {!canPlay && <IconButton icon="file-download" onPress={onDownload} />}
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
  name: PropTypes.string,
  onDownload: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onPause: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
  paused: PropTypes.bool
};

export default Control;
