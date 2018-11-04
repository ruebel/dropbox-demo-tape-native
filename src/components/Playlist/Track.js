import React from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';
import moment from 'moment';

import DownloadProgress from './DownloadProgress';
import Icon from '../Icon';
import { Back, Inner, SwipeRow } from '../SwipeRow';
import { Subtitle, Title } from '../typography';

import { getFilePath, getFileName } from './utils';
import { accountType } from '../../types';

const IconWrapper = styled.View`
  width: 31px;
`;

const Info = styled.View`
  flex: 1;
  overflow: hidden;
`;

const Position = styled.Text`
  color: ${p => p.theme.color.textPrimary};
  margin-right: 8;
  width: 23px;
`;

const Updated = styled(Subtitle)`
  color: ${p => p.theme.color.primary};
  margin-top: 2;
  margin-bottom: 2;
`;

const Wrapper = styled(SwipeRow)`
  border-top-color: ${p => p.theme.color.borderPrimary};
  border-top-width: 1px;
`;

const Track = ({
  onPress,
  onRemove,
  position,
  sortHandlers,
  theme,
  track,
  user
}) => (
  <Wrapper
    onRowPress={() => (track.playing ? null : onPress(track))}
    underlayColor={theme.color.backgroundDisabled}
    rightOpenValue={-85}
    sortHandlers={sortHandlers}
    {...sortHandlers}
  >
    <Back onPress={() => onRemove(track)} text="Remove" />
    <Inner
      active={track.playing}
      disabled={!track.downloadStatus || track.downloadStatus < 100}
    >
      {track.playing ? (
        <IconWrapper>
          <Icon color="black" icon="play-circle-filled" size={24} />
        </IconWrapper>
      ) : (
        <Position>{position}</Position>
      )}
      <Info>
        <Title numberOfLines={1}>{getFileName(track.path)}</Title>
        <Updated>
          Updated {moment(track.server_modified).fromNow()}
          {user ? ` by ${user.name.full}` : ''}
        </Updated>
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
  onPress: PropTypes.func,
  onRemove: PropTypes.func.isRequired,
  position: PropTypes.number,
  sortHandlers: PropTypes.object,
  theme: PropTypes.object,
  track: PropTypes.object,
  user: accountType
};

export default withTheme(Track);
