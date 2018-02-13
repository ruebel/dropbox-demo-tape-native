import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import styled, { withTheme } from 'styled-components/native';

import { Back, Inner, SwipeRow } from '../../SwipeRow';
import { Subtitle, Title } from '../../typography';

import { getFilePath, getFileName } from '../utils';

const Position = styled.Text`
  color: ${p => p.theme.color.textPrimary};
  margin-right: 8;
  width: 23px;
`;

const Wrapper = styled(SwipeRow)`
  border-top-color: ${p => p.theme.color.borderPrimary};
  border-top-width: 1px;
`;

const Track = ({ onRemove, position, sortHandlers, theme, track }) => (
  <Wrapper
    underlayColor={theme.color.backgroundDisabled}
    rightOpenValue={-85}
    sortHandlers={sortHandlers}
    {...sortHandlers}
  >
    <Back onPress={() => onRemove(track)} text="Remove" />
    <Inner disabled={!track.downloadStatus || track.downloadStatus < 100}>
      <Position>{position}</Position>
      <View>
        <Title>{getFileName(track.path)}</Title>
        <Subtitle>{getFilePath(track.path)}</Subtitle>
      </View>
      {track.downloadStatus > 0 &&
        track.downloadStatus < 100 && <Title>{track.downloadStatus}%</Title>}
    </Inner>
  </Wrapper>
);

Track.propTypes = {
  onRemove: PropTypes.func.isRequired,
  position: PropTypes.number,
  sortHandlers: PropTypes.object,
  theme: PropTypes.object,
  track: PropTypes.object
};

export default withTheme(Track);
