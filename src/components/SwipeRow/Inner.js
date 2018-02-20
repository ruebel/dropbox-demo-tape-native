import styled from 'styled-components/native';

export default styled.View`
  align-items: center;
  background-color: ${p =>
    p.active
      ? '#CFFFFF'
      : p.disabled
        ? p.theme.color.backgroundDisabled
        : p.theme.color.backgroundPrimary};
  display: flex;
  flex-direction: row;
  padding: 16px;
`;
