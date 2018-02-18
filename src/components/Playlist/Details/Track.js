import React from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components/native';

import DownloadProgress from './DownloadProgress';
import { Back, Inner, SwipeRow } from '../../SwipeRow';
import { Subtitle, Title } from '../../typography';

import { getFilePath, getFileName } from '../utils';

const Info = styled.View`
  flex: 1;
  overflow: hidden;
`;

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
      <Info>
        <Title numberOfLines={1}>{getFileName(track.path)}</Title>
        <Subtitle>{getFilePath(track.path)}</Subtitle>
      </Info>
      {typeof track.downloadStatus === 'number' &&
        track.downloadStatus < 100 && (
          <DownloadProgress progress={track.downloadStatus} />
        )}
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
