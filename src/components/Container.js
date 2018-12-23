import styled from 'styled-components';

export default styled.View`
  background-color: ${p => p.theme.color.backgroundPrimary};
  flex: 1;
  padding: ${p => (p.pad ? '16px' : 0)};
  ${p => (p.padTop ? 'padding-top: 16px;' : '')}
`;
