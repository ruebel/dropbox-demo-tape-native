import React from 'react';
import PropTypes from 'prop-types';
import PCircle from 'react-native-progress/Circle';
import styled, { withTheme } from 'styled-components/native';

const Wrapper = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: flex-end;
`;

const DownloadProgress = ({ progress, theme }) => {
  return (
    <Wrapper>
      <PCircle
        borderWidth={1}
        color={theme.color.secondary}
        formatText={() => (progress ? `${progress}%` : '...')}
        progress={(progress || 0) / 100}
        showsText
        size={30}
        strokeCap={'round'}
        textStyle={{
          color: theme.color.textPrimary,
          fontSize: 8,
          fontWeight: '400'
        }}
        thickness={2}
        unfilledColor={theme.color.grayLight}
        width={30}
      />
    </Wrapper>
  );
};

DownloadProgress.propTypes = {
  progress: PropTypes.number,
  theme: PropTypes.object
};

export default withTheme(DownloadProgress);
