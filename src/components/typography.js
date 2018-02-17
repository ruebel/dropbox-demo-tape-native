import styled from 'styled-components/native';

export const Empty = styled.Text`
  color: ${p => p.theme.color.textLight};
  font-size: 16px;
  margin-bottom: 16;
  margin-top: 16;
  text-align: center;
`;

export const H1 = styled.Text`
  font-size: 32px;
  font-weight: 300;
  line-height: 38px;
`;

export const H2 = styled.Text`
  font-size: 26px;
  line-height: 30px;
  margin-left: 8px;
  margin-right: 8px;
`;

export const Message = styled.Text`
  font-size: 24px;
`;

export const Subtitle = styled.Text`
  color: ${p => p.theme.color.textLight};
  font-size: 10px;
`;

export const Title = styled.Text`
  color: ${p => p.theme.color.textPrimary};
`;
