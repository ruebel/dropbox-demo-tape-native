import styled from 'styled-components';

export default styled.View`
  background-color: ${p => p.theme.color.backgroundPrimary};
  flex: 1;
  padding-top: ${p => (p.padTop ? '16px' : 0)};
`;
