import React from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';

import { H2 } from '../typography';
import IconButton from '../IconButton';
import TextInput from '../TextInput';

const TitleWrapper = styled.View`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const TitleEdit = ({
  editTitle,
  onTitleChange,
  theme,
  title,
  toggleEditTitle
}) => {
  return (
    <TitleWrapper>
      {editTitle ? (
        <TextInput
          onChange={onTitleChange}
          placeholder="Enter Playlist Name"
          value={title}
        />
      ) : (
        <H2>{title}</H2>
      )}
      <IconButton
        color={theme.color.primary}
        icon={editTitle ? 'save' : 'edit'}
        onPress={toggleEditTitle}
        size={editTitle ? 32 : 20}
      />
    </TitleWrapper>
  );
};

TitleEdit.propTypes = {
  editTitle: PropTypes.bool,
  onTitleChange: PropTypes.func.isRequired,
  theme: PropTypes.object,
  title: PropTypes.string,
  toggleEditTitle: PropTypes.func.isRequired
};

export default withTheme(TitleEdit);
