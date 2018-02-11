import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import styled from 'styled-components/native';

import { Back, Inner, SwipeRow } from '../../SwipeRow';

import { getFilePath, getFileName } from '../utils';

const Name = styled.Text`
  color: ${p => p.theme.color.textPrimary};
`;

const Path = styled.Text`
  color: ${p => p.theme.color.textLight};
  font-size: 10px;
`;

const Position = styled.Text`
  color: ${p => p.theme.color.textPrimary};
  width: 23px;
`;

const Wrapper = styled(SwipeRow)`
  border-top-color: ${p => p.theme.color.borderPrimary};
  border-top-width: 1px;
`;

const Track = ({ onRemove, position, sortHandlers, track }) => (
  <Wrapper
    underlayColor="#eee"
    rightOpenValue={-85}
    sortHandlers={sortHandlers}
    {...sortHandlers}
  >
    <Back onPress={() => onRemove(track)} text="Remove" />
    <Inner disabled={!track.downloadStatus || track.downloadStatus < 100}>
      <Position>{position}</Position>
      <View>
        <Name>{getFileName(track.path)}</Name>
        <Path>{getFilePath(track.path)}</Path>
      </View>
      {track.downloadStatus < 100 && <Name>{track.downloadStatus}%</Name>}
    </Inner>
  </Wrapper>
);

Track.propTypes = {
  onRemove: PropTypes.func.isRequired,
  position: PropTypes.number,
  sortHandlers: PropTypes.object,
  track: PropTypes.object
};

export default Track;
