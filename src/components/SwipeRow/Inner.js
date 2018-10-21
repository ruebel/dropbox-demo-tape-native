import styled from 'styled-components';

export default styled.View`
  align-items: center;
  background-color: ${p =>
    p.active
      ? p.theme.color.backgroundSelected
      : p.disabled
        ? p.theme.color.backgroundDisabled
        : p.theme.color.backgroundPrimary};
  display: flex;
  flex-direction: row;
  padding: 16px;
`;
